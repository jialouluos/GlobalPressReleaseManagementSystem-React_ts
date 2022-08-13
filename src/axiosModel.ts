import axios from 'axios'
import {store} from "./redux/store"
axios.defaults.baseURL = 'http://localhost:3000/selfserver1/';
axios.interceptors.request.use(config => {
    store.dispatch({
        type: "load",
        value: true
    })
    return config
}, (error) => {
    return Promise.reject(error)
})
axios.interceptors.response.use((config) => {
    store.dispatch({
        type: "load",
        value: false
    })
    return config
}, (error) => {
    return Promise.reject(error)
})
export default axios;