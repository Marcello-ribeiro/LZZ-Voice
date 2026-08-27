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
                )
    }
);
