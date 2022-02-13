import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export class RecipientsServices {
    private intermediaryService = new BehaviorSubject('a recipient');
    currRecipient = this.intermediaryService.asObservable();

    constructor() { }
    /* Index Component will need to call this method, passing in string of recipient selected, which will get relayed to AdvSearch */
        addNewRecipient(aRecipient: string) {
            this.intermediaryService.next(aRecipient);
        }
    }


