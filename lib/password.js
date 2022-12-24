import argon2 from "argon2";

export async function hashPassword(password) {
    const hashed = await argon2.hash(password);
    //console.log({hashed})
    return hashed
}

export async function verifyPassword(password, hashedPassword) {
    try {
        const verified = await argon2.verify(hashedPassword, password)
        return verified
    } catch (error) {
        console.error(error)
        return false
    }
}