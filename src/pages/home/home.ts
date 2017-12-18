import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  AlertController,
  ActionSheetController
} from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  songs: Observable<any>;
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public afDatabase: AngularFireDatabase,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.songs = afDatabase.list('/songs').valueChanges();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }
  addSong() {
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: "Enter a name for this new song you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Salva',
          handler: data => {
            const newSongRef = this.afDatabase.list('/songs').push({});

            newSongRef.set({
              id: newSongRef.key,
              title: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }
  showOptions(songId, songTitle) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Delete Song',
          role: 'destructive',
          handler: () => {
            this.removeSong(songId);
          }
        },
        {
          text: 'Update title',
          handler: () => {
            this.updateSong(songId, songTitle);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  removeSong(songId: string) {
    this.afDatabase.list('/songs').remove(songId);
  }
  updateSong(songId, songTitle) {
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: 'Update the name for this song',
      inputs: [
        {
          name: 'title',
          placeholder: 'Titolo della canzone',
          value: songTitle
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.afDatabase.list('/songs').update(songId, {
              title: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }
}
