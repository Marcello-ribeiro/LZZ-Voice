package com.lzz.voice;

import android.content.Context;
import android.media.AudioManager;

import org.webrtc.AudioSource;
import org.webrtc.AudioTrack;
import org.webrtc.MediaConstraints;
import org.webrtc.PeerConnectionFactory;
import org.webrtc.audio.JavaAudioDeviceModule;


public class NativeVoiceEngine {

    private static NativeVoiceEngine instance;

    private static boolean webrtcInicializado =
            false;


    private final Context appContext;


    private PeerConnectionFactory factory;

    private AudioSource audioSource;

    private AudioTrack localAudioTrack;


    private boolean mutado =
            false;


    private int modoAudioAnterior =
            AudioManager.MODE_NORMAL;


    private NativeVoiceEngine(
            Context context
    ) {

        appContext =
                context
                        .getApplicationContext();

    }


    public static synchronized
    NativeVoiceEngine getInstance(
            Context context
    ) {

        if (
                instance == null
        ) {

            instance =
                    new NativeVoiceEngine(
                            context
                    );

        }

        return instance;

    }


    /*
     * INICIA MOTOR NATIVO
     */

    public synchronized void start() {

        if (
                factory != null
        ) {

            return;

        }


        /*
         * ÁUDIO EM MODO DE CHAMADA
         */

        AudioManager audioManager =
                (AudioManager)
                        appContext.getSystemService(
                                Context.AUDIO_SERVICE
                        );


        if (
                audioManager != null
        ) {

            modoAudioAnterior =
                    audioManager.getMode();

            audioManager.setMode(
                    AudioManager.MODE_IN_COMMUNICATION
            );

        }


        /*
         * INICIALIZA WEBRTC
         */

        if (
                !webrtcInicializado
        ) {

            PeerConnectionFactory
                    .InitializationOptions
                    initializationOptions =

                    PeerConnectionFactory
                            .InitializationOptions
                            .builder(
                                    appContext
                            )

                            .setEnableInternalTracer(
                                    false
                            )

                            .createInitializationOptions();


            PeerConnectionFactory.initialize(
                    initializationOptions
            );


            webrtcInicializado =
                    true;

        }


        /*
         * MOTOR DE ÁUDIO NATIVO
         */

        JavaAudioDeviceModule audioDeviceModule =
                JavaAudioDeviceModule
                        .builder(
                                appContext
                        )

                        .setUseHardwareAcousticEchoCanceler(
                                true
                        )

                        .setUseHardwareNoiseSuppressor(
                                true
                        )

                        .createAudioDeviceModule();


        factory =
                PeerConnectionFactory
                        .builder()

                        .setAudioDeviceModule(
                                audioDeviceModule
                        )

                        .createPeerConnectionFactory();


        /*
         * Factory já mantém sua própria referência.
         */

        audioDeviceModule.release();


        /*
         * MICROFONE
         */

        MediaConstraints constraints =
                new MediaConstraints();


        constraints.optional.add(

                new MediaConstraints
                        .KeyValuePair(

                        "googEchoCancellation",
                        "true"

                )

        );


        constraints.optional.add(

                new MediaConstraints
                        .KeyValuePair(

                        "googNoiseSuppression",
                        "true"

                )

        );


        constraints.optional.add(

                new MediaConstraints
                        .KeyValuePair(

                        "googAutoGainControl",
                        "true"

                )

        );


        audioSource =
                factory.createAudioSource(
                        constraints
                );


        localAudioTrack =
                factory.createAudioTrack(

                        "LZZ_AUDIO_TRACK",

                        audioSource
                );


        localAudioTrack.setEnabled(
                !mutado
        );

    }


    /*
     * MUTE
     */

    public synchronized void setMuted(
            boolean value
    ) {

        mutado =
                value;


        if (
                localAudioTrack != null
        ) {

            localAudioTrack.setEnabled(
                    !mutado
            );

        }

    }


    public synchronized boolean isStarted() {

        return factory != null;

    }


    public synchronized PeerConnectionFactory
    getFactory() {

        return factory;

    }


    public synchronized AudioTrack
    getLocalAudioTrack() {

        return localAudioTrack;

    }


    /*
     * ENCERRA MOTOR
     */

    public synchronized void stop() {

        if (
                localAudioTrack != null
        ) {

            localAudioTrack.dispose();

            localAudioTrack =
                    null;

        }


        if (
                audioSource != null
        ) {

            audioSource.dispose();

            audioSource =
                    null;

        }


        if (
                factory != null
        ) {

            factory.dispose();

            factory =
                    null;

        }


        AudioManager audioManager =
                (AudioManager)
                        appContext.getSystemService(
                                Context.AUDIO_SERVICE
                        );


        if (
                audioManager != null
        ) {

            audioManager.setMode(
                    modoAudioAnterior
            );

        }

    }

}