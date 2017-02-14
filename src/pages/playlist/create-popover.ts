import { Component, NgZone } from '@angular/core';
import { Http, RequestOptions, Request, RequestMethod, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import * as SpotifyWebApi from 'spotify-web-api-js';
//import Q from 'q';
import * as gapi from 'google-client-api';
import { DomSanitizer } from '@angular/platform-browser'


@Component({
  selector: 'create-playlist-form',
  templateUrl: 'create-popover.html'
})
export class PopoverPage {
  public playlistName: string;

  private GoogleAuth: any;
  private api:any;
  constructor(public viewCtrl: ViewController) { }

  ngOnInit(){
    this.testGapi();
  }

  close() {
    this.viewCtrl.dismiss();
  }

  createPlaylist(playlistName:string){
    console.log("createPlaylist with api", this.api);
    this.api.client.youtube.playlists.insert({snippet:{title:playlistName}, part:'snippet'})
    .then(data => {
      console.log(data)
    });
  }

  onSubmit() {
    console.log(this.playlistName);
    //this.viewCtrl.dismiss();

    if (this.GoogleAuth.isSignedIn.get()) {
      this.createPlaylist(this.playlistName);
    } else {
      this.GoogleAuth.signIn();
      // Listen for sign-in state changes.
      this.GoogleAuth.isSignedIn.listen(status => {
        console.log("signed in status", status);
         this.createPlaylist(this.playlistName);
      });
    }
    return false;
  }


  testGapi() {
    var page = this;
    gapi().then(api => {
      console.log('the real api', api);

      initClient();

      page.GoogleAuth; // Google Auth object.
      page.api = api;
      function initClient() {
        api.client.init({
          //'apiKey': 'AIzaSyCiMdm16j7he0xSrgnQ78MEjlmctL3gtb0',
          'clientId': '746926310137-khlo1vmtid5j6mhrh19phc4fcqcvfsss.apps.googleusercontent.com',
          'scope': 'https://www.googleapis.com/auth/youtube',
          'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
        }).then(() => {
          page.GoogleAuth = api.auth2.getAuthInstance();
          console.log('after init');

          // api.client.youtube.search.list({ part: "snippet", q: "waves by bayonne", chart: "mostPopular", type:"video" })
          //   .then(response => {
          //     console.log(response);
          //     page._ngZone.run(() => {
          //       page.videos = response.result.items.map(item => {
          //         let urlTemplate = `https://www.youtube.com/embed/${item.id.videoId}?autoplay=0&origin=${window.location.origin}`;

          //         return { url: page.sanitizer.bypassSecurityTrustResourceUrl(urlTemplate) }
          //       });
          //       //window.$("body").append(result);
          //     });

          //   }
          //   );

        });
      }

    });
  }


}