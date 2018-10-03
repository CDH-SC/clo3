import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class VolumeService {
  api_url = 'http://localhost:3000';
  volume_num = '1';
  volumeUrl = `${this.api_url}/api/volume/`;

  constructor(
    private http: HttpClient,
  ) {}

  public getAllVolumes<T>(): Observable<T> {
    return this.http.get<T>(this.volumeUrl);
  }

  public getVolumeById<T>(id: string): Observable<T> {
    return this.http.get<T>(this.volumeUrl + id);
  }

  // Read volume
  // public getVolumes(): Observable<Volume[]> {
  //   return this.http.get(this.volumeUrl)
  //   .map(res => {
  //     return res["data"].docs as Volume[];
  //   })
  // }

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
