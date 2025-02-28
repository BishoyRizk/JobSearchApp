import bcrypt from 'bcrypt'


export const generateHash = ({plainText='',salt=parseInt(process.env.salt)}={})=>{
    const hash = bcrypt.hashSync(plainText,salt)
    return hash
}
export const compareHash = ({plainText='',hashValue=''}={})=>{
    const compare = bcrypt.compareSync(plainText,hashValue)
    return compare
}