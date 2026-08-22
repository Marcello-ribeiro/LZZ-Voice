const SUPABASE_URL = "https://jjkypbiyvhwqeztbztnx.supabase.co";

const SUPABASE_KEY = "sb_publishable_w-vZeqvzEWr_itftzILJoQ_NbXWky8y";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =====================================
   ELEMENTOS
===================================== */

const btnEntrar =
    document.getElementById("btnEntrar");

const btnMute =
    document.getElementById("btnMute");

const btnAudio =
    document.getElementById("btnAudio");

const btnSair =
    document.getElementById("btnSair");

const statusSala =
    document.getElementById("status");

const usersGrid =
    document.getElementById("usersGrid");

const usuariosCanal =
    document.getElementById("usuariosCanal");

const profileMic =
    document.getElementById("profileMic");

const profileAudio =
    document.getElementById("profileAudio");

const nomeCanal =
    document.getElementById("nomeCanal");

const tituloSala =
    document.getElementById("tituloSala");

const miniCanalNome = 
    document.getElementById("miniCanalNome");

const miniStatus = 
document.getElementById("miniStatus");


/* =====================================
   CONFIGURAÇÕES
===================================== */

let conectado = false;

let mutado = false;

let audioSilenciado = false;

let canalAtual = "Geral";

let streamMicrofone = null;

let canalSupabase = null;


/* =====================================
   SERVIÇO ANDROID DA CALL
===================================== */

async function iniciarServicoCall() {

    try {

        const plugin =
            window.Capacitor?.Plugins?.CallService;

        if (!plugin) {

            console.log(
                "CallService só existe no app Android."
            );

            return;
        }

        await plugin.start();

        console.log(
            "CallService iniciado."
        );

    } catch (erro) {

        console.error(
            "Erro ao iniciar CallService:",
            erro
        );
    }
}


async function pararServicoCall() {

    try {

        const plugin =
            window.Capacitor?.Plugins?.CallService;

        if (!plugin) {
            return;
        }

        await plugin.stop();

        console.log(
            "CallService parado."
        );

    } catch (erro) {

        console.error(
            "Erro ao parar CallService:",
            erro
        );
    }
}


/*
    Cada PC recebe um ID diferente.
*/

const meuId =
    crypto.randomUUID();


/*
    Por enquanto vamos pedir o nome
    quando o app abrir.
*/

let meuNome =
    "Usuário";

let meuAvatar =
    null;

let meuPerfil =
    null;


/*
    Aqui ficam as conexões
    com cada amigo.
*/

const peers = new Map();


/*
    Aqui ficam os elementos de áudio
    de cada amigo.
*/

const audiosRemotos = new Map();


/*
    ICE candidates que chegarem
    antes da hora.
*/

/* ======================================
   LOGIN / CADASTRO
====================================== */

const authScreen =
    document.getElementById(
        "authScreen"
    );

const appPrincipal =
    document.getElementById(
        "appPrincipal"
    );

const loginForm =
    document.getElementById(
        "loginForm"
    );

const cadastroForm =
    document.getElementById(
        "cadastroForm"
    );

const tabLogin =
    document.getElementById(
        "tabLogin"
    );

const tabCadastro =
    document.getElementById(
        "tabCadastro"
    );

const authMessage =
    document.getElementById(
        "authMessage"
    );

const cadastroAvatar =
    document.getElementById(
        "cadastroAvatar"
    );

const avatarPreview =
    document.getElementById(
        "avatarPreview"
    );

const avatarPreviewText =
    document.getElementById(
        "avatarPreviewText"
    );

const profileAvatar =
    document.getElementById(
        "profileAvatar"
    );

const profileInitial =
    document.getElementById(
        "profileInitial"
    );

const profileUsername =
    document.getElementById(
        "profileUsername"
    );

const btnLogout =
    document.getElementById(
        "btnLogout"
    );


/* TROCAR ENTRE LOGIN E CADASTRO */

tabLogin.addEventListener(
    "click",
    function () {

        loginForm.classList.remove(
            "hidden"
        );

        cadastroForm.classList.add(
            "hidden"
        );

        tabLogin.classList.add(
            "ativo"
        );

        tabCadastro.classList.remove(
            "ativo"
        );

        authMessage.textContent =
            "";

    }
);


tabCadastro.addEventListener(
    "click",
    function () {

        cadastroForm.classList.remove(
            "hidden"
        );

        loginForm.classList.add(
            "hidden"
        );

        tabCadastro.classList.add(
            "ativo"
        );

        tabLogin.classList.remove(
            "ativo"
        );

        authMessage.textContent =
            "";

    }
);


/* PREVIEW DA FOTO */

