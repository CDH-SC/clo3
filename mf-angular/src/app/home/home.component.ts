import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import 'rxjs/add/operator/map'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  diary: String;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('/api/diaries').subscribe(data => {
      this.diary = data["data"]["docs"];
    })
  }

}
