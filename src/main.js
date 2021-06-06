import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'assets/font/iconfont.css'
//element
import ElementUI, {Message, MessageBox} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.prototype.$confirm=MessageBox.confirm;
Vue.prototype.$message=Message;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