cadastroAvatar.addEventListener(
    "change",
    function () {

        const arquivo =
            cadastroAvatar.files[0];

        if (!arquivo) {
            return;
        }

        const url =
            URL.createObjectURL(
                arquivo
            );

        avatarPreview.style.backgroundImage =
            `url("${url}")`;

        avatarPreviewText.style.display =
            "none";

    }
);


/* ======================================
   CADASTRO
====================================== */

cadastroForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const username =
            document
                .getElementById(
                    "cadastroUsername"
                )
                .value
                .trim();


        const email =
            document
                .getElementById(
                    "cadastroEmail"
                )
                .value
                .trim();


        const senha =
            document
                .getElementById(
                    "cadastroSenha"
                )
                .value;


        const confirmarSenha =
            document
                .getElementById(
                    "cadastroConfirmarSenha"
                )
                .value;


        if (
            senha !==
            confirmarSenha
        ) {

            authMessage.textContent =
                "As senhas não são iguais.";

            return;
        }


        authMessage.textContent =
            "Criando conta...";


        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signUp({

                    email:
                        email,

                    password:
                        senha,

                    options: {

                        data: {
                            username:
                                username
                        }

                    }

                });


        if (error) {

            console.error(error);

            authMessage.textContent =
                error.message;

            return;
        }


        if (!data.user) {

            authMessage.textContent =
                "Erro ao criar usuário.";

            return;
        }


        /*
            ENVIA FOTO
        */

        const arquivo =
            cadastroAvatar.files[0];


        if (
            arquivo &&
            data.session
        ) {

            await salvarAvatar(
                data.user,
                arquivo
            );

        }


        authMessage.style.color =
            "#65eaa6";

        authMessage.textContent =
            "Conta criada!";


        await iniciarUsuario(
            data.user
        );

    }
);


/* ======================================
   LOGIN
====================================== */

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById(
                    "loginEmail"
                )
                .value
                .trim();


        const senha =
            document
                .getElementById(
                    "loginSenha"
                )
                .value;


        authMessage.textContent =
            "Entrando...";


        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signInWithPassword({

                    email:
                        email,

                    password:
                        senha

                });


     if (error) {

    console.error(
        "ERRO LOGIN:",
        error
    );

    authMessage.textContent =
        error.message;

    return;
}


        await iniciarUsuario(
            data.user
        );

    }
);


/* ======================================
   SALVAR AVATAR
====================================== */

async function salvarAvatar(
    usuario,
    arquivo
) {

    const extensao =
        arquivo.name
            .split(".")
            .pop();


    const caminho =
        `${usuario.id}/avatar-${Date.now()}.${extensao}`;


    const {
        error
    } =
        await supabaseClient
            .storage
            .from("avatars")
            .upload(
                caminho,
                arquivo
            );


    if (error) {

        console.error(
            "Erro no avatar:",
            error
        );

        return;
    }


    const {
        data
    } =
        supabaseClient
            .storage
            .from("avatars")
            .getPublicUrl(
                caminho
            );


    const avatarUrl =
        data.publicUrl;


    await supabaseClient
        .from("perfis")
        .update({

            avatar_url:
                avatarUrl

        })
        .eq(
            "id",
            usuario.id
        );

}


/* ======================================
   CARREGAR PERFIL
====================================== */

async function iniciarUsuario(
    usuario
) {

    const {
        data,
        error
    } =
        await supabaseClient

            .from("perfis")

            .select(
                "id, username, avatar_url"
            )

            .eq(
                "id",
                usuario.id
            )

            .single();


    if (error) {

        console.error(
            "Erro ao carregar perfil:",
            error
        );

        return;
    }


    meuPerfil =
        data;


    meuNome =
        data.username;


    meuAvatar =
        data.avatar_url;


    atualizarPerfilVisual();


    authScreen.classList.add(
        "hidden"
    );


    appPrincipal.classList.remove(
        "hidden"
    );

}


/* ======================================
   MOSTRAR PERFIL
====================================== */

function atualizarPerfilVisual() {

    profileUsername.textContent =
        meuNome;


    profileInitial.textContent =
        meuNome
            .charAt(0)
            .toUpperCase();


if (meuAvatar) {

    profileAvatar.style.backgroundImage =
        `url("${meuAvatar}")`;

    profileAvatar.classList.add("tem-foto");

    profileInitial.style.display = "none";

} else {

    profileAvatar.style.backgroundImage =
        "none";

    profileAvatar.classList.remove("tem-foto");

    profileInitial.style.display = "block";
}

}


/* ======================================
   LOGOUT
====================================== */

