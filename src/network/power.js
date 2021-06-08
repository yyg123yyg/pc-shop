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
// 删除角色指定权限
export function deleteRoleinfo(roleid,rightId) {
    return request({
        url: `roles/${roleid}/rights/${rightId}`,
        method:'delete'
    })
}
// 所有权限列表值 list 或 tree , list 列表显示权限, tree 树状显示权限,参数是url参数:type
export function getRightsListTree() {
    return request({
        url: '/rights/tree'
    })

}

//角色授权

export function addRights(roleId,rids) {
    return request({
        url: `roles/${roleId}/rights`,
        method:"post",
        data:{
            rids
        }
    })

}