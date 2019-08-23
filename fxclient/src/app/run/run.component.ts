import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Run } from '../run';
import { StrategyService } from '../strategy.service';

@Component({
  selector: 'app-run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.css']
})
export class RunComponent implements OnInit {

    private run: Run;

    constructor(
        private route: ActivatedRoute,
        private strategyService: StrategyService
        ) { }

    ngOnInit() {
        this.getRun();
    }

    getRun(){
        const sid = this.route.snapshot.paramMap.get('sid');
        this.strategyService.getRun(sid)
            .subscribe( s => {this.run = s; console.log(this.run) })
    }

    stop() {
        const sid = this.route.snapshot.paramMap.get('sid');
        this.strategyService.stopRun(sid)
            .subscribe( s => { console.log(s) })
    }


}
