export const form = {


    data() {
        //验证邮箱
        let checkEmail = (rule, value, cb) => {
            const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
            if (regEmail.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        let checkPhone = (rule, value, cb) => {
            const regPhone = /^[1][3,4,5,7,8,9][0-9]{9}$/
            if (regPhone.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        return {
        }
    }
}
