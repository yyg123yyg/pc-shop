import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'assets/font/iconfont.css'
//element
import ElementUI, {Message, MessageBox,Loading } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
//富文本
//引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//引入vue-quill-editor相关样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

Vue.prototype.$confirm=MessageBox.confirm;
Vue.prototype.$message=Message;
Vue.prototype.$loading=Loading;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
