import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterLink } from '@angular/router';

import { AppComponent } from './app.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AboutComponent } from './about/about.component';
import { BrowseByHandComponent } from './browse-by-hand/browse-by-hand.component';
import { BrowseByDateComponent } from './browse-by-date/browse-by-date.component';
import { HomeComponent } from './home/home.component';
import { PageViewComponent } from './page-view/page-view.component';
import { VolumeLinksComponent } from './volume-links/volume-links.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'browse-by-date', component: BrowseByDateComponent},
  { path: 'browse-by-hand', component: BrowseByHandComponent},
  { path: 'about', component: AboutComponent},
  { path: 'page-view/:id', component: PageViewComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    BrowseByHandComponent,
    BrowseByDateComponent,
    NavBarComponent,
    HomeComponent,
    PageViewComponent,
    VolumeLinksComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
