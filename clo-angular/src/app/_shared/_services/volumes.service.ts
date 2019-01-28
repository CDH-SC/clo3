import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/api/volume/';

@Injectable()
export class VolumeService {

  constructor(private http: HttpClient) {}

  public getAllVolumes<T>(): Observable<T> {
    return this.http.get<T>(BACKEND_URL);
  }

  public getVolumeById<T>(id: string): Observable<T> {
    return this.http.get<T>(BACKEND_URL + id);
  }

  public getLetterById<T>(id: string, xml_id: string): Observable<T> {
    return this.http.get<T>(BACKEND_URL + id + '/' + xml_id);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}

@Injectable()
export class CustomInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.headers.has('Content-Type')) {
      req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    }
    req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
    return next.handle(req);
  }
}
