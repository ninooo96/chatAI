import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import {ChatService } from '../../services/chat.service';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
// import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
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
        this.chatService.addNewMessage({
          msg: data,
          name: "AI",
          myMsg: false
        })
        console.log(data)
        setTimeout(() => {
        this.content.scrollToBottom(300)}, 200);
      })).catch((err: HttpErrorResponse) => {
        this.chatService.addNewMessage({
          msg: "Codice errato o connessione persa. \nScrivi il codice per collegarti al Public URL",
          name: "AI",
          myMsg: false
        })
        this.first=true
      })

      if(this.chatService.voice){
        // this.textToSpeech
        // .speak("ciao antonio")
        // .then(() => console.log('Done'))
        // .catch((reason: any) => console.log(reason));
        // TextToSpeech.speak()
      }
    
    }
    
  
}
