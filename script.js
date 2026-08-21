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


/* =====================================
   CONFIGURAÇÕES
===================================== */

let conectado = false;

let mutado = false;

let audioSilenciado = false;

let canalAtual = "Geral";

let streamMicrofone = null;

let canalSupabase = null;


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
    prompt("Qual é seu nome?") || "Marcello";


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

const candidatesPendentes =
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


            btnEntrar.style.display =
                "none";


            btnMute.disabled = false;

            btnAudio.disabled = false;

            btnSair.disabled = false;


            mostrarMeuUsuario();


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

                            id: meuId,

                            nome: meuNome,

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


    Object.keys(
        estado
    ).forEach(function (id) {


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


        const letra =
            nome
                .charAt(0)
                .toUpperCase();


        htmlSidebar += `

            <div class="usuario-canal">

                <div class="avatar-canal">
                    ${letra}
                </div>

                ${nome}

            </div>

        `;


        htmlCards += `

            <div class="user-card">

                <div class="user-avatar">
                    ${letra}
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


    /*
        FECHA AS CONEXÕES
    */

    peers.forEach(
        function (pc) {

            pc.close();

        }
    );


    peers.clear();


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

            <div class="empty-icon">
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

const canais =
    document.querySelectorAll(
        ".voice-channel"
    );


canais.forEach(
    function (canal) {

        canal.addEventListener(
            "click",
            function () {


                /*
                    Por enquanto não deixa
                    trocar enquanto está
                    conectado.
                */

                if (conectado) {

                    alert(
                        "Saia da call antes de trocar de canal."
                    );

                    return;

                }


                canais.forEach(
                    function (item) {

                        item.classList
                            .remove(
                                "ativo"
                            );

                    }
                );


                canal.classList.add(
                    "ativo"
                );


                canalAtual =
                    canal.dataset.canal;


                nomeCanal.textContent =
                    canalAtual;


                tituloSala.textContent =
                    canalAtual;

            }
        );

    }
);