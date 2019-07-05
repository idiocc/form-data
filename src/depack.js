import 'http'
import '@externs/goa'
import MultipartFormData, { diskStorage, memoryStorage, FormDataError } from './'

DEPACK_EXPORT = {
  '_MultipartFormData': MultipartFormData,
  '_diskStorage': diskStorage,
  '_memoryStorage': memoryStorage,
  '_FormDataError': FormDataError,
}