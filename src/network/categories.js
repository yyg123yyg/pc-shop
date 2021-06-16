// 商品分类数据列表
import {request} from "./request";

export function getCateList({
                                type,
                                pagenum,
                                pagesize
                            }) {
    return request({
        url: "/categories",
        parmas: {
            type,
            pagenum,
            pagesize
        }
    })

}

export function getParentCateList(type=2) {
    return request({
        url: "/categories",
        parmas: {
            type,
        }
    })
}
// 添加分类
export function addCategories(addCateForm) {
    return request({
        url: "/categories",
        method:'post',
        data: addCateForm

    })
}