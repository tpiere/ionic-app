import { Component, NgZone } from '@angular/core';
import { Http, RequestOptions, Request, RequestMethod, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, NavParams, ViewController, ToastController, AlertController, LoadingController } from 'ionic-angular';
import * as SpotifyWebApi from 'spotify-web-api-js';
import Q from 'q';
import * as gapi from 'google-client-api';
import { DomSanitizer } from '@angular/platform-browser'

import { GapiService } from '../../services/gapi.service'
import * as _ from 'lodash';

@Component({
    selector: 'youtube-playlist-select',
    templateUrl: 'youtube-playlist-select.html'
})
export class YoutubePlaylistSelectPage {
    public playlistName: string;

    private GoogleAuth: any;
    private api: any;

    youtubePlaylists: any = null;
    youtubePlaylist: string = null;

    public youtubeSonglist: any = null;
    public newPlaylistName: string;

    constructor(public viewCtrl: ViewController,
        private gapiService: GapiService,
        public toastCtrl: ToastController,
        private _ngZone: NgZone,
        private navParams: NavParams,
        private alertCtrl: AlertController,
        public loadingCtrl: LoadingController) { }

    ngOnInit() {
        this.youtubeSonglist = this.navParams.get('youtubeSongList');
        this.loadYoutubePlaylists();
    }

    close() {
        this.viewCtrl.dismiss();
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

    createPlaylist() {
        this.promptForNewPlaylist().then(
            (playListName: string): Promise<any> => {
                return this.gapiService.createPlaylist(playListName);
            }
        )
            .then(
            (response: any) => {
                this.loadYoutubePlaylists();
                this.youtubePlaylist = response.result.id;
            }
            ).catch(err => console.log(err));
    }

    onCreatePlaylist() {
        console.log(this.newPlaylistName);

        let loader = this.loadingCtrl.create({
            content: "Working..."
            //,
            //duration: 3000
        });
        loader.present();

        this.gapiService.createPlaylist(this.newPlaylistName)
            .then(response => {
                console.log(response);
                // let toast = this.toastCtrl.create({
                //     message: 'Playlist created successfully',
                //     duration: 3000,
                //     position: 'top',
                //     cssClass: 'danger'

                // });
                // toast.present();
                this.addSelectedSongsToPlaylist(response.result.id)
                    .then((details) => { loader.dismiss(); return details; })
                    .then((details) => this.addToPlaylistSucceeded(details));

                //this.close();
            },
            error => {
                let toast = this.toastCtrl.create({
                    message: `Failed to create playlist`,
                    showCloseButton: true,
                    //duration: 3000,
                    position: 'bottom',
                    cssClass: 'danger'

                });
                toast.present();
                loader.dismiss();
            }
            );
        return false;
    }

    onSelectPlaylist() {
        let loader = this.loadingCtrl.create({
            content: "Working..."
            //,
            //duration: 3000
        });
        loader.present();

        this.addSelectedSongsToPlaylist(this.youtubePlaylist)
            .then((details) => { loader.dismiss(); return details; })
            .then((details) => this.addToPlaylistSucceeded(details));

        return false;
    }

    private promptForNewPlaylist() {

        return new Promise((resolve, reject) => {
            let prompt = this.alertCtrl.create({
                title: 'New Playlist',
                message: `Enter playlist name`,
                inputs: [
                    {
                        name: 'playlistName',
                        placeholder: 'name',
                    },],
                buttons: [
                    {
                        text: 'Cancel',
                        handler: data => {
                            reject('canceled');
                        }
                    },
                    {
                        text: 'Ok',
                        handler: data => {
                            console.log('Ok clicked ', data.playlistName);

                            if (data.playlistName) {
                                resolve(data.playlistName);
                                
                            } else {
                                return false;
                            }
                        }
                    }
                ]
            });
            prompt.present();
        });


    }

    private addToPlaylistSucceeded(details) {
        let prompt = this.alertCtrl.create({
            title: 'Success',
            message: `${details.numberOfSongs} videos were added to the playlist`,

            buttons: [
                {
                    text: 'View Playlist',
                    handler: data => {
                        this.viewCtrl.dismiss();
                        window.open(`https://www.youtube.com/playlist?list=${details.playlistId}`);
                    }
                },
                {
                    text: 'Dismiss',
                    handler: data => {
                        console.log('Dismiss clicked');
                        this.viewCtrl.dismiss();
                    }
                }
            ]
        });
        prompt.present();
    }

    addSelectedSongsToPlaylist(playlistId) {
        return new Promise((resolve, reject) => {
            var tasks = [];
            //var promiseList = [];
            _.each(this.youtubeSonglist, (song) => {
                if (song.isSelected) {
                    var newTask = (currentIndex) => {

                        let ytPromise = this.gapiService.addVideoToPlaylist(playlistId, song.id.videoId);

                        ytPromise.then(response => {
                            this._ngZone.run(() => {
                                song.isAdded = true;
                                if (currentIndex === tasks.length - 1) {
                                    resolve({ playlistId: playlistId, numberOfSongs: tasks.length })
                                }
                                console.log("completed currentIndex: ", currentIndex);
                            });

                        },
                            err => console.log(err));

                        return ytPromise;
                    };
                    tasks.push(newTask);
                }
            });
            tasks.reduce((accumulator, currentValue, currentIndex) => {
                return accumulator.then(() => { return currentValue(currentIndex) });
            }, Q());
        });
    }

}