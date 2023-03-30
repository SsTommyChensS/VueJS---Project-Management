import { createRouter, createWebHistory } from 'vue-router'

import ApiExample from '../components/ApiExample.vue'
//Default components
import Home from '../components/Home.vue'
import Register from '../components/auth/Register.vue'
import Login from '../components/auth/Login.vue'
import ForgotPassword from '../components/auth/ForgotPassword.vue'
//Dashboard component
import MyProfile from '../components/dashboard/my-profile/MyProfile.vue'
import MyProject from '../components/dashboard/my-projects/MyProject.vue'
import MySharedProject from '../components/dashboard/my-shared-projects/MySharedProject.vue'
import AllProjects from '../components/dashboard/all-projects/AllProjects.vue'
import AddProject from '../components/dashboard/my-projects/AddProject.vue'
//layouts
import DefaultLayout from '../components/layouts/Default.vue'
import DashboardLayout from '../components/layouts/Dashboard.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // Default layout
        {
            path: '/', 
            name: 'Home', 
            component: Home,
            meta: {
                layout: DefaultLayout
            },
        },
        {
            path: '/register', 
            name: 'Register', 
            component: Register,
            meta: {
                layout: DefaultLayout
            },
        },
        {
            path: '/login', 
            name: 'Login', 
            component: Login,
            meta: {
                layout: DefaultLayout
            },
        },
        {
            path: '/forgot-password', 
            name: 'ForgotPassword',
            component: ForgotPassword,
            meta: {
                layout: DefaultLayout
            },
        },
        {
            path: '/api-example', 
            name: 'ApiExample', 
            component: ApiExample,
            meta: {
                layout: DefaultLayout
            },
        },
        // Admin template layout
        {
            path: '/dashboard',
            name: 'Dashboard',
            meta: {
                layout: DashboardLayout
            },   
            children: [
                {
                    path: 'my-profile',
                    name: 'MyProfile',
                    component: MyProfile,
                },
                {
                    path: 'my-project',
                    name: 'MyProject',
                    component: MyProject,
                },
                {
                    path: 'my-shared-project',
                    name: 'MySharedProject',
                    component: MySharedProject,
                },
                {
                    path: 'all-projects',
                    name: 'AllProjects',
                    component: AllProjects,
                },
                {
                    path: 'add-project',
                    name: 'AddProject',
                    component: AddProject
                }
            ]
        },
    ]
});
//This will check if user not logged in -> redirect to login page (Will change by using state(data contain: user - info))
router.beforeEach((to, from, next) => {
    //redirect to login page if not logged in and trying to access a restricted page (Admin template)
    const publicPages = ['/', '/login', '/register'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');

    if(authRequired && !loggedIn) {
        return next('/login');
    }
    
    next();
});

export default router;