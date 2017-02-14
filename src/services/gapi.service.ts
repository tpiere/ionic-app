import * as gapi from 'google-client-api';
import { Injectable } from '@angular/core';


@Injectable()
export class GapiService {

    private GoogleAuth;
    //private api;

    constructor() {
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
    }

    private loadGapi() {
        return gapi();
    }

    private initializeGapi(api) {
        return new Promise((resolve, reject) => {

            if(api.client.youtube){
                resolve(api);
                return;
            }
            let initPromise = 
            api.client.init({
                'apiKey': 'AIzaSyCiMdm16j7he0xSrgnQ78MEjlmctL3gtb0',
                //'clientId': '746926310137-khlo1vmtid5j6mhrh19phc4fcqcvfsss.apps.googleusercontent.com',
                // 'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
                'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
            });
            
            if(initPromise.then){
                initPromise.then(
                    () => {
                        resolve(api);
                    }, 
                    (err) => {
                        reject(err);
                    });
                // .catch(err => {
                //     reject(err);
                // });
            }else{
                  resolve(api);
            }

           
        });


    }

    private retrieveInitializedGapi() {
        return gapi()
            .then(this.initializeGapi)
            .then(api => {
                console.log('initialized api', api);
                return api;
            }).
            catch(err => {
                console.log(err);
            });
    }



    findSong(title, artist): Promise<any> {
        console.log(`search for ${title} by ${artist}`);

        return new Promise((resolve, reject) => {

            this.retrieveInitializedGapi().then((api) => {
                api.client.youtube.search.list(
                    {
                        part: "snippet",
                        q: `${title} by ${artist}`,
                        chart: "mostPopular",
                        type: "video", maxResults: 1
                    })
                    .then(response => resolve(response))
                    .catch(err => reject(err));
            });
        });
    }


}