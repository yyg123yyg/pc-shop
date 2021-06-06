import {request} from "./request";

//获取用户数据
export function getUserList({query, pagenum, pagesize}) {
    return request({
        url: '/users',
        params: {
            query,
            pagenum,
            pagesize
        }

    })
}

//改变用户状态，发送到服务器
export function userStateChanged(userinfo) {
    return request({
        method: 'put',
        url: `/users/${userinfo.id}/state/${userinfo.mg_state}`
    })
}

//添加用户请求
export function getAddUser({username, password, email, mobile}) {
    return request({
        url: '/users',
        method: 'post',
        data: {
            username,
            password,
            email,
            mobile
        }

    })
}

//修改用户请求
export function editUser(id) {
    return request({
        url: `users/${id}`,

    })
}

// 编辑用户提交
export function editUserInfo({id, email, mobile}) {
    return request({
        url: `users/${id}`,
        method: "put",
        data: {
            email,
            mobile
        }

    })
}

// 删除单个用户
export function deleteUser(id) {
    return request({
        url: `users/${id}`,
        method:'delete'
    })
}