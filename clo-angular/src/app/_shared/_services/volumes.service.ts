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

  /**
   * This function will parse through the letters attribute "docDate" and sort
   * first by year and then by month.
   * It will then return a list of months and years with the certain letters
   * contained in those months and dates.
   * @param letters
   */
  public sortLetters(letters) {
    // Sort by month
    letters.sort((a, b) => {
      const x = a.docDate;
      const y = b.docDate;
      return parseInt(y.substring(y.indexOf('-'), y.lastIndexOf('-')), 10) - parseInt(x.substring(x.indexOf('-'), x.lastIndexOf('-')), 10);
    });

    // Sort by year
    letters.sort((a, b) => {
      const x = a.docDate;
      const y = b.docDate;
      return parseInt(x.substring(0, x.indexOf('-')), 10) - parseInt(y.substring(0, y.indexOf('-')), 10);
    });

    let year = '';
    let month = '';
    let dateString = '';

    const reformattedLetters = {};
    for (let i = 0; i < letters.length; i++) {
      const date = letters[i].docDate.split('-');

      year = date[0];
      month = this.getMonth(date[1]);
      // Creating and setting our own unique dateString to the docDate of the current letter
      dateString = date[2] + ' ' + month + ' ' + year;
      letters[i].docDate = dateString;

      if (i > 0 && i < letters.length - 1) {
        letters[i].prevLetter = letters[i - 1].xml_id;
        letters[i].nextLetter = letters[i + 1].xml_id;
      } else if (i === 0) {
        letters[i].prevLetter = null;
        letters[i].nextLetter = letters[i + 1].xml_id;
      } else if (i === letters.length - 1) {
        letters[i].prevLetter = letters[i - 1].xml_id;
        letters[i].nextLetter = null;
      }

      if (reformattedLetters[month + ' ' + year] == null) {
        reformattedLetters[month + ' ' + year] = [];
        reformattedLetters[month + ' ' + year].push(letters[i]);
      } else {
        reformattedLetters[month + ' ' + year].push(letters[i]);
      }
    }

    const keys = Object.keys(reformattedLetters);
    for (let i = 0; i < keys.length; i++) {
      // Sort by day
      reformattedLetters[keys[i]].sort((a, b) => {
        const x = a.docDate;
        const y = b.docDate;
        return parseInt(x.substring(0, x.indexOf(' ')), 10) - parseInt(y.substring(0, y.indexOf(' ')), 10);
      });
    }

    return reformattedLetters;
  }

  /**
   * HELPER Method for sortLetters()
   * This method returns the month as a string value
   *
   * Ex: 01 --> January
   * INPUT: Month as string (01-12)
   * OUTPUT: Month as string
   */
  public getMonth(month: string) {
    switch (month) {
      case '01':
        return 'January';
      case '02':
        return 'February';
      case '03':
        return 'March';
      case '04':
        return 'April';
      case '05':
        return 'May';
      case '06':
        return 'June';
      case '07':
        return 'July';
      case '08':
        return 'August';
      case '09':
        return 'September';
      case '10':
        return 'October';
      case '11':
        return 'November';
      case '12':
        return 'December';
      default:
        return 'Unknown';
    }
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
