<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!--  表格-->
            <el-table
                    :data="cateList"
                    style="width: 100%"
                    row-key="cat_id"
                    border
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column
                        type="index"
                        width="100"

                >
                </el-table-column>
                <el-table-column
                        prop="cat_name"
                        label="分类名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        label="是否有效"
                        width="180">
                    <template v-slot="scope">
                        <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color: #23d5ab"></i>
                        <i class="el-icon-error" v-else></i>
                        <!--                        {{scope.row.cat_deleted}}-->
                    </template>
                </el-table-column>
                <el-table-column
                        label="排序">
                    <template v-slot="scope">
                        <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
                        <el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
                        <el-tag v-else type="warning">三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete">删除</el-button>
                </el-table-column>
            </el-table>
            <!-- 分页-->
        </el-card>
        <!--        添加分类对话框-->
        <el-dialog
                title="添加分类"
                :visible.sync="addCatedialogVisible"
                width="50%"
                @close="addCateDialogclose"
        >
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!--  options指定数据源 -->
                    <el-cascader
                            v-model="selectedKeys"
                            :options="parentCateList"
                            :props="cascaderProps"
                            @change="parentCateChange"
                            clearable>
                    </el-cascader>

                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
            <el-button @click="addCatedialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import {getCateList, getParentCateList,addCategories} from "network/categories";

    export default {
        name: "Cate",
        data() {
            return {
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                //商品分类
                cateList: [],
                addCatedialogVisible: false,
                addCateForm: {
                    cat_name: '',
                    //父分类id
                    cat_pid: 0,
                    cat_level: 0

                },
                addCateFormRules: {
                    cat_name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'},
                    ],
                },
                //父级分类列表
                parentCateList: [],
                //指定级联选择对象
                cascaderProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    expandTrigger: 'hover',
                    checkStrictly: true
                },
                //
                selectedKeys: []

            }
        },
        methods: {
            getCateList() {
                getCateList(this.queryInfo).then(res => {
                    // console.log(res)
                    if (res.meta.status !== 200) {
                        this.$message.error('请求商品失败')
                    }
                    this.cateList = res.data
                })

            },
            showAddCateDialog() {
                this.getParentCateList()
                this.addCatedialogVisible = true
            },
            //获取父级分类数据列表
            getParentCateList() {
                getParentCateList().then(res => {
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取父级数据失败')
                    }
                    console.log(res)
                    this.parentCateList = res.data
                })
            },
            // 级联选择发生变化触发
            parentCateChange() {
                // selectedKeys数组中的length大于0，证明选中父级分类
                // 反之，就说明灭有选中任何父级分类
                console.log(this.selectedKeys)
                if (this.selectedKeys.length > 0) {
                    //父级分类id
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                    this.addCateForm.cat_level = this.selectedKeys.length
                } else {
                    this.addCateForm.cat_pid = 0
                    this.addCateForm.cat_level = 0
                }

            },
            // 点击确定按钮，添加新的分类
            addCate() {
                console.log(this.addCateForm)
                this.$refs.addCateFormRef.validate(valid => {
                    if (!valid) return
                    addCategories(this.addCateForm).then(res=>{
                        if(res.meta.status!==201){
                           return  this.$message.error('添加分类失败')
                        }
                        this.$message.success('添加分类成功')
                        this.getCateList()
                        this.addCatedialogVisible=false
                    })

                })
            },
            //监听对话框的关闭事件，重置表单
            addCateDialogclose() {
                this.$refs.addCateFormRef.resetFields()
                this.selectedKeys = []
                this.addCateForm.cat_level = 0
                this.addCateForm.cat_pid = 0
            }
        },
        created() {
            this.getCateList()
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


</style>