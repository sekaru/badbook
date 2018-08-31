export const register = (loc, user, callback) => {
    if(user.pass!==user.pass2) {
        alert("Those passwords don't match!")
        return
    }

    fetch(loc + "/register", {method: 'post', body: JSON.stringify(user)})
    .then(res => {
        return res.json()
    })
    .then(resJson => {
        callback(resJson)
    })
}

export const login = (loc, user, callback) => {
    fetch(loc + "/login", {method: 'post', body: JSON.stringify(user)})
    .then(res => {
        return res.json()
    })
    .then(resJson => {
        callback(resJson)
    })
}

export const getStats = (loc, user, callback) => {
    return fetch(loc + "/stats/" + user)
    .then(res => {
        return res.json()
    })
    .then(resJson => {
        callback(resJson)
    })
}

export const getHint = (loc, user, callback) => {
    return fetch(loc + "/hint/" + user)
    .then(res => {
        return res.json()
    })
    .then(resJson => {
        callback(resJson)
    })
}

export const logout = (loc, user) => {
    fetch(loc + "/logout", {method: 'post', body: JSON.stringify({user: user})})
}