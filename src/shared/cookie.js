import cookie from "js-cookie"

const setCookie = (key , value) => {
   cookie.set(key , value , { expires : 1})
}

const getCookie = (key) => {
   return cookie.get(key)
}

const removeCookie = (key) => {
    cookie.remove(key)
}

export {
    setCookie ,
    getCookie ,
    removeCookie
}