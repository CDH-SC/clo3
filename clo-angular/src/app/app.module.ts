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
import { TwitterComponent } from './twitter/twitter.component';
import { SearchComponent } from './search/search.component';
import { AboutCarlylesComponent } from './about/about-carlyles/about-carlyles.component';
import { AboutProjectComponent } from './about/about-project/about-project.component';
import { AboutPhotosComponent } from './about/about-photos/about-photos.component';
import { AboutPrintedComponent } from './about/about-printed/about-printed.component';
import { AboutCitingComponent } from './about/about-citing/about-citing.component';
import { AboutEditorsComponent } from './about/about-editors/about-editors.component';
import { AboutAckComponent } from './about/about-ack/about-ack.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VolumeService } from './_shared/_services/volumes.service';
import { VolumeContentComponent } from './volume-content/volume-content.component';
import { LetterComponent } from './letter/letter.component';
import { FooterService } from './_shared/_services/footer.service';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'home', component: HomeComponent },
  { path: 'browse-volume', component: BrowseVolumeComponent },
  { path: 'photo-album', component: PhotoAlbumComponent },
  { path: 'browse-recipient', component: BrowseRecipientComponent },
  { path: 'browse-subject', component: BrowseSubjectComponent },
  { path: 'about-carlyles', component: AboutCarlylesComponent },
  { path: 'about-project', component: AboutProjectComponent },
  { path: 'about-photoAlbums', component: AboutPhotosComponent },
  { path: 'about-printedEdition', component: AboutPrintedComponent },
  { path: 'about-citing', component: AboutCitingComponent },
  { path: 'about-editors', component: AboutEditorsComponent },
  { path: 'about-acknowledgments', component: AboutAckComponent },
  { path: 'browse-volume/volume-content', component: VolumeContentComponent },
  { path: 'browse-volume/letter/:id/:xml_id', component: LetterComponent },
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
    TwitterComponent,
    SearchComponent,
    AboutCarlylesComponent,
    AboutProjectComponent,
    AboutPhotosComponent,
    AboutPrintedComponent,
    AboutCitingComponent,
    AboutEditorsComponent,
    AboutAckComponent,
    VolumeContentComponent,
    LetterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
    ),
    NgbModule,
  ],
  providers: [
    VolumeService,
    FooterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
