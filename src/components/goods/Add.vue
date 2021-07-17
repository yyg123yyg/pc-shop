<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!--  提示-->
            <el-alert
                    title="消息提示的文案"
                    type="info"
                    center
                    show-icon
                    :closable="false">
            </el-alert>
            <!--步骤条-->
            <el-steps class="steps" :space="200" :active="activeIndex -0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性 3"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- tab栏-->
            <el-form :model="addForm" :rules="addFormRules"
                     label-position="top"
                     ref="addFormRef" label-width="100px">
                <el-tabs @tab-click="tabClicked" v-model="activeIndex" :tab-position="'left'"
                         :before-leave="beforeTabLeave">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <!--  级联选择-->
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                    v-model="addForm.goods_cat"
                                    :options="cateList"
                                    :props="cateProps"
                                    clearable
                                    @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染表单item项-->
                        <el-form-item :label="item.attr_name" v-for="item in manyTableDate" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableDate" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!--action 上传请求的API接口-->
                        <!--on-preview 图片预览地址-->
                        <el-upload
                                action="http://8.140.191.188:8888/api/private/v1/upload"
                                :headers="headerObj"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :on-success="handleSuccess"
                                list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器-->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <!--添加商品按钮-->
                        <el-button @click="add" type="primary" class="btnAdd">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览-->
        <el-dialog
                title="图片预览"
                :visible.sync="previewisible"
                width="40%"
        >
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>

    </div>
</template>

<script>
    import {getCateList, getListMany, getListOnly,addShop} from "network/add";
    import _ from 'lodash'

    export default {
        name: "Add",
        data() {
            return {
                activeIndex: "0",
                addForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    //级联选择，商品所属的分类数组,id
                    goods_cat: [],
                    //图片数组
                    pics: [],
                    //商品描述
                    goods_introduce: '',
                    attrs: []

                },
                addFormRules: {
                    goods_name: [
                        {required: true, message: "请输入商品名称", trigger: "blur"}
                    ],
                    goods_price: [
                        {required: true, message: "请输入商品价格", trigger: "blur"}
                    ],
                    goods_weight: [
                        {required: true, message: "请输入商品重量", trigger: "blur"}
                    ],
                    goods_number: [
                        {required: true, message: "请输入商品数量", trigger: "blur"}
                    ],
                    goods_cat: [
                        {required: true, message: "请选择商品分类", trigger: "blur"}
                    ]
                },
                //商品分类
                cateList: [],
                cateProps: {
                    //选择的名字
                    label: 'cat_name',
                    //选中的id
                    value: 'cat_id',
                    children: 'children',
                    expandTrigger: 'hover'
                },
                //动态参数数据
                manyTableDate: [],
                onlyTableDate: [],
                //图片上传组件的请求头
                headerObj: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                previewPath: '',
                previewisible: false,

            }

        },
        created() {
            this.getCateList()
        },
        methods: {
            getCateList() {
                getCateList().then(res => {
                    if (res.meta.status !== 200) {
                        return this.$message.error('请求商品数据失败')
                    }
                    // this.$message.success('请求成功');
                    this.cateList = res.data
                    // console.log(this.cateList)
                })
            },
            //级联选择器变化触发
            handleChange() {
                if (this.addForm.goods_cat.length !== 3) {
                    this.addForm.goods_cat = []
                }
            },
            //标签切换判断
            beforeTabLeave(activeName, oldActiveName) {
                if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                    this.$message.error('请先完成当前商品分类')
                    return false
                }
            },
            //tab切换，发起请求
            tabClicked() {
                if (this.activeIndex === '1') {
                    getListMany(this.cateId).then(res => {
                        if (res.meta.status !== 200) {
                            return this.$message.error('请求动态商品列表失败')
                        }
                        res.data.forEach(item => {
                            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                        })
                        this.manyTableDate = res.data
                        // console.log(this.manyTableDate)
                    })
                } else if (this.activeIndex === '2') {
                    getListOnly(this.cateId).then(res => {
                        if (res.meta.status !== 200) {
                            return this.$message.error('请求静态商品列表失败')
                        }
                        // res.data.forEach(item => {
                        //     item.attr_vals =item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                        // })
                        this.onlyTableDate = res.data
                        console.log(this.onlyTableDate)
                    })
                }

            },
            //处理图片预览
            handlePreview(file) {
                console.log(file)
                this.previewPath = file.url
                this.previewisible = true
            },
            //点击x
            handleRemove(file) {
                //获取将要删除的图片的临时路径
                const filePath = file.response.data.tmp_path
                //从pic数值中，找到对应的索引值
                const i = this.addForm.pics.findIndex(x => x.pic === filePath)
                // 调用splice方法
                this.addForm.pics.splice(i, 1)
                // console.log(this.addForm)
            },
            //监听图片上传成功的事件
            handleSuccess(response) {
                //拼接得到一个图片信息对象
                this.$message.success('图片上传成功')
                const picInfo = {
                    pic: response.data.tmp_path
                }
                //将图片信息对象，push到pics
                this.addForm.pics.push(picInfo)
            },
            //添加商品
            add() {
                this.$refs.addFormRef.validate(valid => {
                    if (!valid) {
                        return this.$message.error('请填写必要的表单项！')
                    }
                    //执行添加的业务
                    // 级联规定goods_cat必须绑定到数组上，不能直接进行复制
                    //进行深拷贝，lodash库，cloneDeep(object)
                    const form = _.cloneDeep(this.addForm);
                    form.goods_cat = form.goods_cat.join(',');
                    //处理动态参数
                    this.manyTableDate.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(' ')
                        }
                        this.addForm.attrs.push(newInfo)
                    });
                    //处理静态属性
                    this.onlyTableDate.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals
                        }
                        this.addForm.attrs.push(newInfo)
                    });
                    form.attrs=this.addForm.attrs
                    // console.log(form)
                    //发起请求添加商品
                    //商品名称，必须是唯一的
                    addShop(form).then(res=>{
                        if(res.meta.status!==201){
                            return this.$message.error('添加商品失败')
                        }
                        this.$message.success('添加商品成功')
                        this.$router.push('/goods')
                    })
                })
            }


        },
        computed: {
            cateId() {
                if (this.addForm.goods_cat.length === 3) {
                    return this.addForm.goods_cat[2]
                }
                return null
            }
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

    .el-steps {
        margin: 15px 0;
    }

    .el-steps >>> .el-step__title {
        font-size: 15px;
    }

    .el-checkbox {
        margin: 0;
    }

    .previewImg {
        width: 100%;
    }

    .quill-editor >>> .ql-editor {
        min-height: 300px;
    }

    .btnAdd {
        margin-top: 15px;
    }
</style>