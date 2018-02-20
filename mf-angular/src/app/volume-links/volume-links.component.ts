import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DataService } from '../../services/pageview.service';
import 'rxjs/add/operator/map'

@Component({
  selector: 'app-volume-links',
  templateUrl: './volume-links.component.html',
  styleUrls: ['./volume-links.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class VolumeLinksComponent implements OnInit {

  diary : String;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('/api/diaries').subscribe(data => {
      this.diary = data["data"]["docs"];
    })
  }

}
