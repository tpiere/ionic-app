import { Component, NgZone } from '@angular/core';
import { Http, RequestOptions, Request, RequestMethod, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, NavParams, PopoverController, ModalController, ActionSheetController } from 'ionic-angular';
import * as SpotifyWebApi from 'spotify-web-api-js';
import Q from 'q';
import * as gapi from 'google-client-api';
import { DomSanitizer } from '@angular/platform-browser';
import { PopoverPage } from './create-popover.ts';
import { YoutubeVideoSelectPage } from './youtube-video-select';
import { YoutubeVideoDetailsPage } from '../video/youtube-video-details';

import { GapiService } from '../../services/gapi.service'
import * as _ from 'lodash';

@Component({
  selector: 'youtube-songlist',
  templateUrl: 'youtube-songlist.html'
})
export class YoutubeSonglistPage {

  public youtubeSonglist: any = null;

  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    private http: Http,
    private sanitizer: DomSanitizer,
    private _ngZone: NgZone,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    private gapiService: GapiService,
    private actionSheetCtrl: ActionSheetController) {
    // If we navigated to this page, we will have an item available as a nav param
    // this.selectedItem = navParams.get('item');
    // this.spotifyApi = new SpotifyWebApi();
    //this.spotifyApi.setPromiseImplementation(Q);
  }

  ngOnInit() {
    this.youtubeSonglist = this.navParams.get('youtubeSongList');
    console.log(this.youtubeSonglist);
  }

  showVideoDetails(video) {
    console.log(video);
    let detailsModal = this.modalCtrl.create( YoutubeVideoDetailsPage, { youtubeVideo:video});
    detailsModal.present();
  }

  addToPlaylist() {
    this.navCtrl.push(YoutubeVideoSelectPage,
      new NavParams({ youtubeSongList: this.youtubeSonglist }));
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options',
      buttons: [
        {
          text: 'Add videos to a YouTube playlist',
          handler: () => {
            this.addToPlaylist()
          }
        },
        // {
        //   text: 'Back to playlists',
        //   handler: () => {

        //     this.back();
        //   }
        // },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }


}