import Vue from 'vue'
import Clipboard from 'clipboard'
import 'normalize.css'
import * as config from './config'

Vue.directive('clipboard', {
  bind(el, binding, vnode, oldVnode) {
    new Clipboard(el);
  }
});

import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: config.googleMapsAPIKey
  }
});

import App from './components/App.vue'

new Vue({ el: '#app', render: h => h(App) })
