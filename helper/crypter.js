const CryptoJS = require("crypto-js")

function CRYPTER(text, functionType) {
    let phrase = 'U_PRO@2024';
    if (functionType === 'ENCRYPT') {
        // Encrypt
        const encryptedText = CryptoJS.AES.encrypt(text, phrase).toString();
        return encryptedText
    } else if (functionType === 'DECRYPT') {
        // Decrypt
        const decryptedText = CryptoJS.AES.decrypt(text, phrase).toString(CryptoJS.enc.Utf8);
        return decryptedText
    }
}

module.exports = CRYPTER;
