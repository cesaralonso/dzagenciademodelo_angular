import { ResponseInterface } from '../interfaces/response.interface';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { EventosInterface } from '../interfaces/eventos.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
    /* private headers: HttpHeaders; */
    private options: any;
    private apiUrl: string;
    constructor(
        private _http: HttpClient) {
        this.options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'JWT ' + environment.token
            })};
        this.apiUrl = `${environment.apiUrl}`;
       }

       findAll = (endpoint: string) : Observable<ResponseInterface> => {
        return this._http.get<HttpResponse<any>>(`${this.apiUrl}${endpoint}`, this.options)
            .pipe(
                map((response: any) => response),
                catchError(this.handleError));
        }
       
       private handleError(error: HttpResponse<any>) {
           console.error(error);
           return observableThrowError(error || 'Server error');
       }
}
