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
   * 半径
   */
  this.radius = this.options['radius']

  this.initCircle(this.options['center'])
}

ol.inherits(ol.geom.Geometry, ol.geom.CustomCircle)

/**
 * 创建一个圆 创建一个要素
 * @param center
 */
ol.geom.CustomCircle.prototype.initCircle = function (center) {
  this.center = center
  this.centerCopy = ol.proj.transform(center, this._getProjectionCode(), 'EPSG:4326')
  this.geom = this._getCircleGeom()
  // if (this.geom && this.options['zoomToExtent']) {
  //   let extent = this.geom.getExtent()
  //   this.zoomToExtent(extent, true)
  // }
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
  layer.getSource().addFeature(this.circleFeature)
  this.map.addLayer(layer)
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
