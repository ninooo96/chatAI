import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import {ChatService } from '../../services/chat.service';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";



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
  voiceMsg = "";
  recording = false;
  stop = false;

  public supportedVoices: SpeechSynthesisVoice[] = [];

  constructor(public chatService: ChatService, private http: HttpClient) {SpeechRecognition.requestPermissions()}

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
        if(this.supportedVoices[i].lang == "it-IT" || this.supportedVoices[i].lang.includes("ita")){
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
  
  public setVoiceMessage() {
    this.startRecognition()
    console.log("page: " + this.newMsg)
    // this.newMsg = this.chatService.voiceMsg
    
  }

  async startRecognition(){
    const {available} = await SpeechRecognition.available();

    if(available) {
      this.recording=true
      SpeechRecognition.start({
        language: "it-IT",
        popup: false,
        partialResults: false,

      })
      .then((data : any) =>{
        this.newMsg = data.matches[0]
        console.log("speech: " + this.newMsg)
        this.setMessage()
      })

      // SpeechRecognition.addListener("partialResults", (data: any) => {
      //   console.log("partialResults was fired", data.matches);
      //   if(data.matches && data.matches.length > 0) {
      //     this.newMsg = data.matches[0]
          
      //   }})
      // .then(() =>{
      //   this.stop = true
      //   this.newMsg = this.voiceMsg
        // console.log("speech: " + this.newMsg)

        // this.setMessage()
      // });
    }
  }

  async stopRecognition() {
    this.recording = false;
    await SpeechRecognition.stop();
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
          }).finally(() =>{
            if(this.chatService.voice){
              this.setVoiceMessage()
            }
          })
          }
          
      })).catch((err: HttpErrorResponse) => {
        // TextToSpeech.getSupportedLanguages().then((lang: any)  => console.log(lang))
        // TextToSpeech.getSupportedVoices().then((voice: any) => console.log(voice))

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
          }).finally(() =>{
            if(this.chatService.voice){
              this.setVoiceMessage()
            }
          })
      }
      setTimeout(() => {
        this.content.scrollToBottom(300)}, 200);
    })

    setTimeout(() => {
      this.content.scrollToBottom(300)}, 200);

    }
    

    
  
}

