import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';
import userId from '@salesforce/user/Id';
//confetti
import { loadScript } from "lightning/platformResourceLoader";
import CONFETTI_JS from "@salesforce/resourceUrl/confetti";

export default class Notification extends LightningElement {
    // Rename channelName if a different platform event will fire the event to create a notification
    channelName = '/event/Notification__e';
    isSubscribeDisabled = false;
    isUnsubscribeDisabled = !this.isSubscribeDisabled;
    subscription = {};
    currentUserId;
    confettiEnabled = false;

    connectedCallback() {
        Promise.all([
            loadScript(this, CONFETTI_JS)
        ])
            .catch(error => {
                console.log(error);
            });
    }

    fireConfetti() {
        var end = Date.now() + 150;

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        let interval = setInterval(function () {
            if (Date.now() > end) {
                return clearInterval(interval);
            }

            // To modify the confetti spread, intensity etc., modify these values - use https://www.kirilv.com/canvas-confetti/ to experiment 
            // eslint-disable-next-line no-undef
            confetti({
                particleCount: 200,
                startVelocity: 120,
                spread: 175,
                origin: {
                    y: 1.5
                }
            });
        }, 20);
    }

    // Initializes the component - renderedCallback because connectedCallback was firing before the user id was populated
    renderedCallback() {
        // Register error listener
        this.registerErrorListener();

        // Callback invoked whenever a new event message is received
        const thisReference = this;
        const messageCallback = function (response) {

            let obj = JSON.parse(JSON.stringify(response));
            let recipientId = obj.data.payload.RecipientId__c;
            let confettiEnabled = obj.data.payload.Confetti__c;
            this.currentUserId = userId;

            // Take the parameters set in the process/flow which sent the platform event to construct the toast
            const evt = new ShowToastEvent({
                title: obj.data.payload.Title__c,
                message: obj.data.payload.Message__c,
                variant: obj.data.payload.Variant__c,
                mode: obj.data.payload.Mode__c,
                recordId: obj.data.payload.RecordId__c,
                confetti: obj.data.payload.Confetti__c
            });

            if (recipientId == this.currentUserId) {
                // And then actually send the event off - only if it matches the current user's 18 character id.
                // If using processes, this formula looks like CASESAFEID($User.Id)
                thisReference.dispatchEvent(evt);
                if (confettiEnabled) {
                    thisReference.fireConfetti();
                }
            } else {
                console.log('Event fired but recipient id = ' + recipientId + " did not match userid = " + this.currentUserId + " - please ensure you are using the user's 18 digit id")
            }

        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then(response => {
            // Response contains the subscription information on subscribe call
            this.subscription = response;
        });

    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError(error => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }

}