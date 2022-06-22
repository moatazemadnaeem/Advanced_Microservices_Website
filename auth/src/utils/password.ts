import bcrypt from 'bcrypt-nodejs'


export const hashPass=(pass:string):string=>{
    const salt = bcrypt.genSaltSync()
    const hashedpassword= bcrypt.hashSync(pass,salt)
    return hashedpassword
}

export const comparePass=(clientpass:string,dbpass:string):boolean=>{
    const validate=bcrypt.compareSync(clientpass,dbpass)
    return validate
}
