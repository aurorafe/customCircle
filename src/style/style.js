/**
 * Created by 张永平 on 2017/8/31.
 * @desc 设置样式
 */

export const getStyleByPolygon = function (options) {
  let style = null
  if (!options) {
    style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(67, 110, 238, 0.4)'
      }),
      stroke: new ol.style.Stroke({
        color: '#4781d9',
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: '#ffcc33'
        })
      })
    })
  } else {
    style = new ol.style.Style({})
    if (options['stroke'] && getStroke(options['stroke'])) {
      style.setStroke(getStroke(options['stroke']))
    }
    if (options['fill'] && getFill(options['fill'])) {
      style.setFill(getFill(options['fill']))
    }
  }
  return style
}

export const getStroke = function (options) {
  try {
    let stroke = new ol.style.Stroke({
      color: (options['strokeColor'] ? options['strokeColor'] : undefined),
      lineCap: (options['strokeLineCap'] ? options['strokeLineCap'] : 'round'),
      lineJoin: (options['strokeLineJoin'] ? options['strokeLineJoin'] : 'round'),
      lineDash: (options['strokeLineDash'] ? options['strokeLineDash'] : undefined),
      lineDashOffset: (options['strokeLineDashOffset'] ? options['strokeLineDashOffset'] : '0'),
      miterLimit: (options['strokeMiterLimit'] ? options['strokeMiterLimit'] : 10),
      width: (options['strokeWidth'] ? options['strokeWidth'] : undefined)
    })
    if (stroke && stroke instanceof ol.style.Stroke) {
      return stroke
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
  }
}

export const getFill = function (options) {
  try {
    let fill = new ol.style.Fill({
      color: (options['fillColor'] ? options['fillColor'] : undefined)
    })
    if (fill && fill instanceof ol.style.Fill) {
      return fill
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
  }
}
