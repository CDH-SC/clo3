import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class SampleService {

  private title: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor() { }

  setTitle(value: string) {
    this.title.next(value);
  }

  getTitle(): Observable<string> {
    return this.title.asObservable();
  }

}