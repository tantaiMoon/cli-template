import * as crypto from 'crypto'

function WXBizDataCrypt(appId, sessionKey) {
  this.appId = appId
  this.sessionKey = sessionKey
}

WXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
  // base64 decode
  const sessionKey = Buffer.from(this.sessionKey, 'base64')
  encryptedData = Buffer.from(encryptedData, 'base64')
  iv = Buffer.from(iv, 'base64')
  let decoded
  try {
    // 解密
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    decoded = JSON.parse(decoded)
  } catch (err) {
    console.log('error', err)
    throw new Error('Illegal Buffer')
  }

  if (decoded.watermark.appid !== this.appId) {
    console.log('decoded watermark', decoded)
    throw new Error('Illegal Buffer')
  }

  return decoded
}

export default WXBizDataCrypt
