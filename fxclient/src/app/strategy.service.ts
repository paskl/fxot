import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Strategy } from './strategy';

@Injectable({
  providedIn: 'root'
})
export class StrategyService {

    private apiUrl = 'http://localhost:3000';  // URL to web api

    constructor(  private http: HttpClient ) { }

    getStrategies (): Observable<Strategy[]> {
        return this.http.get<Strategy[]>(this.apiUrl + '/strategy/list')
            .pipe( catchError(this.handleError<Strategy[]>('getStrategiesList', [])) )
    }

    getStrategy (id): Observable<Strategy> {
        return this.http.get<Strategy>(this.apiUrl + '/strategy/view/'+ id)
    }

    launchBacktest (id) {
        return this.http.get(this.apiUrl + '/backtest/start/'+ id)
    }

    getBacktest (sid, bid) {
        return this.http.get(this.apiUrl + '/backtest/view/'+ sid +'/'+ bid)
    }

    getMarketData (instrument, granulity, from, limit) {
        let query = (from?'from='+from:'') + (limit?'limit='+limit:'')
        return this.http.get(this.apiUrl + '/marketdata/view?'+query )
    }

    launchRun (id, account) {
        console.log(this.apiUrl + '/run/start/'+ id +'/'+ account )
        return this.http.get(this.apiUrl + '/run/start/'+ id +'/'+ account )
    }

    getRun (id) {
        return this.http.get(this.apiUrl + '/run/view/'+ id )
    }

    stopRun (id){
        return this.http.get(this.apiUrl + '/run/stop/'+ id )
    }

    private handleError<T> (operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        console.error(`${operation} failed: ${error.message}`)
        return of(result as T)
      };
    }

}
