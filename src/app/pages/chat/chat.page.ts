import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import {ChatService } from '../../services/chat.service';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Observable } from 'rxjs';
import { IonContent } from '@ionic/angular';
import { getLocaleWeekEndRange } from '@angular/common';



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
  voice = 0;
  first = true;

  public supportedVoices: SpeechSynthesisVoice[] = [];

  constructor(public chatService: ChatService, private http: HttpClient) {}

  ngOnInit() {
    this.chatService.addNewMessage({
      msg: "Ciao, scrivi il codice per collegarti al Public URL",
      name: "AI",
      myMsg: false
    })

    TextToSpeech.getSupportedVoices().then(result => {
      this.supportedVoices = result.voices;
      console.log(result.voices.length);
      for (let i = 0; i < this.supportedVoices.length; i++) {
        if(this.supportedVoices[i].lang == "it-IT"){
          this.voice = i;
          break;
        }
      }
    });
    
  }
  

  public async setMessage() {
    this.chatService.addNewMessage({
      msg: this.newMsg,
      name: "Antonio",
      myMsg: true
    })
    console.log(this.first)
    if (this.first) {
      this.url = "https://" + this.newMsg.trim() + ".ngrok.io/chat?question="
      this.getResponse("Salutami")
      console.log("primo messaggio")
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
        this.aiMsg = data[0]
        this.chatService.addNewMessage({
          msg: this.aiMsg,
          name: "AI",
          myMsg: false
        })
        console.log(data[0])
        if(this.chatService.voice && !this.first){
          console.log(this.voice)
          TextToSpeech.stop()
          TextToSpeech.speak({
            text: this.aiMsg,
            lang: 'IT-it',
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            voice: this.voice,
            category: 'ambient'
          })
          }
        
      })).catch((err: HttpErrorResponse) => {
        this.aiMsg = "Codice errato o connessione persa. \nScrivi il codice per collegarti al Public URL";
        this.chatService.addNewMessage({
          msg: this.aiMsg,
          name: "AI",
          myMsg: false
        })
        this.first=true
      })
      .then(() => {
        if(this.chatService.voice && this.first){
          TextToSpeech.speak({
            text: this.aiMsg,
            lang: "IT-it",
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            voice: this.voice,
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