btnLogout.addEventListener(
    "click",
    async function () {

        /*
            SE ESTIVER EM CALL,
            SAI PRIMEIRO.
        */

        if (conectado) {

            await sairDaSala();

        }


        await supabaseClient
            .auth
            .signOut();


        meuPerfil =
            null;

        meuNome =
            "Usuário";

        meuAvatar =
            null;


        appPrincipal.classList.add(
            "hidden"
        );


        authScreen.classList.remove(
            "hidden"
        );

    }
);


/* ======================================
   VER SE JÁ ESTAVA LOGADO
====================================== */

async function verificarLogin() {

    const {
        data
    } =
        await supabaseClient
            .auth
            .getSession();


    if (
        data.session
    ) {

        await iniciarUsuario(
            data.session.user
        );

    }

}


verificarLogin();

const candidatesPendentes =
    new Map();

    const monitoresFala =
    new Map();


/* =====================================
   CONFIGURAÇÃO WEBRTC
===================================== */

const rtcConfig = {

    iceServers: [

        {
            urls:
                "stun:stun.l.google.com:19302"
        }

    ]

};


/* =====================================
   ENTRAR NA SALA
===================================== */

btnEntrar.addEventListener(
    "click",
    async function () {

        try {

            statusSala.textContent =
                "Ativando microfone...";


            /*
                PEGA O MICROFONE
            */

            streamMicrofone =
                await navigator.mediaDevices
                    .getUserMedia({

                        audio: {

                            echoCancellation: true,

                            noiseSuppression: true,

                            autoGainControl: true

                        }

                    });


            statusSala.textContent =
                "Conectando à sala...";


            /*
                CONECTA AO SUPABASE
            */

            await entrarNoCanal();


           conectado = true;

            statusSala.textContent =
                `Conectado em ${canalAtual}`;

            miniStatus.textContent = "Conectado";


            btnEntrar.style.display =
                "none";


            btnMute.disabled = false;

            btnAudio.disabled = false;

            btnSair.disabled = false;


mostrarMeuUsuario();

monitorarFala(
    streamMicrofone,
    meuId
);

await iniciarServicoCall();


        } catch (erro) {

            console.error(
                "Erro:",
                erro
            );


            statusSala.textContent =
                `Erro: ${erro.message}`;


            alert(
                "Não foi possível entrar na sala."
            );

        }

    }
);


/* =====================================
   SUPABASE REALTIME
===================================== */

function entrarNoCanal() {

    return new Promise(
        function (resolve, reject) {

            const nomeSala =
                "voz-" +
                canalAtual
                    .toLowerCase();


            canalSupabase =
                supabaseClient.channel(
                    nomeSala,
                    {

                        config: {

                            presence: {

                                key: meuId

                            }

                        }

                    }
                );


            /*
                RECEBER SINALIZAÇÃO
            */

            canalSupabase.on(

                "broadcast",

                {
                    event: "webrtc"
                },

                async function (mensagem) {

                    const dados =
                        mensagem.payload;


                    /*
                        Ignora mensagens
                        para outro usuário.
                    */

                    if (
                        dados.destino &&
                        dados.destino !== meuId
                    ) {

                        return;

                    }


                    /*
                        Ignora nossa própria
                        mensagem.
                    */

                    if (
                        dados.origem === meuId
                    ) {

                        return;

                    }


                    await receberSinal(
                        dados
                    );

                }

            );


            /*
                QUANDO ALGUÉM ENTRA
                OU SAI
            */

            canalSupabase.on(

                "presence",

                {
                    event: "sync"
                },

                async function () {

                    atualizarUsuarios();

                    await conectarNovosUsuarios();

                }

            );


            canalSupabase.on(

                "presence",

                {
                    event: "leave"
                },

                function (dados) {

                    console.log(
                        "Usuário saiu:",
                        dados
                    );


                    atualizarUsuarios();

                }

            );


            /*
                CONECTAR AO CANAL
            */

            canalSupabase.subscribe(

                async function (status) {

                    console.log(
                        "Supabase:",
                        status
                    );


                    if (
                        status ===
                        "SUBSCRIBED"
                    ) {

                      await canalSupabase.track({

    id:
        meuId,

    nome:
        meuNome,

    avatar_url:
        meuAvatar,

    online_at:
        new Date()
            .toISOString()

});


                        resolve();

                    }


                    if (
                        status ===
                        "CHANNEL_ERROR"
                    ) {

                        reject(
                            new Error(
                                "Erro no Supabase."
                            )
                        );

                    }

                }

            );

        }

    );

}


/* =====================================
   ENCONTRAR OUTROS USUÁRIOS
===================================== */

