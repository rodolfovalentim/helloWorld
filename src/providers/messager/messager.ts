import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { WebsocketProvider } from '../websocket/websocket';

// const CHAT_URL = 'ws://echo.websocket.org/';

export interface Message {
	author: string,
	message: string
}

@Injectable()
export class MessagerProvider {

  public messages: Subject<Message>;

  constructor(private wsService: WebsocketProvider) {}

	create(CHAT_URL) {
		this.messages = <Subject<Message>>this.wsService
			.connect(CHAT_URL)
			.map((response: any): any => {
        		let data = JSON.parse(response);
				return {
					author: data.author,
					message: data.message
				}
			});
    }
  
  sendMsg(msg) {
    this.messages.next(msg);
	}
}

