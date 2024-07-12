// 加密
// aes加密，即长度为16字节的字符串作为秘钥，一个iv向量
// 秘钥
// const secret = Buffer.from(Math.random().toString(16).slice(-8) + Math.random().toString(16).slice(-8));
const secret = Buffer.from('b7b5b22c66dd6b28');
// iv向量
// const iv = Buffer.from(Math.random().toString(16).slice(-8) + Math.random().toString(16).slice(-8));
const iv = Buffer.from('b1a95623f35f8e98');
// 导入加密算法库，node内置库
const crypto = require('crypto');

module.exports = {
    encrypt(str) {
        const cryptoHandler = crypto.createCipheriv('aes-128-cbc', secret, iv);
        return cryptoHandler.update(str, 'utf-8', 'base64') + cryptoHandler.final('base64');
    },
    dencrypt(str) {
        const cryptoHandler = crypto.createDecipheriv('aes-128-cbc', secret, iv);
        return cryptoHandler.update(str, 'base64', 'utf-8') + cryptoHandler.final('utf-8');
    }
}
