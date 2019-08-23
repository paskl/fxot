// 1- Get the back test information from the backend on page init
// 2- Backtest info are in the URL, launch the request routine with those params
// 3- on return, check the backtest current status, the response from the backend is in s
//     if the backtest is still running retry in 1 min
//     else display the chart
// 4- displaying the chart
//     get the market data from service (to backend) for the defined window (timestamp or backtest start time)
//     on return, update data linked to google chart


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { ChartReadyEvent } from 'ng2-google-charts';

import { Backtest } from '../backtest';
import { StrategyService } from '../strategy.service';
import { SMA } from 'technicalindicators';

@Component({
    selector: 'app-backtest',
    templateUrl: './backtest.component.html',
    styleUrls: ['./backtest.component.css']
})
export class BacktestComponent implements OnInit {

    private backtest: Backtest;

    public arrows = [];

    private timestamp;
    private mwindows = 300
    public lineChart: GoogleChartInterface

    constructor(
        private route: ActivatedRoute,
        private strategyService: StrategyService
        ) { }

    ngOnInit() {
        // 1- Get the back test information from the backend on page init
        this.getBacktest();
    }

    getBacktest(){
        // 2- Backtest info are in the URL, launch the request routine
        const sid = this.route.snapshot.paramMap.get('sid') // this is the strategy id
        const bid = this.route.snapshot.paramMap.get('bid') // this is the backtest id
        this.strategyService.getBacktest(sid, bid)
            .subscribe( s => this.checkBacktest(s) )
    }

    checkBacktest( s ) {
        // 3- on return check the backtest current status, the response from the backend is in s
        console.log(s);
        this.backtest = s;
        if(s.status == 'running')
          // if the backtest is still running retry in 1 min
            setTimeout( () => this.getBacktest(), 1000 )
        else
          // else display the chart
          this.makeChart();
    }



    moveChart(coef){
      let granmap = { M1:60 }
      this.timestamp = this.timestamp + ((granmap[this.backtest.props.granulity] * 1000 * 300) * coef)
      this.makeChart()
    }

    makeChart() {
      // 4- displaying the chart

      // start the visualization from last timestamp if define or from current date
      let props = this.backtest.props
      this.timestamp = this.timestamp || 1522626477000 // new Date(props.from).getTime()

      // get the market data from service (to backend) for the define window
      this.strategyService.getMarketData(props.instrument, props.granulity, this.timestamp, this.mwindows)
        .subscribe ( marketData => {


          if(this.lineChart && this.lineChart.component) this.lineChart.component.wrapper.clear()

          // console.log(marketData)
          // Adding indicator
          let dt:Array<Array<any>> = marketData['data'].map( a => [ new Date(a[0]), parseFloat( a[1] ), undefined, undefined ] )
          let maxV = Math.max( ...dt.map( a=>a[1] ) )
          let minV =  Math.min( ...dt.map( a=>a[1] ) )
          dt = this.addIndicator('sma', 10, dt, true)
          dt = this.addIndicator('sma', 20, dt, true)
          dt = this.addIndicator('sma', 50, dt, true)

          console.log(this.backtest.events)
          this.backtest.events.forEach( e => {
            // Retrieve index from date
            let evtd = new Date(e.time).getTime()
            if( evtd > this.timestamp && evtd  < this.timestamp + 60*300 ){
              let ind = (new Date(e.time).getTime() - this.timestamp) / 60
              console.log('found: '+ind)
              dt[ind][2] = e.key
              // dt[ind][3] = e.value
            }
          })

          // update data linked to google chart
          dt.unshift(['A','Price', ...new Array( dt[0].length-2 ).fill('Number')])
          this.lineChart = {
            chartType: 'AnnotationChart',
            dataTable: dt,
            options: {
              height: 300
            }
          }

          // TODO :
          // 1- Display the Event, with comments ?
          // 2- Start trying to build a bit of a good strategy

          //

        })
    }

    addIndicator(indic, period, dt, add){
      let vals:Array<Number>
      if(indic == 'sma') vals =  SMA.calculate ({period : period, values : dt.map( a=>a[1] )})
      // if(indic == 'sma') vals =  SMA.calculate ({period : period, values : dt.map( a=>a[1] )})
      vals.unshift(...new Array( period ).fill(null))
      if(add) dt = dt.map( (a,i) => [...a, vals[i]])
      return dt
    }

    ready(event) {
    }

}
