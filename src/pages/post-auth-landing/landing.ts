import { Component } from '@angular/core';
import { Http, RequestOptions, Request, RequestMethod, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import * as SpotifyWebApi from 'spotify-web-api-js';
//import Q from 'q';
import { PlaylistDetailsPage } from '../playlist/playlist';

@Component({
  selector: 'post-auth-landing',
  templateUrl: 'landing.html'
})
export class PostAuthlandingPage {
  selectedItem: any;
  playlists: any = null;
  private spotifyApi;
  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    private http: Http,
    private actionSheetCtrl: ActionSheetController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.spotifyApi = new SpotifyWebApi();
    //this.spotifyApi.setPromiseImplementation(Promise);
  }

  ngOnInit() {
    this.spotifyApi.setAccessToken(this.navParams.get('accessToken'));

    this.playlists = this.spotifyApi.getUserPlaylists({ limit: 50 });

  }

  loadPlaylist(playlistId, userId) {
    let accessToken = this.navParams.get('accessToken');
    this.navCtrl.push(PlaylistDetailsPage,
      new NavParams({ accessToken: accessToken, playlistId: playlistId, userId: userId }));
  }

 

}
