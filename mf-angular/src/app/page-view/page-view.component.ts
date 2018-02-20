import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/map'

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
  styleUrls: ['./page-view.component.scss'],
//encapsulation: ViewEncapsulation.None
})
export class PageViewComponent implements OnInit {

  diary : String;
  // Default page
  folio_num: String;
  page = 1;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.http.get('/api/diaries/'+id).subscribe(data => {
      this.diary = data["data"];
    })
  }

  onClick(jump) {
    jump.value;
    var x = jump;
    var pgNum = 0;
    this.folio_num = jump;

    //Checking index of V or R and slicing string to extract pgNum
    if(jump.indexOf('v') == 1 || jump.indexOf('r') == 1) {
      pgNum = parseInt(jump.slice(0,1));
    } else if(jump.indexOf('v') == 2 || jump.indexOf('r') == 2) {
      pgNum = parseInt(jump.slice(0,2));
    } else if(jump.indexOf('v') == 3 || jump.indexOf('r') == 3) {
      pgNum = parseInt(jump.slice(0,3));
    } else {
      alert("Please insert a valid folio number.\nIn format <Num><r/v>\nExample: 25v or 54r");
    }

    if(jump.includes('v')) {
      pgNum = pgNum*2;
    } else if(jump.includes('r')) {
      pgNum = (pgNum*2) - 1;
    }

    console.log(jump);
    console.log(pgNum);
    this.page = pgNum;
  }

  group(num) {
    this.page = num;
  }

}