async function conectarNovosUsuarios() {

    if (!canalSupabase) return;


    const estado =
        canalSupabase.presenceState();


    const ids =
        Object.keys(estado);


    for (const id of ids) {


        /*
            Não conecta com você mesmo.
        */

        if (id === meuId) {

            continue;

        }


        /*
            Se já existe conexão,
            não cria outra.
        */

        if (peers.has(id)) {

            continue;

        }


        /*
            Para evitar os dois PCs
            criando oferta ao mesmo tempo,
            apenas quem possuir o menor ID
            começa.
        */

        if (meuId < id) {

            await criarOferta(id);

        }

    }

}

/* =====================================
   DETECTAR QUEM ESTÁ FALANDO
===================================== */

function monitorarFala(stream, usuarioId) {

    if (monitoresFala.has(usuarioId)) {
        return;
    }

    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

    const audioContext =
        new AudioContextClass();

    const analyser =
        audioContext.createAnalyser();

    const source =
        audioContext.createMediaStreamSource(
            stream
        );

    analyser.fftSize = 512;

    analyser.smoothingTimeConstant = 0.65;

    source.connect(analyser);

    const dados =
        new Uint8Array(
            analyser.fftSize
        );

    let animationId = null;

    let ultimoSom = 0;


    function analisar() {

        analyser.getByteTimeDomainData(
            dados
        );

        let soma = 0;

        for (
            let i = 0;
            i < dados.length;
            i++
        ) {

            const valor =
                (dados[i] - 128) / 128;

            soma +=
                valor * valor;

        }

        const volume =
            Math.sqrt(
                soma /
                dados.length
            );


        // SENSIBILIDADE
        const estaFalando =
            volume > 0.025;


        const agora =
            Date.now();


        if (estaFalando) {
            ultimoSom = agora;
        }


        const falando =
            agora - ultimoSom < 220;


        const card =
            document.querySelector(
                `[data-user-id="${usuarioId}"]`
            );


        if (card) {

            card.classList.toggle(
                "falando",
                falando
            );

        }


        animationId =
            requestAnimationFrame(
                analisar
            );

    }


    analisar();


    monitoresFala.set(
        usuarioId,
        {
            parar: function () {

                if (animationId) {

                    cancelAnimationFrame(
                        animationId
                    );

                }

                source.disconnect();

                audioContext.close();

                monitoresFala.delete(
                    usuarioId
                );

            }
        }
    );

}


/* =====================================
   CRIAR PEER CONNECTION
===================================== */

function criarPeer(remoteId) {

    if (
        peers.has(remoteId)
    ) {

        return peers.get(remoteId);

    }


    const pc =
        new RTCPeerConnection(
            rtcConfig
        );


    /*
        COLOCA NOSSO MICROFONE
        NA CONEXÃO
    */

    streamMicrofone
        .getTracks()
        .forEach(function (track) {

            pc.addTrack(
                track,
                streamMicrofone
            );

        });


    /*
        ICE CANDIDATES
    */

    pc.onicecandidate =
        function (event) {

            if (
                event.candidate
            ) {

                enviarSinal({

                    tipo: "candidate",

                    destino:
                        remoteId,

                    candidate:
                        event.candidate

                });

            }

        };


    /*
        ÁUDIO DO AMIGO
    */

    pc.ontrack =
        function (event) {

            console.log(
                "Recebendo áudio de:",
                remoteId
            );


            monitorarFala(
                    event.streams[0],
                    remoteId
                );

            let audio =
                audiosRemotos.get(
                    remoteId
                );


            if (!audio) {

                audio =
                    document.createElement(
                        "audio"
                    );


                audio.autoplay = true;

                audio.playsInline = true;


                /*
                    Se apertar silenciar,
                    o áudio remoto fica mudo.
                */

                audio.muted =
                    audioSilenciado;


                document.body.appendChild(
                    audio
                );


                audiosRemotos.set(
                    remoteId,
                    audio
                );

            }


            audio.srcObject =
                event.streams[0];


            audio.play()
                .catch(function (erro) {

                    console.log(
                        "Autoplay:",
                        erro
                    );

                });

        };


    /*
        ESTADO DA CONEXÃO
    */

    pc.onconnectionstatechange =
        function () {

            console.log(
                remoteId,
                pc.connectionState
            );


            atualizarStatusConexao();


            if (

                pc.connectionState ===
                "failed" ||

                pc.connectionState ===
                "closed"

            ) {

                removerPeer(
                    remoteId
                );

            }

        };


    peers.set(
        remoteId,
        pc
    );


    return pc;

}


/* =====================================
   CRIAR OFERTA
===================================== */

async function criarOferta(
    remoteId
) {

    console.log(
        "Criando oferta para:",
        remoteId
    );


    const pc =
        criarPeer(remoteId);


    const oferta =
        await pc.createOffer();


    await pc.setLocalDescription(
        oferta
    );


    await enviarSinal({

        tipo: "offer",

        destino:
            remoteId,

        sdp:
            pc.localDescription

    });

}


