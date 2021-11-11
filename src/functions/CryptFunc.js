/** @format */

import CryptoJS from 'crypto-js'

var key = 'admin@F1'

function CryptFunc(data, type = 0) {
  /*var data = [
    { id: 1, name: 'Anil' },
    { id: 2, name: 'Sunil' },
  ]*/
  if (type == 1) {
    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString()
  } else {
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(data, key)
    var ciphertext = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  }

  return ciphertext
}

export default CryptFunc
