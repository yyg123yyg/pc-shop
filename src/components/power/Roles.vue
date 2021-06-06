<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--添加角色按钮区域-->
        <el-card>
            <el-row>
                <el-col>
                    <!--添加角色按钮-->
                    <el-button type="primary" @click="addRolesDialog">添加角色</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 角色列表区域-->
        <el-table :data="roleList" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作">
                <template v-slot="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button @click="removeRoleById(scope.row.id)" size="mini" type="danger"
                               icon="el-icon-delete">删除
                    </el-button>
                    <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加角色对话框-->
        <el-dialog
                title="请添加用户"
                :visible.sync="addRoleDialogVisible"
                width="50%"
                @close="addRoleDialogClosed()"
        >
            <!--  内容主体-->
            <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="角色名称" prop="roleName" label-width="100px">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!--  底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getRoles, getAddRoles, deleteRole} from "network/power";

    export default {
        name: "Roles",
        data() {
            return {
                addRoleDialogVisible: false,
                addRoleForm: {
                    roleName: '',
                    roleDesc: ''
                },
                addRoleFormRules: {
                    roleName: [
                        {required: true, message: '请输入角色', trigger: 'blur'},
                        {min: 2, max: 6, message: '长度在 2 到 6个字符', trigger: 'blur'}
                    ],
                    roleDesc: [
                        {required: true, message: '请输入角色描述', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur'}
                    ],
                },
                roleList: []
            }
        },
        methods: {
            //角色请求
            getRoles() {
                getRoles().then(res => {
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取用户失败')
                    }
                    this.roleList = res.data
                    console.log(this.roleList)
                })
            },
            //添加用户
            addRole() {
                this.$refs.addFormRef.validate(valid => {
                    if (!valid) return;
                    getAddRoles(this.addRoleForm).then(res => {
                        if (res.meta.status !== 201) {
                            return this.$message.error('添加角色失败')
                        }
                        this.$message.success('添加角色成功')
                        this.getRoles()
                    })
                    this.addRoleDialogVisible = false;
                })
            },
            //弹出添加对话框
            addRolesDialog() {
                this.addRoleDialogVisible = !this.addRoleDialogVisible
            },
            //重置对话框
            addRoleDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            //删除角色
            async removeRoleById(id) {
                console.log(id)

                //弹框询问是否删除
                const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).catch((err) => {
                        return err
                    })
                // confirmResult为confirm/cancel
                // console.log(confirmResult)
                if (confirmResult !== 'confirm') {
                    return this.$message({
                        type: 'info',
                        message: '已取消删除!'
                    });
                }
                deleteRole(id).then(res => {
                    console.log(res)
                    if (res.meta.status !== 200) {
                        return this.$message.error('删除角色失败')
                    }
                    this.$message.success('删除角色成功')
                    this.getRoles()
                })
            }
        },
        created() {
            this.getRoles()
        }
    }
</script>

<style scoped>
    .el-breadcrumb {
        margin-bottom: 15px;
    }
</style>