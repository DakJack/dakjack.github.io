import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private http: HttpClient) {

  }

  public Get(endpointUrl: string): Promise<any>{
    var returnPromise = new Promise((resolve, reject) => {

      this.http.get(endpointUrl).subscribe((data) => {
        resolve(data);
      })

    });

    return returnPromise;
  }
}
