import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { SelectBankComponent } from './pages/selectbank/selectbank.component';
import { WaitforgameComponent } from './pages/waitforgame/waitforgame.component';
import { GameComponent } from './pages/game/game.component';

export const routes: Routes = [
    {path:'', component: WelcomeComponent, pathMatch: 'full'},
    {path:'selectbank', component: SelectBankComponent, },
     {path:'waitforgame', component: WaitforgameComponent, },
     {path:'game', component: GameComponent, }

];
