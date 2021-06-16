import axios from 'axios'

export function request(config) {
    const instance = axios.create({
        // baseURL: "http://8.140.191.188:8888/api/private/v1",
        baseURL: "http://www.ysqorz.top:8888/api/private/v1/",
        // baseURL: "https://www.liulongbin.top:8888/api/private/v1",
        timeout: 5000
    })
// 请求拦截
    instance.interceptors.request.use(config => {
        config.headers.Authorization = window.sessionStorage.getItem('token');
        return config
    }, err => {
        console.log(err)
    });
//响应拦截
    instance.interceptors.response.use(res => {
        // console.log(res)
        return res.data
    }, err => {
        console.log(err)
    });

    return instance(config)
}
