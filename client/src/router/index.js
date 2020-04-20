import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import("../views/Home.vue")
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("../views/Register.vue")
    },
    {
        path: "/create-event",
        name: "CreateEvent",
        beforeEnter: (to, from, next) => {
            if (localStorage.getItem("user") === "null") next({ name: "Home" });
            else next();
        },
        component: () => import("../views/CreateEvent.vue")
    },
    {
        path: "/settings",
        name: "Settings",
        beforeEnter: (to, from, next) => {
            if (localStorage.getItem("user") === "null") next({ name: "Home" });
            else next();
        },
        component: () => import("../views/Settings.vue")
    },
    {
        path: "/event/:id",
        name: "Event",
        beforeEnter: (to, from, next) => {
            if (localStorage.getItem("user") === "null") next({ name: "Home" });
            else next();
        },
        component: () => import("../views/Event.vue")
    }
];

const router = new VueRouter({
    routes,
    mode: "hash"
});

export default router;
