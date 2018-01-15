import Vue from 'vue'
import clipboard from 'clipboard'
import 'normalize.css'

Vue.directive('clipboard', {
  bind(el, binding, vnode, oldVnode) {
    new clipboard(el);
  }
});

import App from './components/App.vue'

new Vue({ el: '#app', render: h => h(App) })
