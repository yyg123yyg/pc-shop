<template>
    <div class="login_container">
        <div class="login_box">
            <!--            头像-->
            <div class="avatar_box">
                <img src="~assets/img/logo.png" alt="">
            </div>
            <!-- 登录-->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0" class="login_form">
                <el-form-item prop="username">
                    <el-input
                            v-model="loginForm.username"
                            placeholder="请输入用户名"
                            prefix-icon=" iconfont icon-touxiang"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                            v-model="loginForm.password"
                            placeholder="请输入密码"
                            prefix-icon="iconfont icon-mima"
                            type="password"
                    ></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                //登录表单的数据绑定对象
                loginForm: {
                    username: '',
                    password: ''
                },
                // 表单验证
                loginFormRules: {
                    // 验证用户名
                    username: [
                        {required: true, message: '请输入登录名称', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur'}
                    ],
                    // 验证密码
                    password: [
                        {required: true, message: '请输入登录名称', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6到 15个字符', trigger: 'blur'}
                    ]

                }
            }
        },
        methods:{
            //重置表单
            resetLoginForm(){
                // this.$refs.loginFormRef.resetFields()
                this.$refs['loginFormRef'].resetFields()
            },
            login(){
                this.$refs['loginFormRef'].validate((valid)=>{
                    console.log(valid)
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .login_container {
        background-color: #2b4b6b;
        width: 100%;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 5px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .avatar_box {
            width: 130px;
            height: 130px;
            border: 1px solid #ccc;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 10px #fff;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;

            }
        }
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;

    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }
</style>