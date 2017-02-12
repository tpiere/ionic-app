import { Component } from '@angular/core';
import {Http, RequestOptions, Request, RequestMethod, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, NavParams } from 'ionic-angular';
import * as SpotifyWebApi from 'spotify-web-api-js';

@Component({
  selector: 'top-artists',
  templateUrl: 'top-artists.component.html'
})
export class topArtists {
  selectedItem: any;
  topArtists: any;

  constructor(public navCtrl: NavController, private navParams: NavParams, private http: Http) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }

  ngOnInit() {
    let url = `https://api.spotify.com/v1/me/top/tracks?time_range=short_term`,
        headers = new Headers(),
        options = new RequestOptions({
            method: RequestMethod.Get
        });

        headers.append('Authorization', `Bearer ${this.navParams.get('accessToken')}`);
        options.headers = headers;

    this.topArtists = this.http.get(url, options)
      .map(resp => {
          let parsed = JSON.parse(resp.text());
          return parsed.items;
      });

  }

}
