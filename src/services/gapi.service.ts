import * as gapi from 'google-client-api';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

@Injectable()
export class GapiService {

    private publicYoutubeApi: any = null;
    private authorizedYoutubeApi: any = null;

    private initializedApi: any = null;

    constructor(
        private sanitizer: DomSanitizer,
    ) {
        // gapi().then(api => {
        //     this.api = api;
        //     api.client.init({
        //         'apiKey': 'AIzaSyCiMdm16j7he0xSrgnQ78MEjlmctL3gtb0',
        //         //'clientId': '746926310137-khlo1vmtid5j6mhrh19phc4fcqcvfsss.apps.googleusercontent.com',
        //         // 'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
        //         'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
        //     }).then(() => {
        //         this.GoogleAuth = api.auth2.getAuthInstance();
        //     });
        // });
        //this.retrieveInitializedGapi(false);
        this.retrieveInitializedGapi(true);

    }

    private loadGapi() {
        return gapi();
    }

    private initializePublicYoutubeApi(api) {
        let page = this;
        return new Promise((resolve, reject) => {

            // if (api.client.youtube) {
            //     resolve(api);
            //     return;
            // }
            let initPromise =
                api.client.init({
                    'apiKey': 'AIzaSyCiMdm16j7he0xSrgnQ78MEjlmctL3gtb0',
                    //'clientId': '746926310137-khlo1vmtid5j6mhrh19phc4fcqcvfsss.apps.googleusercontent.com',
                    //  'scope': 'profile', //'https://www.googleapis.com/auth/youtube',
                    'discoveryDocs': [
                        'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
                    ]
                });

            if (initPromise.then) {
                initPromise.then(
                    () => {
                        page.publicYoutubeApi = api;
                        resolve(api);
                    },
                    (err) => {
                        reject(err);
                    });
                // .catch(err => {
                //     reject(err);
                // });
            } else {
                resolve(api);
            }


        });


    }

    private initializeAuthorizedYoutubeApi(api) {
        let page = this;
        return new Promise((resolve, reject) => {

            if (api.client.youtube) {
                resolve(api);
                return;
            }
            let initPromise =
                api.client.init({
                    //'apiKey': 'AIzaSyCiMdm16j7he0xSrgnQ78MEjlmctL3gtb0',
                    'clientId': '746926310137-khlo1vmtid5j6mhrh19phc4fcqcvfsss.apps.googleusercontent.com',
                    'scope': 'https://www.googleapis.com/auth/youtube',
                    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
                });

            if (initPromise.then) {
                initPromise.then(
                    () => {
                        page.authorizedYoutubeApi = api;
                        resolve(api);
                    },
                    (err) => {
                        reject(err);
                    });
                // .catch(err => {
                //     reject(err);
                // });
            } else {
                resolve(api);
            }


        });


    }



    private retrieveInitializedGapi(isAuthorized: boolean) {
        if (isAuthorized) {
            if (this.authorizedYoutubeApi !== null) {
                return new Promise((resolve, reject) => {
                    resolve(this.authorizedYoutubeApi);
                });
            }
        } else {
            if (this.publicYoutubeApi !== null) {
                return new Promise((resolve, reject) => {
                    resolve(this.publicYoutubeApi);
                });
            }
        }

        return gapi()
            .then((api) => {
                if (isAuthorized) {
                    return this.initializeAuthorizedYoutubeApi(api)
                } else {
                    return this.initializePublicYoutubeApi(api);
                }
            })
            .then(api => {
                console.log('initialized api', isAuthorized, api);
                return api;
            }).
            catch(err => {
                console.log(err);
            });



    }



