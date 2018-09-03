import Cookies from 'universal-cookie'

const cookies = new Cookies()

export const setToken = (token) => {
    cookies.set('user', token)
}

export const getToken = () => {
    return cookies.get('user')
}

export const deleteToken = () => {
    cookies.remove('user')
}