const {
    contextBridge,
    ipcRenderer
} = require("electron");

contextBridge.exposeInMainWorld(
    "lzzDesktop",
    {
        getScreenSources: () =>
            ipcRenderer.invoke(
                "lzz-screen:list-sources"
            ),

        selectScreenSource:
            sourceId =>
                ipcRenderer.invoke(
                    "lzz-screen:select-source",
                    sourceId
                ),

        setFullscreen:
            enabled =>
                ipcRenderer.invoke(
                    "lzz-window:set-fullscreen",
                    Boolean(enabled)
                ),

        isFullscreen: () =>
            ipcRenderer.invoke(
                "lzz-window:is-fullscreen"
            ),

        onFullscreenChange:
            callback => {
                if (
                    typeof callback !==
                    "function"
                ) {
                    return () => {};
                }

                const handler =
                    (_event, enabled) =>
                        callback(
                            Boolean(enabled)
                        );

                ipcRenderer.on(
                    "lzz-window:fullscreen-changed",
                    handler
                );

                return () => {
                    ipcRenderer.removeListener(
                        "lzz-window:fullscreen-changed",
                        handler
                    );
                };
            }
    }
);
