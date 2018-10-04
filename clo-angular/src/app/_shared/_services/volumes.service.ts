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

<<<<<<< 4cf5aa74301ff5978d3ccf8a15da8a42eb9fca1e
  public getVolumeById<T>(id: string): Observable<T> {
    return this.http.get<T>(this.volumeUrl + id);
  }
  
=======
public getLetterById<T>(id: string, xml_id: string): Observable<T> {
  return this.http.get<T>(this.volumeUrl + id +"/"+ xml_id);
}

<<<<<<< HEAD
>>>>>>> added find by xml to api, displaying letter xml for vol 1, further additions to volume upload script
=======
public getLetterById<T>(id: string, xml_id: string): Observable<T> {
  return this.http.get<T>(this.volumeUrl + id +"/"+ xml_id);
}

>>>>>>> eaabc7345f4e61122c2c99d7e738f068c2af448b
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
