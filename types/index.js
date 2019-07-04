export {}

/* typal types/index.xml closure noSuppress */
/**
 * @typedef {_idio.MulterFileFilter} MulterFileFilter The function to control which files are accepted.
 */
/**
 * @typedef {function(http.IncomingMessage, _idio.MulterFile): !Promise<boolean>} _idio.MulterFileFilter The function to control which files are accepted.
 */
/**
 * @typedef {_idio.MulterConfig} MulterConfig
 */
/**
 * @typedef {Object} _idio.MulterConfig
 * @prop {string} [dest] The directory where to store the files using the `DiskStorage`.
 * @prop {_idio.MulterStorageEngine} [storage] An _instance_ of a custom storage engine.
 * @prop {_idio.MulterFileFilter} [fileFilter] The file filter.
 * @prop {_goa.BusBoyLimits} [limits] The limits of the uploaded data.
 * @prop {boolean} [preservePath=false] Whether to keep the full path of files instead of just the base name. Default `false`.
 */
/**
 * @typedef {_idio.MulterStorageEngine} MulterStorageEngine `＠interface`
 */
/**
 * @typedef {Object} _idio.MulterStorageEngine `＠interface`
 * @prop {function(http.IncomingMessage, _idio.MulterFile): !Promise} _handleFile Saves the file asynchronously.
 * @prop {function(http.IncomingMessage, _idio.MulterFile): !Promise} _removeFile Removes the file asynchronously.
 */
/**
 * @typedef {_idio.MulterFile} MulterFile `＠record` The information about each file.
 */
/**
 * @typedef {Object} _idio.MulterFile `＠record` The information about each file.
 * @prop {string} fieldname The field name specified in the form.
 * @prop {string} originalname The name of the file on the user's computer.
 * @prop {string} encoding The encoding type of the file.
 * @prop {string} mimetype The mime type of the file.
 * @prop {number} size The size of the file in bytes.
 * @prop {string} destination The folder to which the file has been saved.
 * @prop {string} filename The name of the file within the `destination`.
 * @prop {string} path The full path to the uploaded file.
 * @prop {Buffer} buffer The `Buffer` of the entire file.
 * @prop {stream.Readable} stream The _Readable_ stream with the file data.
 */
/**
 * @typedef {_idio.MulterField} MulterField The item to use in the .fields method.
 */
/**
 * @typedef {Object} _idio.MulterField The item to use in the .fields method.
 * @prop {string} name The name of the field.
 * @prop {number} [maxCount] The maximum count of the field.
 */
/**
 * @typedef {import('@goa/busboy').BusBoyLimits} _goa.BusBoyLimits
 */
/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 */
/**
 * @typedef {import('fs').Stats} fs.Stats
 */
/**
 * @typedef {import('stream').Readable} stream.Readable
 */

/* typal types/disk-storage.xml closure noSuppress */
/**
 * @typedef {_idio.MulterDiskStorageOptions} MulterDiskStorageOptions `＠record`
 */
/**
 * @typedef {Object} _idio.MulterDiskStorageOptions `＠record`
 * @prop {string|function(http.IncomingRequest, _idio.MulterFile): !Promise<string>} [destination] Used to determine within which folder the uploaded files should be stored. If given as a string, the location will be ensured prior at the start. Default is `tmpdir()`.
 * @prop {function(http.IncomingRequest, _idio.MulterFile): !Promise<string>} [filename] Used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn't include any file extension.
 */
/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 */
