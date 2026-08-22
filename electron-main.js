const {
    app,
    BrowserWindow,
    session
} = require("electron");

const path = require("path");


/*
    Permite áudio remoto sem exigir
    outro clique para começar a tocar.
*/
app.commandLine.appendSwitch(
    "autoplay-policy",
    "no-user-gesture-required"
);


/*
    Ajuda o Windows a associar
    corretamente o ícone ao aplicativo.
*/
app.setAppUserModelId(
    "com.lzz.voice"
);


function criarJanela() {

    const janela =
        new BrowserWindow({

            width: 1280,
            height: 760,

            minWidth: 900,
            minHeight: 600,

            backgroundColor:
                "#07111f",

            autoHideMenuBar:
                true,


            /*
                ÍCONE DO LZZ VOICE
            */
            icon: path.join(
                __dirname,
                "build",
                "favicon.ico"
            ),


            webPreferences: {

                backgroundThrottling:
                    false,

                nodeIntegration:
                    false,

                contextIsolation:
                    true

            }

        });


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


/*
    PERMISSÃO DO MICROFONE
*/

app.whenReady().then(() => {

    session
        .defaultSession
        .setPermissionRequestHandler(
            (
                webContents,
                permission,
                callback
            ) => {

                if (
                    permission ===
                    "media"
                ) {

                    callback(true);

                    return;

                }


                callback(false);

            }
        );


    criarJanela();


    app.on(
        "activate",
        function () {

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
    function () {

        if (
            process.platform !==
            "darwin"
        ) {

            app.quit();

        }

    }
);