/* =====================================
   RECEBER SINAL
===================================== */

async function receberSinal(
    dados
) {

    const remoteId =
        dados.origem;


    let pc =
        peers.get(
            remoteId
        );


    /*
        RECEBEU UMA OFERTA
    */

    if (
        dados.tipo === "offer"
    ) {

        if (!pc) {

            pc =
                criarPeer(
                    remoteId
                );

        }


        await pc.setRemoteDescription(
            dados.sdp
        );


        await adicionarCandidatesPendentes(
            remoteId,
            pc
        );


        const resposta =
            await pc.createAnswer();


        await pc.setLocalDescription(
            resposta
        );


        await enviarSinal({

            tipo: "answer",

            destino:
                remoteId,

            sdp:
                pc.localDescription

        });

    }


    /*
        RECEBEU RESPOSTA
    */

    if (
        dados.tipo === "answer"
    ) {

        if (!pc) return;


        await pc.setRemoteDescription(
            dados.sdp
        );


        await adicionarCandidatesPendentes(
            remoteId,
            pc
        );

    }


    /*
        RECEBEU ICE CANDIDATE
    */

    if (
        dados.tipo ===
        "candidate"
    ) {

        if (!pc) {

            salvarCandidatePendente(
                remoteId,
                dados.candidate
            );

            return;

        }


        if (
            !pc.remoteDescription
        ) {

            salvarCandidatePendente(
                remoteId,
                dados.candidate
            );

            return;

        }


        try {

            await pc.addIceCandidate(
                dados.candidate
            );

        } catch (erro) {

            console.error(
                "Erro ICE:",
                erro
            );

        }

    }

}


/* =====================================
   CANDIDATES PENDENTES
===================================== */

function salvarCandidatePendente(
    remoteId,
    candidate
) {

    if (
        !candidatesPendentes.has(
            remoteId
        )
    ) {

        candidatesPendentes.set(
            remoteId,
            []
        );

    }


    candidatesPendentes
        .get(remoteId)
        .push(candidate);

}


async function adicionarCandidatesPendentes(
    remoteId,
    pc
) {

    const lista =
        candidatesPendentes.get(
            remoteId
        );


    if (!lista) return;


    for (
        const candidate of lista
    ) {

        try {

            await pc.addIceCandidate(
                candidate
            );

        } catch (erro) {

            console.error(
                erro
            );

        }

    }


    candidatesPendentes.delete(
        remoteId
    );

}


/* =====================================
   ENVIAR SINAL
===================================== */

async function enviarSinal(
    dados
) {

    if (!canalSupabase) return;


    await canalSupabase.send({

        type: "broadcast",

        event: "webrtc",

        payload: {

            ...dados,

            origem:
                meuId,

            nome:
                meuNome

        }

    });

}


/* =====================================
   USUÁRIOS ONLINE
===================================== */

