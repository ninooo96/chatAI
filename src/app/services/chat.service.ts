import { ChangeDetectorRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  public messages: Message[] = [];
  public voice: boolean = false;


  constructor() {}

  public async addNewMessage(message: Message) {
    this.messages.push(message);
  }

  public setVoice(){
    this.voice = !this.voice
    
  }

}

export interface Message {
  msg: string,
  name: string,
  myMsg: boolean
}
