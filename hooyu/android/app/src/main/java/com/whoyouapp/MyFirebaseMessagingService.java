package com.whoyouapp;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import android.util.Log;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;



import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;


public class MyFirebaseMessagingService extends FirebaseMessagingService {
  
  private static final String TAG = "MyFirebaseMsgService";

  @Override
  public void onNewToken(String token) {
      Log.d(TAG, "Refreshed token: " + token);
  
      // If you want to send messages to this application instance or
      // manage this apps subscriptions on the server side, send the
      // FCM registration token to your app server.
  }

  @Override
  public void onMessageReceived(RemoteMessage remoteMessage) {

      Log.d(TAG, "메시지 받았습니다.");
      
      //   sendNotification(remoteMessage.getNotification().getBody());
      sendNotification(remoteMessage);
  
    }


  private void sendNotification(RemoteMessage messageBody) {
      Log.d(TAG, "노티드립니다2.");
      Intent intent = new Intent(this, MainActivity.class);
      intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
      PendingIntent pendingIntent = PendingIntent.getActivity(this, 0 /* Request code */, intent,
              PendingIntent.FLAG_ONE_SHOT);
      String channelId = getString(R.string.default_notification_channel_id);
      Uri defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
      
      Bitmap orgImage = BitmapFactory.decodeResource(getResources(), R.drawable.appicon);

      NotificationCompat.Builder notificationBuilder =
              new NotificationCompat.Builder(this, channelId)
                //       .setSmallIcon(R.drawable.icon_custom)
                      .setSmallIcon(R.drawable.notification_icon)
                      .setContentTitle(messageBody.getData().get("title"))
                      .setContentText(messageBody.getData().get("body"))
                      .setPriority(NotificationCompat.PRIORITY_HIGH)
                      .setLargeIcon(orgImage)
                      // .setContentTitle(getString(R.string.fcm_message))
                      // .setContentText(messageBody)
                      .setAutoCancel(true)
                      .setSound(defaultSoundUri)
                      .setContentIntent(pendingIntent);

      NotificationManager notificationManager =
              (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

      // Since android Oreo notification channel is needed.
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          NotificationChannel channel = new NotificationChannel(channelId,
                  "Channel human readable title",
                  NotificationManager.IMPORTANCE_HIGH);
          notificationManager.createNotificationChannel(channel);
      }

      notificationManager.notify(0 /* ID of notification */, notificationBuilder.build());
  }
}