import L from "leaflet"
import "leaflet.heat"
//将wgs84坐标加密为gcj02坐标会用到
L.CRS.CustomCRS = L.extend({}, L.CRS.EPSG3857, {
  // 实现 latLngToPoint 和 pointToLatLng 方法
  latLngToPoint: function (latlng, zoom) {
    // 自定义实现 latLngToPoint 方法
    var projectedPoint = this.projection.project(latlng)
    var scale = this.scale(zoom)
    var point = this.transformation.transform(projectedPoint, scale)

    console.log("latLngToPoint:", point.x, point.y)

    return point
  },

  pointToLatLng: function (point, zoom) {
    // 自定义实现 pointToLatLng 方法
    var scale = this.scale(zoom)
    var untransformedPoint = this.transformation.untransform(point, scale)
    var latlng = this.projection.unproject(untransformedPoint)

    console.log("pointToLatLng:", point.x, point.y)

    return latlng
  },
})

//控制地图底图
let baseLayers = {
  //天地图tk可以换成自己申请的key

  天地图影像: L.layerGroup([
    L.tileLayer(
      "http://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=eb6b544bedefd775ae5f50daea5def8d",
      { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
    ),
    L.tileLayer(
      "http://t{s}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=eb6b544bedefd775ae5f50daea5def8d",
      { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
    ),
  ]),
  天地图地形: L.layerGroup([
    L.tileLayer(
      "http://t{s}.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=eb6b544bedefd775ae5f50daea5def8d",
      { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
    ),
    L.tileLayer(
      "http://t{s}.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=eb6b544bedefd775ae5f50daea5def8d",
      { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] }
    ),
  ]),
  OSM: L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png"),
}

export { L, baseLayers }
