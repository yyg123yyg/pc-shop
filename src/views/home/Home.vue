<template>
    <el-container class="home">
        <!--头部-->
        <el-header>
            <div class="home_header">
                <img src="~assets/img/home_logo.png" alt="" class="home_logo">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体-->
        <el-container>
            <!--侧边栏-->
            <el-aside :width="isCollapse?'64px':'200px'">
                <div class="toggle-button" @click="toggleCollapse">
                    <i class="iconfont icon-shouqi" v-if="isCollapse"></i>
                    <i class="iconfont icon-zhedie2" v-else></i>
                </div>
                <!--侧边栏菜单-->
                <el-menu
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409fff"
                        :unique-opened="true"
                        :collapse="isCollapse"
                        :collapse-transition="false"
                        :router="true"
                        :default-active="activePath"
                >
                    <!-- 一级菜单-->
                    <el-submenu :index="item.id +''" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单模板区-->
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span class="item_font">{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单-->
                        <!-- 这里的index，将是路由跳转的参数，且互斥-->
                        <el-menu-item :index=" '/'+subItem.path "
                                      v-for="subItem in item.children"
                                      :key="subItem.id"
                                      @click="saveNavState('/'+subItem.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>

                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容-->
            <el-main>
                <!--   路由占位符-->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
    import {getMenuList} from "network/home";

    export default {
        name: "Home",
        data() {
            return {
                menuList: [],
                iconsObj: {
                    125: "iconfont icon-touxiang",
                    103: "iconfont icon-quanxian",
                    101: "iconfont icon-shangpin",
                    102: "iconfont icon-single",
                    145: "iconfont icon-shuju",
                },
                isCollapse: false,
                // 被激活的连接地址
                activePath: ''

            }
        },
        methods: {
            logout() {
                new Promise((resolve, reject) => {
                    this.$confirm('此操作将退出登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        resolve()
                    }).catch(() => {
                        reject()
                    })
                }).then(() => {
                    //清空token,退出
                    this.$message({
                        type: 'success',
                        message: '退出成功!'
                    });
                    window.sessionStorage.clear();
                    this.$router.push('/login')

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退出'
                    });
                })


            },
            getMenuList() {
                getMenuList().then(res => {
                    // console.log(res)
                    if (res.meta.status !== 200) {
                        return this.$message.error('登录失败');
                    }
                    this.menuList = res.data
                })
            },
            //点击，切换折叠展开
            toggleCollapse() {
                this.isCollapse = !this.isCollapse;
            },
            // 保存链接的激活状态
            saveNavState(activePath) {
                window.sessionStorage.setItem('activePath', activePath);
                this.activePath=activePath
            }
        },
        created() {
            //获取所有的菜单
            this.getMenuList();
            //高亮效果显示
            this.activePath=window.sessionStorage.getItem('activePath')
        }
    }
</script>

<style lang="less" scoped>
    .home {
        height: 100%;
    }

    .el-header {
        background-color: rgb(51, 55, 68);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 0;
        color: #fff;
        font-size: 20px;

        .home_header {
            display: flex;
            justify-content: center;
            align-items: center;

            .home_logo {
                width: 100px;
                height: 100px;
            }
        }
    }

    .el-aside {
        background-color: #333744;

        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #eaedf1;
    }

    .item_font {
        font-size: 20px;
    }

    .iconfont {
        margin-right: 10px;
        font-size: 23px;
    }

    .toggle-button {
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        text-align: center;
        color: #fff;
        letter-spacing: 0.2px;
        cursor: pointer;
    }
</style>