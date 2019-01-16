import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';

export interface Score { player: string, value: number }

@Injectable()
export class ScoreProvider {

  private score: Map<string, number>

  constructor() { }

  create(players: string[]): Rx.Subject<MessageEvent> {
    this.score = new Map<string, number>();

    for (let player of players) {
      this.score.set(player, 0);
    }

    let observable = new Observable(observer => {
      return () => {
      }
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    let observer = {
      next: (data: Score) => {
        console.log(data["player"], data["value"])
        this.add(data["player"], data["value"]);
      },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Rx.Subject.create(observer, observable);
  }

  add(player: string, value: number) {
    let prev = this.score.get(player);
    this.score.set(player, prev + value)
    return prev + value
  }
}
