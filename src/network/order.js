// 订单数据列表
import {request} from "./request";

export function getOrdersList({
                                  query,
                                  pagenum,
                                  pagesize
                              }) {
    return request({
        url: "/orders",
        params: {
            query,
            pagenum,
            pagesize
        }
    })
}

//查看物流信息
export function getProgress(id=1106975712662) {
    return request({
        url:`/kuaidi/${id}`
    })

}