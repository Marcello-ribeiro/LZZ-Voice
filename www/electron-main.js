const {
    app,
    BrowserWindow,
    desktopCapturer,
    ipcMain,
    session
} = require("electron");

const path = require("path");

app.commandLine.appendSwitch(
    "autoplay-policy",
    "no-user-gesture-required"
);

app.setAppUserModelId(
    "com.lzz.voice"
);

let selectedDisplaySourceId = null;

async function listarFontesDeTela() {
    const sources =
        await desktopCapturer.getSources({
            types: [
                "screen",
                "window"
            ],

            thumbnailSize: {
                width: 320,
                height: 180
            },

            fetchWindowIcons: true
        });

    return sources.map(
        source => ({
            id: source.id,
            name: source.name,

            thumbnail:
                source.thumbnail &&
                !source.thumbnail.isEmpty()
                    ? source.thumbnail
                        .toDataURL()
                    : null,

            appIcon:
                source.appIcon &&
                !source.appIcon.isEmpty()
                    ? source.appIcon
                        .toDataURL()
                    : null
        })
    );
}

ipcMain.handle(
    "lzz-screen:list-sources",
    async () =>
        listarFontesDeTela()
);

ipcMain.handle(
    "lzz-screen:select-source",
    async (
        _event,
        sourceId
    ) => {
        selectedDisplaySourceId =
            typeof sourceId ===
                "string"
                ? sourceId
                : null;

        return Boolean(
            selectedDisplaySourceId
        );
    }
);


ipcMain.handle(
    "lzz-window:set-fullscreen",
    async (
        event,
        enabled
    ) => {
        const janela =
            BrowserWindow.fromWebContents(
                event.sender
            );

        if (!janela) {
            return false;
        }

        janela.setFullScreen(
            Boolean(enabled)
        );

        return janela.isFullScreen();
    }
);

ipcMain.handle(
    "lzz-window:is-fullscreen",
    async event => {
        const janela =
            BrowserWindow.fromWebContents(
                event.sender
            );

        return Boolean(
            janela?.isFullScreen()
        );
    }
);

function configurarPermissoes() {
    session.defaultSession
        .setPermissionRequestHandler(
            (
                _webContents,
                permission,
                callback
            ) => {
                if (
                    permission ===
                        "media" ||
                    permission ===
                        "display-capture"
                ) {
                    callback(true);
                    return;
                }

                callback(false);
            }
        );

    session.defaultSession
        .setPermissionCheckHandler(
            (
                _webContents,
                permission
            ) => {
                return (
                    permission ===
                        "media" ||
                    permission ===
                        "display-capture"
                );
            }
        );

    session.defaultSession
        .setDisplayMediaRequestHandler(
            async (
                _request,
                callback
            ) => {
                try {
                    const sources =
                        await desktopCapturer
                            .getSources({
                                types: [
                                    "screen",
                                    "window"
                                ]
                            });

                    let source =
                        sources.find(
                            item =>
                                item.id ===
                                selectedDisplaySourceId
                        );

                    if (!source) {
                        source =
                            sources.find(
                                item =>
                                    item.id
                                        .startsWith(
                                            "screen:"
                                        )
                            );
                    }

                    if (!source) {
                        source =
                            sources[0];
                    }

                    selectedDisplaySourceId =
                        null;

                    if (!source) {
                        callback({});
                        return;
                    }

                    callback({
                        video: source
                    });
                } catch (error) {
                    console.error(
                        "Erro no compartilhamento de tela:",
                        error
                    );

                    selectedDisplaySourceId =
                        null;

                    callback({});
                }
            }
        );
}

function criarJanela() {
    const janela =
        new BrowserWindow({
            width: 1280,
            height: 760,

            minWidth: 900,
            minHeight: 600,

            backgroundColor:
                "#07111f",

            autoHideMenuBar: true,

            icon:
                path.join(
                    __dirname,
                    "build",
                    "favicon.ico"
                ),

            webPreferences: {
                preload:
                    path.join(
                        __dirname,
                        "preload.js"
                    ),

                backgroundThrottling:
                    false,

                nodeIntegration:
                    false,

                contextIsolation:
                    true
            }
        });

    janela.on(
        "enter-full-screen",
        () => {
            janela.webContents.send(
                "lzz-window:fullscreen-changed",
                true
            );
        }
    );

    janela.on(
        "leave-full-screen",
        () => {
            janela.webContents.send(
                "lzz-window:fullscreen-changed",
                false
            );
        }
    );

    janela.loadFile(
        path.join(
            __dirname,
            "www",
            "index.html"
        )
    );

    janela.setMenuBarVisibility(
        false
    );
}

app.whenReady().then(() => {
    configurarPermissoes();
    criarJanela();

    app.on(
        "activate",
        () => {
            if (
                BrowserWindow
                    .getAllWindows()
                    .length === 0
            ) {
                criarJanela();
            }
        }
    );
});

app.on(
    "window-all-closed",
    () => {
        if (
            process.platform !==
                "darwin"
        ) {
            app.quit();
        }
    }
);
