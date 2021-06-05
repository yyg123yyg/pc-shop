<template>
    <div>
        <!--面包导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区-->
        <el-card class="box-card">
            <!--  搜索与添加用户区域-->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input @clear="getUserList" clearable v-model="queryInfo.query" placeholder="请输入内容">
                        <!--搜索按钮-->
                        <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区-->
            <el-table :data="userList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <!--  作用域插槽-->
                    <template v-slot="scope">
                        <!-- {{scope.row}}-->
                        <el-switch
                                v-model="scope.row.mg_state"
                                @change="userStateChange(scope.row)"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template>
                        <!-- 修改-->
                        <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
                        <!-- 删除-->
                        <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
                        <!--   分配角色-->
                        <el-tooltip content="分配角色" placement="top" :enterable="false">
                            <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <!--        对话框-->
        <el-dialog
                title="请添加用户"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClosed()"
        >
            <!--  内容主体-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input type="email" v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobil">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!--  底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getUserList, userStateChanged, getAddUser} from "network/user";

    export default {
        name: "User",

        data() {
            //验证邮箱
            let checkEmail = (rule, value, cb) => {
                const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
                if (regEmail.test(value)) {
                    return cb()
                }
                cb(new Error('请输入合法的邮箱'))
            }
            let checkPhone = (rule, value, cb) => {
                const regPhone = /^[1][3,4,5,7,8,9][0-9]{9}$/;
                if (regPhone.test(value)) {
                    return cb()
                }
                cb(new Error('请输入合法的手机号'))
            }
            return {
                queryInfo: {
                    query: '',
                    //当前的页数
                    pagenum: 1,
                    //当前每页显示多少条数据
                    pagesize: 2
                },
                userList: [],
                total: 0,
                //控制用户对话框的显示与隐藏
                addDialogVisible: false,
                //添加用户的表单验证
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                addFormRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 10, message: '长度在 6到 10个字符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机', trigger: 'blur'},
                        {validator: checkPhone, trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            getUserList() {
                getUserList(this.queryInfo).then(res => {
                    // console.log(res)
                    if (res.meta.status !== 200) {
                        return this.$message({
                            type: 'error',
                            message: '获取用户列表失败!'
                        });
                    }
                    this.userList = res.data.users;
                    this.total = res.data.total

                })
            },
            //监听pagesize的改变
            handleSizeChange(newSize) {
                console.log(newSize)
                this.queryInfo.pagesize = newSize;
                this.getUserList();
            },
            //监听当前的页码值
            handleCurrentChange(newPage) {
                console.log(newPage);
                this.queryInfo.pagenum = newPage
                //重新获取数据
                this.getUserList();
            },
            //改变用户状态，发送到服务器
            userStateChange(userinfo) {
                // console.log(userinfo)
                userStateChanged(userinfo).then(res => {
                    // console.log(res)
                    if (res.meta.status !== 200) {
                        userinfo.mg_state = !userinfo.mg_state
                        return this.$message({
                            type: 'error',
                            message: '更新用户失败!'
                        });
                    }
                    this.$message({
                        type: 'success',
                        message: '更新用户成功!'
                    });

                })
            },
            //监听用户对话框的关闭事件
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            //点击按钮添加新用户
            addUser() {
                this.$refs.addFormRef.validate(valid => {
                    if (!valid) return;
                    //发起请求
                    getAddUser(this.addForm).then(res => {
                        if (res.meta.status !== 201) {
                            return this.$message({
                                type: 'error',
                                message: '添加用户失败'
                            });
                        }
                        this.$message({
                            type: 'success',
                            message: '添加用户成功'
                        });
                        //隐藏添加用户框
                        this.addDialogVisible = false
                        //重新获取用户的列表
                        this.getUserList()
                    })
                })

            }

        },
        created() {
            this.getUserList()
        }
    }
</script>

<style scoped>
    .el-breadcrumb {
        margin-bottom: 15px;
        font-size: 12px;
    }

    .el-card {
        box-shadow: 0 1px 1px rgba(0, 0, 0, .15);
    }

    .el-table {
        margin-top: 15px;
        font-size: 18px;
    }

    .el-pagination {
        margin-top: 15px;
    }
</style>