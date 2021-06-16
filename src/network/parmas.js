import {request} from "./request";
//获取商品列表
export function getCateList() {
    return request({
        url: "/categories",
    })

}
//参数列表
export function getCateAttributes(id,activeName) {
    return request({
        url:`categories/${id}/attributes`,
        params:{
            sel:activeName
        },
        method:'get'
    })
}

//.2. 添加动态参数或者静态属性
export function addParmas(id,attr_name,attr_sel) {
    return request({
        url:`categories/${id}/attributes`,
        data:{
            attr_name,
            attr_sel
        },
        method: 'post'
    })
}
//根据 ID 查询参数
