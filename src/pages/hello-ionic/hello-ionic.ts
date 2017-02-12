import { Component, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, RequestOptions, Request, RequestMethod, Headers, Response } from '@angular/http';
import * as gapi from 'google-client-api';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  public origin: string;
  public testResult: Observable<Response>;

  public videos: any = null;



  constructor(private http: Http, private sanitizer: DomSanitizer, private _ngZone: NgZone) {
    this.origin = window.location.origin;

    // console.log("gapi", gapi);

  }

  spotifyLogin() {
    let client_id = '3c5c178f5ede49d690f953c56d5cd14f',
      redirect_uri = window.location.origin;
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user-read-private%20user-read-email%20user-top-read&response_type=token&state=123`;
  }

  testLocalCors() {
    this.testResult = this.http.get('http://localhost:3000/testing');
  }

  testGapi() {
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
          api.client.youtube.search.list({ part: "snippet", q: "waves by bayonne", chart: "mostPopular", type:"video" })
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

    });
  }
}
