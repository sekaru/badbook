import Cookies from 'universal-cookie'

const cookies = new Cookies()

export const setToken = (token) => {
    let expiryDate = new Date()
    expiryDate.setTime(expiryDate.getTime() + 2592000000)

    cookies.set('user', token, {expires: expiryDate})
}

export const getToken = () => {
    return cookies.get('user')
}

export const deleteToken = () => {
    cookies.remove('user')
}