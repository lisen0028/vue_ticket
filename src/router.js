import { createRouter, createWebHashHistory } from 'vue-router';
import Ulist  from "./components/Ulist.vue";
import NavBar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";
import Ulist1 from "./components/Ulist1.vue";
import Ulist2 from "./components/Ulist2.vue";
import Ulist3 from "./components/Ulist3.vue";
import Ulist4 from "./components/Ulist4.vue";
import Login  from "./components/Login.vue";
import Ulist5 from "./components/Ulist5.vue";




const routes = [
    {
        path: '/usersManagement',
        component:()=>import('./components/UserManagement.vue')
    },
    {
        path: '/manager',
        component:()=>import('./components/Management.vue')
    },
    {
        path: '/ticketManagement',
        component:()=>import('./components/TicketManage.vue')
    },
    {
        path: '/venueManagement',
        component:()=>import('./components/VenueManage.vue')
    },
    {
        path: '/activeManagement',
        component:()=>import('./components/ActiveManage.vue')
    },
    {
        path: '/managerManagement',
        component:()=>import('./components/manager.vue')
    },
    //
    {path: '/Manage',component: ()=>import("./App.vue") },
    { path: '/PInfo', component:()=>import("./components/PInfo.vue") }, // 添加PInfo组件的路由
    { path: '/POrder', component:()=>import("./components/POrder.vue") }, // 添加PInfo组件的路由
    { path: '/Commit', component:()=>import("./components/Commit.vue") }, // 添加PInfo组件的路由
    { path: '/SellerInfo', component:()=>import("./components/SellerInfo.vue") }, // 添加PInfo组件的路由
    { path: '/CreateAct', component:()=>import("./components/CreateAct.vue") },
    { path: '/Category/:eventid', component:()=>import("./components/Category.vue") },
    { path: '/SActivities', component:()=>import("./components/SActivities.vue") },
    { path: '/ManagerInfo', component:()=>import("./components/ManagerInfo.vue") },
    { path: '/MInfo', component:()=>import("./components/MInfo.vue") },
    { path: '/ActManage', component:()=>import("./components/ActManage.vue") },
    { path: '/UManage', component:()=>import("./components/UManage.vue") },
    { path: '/CManage', component:()=>import("./components/CManage.vue") },
    { path: '/NavBar',  component:()=>import("./components/NavBar.vue")},
    { path: '/UserInfo',  component:()=>import("./components/UserInfo.vue")},




    { path: '/', component:()=>import("./components/Ulist.vue")},
    { path: '/Ulist', component:()=>import("./components/Ulist.vue")},
    { path: '/Footer', component:()=>import("./components/Footer.vue") },
    {
        path: '/Ulist1/:eventid',
        component: () => import("./components/Ulist1.vue"),
    },
    { path: '/Ulist2', component:()=>import("./components/Ulist2.vue") },
    { path: '/Ulist3', component:()=>import("./components/Ulist3.vue") },
    { path: '/Ulist4', component:()=>import("./components/Ulist4.vue") },
    { path: '/Login', component:()=>import("./components/Login.vue") },
    { path: '/Ulist5', component:()=>import("./components/Ulist5.vue") }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
