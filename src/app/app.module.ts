import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { topArtists } from '../pages/top-artists/top-artists.component';
import { PostAuthlandingPage } from '../pages/post-auth-landing/landing';
import { PlaylistDetailsPage } from '../pages/playlist/playlist';

import { ListPage } from '../pages/list/list';
import { HttpModule } from '@angular/http';


@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    topArtists,
    PostAuthlandingPage,
    PlaylistDetailsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {}, {
      links:[
        {component: PostAuthlandingPage, name: 'PostAuthLanding', segment: ':accessToken/playlists'},
         {component: PlaylistDetailsPage, name: 'PlaylistDetailsPage', segment: ':accessToken/:userId/playlists/:playlistId'}
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
    PlaylistDetailsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
