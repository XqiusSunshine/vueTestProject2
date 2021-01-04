import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import AswjgCx from '@/components/AswjgCx';
import Djztzk from "../components/Djztzk";
Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },{
      path: '/aswjgcx',
      name: 'aswjgcx',
      component: AswjgCx
    },{
      path: '/djztzk',
      name: 'djztzk',
      component: Djztzk
    }
  ]
});
