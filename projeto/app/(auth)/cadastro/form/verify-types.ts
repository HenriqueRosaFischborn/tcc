'use server'

export async function verifyTypes(value: any) {
    const allowedKeys = ['email', 'password']

    const keys = Object.keys(value)
    
    if (!(keys.every(el => allowedKeys.includes(el)))) {
        return false
    }

    if (
        typeof value == 'object' &&
        typeof value.email == 'string' &&
        typeof value.password == 'string' 
    ) {
        return true
    } else {
        return false
    }
}

export async function verifyEmail(value: string) {
    if (
        typeof value == 'string'
    ) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    } else {
        return false
    }
}