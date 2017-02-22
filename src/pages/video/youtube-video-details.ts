import { Component, NgZone } from '@angular/core';
import { Http, RequestOptions, Request, RequestMethod, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, NavParams, PopoverController, ModalController, ActionSheetController, ViewController } from 'ionic-angular';
import * as SpotifyWebApi from 'spotify-web-api-js';
import Q from 'q';
import * as gapi from 'google-client-api';
import { DomSanitizer } from '@angular/platform-browser';

import { GapiService } from '../../services/gapi.service'
import * as _ from 'lodash';

@Component({
  selector: 'youtube-video-details',
  templateUrl: 'youtube-video-details.html'
})
export class YoutubeVideoDetailsPage {

  public video: any = null;

  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    private http: Http,
    private sanitizer: DomSanitizer,
    private _ngZone: NgZone,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    private gapiService: GapiService,
    private actionSheetCtrl: ActionSheetController,
    private viewCtrl: ViewController) {
    // If we navigated to this page, we will have an item available as a nav param
    // this.selectedItem = navParams.get('item');
    // this.spotifyApi = new SpotifyWebApi();
    //this.spotifyApi.setPromiseImplementation(Q);
  }

  ngOnInit() {
    this.video = this.navParams.get('youtubeVideo');
    console.log(this.video);
  }

  showVideoDetails(song) {
    console.log(song);
    //  this.modalCtrl.create({

    //  })
  }

    dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
    }

 
  presentActionSheet() {
    // let actionSheet = this.actionSheetCtrl.create({
    //   title: 'Options',
    //   buttons: [
    //     {
    //       text: 'Add videos to a YouTube playlist',
    //       handler: () => {
    //         this.addToPlaylist()
    //       }
    //     },
    //     // {
    //     //   text: 'Back to playlists',
    //     //   handler: () => {

    //     //     this.back();
    //     //   }
    //     // },
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       handler: () => {
    //         console.log('Cancel clicked');
    //       }
    //     }
    //   ]
    // });

    // actionSheet.present();
  }


}