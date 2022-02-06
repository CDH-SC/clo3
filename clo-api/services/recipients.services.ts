import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export class RecipientsServices {
    private publisher = new BehaviorSubject('a recipient');
}

