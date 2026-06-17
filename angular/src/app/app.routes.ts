import { Routes } from '@angular/router'
import { Login } from './login/login';
import { Signin } from './signin/signin';
import { Dashboard } from './dashboard/dashboard';
import { Profile } from './profile/profile';
import { Vuelos } from './vuelos/vuelos';

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
    },{
        path: 'profile',
        component: Profile
    },{
        path: 'vuelos',
        component: Vuelos
    }
];
