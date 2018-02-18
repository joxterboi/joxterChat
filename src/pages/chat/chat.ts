import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';


@IonicPage()
@Component({
  	selector: 'page-chat',
	templateUrl: 'chat.html',
})
export class ChatPage {

	username: string = "";
	message: string = "";
	subscription;
	messages: object[] = [];
	@ViewChild(Content) content: Content;

	constructor(public db: AngularFirestore,
		public navCtrl: NavController, public navParams: NavParams) {
			this.username = this.navParams.get("username");
			this.subscription = this.db.collection('chat').valueChanges().subscribe( data => {
				this.messages= data;			
				this.scrollToBottom()	
			});
	  }
	// Looks if user presses "ENTER" when tring to send message


	  
	//   stringTime: string = Date.now().toString();
	  sendMessage() {			
		  	const stringTime = Date.now().toString();
			this.db.collection('chat').doc(stringTime).set({
				'username': this.username,
				'message': this.message,
				'time': Date.now()
			}).then( () => {
				//Message is now sent
			}).catch( () => {
				// If an arror happens
			});
			this.message="";
		  	this.scrollToBottom()
		}

		ionViewDidLoad() {
			const stringTime = Date.now().toString();
			this.db.collection('chat').doc(stringTime).set({
				specialMessage: true,
				message: this.username + ' has joined the chat'
			})
		}
		ionViewWillLeave() {
			const stringTime = Date.now().toString();
			this.subscription.unsubscribe();
			this.db.collection('chat').doc(stringTime).set({
				specialMessage: true,
				message: this.username + ' has left the chat'
			})
		}

		scrollToBottom() {
			setTimeout(() => {
				this.content.scrollToBottom();
		})
	}
	}