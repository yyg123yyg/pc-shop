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
export function selectId(id,attrId,attr_sel) {
    return request({
        url:`categories/${id}/attributes/${attrId}`,
        params:{
            attr_sel
        },
        method:'get',
    })
}
//编辑提交参数1
export function editInfo(id,attrId,attr_name,attr_sel) {
    return request({
        url:`categories/${id}/attributes/${attrId}`,
        data:{
          attr_name,
          attr_sel
        },
        method:"put"
    })
}
//删除参数
export  function deleteParmas(id,attrid) {
    return request({
        url: `categories/${id}/attributes/${attrid}`,
        method:'delete'
    })
}
// 编辑提交参数2
export function editInfo2(id,attrId,attr_name,attr_sel,attr_vals) {
    return request({
        url:`categories/${id}/attributes/${attrId}`,
        data:{
            attr_name,
            attr_sel,
            attr_vals
        },
        method:"put"
    })
}