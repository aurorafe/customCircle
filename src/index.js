/**
 * Created by 张永平 on 2017/8/31.
 * @desc 周边搜索 自定义圆
 */
import './scss/customCircle.scss'
import * as htmlUtils from 'nature-dom-util/src/utils/domUtils'
import * as utils from 'nature-dom-util/src/utils/utils'
import * as css from './dom/css'
import * as style from './style/style'
ol.geom.CustomCircle = function (params) {
  /**
   * 当前配置
   * @type {*}
   */
  this.options = params || {}

  if (!this.options['map'] || !(this.options['map'] instanceof ol.Map)) {
    throw new Error('缺少底图对象！')
  } else {
    this.map = this.options['map']
  }

  if (!this.options['center'] || !(this.options['center'] instanceof Array)) {
    throw new Error('圆心坐标格式有误！')
  }

  /**
   * 默认配置
   * @type {{radius: number, minRadius: number, maxRadius: number, layerName: string, showPolygonFeature: boolean, showCenterFeature: boolean, zoomToExtent: boolean, style: {stroke: {strokeColor: string, strokeLineCap: string, strokeLineJoin: string, strokeLineDash: undefined, strokeLineDashOffset: string, strokeMiterLimit: number, strokeWidth: number}, fill: {fillColor: string}}}}
   */
  this.defaultConfig = {
    radius: 5000,
    minRadius: 50,
    maxRadius: 50000,
    layerName: 'perimeterSerachLayer',
    showPolygonFeature: true,
    showCenterFeature: true,
    zoomToExtent: true,
    style: {
      stroke: {
        strokeColor: 'rgba(71, 129, 217, 1)',
        strokeLineCap: 'round',
        strokeLineJoin: 'round',
        strokeLineDash: undefined,
        strokeLineDashOffset: '0',
        strokeMiterLimit: 10,
        strokeWidth: 1
      },
      fill: {
        fillColor: 'rgba(255, 255, 255, 0)'
      }
    }
  }

  /**
   * 部分参数未传输时使用默认配置
   */
  for (let key in this.defaultConfig) {
    if (!this.options.hasOwnProperty(key)) {
      this.options[key] = this.defaultConfig[key]
    }
  }
  /**
   * 如果当前坐标不是米制单位需要计算获取长度
   * @type {ol.Sphere}
   */
  this.sphare = new ol.Sphere(6378137)
  /**
   * 鼠标是否按下
   * @type {boolean}
   */
  this.isMouseDown = false
  /**
   * 是否正在移动
   * @type {boolean}
   */
  this.isMoving = false
  /**
   * 半径
   */
  this.radius = this.options['radius']

  /**
   * 半径显示DOM
   * @type {null}
   */
  this.handleLabel = null

  this.initCircle(this.options['center'])
}

ol.inherits(ol.geom.CustomCircle, ol.geom.Geometry)

/**
 * 创建一个圆 创建一个要素
 * @param center
 */
ol.geom.CustomCircle.prototype.initCircle = function (center) {
  this.center = center
  this.centerCopy = ol.proj.transform(center, this._getProjectionCode(), 'EPSG:4326')
  this.geom = this._getCircleGeom()
  if (this.geom && this.options['zoomToExtent']) {
    let extent = this.geom.getExtent()
    this.zoomToExtent(extent)
  }
  this.circleFeature = new ol.Feature({
    geometry: this.geom
  })
  /**
   * 创建一个临时图层 用于存储Feature
   * @type {ol.layer.Vector}
   */
  let layer = new ol.layer.Vector({
    layerName: this.options['layerName'],
    source: new ol.source.Vector()
  })
  let styles = style.getStyleByPolygon(this.options['style'])
  layer.setStyle(styles)
  layer.getSource().addFeature(this.circleFeature)
  /**
   * 是否添加中心点
   */
  if (this.options['showCenterFeature']) {
    this.addCenterPoint(layer)
  }
  this.map.addLayer(layer)

  /**
   * 添加编辑操作
   */
  this.addEditor()
  this.dispachChange()
}

/**
 * 获取当前投影
 * @returns {string}
 * @private
 */
ol.geom.CustomCircle.prototype._getProjectionCode = function () {
  let code = ''
  if (this.map) {
    code = this.map.getView().getProjection().getCode()
  } else {
    code = 'EPSG:3857'
  }
  return code
}

/**
 * 创建一个要素 ol.geom.Circle()
 * @returns {ol.geom.Geometry}
 * @private
 */
ol.geom.CustomCircle.prototype._getCircleGeom = function () {
  let sourceGeom = new ol.geom.Circle(this.centerCopy, (this.transformRadius(this.centerCopy, this.radius)))
  let geom = sourceGeom.transform('EPSG:4326', this._getProjectionCode())
  return geom
}

/**
 * 半径和坐标间的转换
 * @param center
 * @param meterRadius
 * @returns {number}
 */
