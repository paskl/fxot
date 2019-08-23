import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component'
import { StrategyComponent } from './strategy/strategy.component'
import { BacktestComponent } from './backtest/backtest.component'
import { RunComponent } from './run/run.component'

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    // { path:'', component: DashboardComponent },
    { path:'dashboard', component: DashboardComponent },
    { path:'strategy/:id', component: StrategyComponent},
    { path:'run/:sid', component: RunComponent},
    { path:'backtest/:sid/:bid', component: BacktestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
