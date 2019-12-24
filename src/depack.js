import '@externs/goa'
import '../types/externs'

import FormData, { diskStorage, memoryStorage, FormDataError } from './'

module.exports = {
  '_FormData': FormData,
  '_diskStorage': diskStorage,
  '_memoryStorage': memoryStorage,
  '_FormDataError': FormDataError,
}