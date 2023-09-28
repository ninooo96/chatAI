import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import {ChatService } from '../../services/chat.service';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

import { Observable } from 'rxjs';
import { IonContent } from '@ionic/angular';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
@Injectable({
  providedIn: 'root'
})
export class ChatPage implements OnInit {

  @ViewChild('content') content: any;

  newMsg = '';
  aiMsg='';
  url = "";
  first = true;

  constructor(public chatService: ChatService, private http: HttpClient) { }

  ngOnInit() {
    this.chatService.addNewMessage({
      msg: "Ciao, scrivi il codice per collegarti al Public URL",
      name: "AI",
      myMsg: false
    })
    
  }
  

  public async setMessage() {
    this.chatService.addNewMessage({
      msg: this.newMsg,
      name: "Antonio",
      myMsg: true
    })

    if (this.first) {
      this.url = "https://" + this.newMsg.trim() + ".ngrok.io/chat?question="
      this.getResponse("Salutami")
      this.first = false
    } else {
      this.getResponse(this.newMsg)
    }
  
    this.newMsg = ''
    
    setTimeout(() => {
      this.content.scrollToBottom(300)}, 200);

  }
  
  public onClickTextArea(){
      setTimeout(() => {
        this.content.scrollToBottom(300)}, 200);
    }

  private getResponse(msg: string){
    console.log(this.url + msg)
    this.http.get<any>(this.url + msg).forEach(
      (data => {
        this.aiMsg = data
        this.chatService.addNewMessage({
          msg: this.aiMsg,
          name: "AI",
          myMsg: false
        })
        console.log(data)
        if(this.chatService.voice && !this.first){
          console.log(this.aiMsg)
          // TextToSpeech.getSupportedLanguages().then((lang: any)  => console.log(lang))
          // TextToSpeech.getSupportedVoices().then((voice: any) => console.log(voice))
          TextToSpeech.speak({
            text: this.aiMsg,
            lang: 'it-IT',
            rate: 1.2,
            pitch: 1.0,
            volume: 1.0,
            voice: 11,
            category: 'ambient'
          })
          // .then(() => console.log('Done'))
          // .catch((reason: any) => console.log(reason));
          }
        
      })).catch((err: HttpErrorResponse) => {
        this.aiMsg = "Codice errato o connessione persa. \nScrivi il codice per collegarti al Public URL";
        this.chatService.addNewMessage({
          msg: this.aiMsg,
          name: "AI",
          myMsg: false
        })
        this.first=true
      }).then(() => {
        if(this.chatService.voice && this.first){
          // TextToSpeech.getSupportedLanguages().then((lang: any)  => console.log(lang))
          // TextToSpeech.getSupportedVoices().then((voice: any) => console.log(voice))
          TextToSpeech.speak({
            text: this.aiMsg,
            lang: 'it-IT',
            rate: 1.2,
            pitch: 1.0,
            volume: 1.0,
            voice: 11,
            category: 'ambient'
          })
      }
      setTimeout(() => {
        this.content.scrollToBottom(300)}, 200);
    })

    setTimeout(() => {
      this.content.scrollToBottom(300)}, 200);

    }
    

    
  
}
