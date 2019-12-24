import '@externs/goa'
import '../types/externs'

import MultipartFormData, { diskStorage, memoryStorage, FormDataError } from './'

module.exports = {
  '_MultipartFormData': MultipartFormData,
  '_diskStorage': diskStorage,
  '_memoryStorage': memoryStorage,
  '_FormDataError': FormDataError,
}