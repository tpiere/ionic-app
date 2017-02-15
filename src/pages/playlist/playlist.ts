import { Component, NgZone } from '@angular/core';
import { Http, RequestOptions, Request, RequestMethod, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import * as SpotifyWebApi from 'spotify-web-api-js';
//import Q from 'q';
import * as gapi from 'google-client-api';
import { DomSanitizer } from '@angular/platform-browser'
import { PopoverPage } from './create-popover.ts'

import { GapiService } from '../../services/gapi.service'

@Component({
  selector: 'playlist-details',
  templateUrl: 'playlist.html'
})
export class PlaylistDetailsPage {
  selectedItem: any;
  playlist: any = null;
  private spotifyApi;
  videos: any = null;
  youtubePlaylists: any = null;

  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    private http: Http,
    private sanitizer: DomSanitizer,
    private _ngZone: NgZone,
    public popoverCtrl: PopoverController,
    private gapiService: GapiService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.spotifyApi = new SpotifyWebApi();
    //this.spotifyApi.setPromiseImplementation(Q);
  }

  ngOnInit() {
    this.spotifyApi.setAccessToken(this.navParams.get('accessToken'));
    let playlistId = this.navParams.get('playlistId');
    let userId = this.navParams.get('userId');


    let playlistPromise = this.spotifyApi.getPlaylistTracks(userId, playlistId);

    playlistPromise.then(data => {
      console.log('playlist ', data);
      this.playlist = data;
    });




    //console.log(this.playlist);
    // setTimeout(() => {
    //   this.playlist = new Promise((resolve, reject) => {
    //     // this.spotifyApi
    //     //   .getMe()
    //     //   .then(profile => {
    //     //return 
    //     this.spotifyApi.getPlaylistTracks(userId, playlistId)
    //       .then(data => {
    //         resolve(data);
    //       }).catch(err => {
    //         reject(err);
    //       });
    //     //});

    //   });
    // }, 500);

  }

  loadSong(title, artist) {
    console.log(`load song for ${title} by ${artist}`);
    this.gapiService.findSong(title, artist)
      .then(response => {
        console.log(response);
        this._ngZone.run(() => {
          this.videos = response.result.items.map(item => {
            let urlTemplate = `https://www.youtube.com/embed/${item.id.videoId}?autoplay=0&origin=${window.location.origin}`;

            return { url: this.sanitizer.bypassSecurityTrustResourceUrl(urlTemplate) }
          });
        });
      })
      .catch(err => { });

  }

  loadAll(){
    this.playlist.items = this.findAllOnYouTube(this.playlist.items);
  }

  private findAllOnYouTube(list) {
    return list.map(song => {
      let newObj = {
        track: song.track,
        loadingPromise: null,
        videoId: null,
        videoUrl:null
      };
      let ytPromise = this.gapiService.findSong(song.track.name, song.track.artists[0].name);

      ytPromise.then(response => {
        newObj.loadingPromise = null;
        if (response.result.items.length > 0) {
          newObj.videoId = response.result.items[0].id.videoId;

          let urlTemplate = `https://www.youtube.com/embed/${newObj.videoId}?autoplay=0&origin=${window.location.origin}`;

          newObj.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlTemplate) 
        }
        
      }, err => {
        console.log(err);
      });

      newObj.loadingPromise = ytPromise;
      return newObj;
    });
  }

  signOutOfGoogle(){
    this.gapiService.signOut();
  }

  disconnectFromGoogle(){
    this.gapiService.disconnect();
  }

  back() {
    this.navCtrl.pop();
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  loadYoutubePlaylists(){
     
    this.gapiService.retrievePlaylists()
      .then(response => {
        console.log(response);
        this._ngZone.run(() => {
          this.youtubePlaylists = response.result.items.map(item => {
            return {id: item.id, title:item.snippet.title};
          });
        });
      })
      .catch(err => { console.log(err);});
  }

}
