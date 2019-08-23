import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router'

import { Strategy } from '../strategy';
import { StrategyService } from '../strategy.service';


@Component({
    selector: 'app-strategy',
    templateUrl: './strategy.component.html',
    styleUrls: ['./strategy.component.css']
})
export class StrategyComponent implements OnInit {

    private strategy: Strategy;
    private accounts: Array<Object>;
    selectedAccount: Object;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private strategyService: StrategyService,
        private location: Location
        ) {}

    ngOnInit() {
        this.getStrategy();
        this.getAccounts();
    }

    getAccounts(): void {
        this.accounts = [
            {name:'dry'},
            {name:'real'}
        ];
        this.selectedAccount = this.accounts[0];
    }

    getStrategy(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.strategyService.getStrategy(id)
            .subscribe( s => {this.strategy = s} )
    }

    backtest() {
        const id = this.route.snapshot.paramMap.get('id');
        this.strategyService.launchBacktest(id)
            .subscribe( b => {
                this.router.navigate(['/backtest/'+id+'/'+b['id']]);
            })
    }

    run() {
        const id = this.route.snapshot.paramMap.get('id');
        this.strategyService.launchRun(id, this.selectedAccount['name'])
            .subscribe( res => {
                console.log(res)
                this.router.navigate(['/run/'+res['id']]);
            })
    }


}
