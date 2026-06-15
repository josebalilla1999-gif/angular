import { Routes } from '@angular/router'
import { Login } from './login/login';
import { Signin } from './signin/signin';
import { App } from './app';

export const routes: Routes = [
    {
        path: '',
        component: App
    },{
        path: 'login',
        component: Login
    },{
        path: 'signin',
        component: Signin
    }
];
