import { MusicControls } from '@ionic-native/music-controls';
import { Media, MediaObject } from '@ionic-native/media';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public fileuri:String;
  public file: MediaObject;
  constructor(public navCtrl: NavController, public media: Media, public chooser: FileChooser, public path: FilePath, public musicControls:MusicControls) {}

  filechooser(){
    this.chooser.open()
      .then( (uri) => {
       this.path.resolveNativePath(uri).then( (result)=>{
         this.fileuri = result;
         this.audioplay();
       })
      }).catch(err=>{
        alert('err:- '+err)
      })
      .catch(e => console.log(e));
  }
  audioplay(){
    var pathalone = this.fileuri.substring(8)
    this.file = this.media.create(pathalone)
    this.file.onStatusUpdate.subscribe(status => console.log('status', status)); // fires when this.file status changes
    this.file.onSuccess.subscribe(() => console.log('Action is successful'));
    this.file.onError.subscribe(error => console.log('Error!', error));
    // play the this.file
    this.file.play();

    // get current playback position
    // this.file.getCurrentPosition().then((position) => {
    //   console.log(position);
    // });
    this.musicControls.create({
      isPlaying: true,                         // optional, default : true
      dismissable: true,                         // optional, default : false

      // hide previous/next/close buttons:
      hasPrev: false,      // show previous button, optional, default: true
      hasNext: false,      // show next button, optional, default: true
      hasClose: true,       // show close button, optional, default: false
      playIcon: 'media_play',
      pauseIcon: 'media_pause',
      prevIcon: 'media_prev',
      nextIcon: 'media_next',
      closeIcon: 'media_close',
      notificationIcon: 'notification'
    });
    var self = this;
    this.musicControls.subscribe().subscribe( action => {
      function events(action){
        const message = JSON.parse(action).message;
        switch (message) {
          case 'music-controls-next':  
          break;
          case 'music-controls-play':
          self.file.play();
          break;  
          case 'music-controls-pause':
            self.file.pause();
          break;
          case 'music-controls-destroy':
          break;
          
        }
      }
    })
  } 
  pause(){
    this.file.pause();
  }
  play(){
    this.file.play();
  }
  musicoption(){
    console.log('music option');
    this.musicControls.listen();
  }
}
