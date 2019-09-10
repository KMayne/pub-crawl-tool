import Vue from 'vue'
import Clipboard from 'clipboard'
import 'normalize.css'

Vue.directive('clipboard', {
  bind(el, binding, vnode, oldVnode) {
    new Clipboard(el);
  }
});

import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: '[API-key]'
  }
});

import App from './components/App.vue'

new Vue({ el: '#app', render: h => h(App) })
