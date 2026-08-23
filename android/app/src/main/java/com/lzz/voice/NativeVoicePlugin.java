package com.lzz.voice;

import android.Manifest;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;


@CapacitorPlugin(

        name = "NativeVoice",

        permissions = {

                @Permission(

                        alias = "microphone",

                        strings = {
                                Manifest.permission.RECORD_AUDIO
                        }

                )

        }

)

public class NativeVoicePlugin
        extends Plugin {


    private NativeVoiceEngine engine() {

        return NativeVoiceEngine
                .getInstance(
                        getContext()
                );

    }


    /*
     * INICIAR
     */

    @PluginMethod
    public void start(
            PluginCall call
    ) {

        if (
                getPermissionState(
                        "microphone"
                )
                        !=
                PermissionState.GRANTED
        ) {

            requestPermissionForAlias(

                    "microphone",

                    call,

                    "microphonePermissionCallback"

            );

            return;

        }


        iniciarEngine(
                call
        );

    }


    /*
     * RETORNO DA PERMISSÃO
     */

    @PermissionCallback
    private void microphonePermissionCallback(
            PluginCall call
    ) {

        if (
                getPermissionState(
                        "microphone"
                )
                        ==
                PermissionState.GRANTED
        ) {

            iniciarEngine(
                    call
            );

        } else {

            call.reject(
                    "Permissão do microfone negada."
            );

        }

    }


    private void iniciarEngine(
            PluginCall call
    ) {

        try {

            engine().start();

            JSObject resposta =
                    new JSObject();


            resposta.put(
                    "ativo",
                    true
            );


            call.resolve(
                    resposta
            );


        } catch (
                Exception erro
        ) {

            call.reject(

                    "Erro ao iniciar WebRTC nativo: "
                            +
                    erro.getMessage(),

                    erro

            );

        }

    }


    /*
     * MUTE
     */

    @PluginMethod
    public void setMuted(
            PluginCall call
    ) {

        Boolean muted =
                call.getBoolean(
                        "muted"
                );


        if (
                muted == null
        ) {

            call.reject(
                    "Informe muted."
            );

            return;

        }


        engine().setMuted(
                muted
        );


        call.resolve();

    }


    /*
     * STATUS
     */

    @PluginMethod
    public void status(
            PluginCall call
    ) {

        JSObject resposta =
                new JSObject();


        resposta.put(

                "ativo",

                engine()
                        .isStarted()

        );


        call.resolve(
                resposta
        );

    }


    /*
     * PARAR
     */

    @PluginMethod
    public void stop(
            PluginCall call
    ) {

        engine().stop();

        call.resolve();

    }

}