ol.geom.CustomCircle.prototype.transformRadius = function (center, meterRadius) {
  try {
    let lastCoords = this.sphare.offset(center, meterRadius, (270 / 360) * 2 * Math.PI) // 计算偏移量
    let [ptx, pty] = [(center[0] - lastCoords[0]), (center[1] - lastCoords[1])]
    let transformRadiu = (Math.sqrt(Math.pow(ptx, 2) + Math.pow(pty, 2)))
    return transformRadiu
  } catch (e) {
    console.log(e)
  }
}

/**
 * extent 适当更新范围
 * @param extent
 */
ol.geom.CustomCircle.prototype.zoomToExtent = function (extent) {
  if (this.map) {
    let view = this.map.getView()
    let size = this.map.getSize()
    view.fit(extent, {
      size: size
    })
  }
}

/**
 * 添加中心点
 * @param layer
 */
ol.geom.CustomCircle.prototype.addCenterPoint = function (layer) {
  this.centerPoint = new ol.Feature({
    geometry: new ol.geom.Point(this.center)
  })
  let centerStyle = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      stroke: new ol.style.Stroke({
        color: 'rgba(71, 129, 217, 1)',
        width: 1
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255,255,255,0.5)'
      })
    })
  })
  this.centerPoint.setStyle(centerStyle)
  layer.getSource().addFeature(this.centerPoint)
}

/**
 * 添加编辑器
 */
ol.geom.CustomCircle.prototype.addEditor = function () {
  let editor = htmlUtils.create('div', css.CLASS_CUSTOM_CIRCLE, document.body)
  let button = htmlUtils.create('span', css.CLASS_CUSTOM_CIRCLE_BUTTON, editor, ('editor_' + utils.getuuid()))
  this.handleLabel = htmlUtils.create('span', css.CLASS_CUSTOM_CIRCLE_HANDLELABEL, editor)
  this.handleLabel.innerHTML = this.radius + 'm'
  this.addEventHandle(button, this.handleLabel)
  this.overlay = new ol.Overlay({
    element: editor,
    position: this.geom.getLastCoordinate(),
    positioning: 'left-center',
    offset: [-18, -10]
  })
  this.map.addOverlay(this.overlay)
}

/**
 * 拖拽按钮事件处理
 * @param button
 */
ol.geom.CustomCircle.prototype.addEventHandle = function (button) {
  if (button && button instanceof Element) {
    button.addEventListener('mousedown', event => {
      if (event.preventDefault) {
        event.preventDefault()
      } else {
        event.returnValue = false
      }
      this.isMouseDown = true
      this.map.on('pointermove', this.onMouseMove, this)
    })
    button.addEventListener('mouseup', event => {
      if (event.preventDefault) {
        event.preventDefault()
      } else {
        event.returnValue = false
      }
      if (this.isMouseDown && this.isMoving) {
        this.dispachChange()
      }
      this.isMouseDown = false
      this.isMoving = false
      this.map.un('pointermove', this.onMouseMove, this)
    })
    document.addEventListener('mouseup', event => {
      if (event.preventDefault) {
        event.preventDefault()
      } else {
        event.returnValue = false
      }
      if (this.isMouseDown && this.isMoving) {
        this.dispachChange()
      }
      this.isMouseDown = false
      this.isMoving = false
      this.map.un('pointermove', this.onMouseMove, this)
    })
  }
}

/**
 * 拖拽完成信息返回
 */
ol.geom.CustomCircle.prototype.dispachChange = function () {
  if (this.options['onRadiusChangeEnd'] && typeof this.options['onRadiusChangeEnd'] === 'function') {
    this.options['onRadiusChangeEnd'](this)
  }
}

/**
 * 鼠标移动
 * @param event
 */
ol.geom.CustomCircle.prototype.onMouseMove = function (event) {
  if (this.isMouseDown) {
    this.mathRadius(event.coordinate)
  }
}

/**
 * 移动时 重新设置半径 重新构建圆 更新半径显示数值
 * @param coords
 */
ol.geom.CustomCircle.prototype.mathRadius = function (coords) {
  this.isMoving = true
  if (this.center && coords) {
    let c1 = ol.proj.transform(this.center, this._getProjectionCode(), 'EPSG:4326')
    let c2 = ol.proj.transform(coords, this._getProjectionCode(), 'EPSG:4326')
    let radius = this.sphare.haversineDistance(c1, c2)
    if (radius > this.options['maxRadius']) {
      this.radius = this.options['maxRadius'] - 1
      this.isMouseDown = false
      this.map.un('pointermove', this.onMouseMove, this)
    } else if (radius < this.options['minRadius']) {
      this.radius = this.options['minRadius'] - 1
      this.isMouseDown = false
      this.map.un('pointermove', this.onMouseMove, this)
    } else {
      this.radius = radius
    }
    this.handleLabel.innerHTML = Math.floor(this.radius) + 1 + 'm'
    this.geom = this._getCircleGeom()
    this.circleFeature.setGeometry(this.geom)
  }
  this.overlay.setPosition(this.geom.getLastCoordinate())
}
