'use server'

export default async function classifyTime(min: number, seg: number) {

    const total = min + seg

    if (total < 3) {
        return 'bullet'
    } else if (total < 10) {
        return 'blitz'
    } else if (total < 60) {
        return 'rapid'
    } else {
        return 'standard'
    }
}