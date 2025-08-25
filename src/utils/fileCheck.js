import { Message } from "element-ui"
let shpFileCheck = {
  allowedFileFormat(allowFormat, suffix, mustFormat) {
    /**
     * format:允许的后缀格式字符串数组，如['shp', 'dbf', 'shx', 'prj', 'sbn', 'sbx', 'cpg']
     * suffix:上传的所有文件后缀数组，如['shp', 'dbf', 'shx']
     * mustFormat可选:上传所包含的必要格式()
     */
    let allowFormatStr = allowFormat.reduce((accumulator, currentValue) => {
      return accumulator + "." + currentValue
    }, " ")
    const isAllowed = suffix.every((el) => allowFormat.includes(el))
    if (!isAllowed) {
      Message({
        message: "请上传符合要求格式的文件" + allowFormatStr,
        type: "error",
      })
      return false
    }
    if (mustFormat) {
      let mustFormatStr = mustFormat.reduce(
        (accumulator, currentValue) => accumulator + "." + currentValue,
        " "
      )
      if (!mustFormat.every((el) => suffix.includes(el))) {
        Message({
          message: "请上传符合要求格式的文件" + mustFormatStr,
          type: "error",
        })
        return false
      }
      return true
    }
    return true
  },
  // 统计FileList中的后缀名
  fileSuffix(fileList) {
    let suffixArr = []
    fileList.forEach((el) => suffixArr.push(el.name.split(".").pop()))
    suffixArr = [...new Set(suffixArr)]
    return suffixArr
  },
  // 统计FileList中的文件名是否统一
  isSingleFile(fileList) {
    let fileName = fileList[0].name.split(".").shift()
    const isSingleFile = fileList.every((el) => {
      return el.name.split(".").shift() == fileName
    })
    return isSingleFile
  },
  // 上传之前限制文件格式
  isLessThanLimit(file, fileSize) {
    const isLt = file.size / 1024 / 1024 < fileSize
    if (!isLt) {
      Message({
        message: "上传文件大小不能超过" + fileSize,
        type: "error",
      })
    }
    return isLt
  },
}
export { shpFileCheck }
