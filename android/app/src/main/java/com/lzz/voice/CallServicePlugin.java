package com.lzz.voice;

import android.content.Intent;

import androidx.core.content.ContextCompat;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;


@CapacitorPlugin(name = "CallService")
public class CallServicePlugin extends Plugin {

    @PluginMethod
    public void start(PluginCall call) {

        Intent intent = new Intent(
                getContext(),
                CallService.class
        );

        ContextCompat.startForegroundService(
                getContext(),
                intent
        );

        call.resolve();
    }


    @PluginMethod
    public void stop(PluginCall call) {

        Intent intent = new Intent(
                getContext(),
                CallService.class
        );

        getContext().stopService(intent);

        call.resolve();
    }
}