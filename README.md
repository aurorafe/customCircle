# 周边搜索

> 提供周边搜索插件，支持openlayers3+ 以上。

> 

## build

> 重要: Github 仓库的 /dist 文件夹只有在新版本发布时才会更新。如果想要使用 Github 上最新的源码，你需要自己构建。

---

```bash
git clone https://github.com/pingpingEE/customCircle.git
npm install
npm run dev
npm run build
```

## Use

> `new ol.plugins.CustomCircle(options)`

### CDN

```bash
```

### NPM

```bash
```

## Examples

其他示例请参看example文件夹

#### Parameters:

| key | type | desc |
| :--- | :--- | :---------- |
| `center` | `Array` | 中心点坐标 |
| `map` | `ol.Map` | 地图类 |
| `onRadiusChangeEnd` | `Function` | 完成事件 |
| `radius` | `Number` |半径 |
| `minRadius` | `Number` | 最小半径 |
| `maxRadius` | `Number` | 最大半径 |
| `layerName` | `String` | 图层名 |
| `showPolygonFeature`| `Boolean` | 是否自定义圆样式 |
| `showCenterFeature`| `Boolean` | 是否自定义中心点样式 |
| `zoomToExtent`| `Boolean`| 是否缩放范围 |
| `style`| `Object` | 圆的样式 详情查看style参数配置|
| `centerStyle`| `Object`| 中心点样式 详情查看centerStyle配置|

##### style Parameters:

| key | type | desc |
| :--- | :--- | :---------- |
| `stroke` | `Object` | 边框样式配置 |
| `stroke['strokeColor']` | `String` | 边框颜色 |
| `stroke['strokeLineCap']` | `String` | 线帽风格 |
| `stroke['strokeLineJoin']` | `String` | 线条连接样式 |
| `stroke['strokeLineDash']` | `String` | 边框折号 |
| `stroke['strokeLineDashOffset']` | `String` | 边框折号 |
| `stroke['strokeMiterLimit']` | `Number` | 斜度限制 |
| `stroke['strokeWidth']` | `Number` | 边框宽度 |
| `fill` | `Object` | 填充样式配置 |
| `fill['fillColor']` | `String` | 填充颜色 |

##### centerStyle Parameters:

| key | type | desc |
| :--- | :--- | :---------- |
| `stroke` | `Object` | 边框样式配置 |
| `stroke['strokeColor']` | `String` | 边框颜色 |
| `stroke['strokeWidth']` | `Number` | 边框宽度 |
| `fill` | `Object` | 填充样式配置 |
| `fill['fillColor']` | `String` | 填充颜色 |
| `circleRadius` | `Number` | 圆心半径设置 |


#### Methods

##### `getCenter()`

> 获取圆的中心点

##### `getRadius()`

> 获取圆的半径

##### `setRadius(radius)`

> 设置圆的半径

###### Parameters:

| key | type | desc |
| :--- | :--- | :---------- |
| `radius` | `Number` | 半径 |

##### `setCenter(center)`

> 设置圆的圆心点

###### Parameters:

| key | type | desc |
| :--- | :--- | :---------- |
| `center` | `Array` | 圆心点 |
