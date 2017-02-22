import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { topArtists } from '../pages/top-artists/top-artists.component';
import { PostAuthlandingPage } from '../pages/post-auth-landing/landing';
import { PlaylistDetailsPage } from '../pages/playlist/playlist';
import { PopoverPage } from '../pages/playlist/create-popover';
import { YoutubeSonglistPage } from '../pages/playlist/youtube-songlist';
import { YoutubeVideoSelectPage } from '../pages/playlist/youtube-video-select';
import { YoutubePlaylistSelectPage } from '../pages/playlist/youtube-playlist-select';
import { YoutubeVideoDetailsPage } from '../pages/video/youtube-video-details';

import { ListPage } from '../pages/list/list';
import { HttpModule } from '@angular/http';

import { GapiService } from '../services/gapi.service';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    topArtists,
    PostAuthlandingPage,
    PlaylistDetailsPage,
    PopoverPage,
    YoutubeSonglistPage,
    YoutubeVideoSelectPage,
    YoutubePlaylistSelectPage,
    YoutubeVideoDetailsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {}, {
      links: [
        {
          component: PostAuthlandingPage,
          name: 'PostAuthLanding',
          segment: ':accessToken/playlists',
          defaultHistory: [HelloIonicPage]
        },
        {
          component: PlaylistDetailsPage,
          name: 'PlaylistDetailsPage',
          segment: ':accessToken/:userId/playlists/:playlistId',
          defaultHistory: [HelloIonicPage]
        }
      ]
    }),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    topArtists,
    PostAuthlandingPage,
    PlaylistDetailsPage,
    PopoverPage,
    YoutubeSonglistPage,
    YoutubeVideoSelectPage,
    YoutubePlaylistSelectPage,
    YoutubeVideoDetailsPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, GapiService]
})
export class AppModule { }
