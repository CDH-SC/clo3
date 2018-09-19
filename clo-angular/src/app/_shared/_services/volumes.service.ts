import Volume from '../models/volume';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class VolumeService {
  api_url = 'http://localhost:3000';
  volumeUrl = `${this.api_url}/api/volumes`;

  constructor(
    private http: HttpClient
  ) {}

  //Read volume
  getVolumes(): Observable<Volume[]>{
    return this.http.get(this.volumeUrl)
    .map(res => {
      return res["data"].docs as Volume[];
    })
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
