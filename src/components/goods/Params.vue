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
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <el-tag @close="handleClose(index,scope.row)"
                                        v-for="(item,index) in scope.row.attr_vals" :key="index" closable
                                >{{item}}
                                </el-tag>
                                <!--输入的文本框-->
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                ></el-input>
                                <!--添加的按钮-->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button size="mini" @click="showEditDialog(scope.row.attr_id)" type="primary"
                                           icon="el-icon-edit">编辑
                                </el-button>
                                <el-button size="mini" @click='deleteParmas(scope.row.attr_id)' type="danger"
                                           icon="el-icon-delete">删除
                                </el-button>
                            </template>

                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button @click="addDialogVisible=true" :disabled="disable" type="primary" size="mini">添加属性
                    </el-button>
                    <!--  静态参数表格-->
                    <el-table :data="onlyTableDate" border stripe>
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <el-tag @close="handleClose(index,scope.row)" v-for="(item,index) in scope.row.attr_vals" :key="index" closable
                                >{{item}}
                                </el-tag>
                                <!--输入的文本框-->
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                ></el-input>
                                <!--添加的按钮-->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button @click="showEditDialog(scope.row.attr_id)" size="mini" type="primary"
                                           icon="el-icon-edit">编辑
                                </el-button>
                                <el-button size="mini" @click='deleteParmas(scope.row.attr_id)' type="danger"
                                           icon="el-icon-delete">删除
                                </el-button>
                            </template>
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
            <!-- 修改参数的对话框 -->
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
    import {
        getCateList, getCateAttributes, addParmas,
        selectId, editInfo, deleteParmas, editInfo2
    } from "network/parmas";

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
                    // attr_name: ''
                },
                addFormRules: {
                    attr_name: [
                        {required: true, message: '请输入参数名称', trigger: 'blur'},
                    ],
                },
                editDialogVisible: false,
                editForm: {},
                editFormRules: {
                    attr_name: [
                        {required: true, message: '请输入参数名称', trigger: 'blur'},
                    ],
                },


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
                // console.log(this.activeName)
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
                    this.manyTableDate = [];
                    this.onlyTableDate = [];
                    return;
                }
                // console.log(this.cateId)
                //证明选中的是三级分类
                // console.log(this.selectCateKeys)
                //根据所选分类的id，和当前所处的面板获取对应的参数
                getCateAttributes(this.cateId, this.activeName).then(res => {
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取参数列表失败')
                    }
                    console.log(res);
                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []; //解决attr_val为空字符串时的问题
                        //控制文本框的显示与隐藏
                        item.inputVisible = false;
                        // //文本框中输入的值
                        item.inputValue = '';
                    });
                    if (this.activeName === "many") {
                        this.manyTableDate = res.data
                    } else {
                        this.onlyTableDate = res.data
                        // console.log(this.onlyTableDate)

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
            showEditDialog(attr_id) {
                //查询当前参数的信息

                selectId(this.cateId, attr_id, this.activeName).then(res => {
                    if (res.meta.status !== 200) {
                        return this.$message.error('查询商品信息失败')
                    }
                    this.editForm = res.data;
                })
                this.editDialogVisible = true;

            },
            //重置修改表单
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            //更新数据
            editParmasbtn() {
                this.$refs.editFormRef.validate(valid => {
                    if (!valid) return;
                    editInfo(this.cateId, this.editForm.attr_id,
                        this.editForm.attr_name, this.activeName).then(res => {
                        if (res.meta.status !== 200) {
                            return this.$message.error('数据更新失败')
                        }
                        this.$message.success('数据更新成功');
                        this.getParamsDate();
                        this.editDialogVisible = false;

                    })
                })
            },
            //删除数据
            async deleteParmas(attr_id) {
                const confirmRerult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => {
                    return err
                });
                if (confirmRerult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }
                deleteParmas(this.cateId, attr_id).then(res => {
                    if (res.meta.status !== 200) {
                        this.$message.error('删除失败')
                    }
                    this.$message.success('删除成功')
                    this.getParamsDate()
                })
            },
            //文本框失去焦点或按下了enter建时触发
            handleInputConfirm(data) {
                if (data.inputValue.trim().length === 0) {
                    data.inputValue = '';
                    data.inputVisible = false;
                    return;
                }
                data.attr_vals.push(data.inputValue.trim());
                data.inputValue = '';
                data.inputVisible = false;
                //发起请求，保存此数据
                editInfo2(this.cateId, data.attr_id, data.attr_name,
                    data.attr_sel, data.attr_vals.join(" ")).then(res => {
                    if (res.meta.status !== 200) {
                        this.$message.error('保存失败')
                    }
                    this.$message.success('保存成功')
                })
            },

            showInput(data) {
                data.inputVisible = true;
                //让文本框自动获得焦点
                //$nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会执行回调函数中的代码
                this.$nextTick(() => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            //删除对应的参数
            handleClose(index, data) {
                data.attr_vals.splice(index,1)
                editInfo2(this.cateId, data.attr_id, data.attr_name,
                    data.attr_sel, data.attr_vals.join(" ")).then(res => {
                    if (res.meta.status !== 200) {
                        this.$message.error('删除失败')
                    }
                    this.$message.success('删除成功')
                })
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

    .el-tag {
        margin: 10px;
    }

    .cat_opt {
        margin: 15px 0;
    }

    .input-new-tag {
        width: 120px;
    }
</style>