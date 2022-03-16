
const setLocalStorage = (key , value) => {
   localStorage.setItem(key , JSON.stringify(value))
}

const getLocalStorage = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key))
    } catch (err) {
        return null
    }
}

const removeLocalStorage = (key) => {
    localStorage.removeItem(key)
}

export {
    setLocalStorage ,
    getLocalStorage ,
    removeLocalStorage
}