    findSong(title, artist): Promise<any> {
        console.log(`search for ${title} by ${artist}`);

        return new Promise((resolve, reject) => {

            this.retrieveInitializedGapi(true)
                .then(this.signIntoGoogle)
                .then((api) => {
                    api.client.youtube.search.list(
                        {
                            part: "snippet",
                            q: `${title} by ${artist}`,
                            chart: "mostPopular",
                            type: "video", maxResults: 1
                        })
                        .then(response => {
                            let video = response.result.items[0],
                                videoId = video.id.videoId;

                            video.spotifyParams = {
                                title: title,
                                artist: artist
                            };


                            let urlTemplate = `https://www.youtube.com/embed/${videoId}?autoplay=0&origin=${window.location.origin}`;

                            video.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlTemplate)



                            resolve(video);
                        }, err => reject(err));
                });
        });
    }

    findSongs(list) {
        return list.map(song => {
            //   let newObj = {
            //     track: song.track,
            //     loadingPromise: null,
            //     videoId: null,
            //     videoUrl: null
            //   };
            let ytPromise = this.findSong(song.track.name, song.track.artists[0].name);

            //   ytPromise.then(response => {
            //     newObj.loadingPromise = null;
            //     if (response.result.items.length > 0) {
            //       newObj.videoId = response.result.items[0].id.videoId;

            //       let urlTemplate = `https://www.youtube.com/embed/${newObj.videoId}?autoplay=0&origin=${window.location.origin}`;

            //       newObj.videoUrl = this.bypassSecurityTrustResourceUrl(urlTemplate)
            //     }

            //   }, err => {
            //     console.log(err);
            //   });

            //  newObj.loadingPromise = ytPromise;
            return ytPromise;
        });
    }

    private signIntoGoogle(api) {
        let GoogleAuth = api.auth2.getAuthInstance();
        return new Promise((resolve, reject) => {
            if (GoogleAuth.isSignedIn.get()) {
                resolve(api);
            } else {
                GoogleAuth.signIn()
                    .then(resp => {
                        console.log('auth signin resp', resp);
                        resolve(api);
                    }, err => {
                        console.log('auth signin err', err);
                        reject(err);
                    });
                // GoogleAuth.isSignedIn.listen(status => {
                //     if (status === true) {
                //         resolve(api);
                //     } else {
                //         reject(status);
                //     }
                // });
            }
        });

    }

    private signOutOfGoogle(api) {
        let GoogleAuth = api.auth2.getAuthInstance();
        return new Promise((resolve, reject) => {
            if (GoogleAuth.isSignedIn.get()) {

                GoogleAuth.signOut();
                resolve();

            }else{
                resolve();
            }
        });

    }

    private disconnectFromGoogle(api) {
        let GoogleAuth = api.auth2.getAuthInstance();
        return new Promise((resolve, reject) => {
            GoogleAuth.disconnect();
            resolve(api);
            // if (GoogleAuth.isSignedIn.get()) {

            //     GoogleAuth.signOut();

            // }
        });

    }

    signIn() {
        return new Promise((resolve, reject) => {

            this.retrieveInitializedGapi(true)
                .then(this.signIntoGoogle)
                .then(resp => resolve(resp), err => reject(err));

        });
    }

    signOut() {
        return new Promise((resolve, reject) => {

            this.retrieveInitializedGapi(true)
                .then(this.signOutOfGoogle)
                .then(resp => resolve(resp), err => reject(err));

        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {

            this.retrieveInitializedGapi(true)
                .then(this.disconnectFromGoogle)
                .then(resp => resolve(resp), err => reject(err));

        });
    }

    private grantYoutubePermission(api) {
        let NEW_SCOPES = 'https://www.googleapis.com/auth/youtube',
            GoogleAuth = api.auth2.getAuthInstance(),
            GoogleUser = GoogleAuth.currentUser.get();


        return new Promise((resolve, reject) => {

            GoogleUser.grant({ 'scope': NEW_SCOPES })
                .then(resp => resolve(api), err => reject(err));

        });
    }

    createPlaylist(playlistName: string): Promise<any> {

        return new Promise((resolve, reject) => {

            this.retrieveInitializedGapi(true)
                .then(this.signIntoGoogle)
                // .then(this.grantYoutubePermission)
                .then((api) => {
                    api.client.youtube.playlists.insert({ snippet: { title: playlistName }, part: 'snippet' })
                        .then(response => resolve(response), err => reject(err));
                },
                (err) => {
                    console.log(err);
                    reject(err);
                }

                )
                .catch(err => {
                    console.log('catch', err);
                    reject(err);
                });
        });


    }

    retrievePlaylists(): Promise<any> {

        return new Promise((resolve, reject) => {

            this.retrieveInitializedGapi(true)
                .then(this.signIntoGoogle)
                // .then(this.grantYoutubePermission)
                .then((api) => {
                    api.client.youtube.playlists.list({ part: 'snippet', mine: true })
                        .then(response => resolve(response), err => reject(err));
                },
                (err) => {
                    console.log(err);
                }

                )
                .catch(err => {
                    console.log('catch', err);
                });
        });


    }

    addVideoToPlaylist(playlistId: string, videoId: string): Promise<any> {

        return new Promise((resolve, reject) => {

            this.retrieveInitializedGapi(true)
                .then(this.signIntoGoogle)
                // .then(this.grantYoutubePermission)
                .then((api) => {
                    api.client.youtube.playlistItems.insert({
                        part: 'snippet',
                        snippet: {
                            playlistId: playlistId,
                            resourceId: {
                                videoId: videoId,
                                kind: 'youtube#video'
                            }
                        }
                    })
                        .then(response => resolve(response), err => reject(err));
                },
                (err) => {
                    console.log(err);
                }

                )
                .catch(err => {
                    console.log('catch', err);
                });
        });


    }


}