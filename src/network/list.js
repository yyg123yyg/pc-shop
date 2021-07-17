// . 商品列表数据
import {request} from "./request";

export function getGoodsList({query, pagenum, pagesize}) {
    return request({
        url: "/goods",
        params: {
            query, pagenum, pagesize
        },
        method:'get'

    })
}

// 删除商品
export function deleteGoods(id) {
    return request({
        url:`goods/${id}`,
        method: 'delete',

    })
}
// 添加商品
// export function f() {
//     return request({
//         url:'goods',
//         method:'post',
//         data:{
//             goods_name,
//             goods_cat,
//             goods_price,
//             goods_number,
//             goods_weigh
//
//         }
//     })
// }