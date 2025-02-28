import CryptoJS from "crypto-js";

export const generateEncryption = ({plainText='',signatureEnc=process.env.signatureEnc}={})=>{
    const enc = CryptoJS.AES.encrypt(plainText,signatureEnc).toString()
    return enc
}
export const generateDecryption = ({cipherText='',signatureEnc=process.env.signatureEnc}={})=>{
    const dec = CryptoJS.AES.decrypt(cipherText,signatureEnc).toString(CryptoJS.enc.Utf8)
    return dec
}