
import { Component, NgZone } from '@angular/core';
import { Http, RequestOptions, Request, RequestMethod, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, NavParams, PopoverController, ToastController, LoadingController } from 'ionic-angular';
import * as SpotifyWebApi from 'spotify-web-api-js';
import Q from 'q';
import * as gapi from 'google-client-api';
import { DomSanitizer } from '@angular/platform-browser'
import { PopoverPage } from './create-popover.ts'
import { YoutubeSonglistPage } from './youtube-songlist'

import { GapiService } from '../../services/gapi.service'
import * as _ from 'lodash';

@Component({
    selector: 'youtube-playlist-select',
    templateUrl: 'youtube-playlist-select.html'
})
export class YoutubePlaylistSelectPage {
    selectedItem: any;
    playlist: any = null;
    private spotifyApi;
    videos: any = null;
    youtubePlaylists: any = null;
    youtubePlaylist: string = null;

    public youtubeSonglist: any = null;

    constructor(public navCtrl: NavController,
        private navParams: NavParams,
        private http: Http,
        private sanitizer: DomSanitizer,
        private _ngZone: NgZone,
        public popoverCtrl: PopoverController,
        private gapiService: GapiService,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController) {

    }

    ngOnInit() {
        this.youtubeSonglist = this.navParams.get('youtubeSongList');
        this.loadYoutubePlaylists();
    }

    loadYoutubePlaylists() {

        this.gapiService.retrievePlaylists()
            .then(response => {
                console.log(response);
                this._ngZone.run(() => {
                    this.youtubePlaylists = response.result.items.map(item => {
                        return { id: item.id, title: item.snippet.title };
                    });
                });
            })
            .catch(err => { console.log(err); });
    }

    addSelectedSongsToPlaylist() {

        var tasks = [];
        _.each(this.youtubeSonglist, (song) => {
            if (song.isSelected) {
                var newTask = () => {
                    let ytPromise = this.gapiService.addVideoToPlaylist(this.youtubePlaylist, song.id.videoId);

                    ytPromise.then(response => {
                        this._ngZone.run(() => {
                            song.isAdded = true;

                        });

                    });
                    return ytPromise;
                };
                tasks.push(newTask);
            }
        });
        tasks.reduce(Q.when, Q());
    }

}