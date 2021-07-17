<template>
    <div>
        <!--面包导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图-->
        <el-card>
            <!-- 2 .为 ECharts 准备一个具备大小（宽高）的 DOM -->
            <div ref="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
    //1. 导入echarts
    import echarts from "echarts";
    import {getReport} from "network/report";
    import _ from 'lodash';

    export default {
        name: "Report",
        data() {
            return {
                options: {
                    title: {
                        text: '用户来源'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#E9EEF3'
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            boundaryGap: false
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ]
                }
            }
        },
        methods: {
            getReport() {
                let myChart = echarts.init(this.$refs.main);
                getReport().then(res => {
                    // console.log(res)
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取统计图失败')
                    }
                    const result = _.merge(res.data, this.options)
                    console.log(result)
                    myChart.setOption(result);
                })
            },


        },
        created() {
        },
        mounted() {
            this.getReport()
            // this.a()

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