function atualizarUsuarios() {

    if (!canalSupabase) return;


    const estado =
        canalSupabase.presenceState();


    let htmlSidebar = "";

    let htmlCards = "";


    Object.keys(estado).forEach(function (id) {

        const presencas =
            estado[id];


        if (
            !presencas ||
            presencas.length === 0
        ) {
            return;
        }


        const usuario =
            presencas[0];


        const nome =
            usuario.nome ||
            "Usuário";


        const avatar =
            usuario.avatar_url ||
            null;


        const letra =
            nome
                .charAt(0)
                .toUpperCase();


        /* =============================
           USUÁRIO NA BARRA ESQUERDA
        ============================= */

        htmlSidebar += `

            <div class="usuario-canal">

                <div
                    class="avatar-canal ${avatar ? "tem-foto" : ""}"
                    ${
                        avatar
                            ? `style="background-image: url('${avatar}');"`
                            : ""
                    }
                >
                    ${avatar ? "" : letra}
                </div>

                <span class="usuario-canal-nome">
                    ${nome}
                </span>

            </div>

        `;


        /* =============================
           CARD GRANDE DA CALL
        ============================= */

        htmlCards += `

            <div
                class="user-card"
                data-user-id="${id}"
            >

                <div
                    class="user-avatar ${avatar ? "tem-foto" : ""}"
                    ${
                        avatar
                            ? `style="background-image: url('${avatar}');"`
                            : ""
                    }
                >
                    ${avatar ? "" : letra}
                </div>


                <span class="user-name">
                    ${nome}
                </span>


                <div class="user-mic">
                    🎙️
                </div>

            </div>

        `;

    });


    usuariosCanal.innerHTML =
        htmlSidebar;


    if (htmlCards) {

        usersGrid.innerHTML =
            htmlCards;

    } else {

        usersGrid.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    🎧
                </div>

                <h2>
                    Ninguém conectado
                </h2>

                <p>
                    Entre na sala para começar.
                </p>

            </div>

        `;

    }

}


/* =====================================
   MOSTRAR MEU USUÁRIO
===================================== */

function mostrarMeuUsuario() {

    atualizarUsuarios();

}


/* =====================================
   STATUS
===================================== */

function atualizarStatusConexao() {

    let conectados = 0;


    peers.forEach(
        function (pc) {

            if (
                pc.connectionState ===
                "connected"
            ) {

                conectados++;

            }

        }
    );


    if (conectados === 0) {

        statusSala.textContent =
            `Conectado em ${canalAtual} - aguardando amigos...`;

    } else {

        statusSala.textContent =
            `🔊 ${conectados + 1} pessoas conectadas`;

    }

}


/* =====================================
   MUTE
===================================== */

btnMute.addEventListener(
    "click",
    alternarMute
);


profileMic.addEventListener(
    "click",
    function () {

        if (!conectado) return;

        alternarMute();

    }
);


function alternarMute() {

    mutado = !mutado;


    if (
        streamMicrofone
    ) {

        streamMicrofone
            .getAudioTracks()
            .forEach(
                function (track) {

                    track.enabled =
                        !mutado;

                }
            );

    }


    if (mutado) {

        btnMute.textContent =
            "🔇";

        profileMic.textContent =
            "🔇";

        btnMute.classList.add(
            "ativo"
        );

    } else {

        btnMute.textContent =
            "🎙️";

        profileMic.textContent =
            "🎙️";

        btnMute.classList.remove(
            "ativo"
        );

    }

}


/* =====================================
   SILENCIAR OS OUTROS
===================================== */

btnAudio.addEventListener(
    "click",
    alternarAudio
);


profileAudio.addEventListener(
    "click",
    function () {

        if (!conectado) return;

        alternarAudio();

    }
);


function alternarAudio() {

    audioSilenciado =
        !audioSilenciado;


    audiosRemotos.forEach(
        function (audio) {

            audio.muted =
                audioSilenciado;

        }
    );


    if (
        audioSilenciado
    ) {

        btnAudio.textContent =
            "🔇";

        profileAudio.textContent =
            "🔇";

        btnAudio.classList.add(
            "ativo"
        );

    } else {

        btnAudio.textContent =
            "🎧";

        profileAudio.textContent =
            "🎧";

        btnAudio.classList.remove(
            "ativo"
        );

    }

}


/* =====================================
   REMOVER PEER
===================================== */

function removerPeer(
    remoteId
) {

    const pc =
        peers.get(
            remoteId
        );


    if (pc) {

        pc.close();

        peers.delete(
            remoteId
        );


        const monitor =
    monitoresFala.get(
        remoteId
    );

if (monitor) {
    monitor.parar();
}

    }


    const audio =
        audiosRemotos.get(
            remoteId
        );


    if (audio) {

        audio.remove();

        audiosRemotos.delete(
            remoteId
        );

    }


    candidatesPendentes.delete(
        remoteId
    );

}


/* =====================================
   SAIR DA SALA
===================================== */

btnSair.addEventListener(
    "click",
    sairDaSala
);


async function sairDaSala() {

    conectado = false;

    await pararServicoCall();


    /*
        FECHA AS CONEXÕES
    */

    peers.forEach(
        function (pc) {

            pc.close();

        }
    );


    peers.clear();

    monitoresFala.forEach(
    function (monitor) {
        monitor.parar();
    }
);

monitoresFala.clear();


    /*
        REMOVE ÁUDIOS
    */

    audiosRemotos.forEach(
        function (audio) {

            audio.remove();

        }
    );


    audiosRemotos.clear();


    /*
        DESLIGA MICROFONE
    */

    if (
        streamMicrofone
    ) {

        streamMicrofone
            .getTracks()
            .forEach(
                function (track) {

                    track.stop();

                }
            );


        streamMicrofone =
            null;

    }


    /*
        SAI DO SUPABASE
    */

    if (
        canalSupabase
    ) {

        await canalSupabase.untrack();

        await supabaseClient
            .removeChannel(
                canalSupabase
            );


        canalSupabase =
            null;

    }


    usersGrid.innerHTML = `

        <div class="empty-state">

            <div class="empty-state-icon">
                🎧
            </div>

            <h2>
                Ninguém conectado
            </h2>

            <p>
                Entre na sala para começar.
            </p>

        </div>

    `;


    usuariosCanal.innerHTML =
        "";


    statusSala.textContent =
        "Você não está conectado.";

        miniStatus.textContent = "Offline";


    btnEntrar.style.display =
        "block";


    btnMute.disabled = true;

    btnAudio.disabled = true;

    btnSair.disabled = true;


    mutado = false;

    audioSilenciado = false;


    btnMute.textContent =
        "🎙️";

    btnAudio.textContent =
        "🎧";

}


/* =====================================
   CANAIS
===================================== */

/* =====================================
   CANAIS DE VOZ
===================================== */

const canais =
    document.querySelectorAll(
        ".voice-channel"
    );


canais.forEach(function (canal) {

    canal.addEventListener(
        "click",
        function () {

            const canalClicado =
                canal.dataset.canal;


            /*
                Se eu estiver conectado
                e clicar no MESMO canal,
                só volta para a tela da voz.
            */

            if (
                conectado &&
                canalClicado === canalAtual
            ) {

                mostrarVoz();

                return;

            }


            /*
                Se estiver conectado e tentar
                trocar para outra sala.
            */

            if (
                conectado &&
                canalClicado !== canalAtual
            ) {

                alert(
                    "Saia da call antes de trocar de canal."
                );

                return;

            }


            /*
                Mostra a interface de voz.
            */

            mostrarVoz();


            /*
                Remove seleção dos outros canais.
            */

            document
                .querySelectorAll(".channel")
                .forEach(function (item) {

                    item.classList.remove(
                        "ativo"
                    );

                });


            canal.classList.add(
                "ativo"
            );


            canalAtual =
                canalClicado;


            nomeCanal.textContent =
                canalAtual;


            tituloSala.textContent =
                canalAtual;


            miniCanalNome.textContent =
                canalAtual;

        }
    );

});

/* ==========================================
   CHAT DE TEXTO
========================================== */

const textChannels =
    document.querySelectorAll(".text-channel");


const textView =
    document.getElementById("textView");


const voiceHero =
    document.getElementById("voiceHero");


const voiceContent =
    document.getElementById("voiceContent");


const voiceCallbar =
    document.getElementById("voiceCallbar");


const chatCanalNome =
    document.getElementById("chatCanalNome");


const welcomeTitle =
    document.getElementById("welcomeTitle");


const messages =
    document.getElementById("messages");


const chatForm =
    document.getElementById("chatForm");


const chatInput =
    document.getElementById("chatInput");


let canalTextoAtual = null;

let realtimeTexto = null;

const mensagensExibidas =
    new Set();


/* ==========================================
   CLICAR EM CANAL DE TEXTO
========================================== */

textChannels.forEach(function (canal) {

    canal.addEventListener(
        "click",
        async function () {

            const nome =
                canal.dataset.canal;


            canalTextoAtual =
                nome;


            document
                .querySelectorAll(".channel")
                .forEach(function (item) {

                    item.classList.remove("ativo");

                });


            canal.classList.add("ativo");


            mostrarChat();


            chatCanalNome.textContent =
                nome;


            welcomeTitle.textContent =
                `Bem-vindo ao #${nome}`;


            chatInput.placeholder =
                `Mensagem em #${nome}`;


            await carregarMensagens(nome);


            conectarChatTempoReal(nome);

        }
    );

});


