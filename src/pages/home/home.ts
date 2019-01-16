import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ScoreProvider } from '../../providers/score/score';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ScoreProvider]
})
export class HomePage {

  scoreBoard;

  constructor(public navCtrl: NavController, private score: ScoreProvider) {
    this.scoreBoard = score.create(["player-1", "player-2"])
  }
}
