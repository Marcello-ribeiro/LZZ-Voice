package com.lzz.voice;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;


public class CallService extends Service {

    private static final String CHANNEL_ID =
            "lzz_voice_call";

    private static final int NOTIFICATION_ID =
            1001;

    private PowerManager.WakeLock wakeLock;


    @Override
    public void onCreate() {

        super.onCreate();

        criarCanalNotificacao();


        Intent abrirApp =
                new Intent(
                        this,
                        MainActivity.class
                );


        PendingIntent pendingIntent =
                PendingIntent.getActivity(
                        this,
                        0,
                        abrirApp,
                        PendingIntent.FLAG_UPDATE_CURRENT |
                                PendingIntent.FLAG_IMMUTABLE
                );


        Notification notification =
                new NotificationCompat.Builder(
                        this,
                        CHANNEL_ID
                )

                        .setContentTitle(
                                "LZZ Voice"
                        )

                        .setContentText(
                                "Chamada de voz ativa"
                        )

                        .setSmallIcon(
                                android.R.drawable.ic_btn_speak_now
                        )

                        .setContentIntent(
                                pendingIntent
                        )

                        .setOngoing(
                                true
                        )

                        .setCategory(
                                NotificationCompat.CATEGORY_CALL
                        )

                        .setPriority(
                                NotificationCompat.PRIORITY_LOW
                        )

                        .build();


        /*
         * MICROFONE + REPRODUÇÃO DE ÁUDIO
         */

        if (
                Build.VERSION.SDK_INT >=
                        Build.VERSION_CODES.Q
        ) {

            int tiposServico =
                    ServiceInfo
                            .FOREGROUND_SERVICE_TYPE_MICROPHONE
                            |
                    ServiceInfo
                            .FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK;


            startForeground(
                    NOTIFICATION_ID,
                    notification,
                    tiposServico
            );

        } else {

            startForeground(
                    NOTIFICATION_ID,
                    notification
            );
        }


        /*
         * MANTÉM CPU ACORDADA
         * MESMO COM TELA APAGADA
         */

        PowerManager powerManager =
                (PowerManager)
                        getSystemService(
                                POWER_SERVICE
                        );


        wakeLock =
                powerManager.newWakeLock(

                        PowerManager
                                .PARTIAL_WAKE_LOCK,

                        "LZZVoice:CallWakeLock"
                );


        wakeLock.acquire();

    }


    @Override
    public int onStartCommand(
            Intent intent,
            int flags,
            int startId
    ) {

        return START_STICKY;
    }


    @Override
    public void onDestroy() {

        if (
                wakeLock != null &&
                wakeLock.isHeld()
        ) {

            wakeLock.release();
        }


        stopForeground(true);

        super.onDestroy();

    }


    @Nullable
    @Override
    public IBinder onBind(
            Intent intent
    ) {

        return null;
    }


    private void criarCanalNotificacao() {

        if (
                Build.VERSION.SDK_INT >=
                        Build.VERSION_CODES.O
        ) {

            NotificationChannel channel =
                    new NotificationChannel(

                            CHANNEL_ID,

                            "Chamada de voz",

                            NotificationManager
                                    .IMPORTANCE_LOW
                    );


            channel.setDescription(
                    "Mantém a chamada do LZZ Voice ativa"
            );


            NotificationManager manager =
                    getSystemService(
                            NotificationManager.class
                    );


            manager.createNotificationChannel(
                    channel
            );

        }

    }

}