/* ==========================================
   MOSTRAR CHAT
========================================== */

function mostrarChat() {

    voiceHero.classList.add("hidden");

    voiceContent.classList.add("hidden");

    voiceCallbar.classList.add("hidden");


    textView.classList.remove("hidden");

}


/* ==========================================
   MOSTRAR VOZ
========================================== */

function mostrarVoz() {

    textView.classList.add("hidden");


    voiceHero.classList.remove("hidden");

    voiceContent.classList.remove("hidden");

    voiceCallbar.classList.remove("hidden");

}


/* ==========================================
   CARREGAR HISTÓRICO
========================================== */

async function carregarMensagens(canal) {

    messages.innerHTML = `
        <div class="chat-welcome">

            <div class="welcome-icon">
                #
            </div>

            <h2>
                Bem-vindo ao #${canal}
            </h2>

            <p>
                Este é o começo deste canal.
            </p>

        </div>
    `;


    mensagensExibidas.clear();


    const { data, error } =
        await supabaseClient

            .from("mensagens")

            .select(
                "id, canal, autor, texto, criado_em"
            )

            .eq(
                "canal",
                canal
            )

            .order(
                "criado_em",
                {
                    ascending: false
                }
            )

            .limit(100);


    if (error) {

        console.error(
            "Erro ao carregar mensagens:",
            error
        );

        return;

    }


    const lista =
        [...data].reverse();


    lista.forEach(function (mensagem) {

        adicionarMensagem(
            mensagem,
            false
        );

    });


    rolarChat();

}


