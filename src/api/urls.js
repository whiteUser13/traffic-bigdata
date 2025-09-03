const BASE_URL = "http://60.205.12.90:5001"

export default {
  readShpAttr: `${BASE_URL}/read_shp`, //读取shp数据的属性数据，需要携带路径参数
  uploadPointShp: `${BASE_URL}/upload/shp/point`,
  uploadPolygonShp: `${BASE_URL}/upload/shp/polygon`,
  getShpFile: `${BASE_URL}/get_shpfile`,
  mock: `${BASE_URL}/api/simu/path`,
}
