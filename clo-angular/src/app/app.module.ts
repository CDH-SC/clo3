import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
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
import { AboutPrintedComponent } from './about/about-printed/about-printed.component';
import { AboutCitingComponent } from './about/about-citing/about-citing.component';
import { AboutEditorsComponent } from './about/about-editors/about-editors.component';
import { AboutAckComponent } from './about/about-ack/about-ack.component';
import { VolumeContentComponent } from './volume-content/volume-content.component';
import { AlbumViewerComponent } from './album-viewer/album-viewer.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AlbumService } from './_shared/_services/album.service';
import { VolumeService } from './_shared/_services/volumes.service';
import { SubjectTermService } from './_shared/_services/subject-terms.service';
import { SortByPipe } from './_shared/pipes/sortBy.pipe';
// import { NgxViewerModule } from 'ngx-viewer';

import { PhotoViewerComponent } from './photo-viewer/photo-viewer.component';
import { VolumeTocComponent } from './volume-toc/volume-toc.component';
import { VolumeViewerComponent } from './volume-viewer/volume-viewer.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SubjectTermsComponent } from './subject-terms/subject-terms.component';
import { SubjectLettersComponent } from './subject-letters/subject-letters.component';
import { RubensteinComponent } from './rubenstein/rubenstein.component';

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
  { path: 'about-printedEdition', component: AboutPrintedComponent },
  { path: 'about-citing', component: AboutCitingComponent },
  { path: 'about-editors', component: AboutEditorsComponent },
  { path: 'about-acknowledgments', component: AboutAckComponent },
  { path: 'volume/:id/:content', component: VolumeContentComponent },
  { path: 'album-viewer/:id', component: AlbumViewerComponent },
  { path: 'photo-viewer/:album/:id', component: PhotoViewerComponent },
  { path: 'search-results/:search', component: SearchResultsComponent },
  { path: 'subject-terms', component: SubjectTermsComponent },
  { path: 'subject-letters/:subjectSearch', component: SubjectLettersComponent },
  { path: 'advanced-search', component: AdvancedSearchComponent }
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
    AboutPrintedComponent,
    AboutCitingComponent,
    AboutEditorsComponent,
    AboutAckComponent,
    VolumeContentComponent,
    AlbumViewerComponent,
    PhotoViewerComponent,
    VolumeTocComponent,
    VolumeViewerComponent,
    SearchResultsComponent,
    SubjectTermsComponent,
    SubjectLettersComponent,
    AdvancedSearchComponent,
    SortByPipe,
    RubensteinComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
    ),
    NgbModule,
    FontAwesomeModule,
    // NgxViewerModule,
  ],
  providers: [
    VolumeService,
    AlbumService,
    SubjectTermService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
