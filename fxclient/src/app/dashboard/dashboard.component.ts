import { Component, OnInit } from '@angular/core';

import { Strategy } from '../strategy';
import { StrategyService } from '../strategy.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

    strategies: Strategy[];

    constructor(private strategyService: StrategyService) { }

    ngOnInit() {
        this.getStrategies();
    }

    getStrategies() {
        this.strategyService.getStrategies()
            .subscribe( strategies => this.strategies = strategies);
    }

}
