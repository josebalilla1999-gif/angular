import { Routes } from '@angular/router'
import { Login } from './login/login';
import { Signin } from './signin/signin';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    {
        path: '',
        component: Dashboard
    },
    {
        path: 'login',
        component: Login
    },{
        path: 'signin',
        component: Signin
    }
];
