<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片-->
        <el-card>
            <!--  警告区  -->
            <el-alert
                    show-icon
                    :closable="false"
                    title="注意只能选择三级菜单"
                    type="warning">
            </el-alert>
            <!-- 选择商品分类区域-->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!--选择商品分类级联选择框 -->
                    <el-cascader
                            v-model="selectCateKeys"
                            :options="cateList"
                            :props="cateProps"
                            @change="handleChange"
                    >
                    </el-cascader>
                </el-col>
            </el-row>
            <!--  tab页签区域-->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button @click="addDialogVisible=true" :disabled="disable" type="primary" size="mini">添加参数
                    </el-button>
                    <!--  动态参数表格-->
                    <el-table :data="manyTableDate" border stripe>
                        <el-table-column type="expand"></el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <el-button size="mini" @click="showEditDialog" type="primary" icon="el-icon-edit">编辑
                            </el-button>
                            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button @click="addDialogVisible=true" :disabled="disable" type="primary" size="mini">添加属性
                    </el-button>
                    <!--  静态参数表格-->
                    <el-table :data="onlyTableDate" border stripe>
                        <el-table-column type="expand"></el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <el-button @click="showEditDialog" size="mini" type="primary" icon="el-icon-edit">编辑
                            </el-button>
                            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数的对话框-->
        <el-dialog
                :title="'添加'+titleText"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClosed"
        >
            <!-- 添加参数的对话框 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParmasbtn">确 定</el-button>
             </span>
        </el-dialog>
        <!--修改参数的对话框-->
        <el-dialog
                :title="'修改'+titleText"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editDialogClosed"
        >
            <!-- 添加参数的对话框 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParmasbtn">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getCateList, getCateAttributes, addParmas} from "network/parmas";

    export default {
        name: "Params",
        data() {
            return {
                cateList: [],
                //级联选择框配置对象
                cateProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    expandTrigger: 'hover',
                },
                //级联选择框双向绑定
                selectCateKeys: [],
                //被激活的页签名称
                activeName: 'many',
                //动态参数的数据
                manyTableDate: [],
                //静态参数的数据
                onlyTableDate: [],
                addDialogVisible: false,
                addForm: {
                    attr_name: ''
                },
                addFormRules: {
                    attr_name: [
                        {required: true, message: '请输入参数名称', trigger: 'blur'},
                    ],
                },
                editDialogVisible: false,
                editForm: {},
                editFormRules:{
                    attr_name: [
                        {required: true, message: '请输入参数名称', trigger: 'blur'},
                    ],
                }

            }
        },
        computed: {
            disable() {
                return this.selectCateKeys.length === 3 ? false : true
            },
            //当前选中的三级分类的id
            cateId() {
                if (this.selectCateKeys.length === 3) {
                    return this.selectCateKeys[2]
                }
                return null
            },
            //动态计算标题的文本
            titleText() {
                if (this.activeName === 'many') {
                    return '动态参数'
                } else {
                    return '静态属性'
                }
            }

        },
        methods: {
            getCateList() {
                getCateList().then(res => {
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取商品列表失败')
                    }
                    this.cateList = res.data
                    // console.log(this.cateList)

                })
            },
            //级联选择框变化触发
            handleChange() {
                this.getParamsDate()
                // //证明选中的不是三级分类
                // if (this.selectCateKeys.length !== 3) {
                //     this.selectCateKeys = [];
                //     return;
                // }
                // console.log(this.cateId)
                //
                // //证明选中的是三级分类
                // console.log(this.selectCateKeys)
                // //根据所选分类的id，和当前所处的面板获取对应的参数
                // getCateAttributes(this.cateId,this.activeName).then(res=>{
                //     if(res.meta.status!==200){
                //         return this.$message.error('获取参数列表失败')
                //     }
                //     console.log(res)
                // })
            },
            //tab点击事件
            handleTabClick() {
                this.getParamsDate()
                // getCateAttributes(this.cateId,this.activeName).then(res=>{
                //     if(res.meta.status!==200){
                //         return this.$message.error('获取参数列表失败')
                //     }
                //     console.log(res)
                // })
            },
            getParamsDate() {
                //证明选中的不是三级分类
                if (this.selectCateKeys.length !== 3) {
                    this.selectCateKeys = [];
                    return;
                }
                console.log(this.cateId)

                //证明选中的是三级分类
                // console.log(this.selectCateKeys)
                //根据所选分类的id，和当前所处的面板获取对应的参数
                getCateAttributes(this.cateId, this.activeName).then(res => {
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取参数列表失败')
                    }
                    console.log(res)
                    if (this.activeName === "many") {
                        this.manyTableDate = res.data
                    } else {
                        this.onlyTableDate = res.data
                    }
                })
            },
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            //点击确定按钮添加参数
            addParmasbtn() {
                this.$refs.addFormRef.validate(valid => {
                    if (!valid) return
                    addParmas(this.cateId, this.addForm.attr_name, this.activeName).then(res => {
                        if (res.meta.status !== 201) {
                            return this.$message.error('添加参数失败')
                        }
                        this.$message.success("添加参数成功")
                        this.addDialogVisible = false
                        this.getParamsDate()
                    })
                })
            },
            //点击按钮，展示修改的对话框
            showEditDialog() {
                this.editDialogVisible = true
            },
            //重置修改表单
            editDialogClosed() {
                this.$refs.editForm.resetFields()
            },
            editParmasbtn(){

            }


        },
        created() {
            //获取所有的商品分类列表
            this.getCateList()
        }

    }
</script>

<style lang="less" scoped>
    .el-breadcrumb {
        margin-bottom: 15px;
        font-size: 12px;
    }

    .el-card {
        box-shadow: 0 1px 1px rgba(0, 0, 0, .15);
    }

    .cat_opt {
        margin: 15px 0;
    }
</style>