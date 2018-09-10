import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { RouterModule, Routes } from '@angular/router';
import { RouterLink } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { BrowseVolumeComponent } from './browse-volume/browse-volume.component';
import { PhotoAlbumComponent } from './photo-album/photo-album.component';
import { BrowseRecipientComponent } from './browse-recipient/browse-recipient.component';
import { BrowseSubjectComponent } from './browse-subject/browse-subject.component';
import { AboutComponent } from './about/about.component';
import { VolumeService } from './_shared/_services/volumes.service';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'home', component: HomeComponent },
  { path: 'browse-volume/:id', component: BrowseVolumeComponent },
  { path: 'photo-album', component: PhotoAlbumComponent },
  { path: 'browse-recipient', component: BrowseRecipientComponent },
  { path: 'browse-subject', component: BrowseSubjectComponent },
  { path: 'about', component: AboutComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavComponent,
    FooterComponent,
    HomeComponent,
    BrowseVolumeComponent,
    PhotoAlbumComponent,
    BrowseRecipientComponent,
    BrowseSubjectComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),
  ],
  providers: [
    VolumeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
