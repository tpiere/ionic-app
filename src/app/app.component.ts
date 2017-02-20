import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, NavParams } from 'ionic-angular';

import { StatusBar, Splashscreen } from 'ionic-native';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
import { topArtists } from '../pages/top-artists/top-artists.component';
import { PostAuthlandingPage } from '../pages/post-auth-landing/landing';

import { GapiService } from '../services/gapi.service'


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = HelloIonicPage;
  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    private gapiService: GapiService,
  ) {
    console.log('app constructor window.location', window.location);
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Hello Ionic', component: HelloIonicPage },
      { title: 'Playlists', component: PostAuthlandingPage }
    ];
  }

  initializeApp() {
    let tokenRegex = /access_token=([^&]*)/i,
      accessTokenParsed = window.location.hash.match(tokenRegex),
      accessToken;

    this.platform.ready().then(() => {
      console.log('platform ready - window.location', window.location);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      if (accessTokenParsed != null && accessTokenParsed.length > 1) {
        accessToken = accessTokenParsed[1];
        //this.nav.push(this.pages[2].component, new NavParams({accessToken:accessToken}));
        this.nav.push(PostAuthlandingPage, new NavParams({ accessToken: accessToken }));
      }

      console.log('accessToken = ', accessToken);
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  signOutFromGoogle() {
    this.gapiService.signOut().then(
      (res) => {
        console.log(res);
        this.menu.close('right');
      },
      err => console.log(err)
    );
  }

  revokeGoogleAccess() {
    this.gapiService.disconnect().then(
      (res) => {
        console.log(res)
        this.menu.close('right');
      },
      err => console.log(err)
    )
  }
}
