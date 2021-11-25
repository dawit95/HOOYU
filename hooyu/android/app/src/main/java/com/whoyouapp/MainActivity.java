package com.whoyouapp;

import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import expo.modules.ReactActivityDelegateWrapper;

//추가
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;
import android.util.Log;
import androidx.annotation.NonNull;
import android.widget.Toast;

import android.content.Intent;

public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
SplashScreen.show(this, R.style.SplashScreenTheme);
    setTheme(R.style.AppTheme);
    super.onCreate(null);
    FirebaseMessaging.getInstance().getToken()
      .addOnCompleteListener(new OnCompleteListener<String>() {
        @Override
        public void onComplete(@NonNull Task<String> task) {
          if (!task.isSuccessful()) {
            Log.w("TAG", "Fetching FCM registration token failed", task.getException());
            return;
          }

          String token = task.getResult();

          // Log.d("TAG", "Refreshed token: " + token);
          // Log.d("TAG", "토큰 받았다!");
        }
      });

  }


  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "main";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegateWrapper(
      this,
      new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    });
  }
}
