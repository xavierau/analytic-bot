import bcrypt from 'bcrypt'

export function hashPassword(password: string) {
    const saltRounds = 10
    return bcrypt.genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .catch(err => {
            console.error(err)
            throw new Error("Error hashing password")
        })
}