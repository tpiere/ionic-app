import { Component, NgZone } from '@angular/core';
import { Http, RequestOptions, Request, RequestMethod, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, NavParams } from 'ionic-angular';
import * as SpotifyWebApi from 'spotify-web-api-js';
//import Q from 'q';
import * as gapi from 'google-client-api';
import { DomSanitizer } from '@angular/platform-browser'


@Component({
  selector: 'playlist-details',
  templateUrl: 'playlist.html'
})
export class PlaylistDetailsPage {
  selectedItem: any;
  playlist: any = null;
  private spotifyApi;
  videos: any = null;

  constructor(public navCtrl: NavController,
    private navParams: NavParams, private http: Http, private sanitizer: DomSanitizer, private _ngZone: NgZone) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.spotifyApi = new SpotifyWebApi();
    //this.spotifyApi.setPromiseImplementation(Q);
  }

  ngOnInit() {
    this.spotifyApi.setAccessToken(this.navParams.get('accessToken'));
    let playlistId = this.navParams.get('playlistId');
    let userId = this.navParams.get('userId');


    this.playlist = this.spotifyApi.getPlaylistTracks(userId, playlistId);

    // this.playlist.then(data => {
    //   console.log('playlist ', data);
    // });




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

  searchSong(title, artist) {
    console.log(`search for ${title} by ${artist}`);

    var page = this;
    gapi().then(api => {
      console.log('the real api', api);

      initClient();

      var GoogleAuth; // Google Auth object.
      function initClient() {
        api.client.init({
          'apiKey': 'AIzaSyCiMdm16j7he0xSrgnQ78MEjlmctL3gtb0',
          //'clientId': '746926310137-khlo1vmtid5j6mhrh19phc4fcqcvfsss.apps.googleusercontent.com',
          // 'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
          'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
        }).then(() => {
          //GoogleAuth = api.auth2.getAuthInstance();
          console.log('after init');
          api.client.youtube.search.list({ part: "snippet", q: `${title} by ${artist}`, chart: "mostPopular", type: "video", maxResults: 1 })
            .then(response => {
              console.log(response);
              page._ngZone.run(() => {
                page.videos = response.result.items.map(item => {
                  let urlTemplate = `https://www.youtube.com/embed/${item.id.videoId}?autoplay=0&origin=${window.location.origin}`;

                  return { url: page.sanitizer.bypassSecurityTrustResourceUrl(urlTemplate) }
                });
                //window.$("body").append(result);
              });

            }
            );
          // Listen for sign-in state changes.
          //GoogleAuth.isSignedIn.listen(updateSigninStatus);
        });
      }
    }
    );

  }

  back() {
    this.navCtrl.pop();
  }

}
