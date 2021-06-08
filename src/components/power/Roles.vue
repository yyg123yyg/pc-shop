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
            <!--展开行-->
            <el-table-column type="expand">
                <template v-slot="scope">
                    <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children"
                            :key="item1.id">
                        <!--  一级权限-->
                        <el-col :span="5">
                            <el-tag closable @close="removeRightById(scope.row,item1.id)">
                                {{item1.authName}}
                            </el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!--  二级、三级权限-->
                        <el-col :span="19">
                            <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children"
                                    :key="item2.id">
                                <el-col :span="6">
                                    <el-tag closable @close="removeRightById(scope.row,item2.id)" type="success">
                                        {{item2.authName}}
                                    </el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="18">
                                    <!--closable就是x-->
                                    <el-tag closable @close="removeRightById(scope.row,item3.id)" type="warning"
                                            v-for="(item3) in item2.children"
                                            :key="item3.id">
                                        {{item3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <pre>
<!--                        {{scope.row}}-->
                    </pre>
                </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作">
                <template v-slot="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button @click="removeRoleById(scope.row.id)" size="mini" type="danger"
                               icon="el-icon-delete">删除
                    </el-button>
                    <el-button @click="showSetRightDialog(scope.row)" size="mini" type="warning" icon="el-icon-setting">
                        分配权限
                    </el-button>
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
        <!-- 分配权限对话框-->
        <el-dialog
                title="分配权限"
                :visible.sync="setRightDialogVisible"
                width="50%"
                @close="setRightDialogClose"
        >
            <!--  树形内容主体-->
            <el-tree :data="rightsList" :props="treeProps"
                     show-checkbox node-key="id" default-expand-all
                     :default-checked-keys="defKeys"
                     ref="treeRef"
            ></el-tree>
            <!--  底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getRoles, getAddRoles, deleteRole, deleteRoleinfo,
        getRightsListTree, addRights
    } from "network/power";

    export default {
        name: "Roles",
        data() {
            return {
                addRoleDialogVisible: false,
                setRightDialogVisible: false,
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
                roleList: [],
                rightsList: [],
                //属性控件的属性绑定对象
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                //默认选中的id值
                defKeys: [],
                //当前即将分配权限角色的id
                roleId: ''
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
                    // console.log(res)
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
            },
            //根据id删除对应的权限
            async removeRightById(role, rightId) {
                const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch((err) => {
                    return err
                })
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }
                // const {data: res} = await
                deleteRoleinfo(role.id, rightId).then(res => {
                    if (res.meta.status !== 200) {
                        return this.$message.error('删除权限失败')
                    }
                    // 返回的data, 是当前角色下最新的权限数据,防止整个列表 的刷新
                    role.children = res.data
                    this.$message.success('删除权限成功')
                })
            },
            //展示分配权限对话框
            showSetRightDialog(role) {
                this.roleId = role.id
                //获取所有权限的数据
                getRightsListTree().then(res => {
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取权限失败')
                    }
                    //这是获取到的数据
                    this.rightsList = res.data
                    console.log(this.rightsList)
                })
                //递归获取三级节点
                this.getLeafKeys(role, this.defKeys)

                this.setRightDialogVisible = true
            },
            //通过递归获取角色下所有的三级权限
            getLeafKeys(node, arr) {
                //如果当前node不包含chiildren属性，则是三级节点
                if (!node.children) {
                    return arr.push(node.id)
                }
                //递归
                node.children.forEach(item => {
                    this.getLeafKeys(item, arr)
                })

            },
            //关闭分配对话框
            setRightDialogClose() {
                this.defKeys = []
            },
            //点击为角色分配权限
            allotRights() {
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                const idStr = keys.join(',')
                addRights(this.roleId, idStr).then(res => {
                    if (res.meta.status !== 200) {
                        return this.$message.error('分配角色权限失败')
                    }
                    this.$message.success('分配角色权限成功')
                    this.getRoles()
                    this.setRightDialogVisible=false
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

    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;

    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>