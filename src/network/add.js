import {request} from "./request";

export function getCateList() {
    return request({
        url: "/categories",
    })

}

export function getListMany(id) {
    return request({
        url: `/categories/${id}/attributes`,
        params: {
            sel: 'many'
        }
    })
}

export function getListOnly(id) {
    return request({
        url: `/categories/${id}/attributes`,
        params: {
            sel: 'only'
        }
    })
}

//添加商品
export function addShop(form) {
    return request({
        url: '/goods',
        data: form,
        method: 'post'
    })
}