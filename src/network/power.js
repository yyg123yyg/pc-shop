// . 所有权限列表
import {request} from "./request";

export function getRightsList(type) {
    return request({
        url: '/rights/' + type
    })

}

// 角色列表
export function getRoles() {
    return request({
        url: '/roles/'
    })

}
// 添加角色列表
export function getAddRoles({roleName,roleDesc}) {
    return request({
        url: '/roles/',
        method:"post",
        data:{
            roleName,
            roleDesc
        }
    })
}
//. 删除角色
export function deleteRole(id) {
    return request({
        url: `roles/${id}`,
        method:'delete'
    })
}