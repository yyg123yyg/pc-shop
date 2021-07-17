<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="40">
                <el-col :span="8">
                    <el-input clearable @clear="getGoodsList()" placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goADDpage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 表格区-->
            <el-table :data="goodsList" border stirpe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)" width="105px"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="100px">
                    <template v-slot="scope">
                        {{scope.row.add_time | showDate}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template v-slot="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button @click="removeId(scope.row.goods_id)" size="mini" type="danger"
                                   icon="el-icon-delete">删除
                        </el-button>
                    </template>

                </el-table-column>
            </el-table>
            <!--  分页区-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[10, 20, 25, 30]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" background>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    import {getGoodsList,deleteGoods} from "network/list";
    import {formatDate} from "components/utiles/utils"

    export default {
        name: "List",
        data() {
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                total: 0,
                //商品列表
                goodsList: []

            }
        },
        filters: {
            showDate(value) {
                const date = new Date(value * 1000);
                return formatDate(date, 'yyyy-mm-dd')
            }
        },
        created() {
            this.getGoodsList()
        },
        methods: {
            getGoodsList() {
                getGoodsList(this.queryInfo).then(res => {
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取商品列表失败')
                    }
                    this.$message.success('获取商品列表成功')
                    console.log(res.data)
                    this.total = res.data.total;

                    this.goodsList = res.data.goods;
                })
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getGoodsList()
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getGoodsList()
            },
            //删除商品
            async removeId(id) {
                const confirm = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=>err)
                if(confirm!=='confirm'){
                    return this.$message.info('已取消删除')
                }
                deleteGoods(id).then(res=>{
                    if(res.meta.status!==200){
                        return this.$message.error('删除商品失败')
                    }
                    this.$message.success('删除商品成功')
                    this.getGoodsList()
                })

            },
            //跳转到添加商品界面
            goADDpage(){
                this.$router.push('/goods/add')

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

</style>