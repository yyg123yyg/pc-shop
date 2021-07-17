// eslint-disable-next-line vue/experimental-script-setup-vars
module.exports = {
  configureWebpack:{
    devServer: {
      port: 3000, // 端口
    },
    resolve:{
      //别名
      alias:{
        'assets': '@/assets',
        'common': '@/components/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views'
      }
    }
  },

}
