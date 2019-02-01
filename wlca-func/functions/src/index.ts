import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

const db = admin.firestore();


//Subscription Functions--------------------------------------------------------
 export const subscribeToTopic = functions.https.onCall(
   async (data, context) => {
     await admin.messaging().subscribeToTopic(data.token, data.topic);
 
     return `subscribed to ${data.topic}`;
   }
 );
 
 export const unsubscribeFromTopic = functions.https.onCall(
   async (data, context) => {
     await admin.messaging().unsubscribeFromTopic(data.token, data.topic);
 
     return `unsubscribed from ${data.topic}`;
   }
 );

//OnCreate Functions----------------------------------------------------------
 export const onNoticeCreate = functions.firestore
  .document('{churchId}/cms/notices/{noticesId}')
  .onCreate(async snapshot => {
    const notice = snapshot.data();

    const notification: admin.messaging.Notification = {
      title: 'New Notice from '+ notice.group_name,
      body: notice.title
    };

    const payload: admin.messaging.Message = {
      notification,
      topic: notice.group_id
    };

    return admin.messaging().send(payload);
  });

  export const onEventCreate = functions.firestore
  .document('{churchId}/cms/events/{eventId}')
  .onCreate(async snapshot => {
    const event = snapshot.data();

    const notification: admin.messaging.Notification = {
      title: 'New '+ event.group_name+' Event' ,
      body: event.name
    };

    const payload: admin.messaging.Message = {
      notification,
      topic: event.group_id
    };

    return admin.messaging().send(payload);
  });

  export const onDevotionCreate = functions.firestore
  .document('{churchId}/cms/devotions/{devotionId}')
  .onCreate(async snapshot => {
    const devotion = snapshot.data();

    const notification: admin.messaging.Notification = {
      title: 'New Devotion from '+ devotion.group_name,
      body: devotion.title
    };

    const payload: admin.messaging.Message = {
      notification,
      topic: devotion.group_id
    };

    return admin.messaging().send(payload);
  });

  //End OnCreate Functions----------------------------------------------------------