/* ==========================================
   ENVIAR MENSAGEM
========================================== */

chatForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!canalTextoAtual) {

            return;

        }


        const texto =
            chatInput.value.trim();


        if (!texto) {

            return;

        }


        chatInput.value = "";


        const novaMensagem = {

            canal:
                canalTextoAtual,

            autor:
                meuNome,

            texto:
                texto

        };


        const { data, error } =
            await supabaseClient

                .from("mensagens")

                .insert(
                    novaMensagem
                )

                .select()

                .single();


        if (error) {

            console.error(
                "Erro ao enviar:",
                error
            );


            alert(
                "Não foi possível enviar a mensagem."
            );


            return;

        }


        adicionarMensagem(data);


        if (realtimeTexto) {

            await realtimeTexto.send({

                type:
                    "broadcast",

                event:
                    "nova-mensagem",

                payload:
                    data

            });

        }

    }
);


/* ==========================================
   CHAT EM TEMPO REAL
========================================== */

async function conectarChatTempoReal(
    canal
) {

    if (realtimeTexto) {

        await supabaseClient
            .removeChannel(
                realtimeTexto
            );

    }


    realtimeTexto =
        supabaseClient.channel(
            `chat-${canal}`
        );


    realtimeTexto.on(

        "broadcast",

        {
            event:
                "nova-mensagem"
        },

        function (evento) {

            const mensagem =
                evento.payload;


            if (
                mensagem.canal !==
                canalTextoAtual
            ) {

                return;

            }


            adicionarMensagem(
                mensagem
            );

        }

    );


    realtimeTexto.subscribe();

}


/* ==========================================
   ADICIONAR MENSAGEM NA TELA
========================================== */

function adicionarMensagem(
    mensagem,
    rolar = true
) {

    if (
        mensagensExibidas.has(
            mensagem.id
        )
    ) {

        return;

    }


    mensagensExibidas.add(
        mensagem.id
    );


    const container =
        document.createElement(
            "div"
        );


    container.className =
        "message";


    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "message-avatar";


    avatar.textContent =
        mensagem.autor
            .charAt(0)
            .toUpperCase();


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "message-content";


    const top =
        document.createElement(
            "div"
        );


    top.className =
        "message-top";


    const autor =
        document.createElement(
            "span"
        );


    autor.className =
        "message-author";


    autor.textContent =
        mensagem.autor;


    const hora =
        document.createElement(
            "span"
        );


    hora.className =
        "message-time";


    hora.textContent =
        formatarHora(
            mensagem.criado_em
        );


    const texto =
        document.createElement(
            "div"
        );


    texto.className =
        "message-text";


    texto.textContent =
        mensagem.texto;


    top.appendChild(
        autor
    );


    top.appendChild(
        hora
    );


    content.appendChild(
        top
    );


    content.appendChild(
        texto
    );


    container.appendChild(
        avatar
    );


    container.appendChild(
        content
    );


    messages.appendChild(
        container
    );


    if (rolar) {

        rolarChat();

    }

}


/* ==========================================
   HORA
========================================== */

function formatarHora(data) {

    return new Date(
        data
    ).toLocaleTimeString(
        "pt-BR",
        {

            hour:
                "2-digit",

            minute:
                "2-digit"

        }
    );

}


/* ==========================================
   ROLAR PARA ÚLTIMA MENSAGEM
========================================== */

function rolarChat() {

    messages.scrollTop =
        messages.scrollHeight;

}

/* ==========================================
   MENU MOBILE
========================================== */

const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );

const mobileOverlay =
    document.getElementById(
        "mobileOverlay"
    );

const sidebar =
    document.querySelector(
        ".sidebar"
    );


function abrirMenuMobile() {

    sidebar.classList.add(
        "aberta"
    );

    mobileOverlay.classList.add(
        "ativo"
    );

}


function fecharMenuMobile() {

    sidebar.classList.remove(
        "aberta"
    );

    mobileOverlay.classList.remove(
        "ativo"
    );

}


mobileMenuBtn.addEventListener(
    "click",
    function () {

        if (
            sidebar.classList.contains("aberta")
        ) {

            fecharMenuMobile();

        } else {

            abrirMenuMobile();

        }

    }
);


mobileOverlay.addEventListener(
    "click",
    fecharMenuMobile
);


/*
    Fecha automaticamente quando
    escolher um canal no celular.
*/

document
    .querySelectorAll(".channel")
    .forEach(function (canal) {

        canal.addEventListener(
            "click",
            function () {

                if (
                    window.innerWidth <= 768
                ) {

                    fecharMenuMobile();

                }

            }
        );

    });