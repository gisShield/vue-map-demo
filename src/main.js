import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'ol/ol.css' // ol css
Vue.use(ElementUI)

Vue.prototype.$Bus = new Vue()
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
