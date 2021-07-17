import axios from 'axios'

import { showLoading, hideLoading } from './loading';
export function request(config) {
    const instance = axios.create({
        baseURL: "http://8.140.191.188:8888/api/private/v1",
        // baseURL: "http://www.ysqorz.top:8888/api/private/v1/",
        // baseURL: "https://www.liulongbin.top:8888/api/private/v1",
        timeout: 5000
    });
// 请求拦截
    instance.interceptors.request.use(config => {
        showLoading()
        config.headers.Authorization = window.sessionStorage.getItem('token');
        return config
    }, err => {
        console.log(err)
    });
//响应拦截
    instance.interceptors.response.use(res => {
        hideLoading();

        // console.log(res)
        return res.data
    }, err => {
        console.log(err)
    });

    return instance(config)
}
