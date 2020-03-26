import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Login",
        component: Login
    },
    {
        path: "/calendar",
        name: "Calendar",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/Calendar.vue")
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("../views/Register.vue")
    },
    {
        path: "/create-event",
        name: "CreateEvent",
        component: () => import("../views/CreateEvent.vue")
    },
    {
        path: "/event/:id",
        name: "Event",
        component: () => import("../views/Event.vue")
    }
];

const router = new VueRouter({
    routes,
    mode: "history"
});

export default router;
