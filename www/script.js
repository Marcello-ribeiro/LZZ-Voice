const SUPABASE_URL = "https://jjkypbiyvhwqeztbztnx.supabase.co";
const SUPABASE_KEY = "sb_publishable_w-vZeqvzEWr_itftzILJoQ_NbXWky8y";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const $ = (id) => document.getElementById(id);

/* ==========================================
   ELEMENTOS
========================================== */

const authScreen = $("authScreen");
const appPrincipal = $("appPrincipal");

const tabLogin = $("tabLogin");
const tabCadastro = $("tabCadastro");
const loginForm = $("loginForm");
const cadastroForm = $("cadastroForm");
const authMessage = $("authMessage");

const cadastroUsername = $("cadastroUsername");
const cadastroEmail = $("cadastroEmail");
const cadastroSenha = $("cadastroSenha");
const cadastroConfirmarSenha = $("cadastroConfirmarSenha");
const cadastroAvatar = $("cadastroAvatar");
const avatarPreview = $("avatarPreview");
const avatarPreviewText = $("avatarPreviewText");

const profileAvatar = $("profileAvatar");
const profileInitial = $("profileInitial");
const profileUsername = $("profileUsername");
const profileMic = $("profileMic");
const profileAudio = $("profileAudio");
const btnConfig = $("btnConfig");
const btnLogout = $("btnLogout");

const settingsModal = $("settingsModal");
const btnFecharConfig = $("btnFecharConfig");
const configUsername = $("configUsername");
const configAvatarInput = $("configAvatarInput");
const configAvatarPreview = $("configAvatarPreview");
const configAvatarLetra = $("configAvatarLetra");
const btnSalvarPerfil = $("btnSalvarPerfil");
const selectMicrofone = $("selectMicrofone");
const selectSaida = $("selectSaida");
const settingsStatus = $("settingsStatus");

const btnEntrar = $("btnEntrar");
const btnMute = $("btnMute");
const btnAudio = $("btnAudio");
const btnSair = $("btnSair");
const statusSala = $("status");
const usersGrid = $("usersGrid");
const usuariosCanal = $("usuariosCanal");
const nomeCanal = $("nomeCanal");
const tituloSala = $("tituloSala");
const miniCanalNome = $("miniCanalNome");
const miniStatus = $("miniStatus");

const textView = $("textView");
const voiceHero = $("voiceHero");
const voiceContent = $("voiceContent");
const voiceCallbar = $("voiceCallbar");
const chatCanalNome = $("chatCanalNome");
const welcomeTitle = $("welcomeTitle");
const messages = $("messages");
const chatForm = $("chatForm");
const chatInput = $("chatInput");

const mobileMenuBtn = $("mobileMenuBtn");
const mobileOverlay = $("mobileOverlay");
const sidebar = document.querySelector(".sidebar");

const updateModal = $("updateModal");
const versaoAtualTexto = $("versaoAtualTexto");
const versaoNovaTexto = $("versaoNovaTexto");
const btnAtualizarApp = $("btnAtualizarApp");

const canaisVoz = document.querySelectorAll(".voice-channel");
const canaisTexto = document.querySelectorAll(".text-channel");

/* ==========================================
   ESTADO
========================================== */

const APP_VERSION = "1.0.1";

const UPDATE_URL =
    "https://lzz-voice.vercel.app/version.json";

let linkAtualizacao =
    "https://lzz-voicedownload.vercel.app";

const meuId = crypto.randomUUID();

let meuNome = "Usuário";
let meuAvatar = null;

let conectado = false;
let mutado = false;
let audioSilenciado = false;
let canalAtual = "Geral";

let streamMicrofone = null;
let canalSupabase = null;

let canalPresenca = null;
let topicoPresencaAtual = null;

let microfoneSelecionado =
    localStorage.getItem("lzz_microfone") || "default";

let saidaSelecionada =
    localStorage.getItem("lzz_saida") || "default";

let canalTextoAtual = null;
let realtimeTexto = null;

const peers = new Map();
const audiosRemotos = new Map();
const candidatesPendentes = new Map();
const monitoresFala = new Map();
const mensagensExibidas = new Set();

const rtcConfig = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};

/* ==========================================
   HELPERS
========================================== */

function setStatusConfig(texto, tipo = "normal") {
    const cores = {
        normal: "#9da9c5",
        sucesso: "#70e5aa",
        erro: "#ff7185"
    };

    settingsStatus.style.color = cores[tipo] || cores.normal;
    settingsStatus.textContent = texto;
}

function primeiraLetra(nome) {
    return (nome || "U").charAt(0).toUpperCase();
}

function montarConstraintsMicrofone() {
    const audio = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    };

    if (microfoneSelecionado !== "default") {
        audio.deviceId = {
            exact: microfoneSelecionado
        };
    }

    return audio;
}

function pararStream(stream) {
    if (!stream) return;

    stream.getTracks().forEach((track) => {
        track.stop();
    });
}

function criarEstadoVazio(
    titulo = "Ninguém conectado",
    texto = "Entre na sala para começar."
) {
    usersGrid.innerHTML = "";

    const vazio = document.createElement("div");
    vazio.className = "empty-state";

    const icone = document.createElement("div");
    icone.className = "empty-state-icon";
    icone.textContent = "🎧";

    const h2 = document.createElement("h2");
    h2.textContent = titulo;

    vazio.append(icone, h2);

    if (texto) {
        const p = document.createElement("p");
        p.textContent = texto;
        vazio.appendChild(p);
    }

    usersGrid.appendChild(vazio);
}

function atualizarNomesSala() {
    nomeCanal.textContent = canalAtual;
    tituloSala.textContent = canalAtual;
    miniCanalNome.textContent = canalAtual;
}

/* ==========================================
   ANDROID - FOREGROUND SERVICE
========================================== */

async function iniciarServicoCall() {
    const plugin = window.Capacitor?.Plugins?.CallService;

    if (!plugin) return;

    try {
        await plugin.start();
    } catch (erro) {
        console.error("Erro ao iniciar CallService:", erro);
    }
}

async function pararServicoCall() {
    const plugin = window.Capacitor?.Plugins?.CallService;

    if (!plugin) return;

    try {
        await plugin.stop();
    } catch (erro) {
        console.error("Erro ao parar CallService:", erro);
    }
}

/* ==========================================
   AUTH
========================================== */

tabLogin.addEventListener("click", () => {
    loginForm.classList.remove("hidden");
    cadastroForm.classList.add("hidden");

    tabLogin.classList.add("ativo");
    tabCadastro.classList.remove("ativo");

    authMessage.textContent = "";
});

tabCadastro.addEventListener("click", () => {
    cadastroForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    tabCadastro.classList.add("ativo");
    tabLogin.classList.remove("ativo");

    authMessage.textContent = "";
});

cadastroAvatar.addEventListener("change", () => {
    const arquivo = cadastroAvatar.files[0];

    if (!arquivo) return;

    avatarPreview.style.backgroundImage =
        `url("${URL.createObjectURL(arquivo)}")`;

    avatarPreviewText.style.display = "none";
});

cadastroForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = cadastroUsername.value.trim();
    const email = cadastroEmail.value.trim();
    const senha = cadastroSenha.value;
    const confirmarSenha = cadastroConfirmarSenha.value;

    if (senha !== confirmarSenha) {
        authMessage.style.color = "#ff7185";
        authMessage.textContent = "As senhas não são iguais.";
        return;
    }

    authMessage.style.color = "";
    authMessage.textContent = "Criando conta...";

    const { data, error } =
        await supabaseClient.auth.signUp({
            email,
            password: senha,
            options: {
                data: {
                    username
                }
            }
        });

    if (error) {
        console.error(error);
        authMessage.style.color = "#ff7185";
        authMessage.textContent = error.message;
        return;
    }

    if (!data.user) {
        authMessage.style.color = "#ff7185";
        authMessage.textContent = "Erro ao criar usuário.";
        return;
    }

    if (!data.session) {
        authMessage.style.color = "#70e5aa";
        authMessage.textContent =
            "Conta criada. Confirme o e-mail para entrar.";
        return;
    }

    const arquivo = cadastroAvatar.files[0];

    if (arquivo) {
        const avatarUrl =
            await enviarAvatar(data.user, arquivo);

        if (avatarUrl) {
            await supabaseClient
                .from("perfis")
                .update({
                    avatar_url: avatarUrl
                })
                .eq("id", data.user.id);
        }
    }

    authMessage.style.color = "#70e5aa";
    authMessage.textContent = "Conta criada!";

    await iniciarUsuario(data.user);
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = $("loginEmail").value.trim();
    const senha = $("loginSenha").value;

    authMessage.style.color = "";
    authMessage.textContent = "Entrando...";

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email,
            password: senha
        });

    if (error) {
        console.error("Erro no login:", error);
        authMessage.style.color = "#ff7185";
        authMessage.textContent = error.message;
        return;
    }

    await iniciarUsuario(data.user);
});

async function enviarAvatar(usuario, arquivo) {
    const extensao =
        arquivo.name.split(".").pop()?.toLowerCase() || "jpg";

    const caminho =
        `${usuario.id}/avatar-${Date.now()}.${extensao}`;

    const { error } =
        await supabaseClient
            .storage
            .from("avatars")
            .upload(caminho, arquivo);

    if (error) {
        console.error("Erro no avatar:", error);
        return null;
    }

    const { data } =
        supabaseClient
            .storage
            .from("avatars")
            .getPublicUrl(caminho);

    return data.publicUrl;
}

async function iniciarUsuario(usuario) {
    const { data, error } =
        await supabaseClient
            .from("perfis")
            .select("id, username, avatar_url")
            .eq("id", usuario.id)
            .single();

    if (error) {
        console.error("Erro ao carregar perfil:", error);
        authMessage.style.color = "#ff7185";
        authMessage.textContent =
            "Não foi possível carregar o perfil.";
        return;
    }

    meuNome = data.username || "Usuário";
    meuAvatar = data.avatar_url || null;

    atualizarPerfilVisual();

    authScreen.classList.add("hidden");
    appPrincipal.classList.remove("hidden");

    await observarSala(canalAtual);
}

function atualizarPerfilVisual() {
    profileUsername.textContent = meuNome;
    profileInitial.textContent = primeiraLetra(meuNome);

    if (meuAvatar) {
        profileAvatar.style.backgroundImage =
            `url("${meuAvatar}")`;

        profileAvatar.classList.add("tem-foto");
        profileInitial.style.display = "none";
    } else {
        profileAvatar.style.backgroundImage = "none";
        profileAvatar.classList.remove("tem-foto");
        profileInitial.style.display = "block";
    }
}

btnLogout.addEventListener("click", async () => {
    if (conectado) {
        await sairDaSala();
    }

    if (canalPresenca) {
        await supabaseClient.removeChannel(canalPresenca);
        canalPresenca = null;
        topicoPresencaAtual = null;
    }

    if (realtimeTexto) {
        await supabaseClient.removeChannel(realtimeTexto);
        realtimeTexto = null;
    }

    await supabaseClient.auth.signOut();

    meuNome = "Usuário";
    meuAvatar = null;
    canalTextoAtual = null;

    appPrincipal.classList.add("hidden");
    authScreen.classList.remove("hidden");
});

async function verificarLogin() {
    const { data } =
        await supabaseClient.auth.getSession();

    if (data.session) {
        await iniciarUsuario(data.session.user);
    }
}

/* ==========================================
   CONFIGURAÇÕES / PERFIL
========================================== */

btnConfig.addEventListener("click", async () => {
    configUsername.value = meuNome;
    configAvatarLetra.textContent = primeiraLetra(meuNome);

    if (meuAvatar) {
        configAvatarPreview.style.backgroundImage =
            `url("${meuAvatar}")`;

        configAvatarLetra.style.display = "none";
    } else {
        configAvatarPreview.style.backgroundImage = "none";
        configAvatarLetra.style.display = "block";
    }

    configAvatarInput.value = "";
    setStatusConfig("");

    settingsModal.classList.remove("hidden");

    await carregarDispositivosAudio();
});

btnFecharConfig.addEventListener("click", () => {
    settingsModal.classList.add("hidden");
});

settingsModal.addEventListener("click", (event) => {
    if (event.target === settingsModal) {
        settingsModal.classList.add("hidden");
    }
});

configAvatarInput.addEventListener("change", () => {
    const arquivo = configAvatarInput.files[0];

    if (!arquivo) return;

    configAvatarPreview.style.backgroundImage =
        `url("${URL.createObjectURL(arquivo)}")`;

    configAvatarLetra.style.display = "none";
});

btnSalvarPerfil.addEventListener("click", async () => {
    const novoNome = configUsername.value.trim();

    if (novoNome.length < 2) {
        setStatusConfig("Nome muito curto.", "erro");
        return;
    }

    setStatusConfig("Salvando...");

    const { data: authData } =
        await supabaseClient.auth.getUser();

    const usuario = authData.user;

    if (!usuario) {
        setStatusConfig("Usuário não encontrado.", "erro");
        return;
    }

    let avatarNovo = meuAvatar;
    const arquivo = configAvatarInput.files[0];

    if (arquivo) {
        const resultado =
            await enviarAvatar(usuario, arquivo);

        if (!resultado) {
            setStatusConfig(
                "Não foi possível enviar a foto.",
                "erro"
            );
            return;
        }

        avatarNovo = resultado;
    }

    const { error } =
        await supabaseClient
            .from("perfis")
            .update({
                username: novoNome,
                avatar_url: avatarNovo
            })
            .eq("id", usuario.id);

    if (error) {
        console.error(error);

        if (error.code === "23505") {
            setStatusConfig(
                "Esse nome já está sendo usado.",
                "erro"
            );
        } else {
            setStatusConfig(
                "Não foi possível salvar.",
                "erro"
            );
        }

        return;
    }

    meuNome = novoNome;
    meuAvatar = avatarNovo;

    atualizarPerfilVisual();

    if (canalSupabase) {
        await canalSupabase.track({
            id: meuId,
            nome: meuNome,
            avatar_url: meuAvatar,
            online_at: new Date().toISOString()
        });
    }

    if (conectado && canalPresenca) {
        await canalPresenca.track({
            id: meuId,
            nome: meuNome,
            avatar_url: meuAvatar,
            online_at: new Date().toISOString()
        });
    }

    atualizarUsuarios();

    configAvatarInput.value = "";
    setStatusConfig("Perfil atualizado.", "sucesso");
});

/* ==========================================
   DISPOSITIVOS DE ÁUDIO
========================================== */

async function carregarDispositivosAudio() {
    try {
        let dispositivos =
            await navigator.mediaDevices.enumerateDevices();

        const semNome =
            dispositivos.some(
                (dispositivo) =>
                    dispositivo.kind === "audioinput" &&
                    !dispositivo.label
            );

        if (semNome && !streamMicrofone) {
            const teste =
                await navigator.mediaDevices.getUserMedia({
                    audio: true
                });

            pararStream(teste);

            dispositivos =
                await navigator.mediaDevices.enumerateDevices();
        }

        const microfones =
            dispositivos.filter(
                (d) => d.kind === "audioinput"
            );

        const saidas =
            dispositivos.filter(
                (d) => d.kind === "audiooutput"
            );

        preencherSelectDispositivos(
            selectMicrofone,
            microfones,
            "Microfone",
            microfoneSelecionado
        );

        if (
            ![...selectMicrofone.options]
                .some(
                    (option) =>
                        option.value === microfoneSelecionado
                )
        ) {
            microfoneSelecionado = "default";
            selectMicrofone.value = "default";

            localStorage.setItem(
                "lzz_microfone",
                "default"
            );
        }

        if (
            typeof HTMLMediaElement.prototype.setSinkId !==
            "function"
        ) {
            selectSaida.innerHTML =
                "<option>Controlado pelo sistema</option>";

            selectSaida.disabled = true;
            return;
        }

        selectSaida.disabled = false;

        preencherSelectDispositivos(
            selectSaida,
            saidas,
            "Saída",
            saidaSelecionada
        );

        if (
            ![...selectSaida.options]
                .some(
                    (option) =>
                        option.value === saidaSelecionada
                )
        ) {
            saidaSelecionada = "default";
            selectSaida.value = "default";

            localStorage.setItem(
                "lzz_saida",
                "default"
            );
        }
    } catch (erro) {
        console.error("Erro ao carregar áudio:", erro);
    }
}

function preencherSelectDispositivos(
    select,
    dispositivos,
    nomePadrao,
    valorSelecionado
) {
    select.innerHTML = "";

    const padrao = document.createElement("option");
    padrao.value = "default";
    padrao.textContent = "Padrão do sistema";
    select.appendChild(padrao);

    dispositivos.forEach((dispositivo, index) => {
        const option = document.createElement("option");

        option.value = dispositivo.deviceId;
        option.textContent =
            dispositivo.label ||
            `${nomePadrao} ${index + 1}`;

        select.appendChild(option);
    });

    select.value = valorSelecionado;
}

selectMicrofone.addEventListener("change", async () => {
    microfoneSelecionado = selectMicrofone.value;

    localStorage.setItem(
        "lzz_microfone",
        microfoneSelecionado
    );

    if (!conectado) {
        setStatusConfig(
            "Microfone selecionado.",
            "sucesso"
        );
        return;
    }

    try {
        const novoStream =
            await navigator.mediaDevices.getUserMedia({
                audio: montarConstraintsMicrofone()
            });

        const novaTrack =
            novoStream.getAudioTracks()[0];

        novaTrack.enabled = !mutado;

        for (const pc of peers.values()) {
            const sender =
                pc.getSenders().find(
                    (s) =>
                        s.track &&
                        s.track.kind === "audio"
                );

            if (sender) {
                await sender.replaceTrack(novaTrack);
            }
        }

        const monitor =
            monitoresFala.get(meuId);

        if (monitor) {
            monitor.parar();
        }

        pararStream(streamMicrofone);
        streamMicrofone = novoStream;

        monitorarFala(
            streamMicrofone,
            meuId
        );

        setStatusConfig(
            "Microfone alterado.",
            "sucesso"
        );
    } catch (erro) {
        console.error(erro);

        setStatusConfig(
            "Não foi possível trocar o microfone.",
            "erro"
        );
    }
});

async function aplicarSaidaAudio(audio) {
    if (typeof audio.setSinkId !== "function") {
        return;
    }

    try {
        await audio.setSinkId(saidaSelecionada);
    } catch (erro) {
        console.error(
            "Erro ao trocar saída:",
            erro
        );
    }
}

selectSaida.addEventListener("change", async () => {
    saidaSelecionada = selectSaida.value;

    localStorage.setItem(
        "lzz_saida",
        saidaSelecionada
    );

    for (const audio of audiosRemotos.values()) {
        await aplicarSaidaAudio(audio);
    }

    setStatusConfig(
        "Saída de áudio alterada.",
        "sucesso"
    );
});

/* ==========================================
   ENTRAR / SAIR DA CALL
========================================== */

btnEntrar.addEventListener("click", async () => {
    if (conectado) return;

    try {
        statusSala.textContent =
            "Ativando microfone...";

        streamMicrofone =
            await navigator.mediaDevices.getUserMedia({
                audio: montarConstraintsMicrofone()
            });

        statusSala.textContent =
            "Conectando à sala...";

        await entrarNoCanal();

        conectado = true;

        await marcarPresencaCall();

        statusSala.textContent =
            `Conectado em ${canalAtual}`;

        miniStatus.textContent =
            "Conectado";

        btnEntrar.style.display = "none";
        btnMute.disabled = false;
        btnAudio.disabled = false;
        btnSair.disabled = false;

        atualizarUsuarios();

        monitorarFala(
            streamMicrofone,
            meuId
        );

        await iniciarServicoCall();
    } catch (erro) {
        console.error("Erro ao entrar:", erro);

        conectado = false;

        pararStream(streamMicrofone);
        streamMicrofone = null;

        if (canalSupabase) {
            await supabaseClient
                .removeChannel(canalSupabase);

            canalSupabase = null;
        }

        statusSala.textContent =
            `Erro: ${erro.message}`;

        alert(
            "Não foi possível entrar na sala."
        );
    }
});

btnSair.addEventListener(
    "click",
    sairDaSala
);

async function sairDaSala() {
    if (!conectado && !streamMicrofone && !canalSupabase) {
        return;
    }

    conectado = false;

    await removerPresencaCall();
    await pararServicoCall();

    for (const pc of peers.values()) {
        pc.close();
    }

    peers.clear();

    for (const monitor of monitoresFala.values()) {
        monitor.parar();
    }

    monitoresFala.clear();

    for (const audio of audiosRemotos.values()) {
        audio.remove();
    }

    audiosRemotos.clear();

    pararStream(streamMicrofone);
    streamMicrofone = null;

    if (canalSupabase) {
        try {
            await canalSupabase.untrack();
        } catch (_) {}

        await supabaseClient
            .removeChannel(canalSupabase);

        canalSupabase = null;
    }

    candidatesPendentes.clear();

    mutado = false;
    audioSilenciado = false;

    btnEntrar.style.display = "block";
    btnMute.disabled = true;
    btnAudio.disabled = true;
    btnSair.disabled = true;

    btnMute.textContent = "🎙️";
    profileMic.textContent = "🎙️";
    btnMute.classList.remove("ativo");

    btnAudio.textContent = "🎧";
    profileAudio.textContent = "🎧";
    btnAudio.classList.remove("ativo");

    statusSala.textContent =
        "Você não está conectado.";

    miniStatus.textContent =
        "Offline";

    atualizarUsuarios();
}

/* ==========================================
   SUPABASE REALTIME DA CALL
========================================== */

function entrarNoCanal() {
    return new Promise(
        (resolve, reject) => {
            const nomeSala =
                `voz-${canalAtual.toLowerCase()}`;

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

            canalSupabase.on(
                "broadcast",
                {
                    event: "webrtc"
                },
                async (mensagem) => {
                    const dados = mensagem.payload;

                    if (
                        dados.destino &&
                        dados.destino !== meuId
                    ) {
                        return;
                    }

                    if (dados.origem === meuId) {
                        return;
                    }

                    await receberSinal(dados);
                }
            );

            canalSupabase.on(
                "presence",
                {
                    event: "sync"
                },
                async () => {
                    await conectarNovosUsuarios();
                }
            );

            canalSupabase.on(
                "presence",
                {
                    event: "leave"
                },
                () => {
                    sincronizarPeersComSala();
                }
            );

            canalSupabase.subscribe(
                async (status) => {
                    if (status === "SUBSCRIBED") {
                        await canalSupabase.track({
                            id: meuId,
                            nome: meuNome,
                            avatar_url: meuAvatar,
                            online_at:
                                new Date().toISOString()
                        });

                        resolve();
                        return;
                    }

                    if (
                        status === "CHANNEL_ERROR" ||
                        status === "TIMED_OUT"
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

async function conectarNovosUsuarios() {
    if (!canalSupabase) return;

    const estado =
        canalSupabase.presenceState();

    const ids = Object.keys(estado);

    sincronizarPeersComSala();

    for (const id of ids) {
        if (
            id === meuId ||
            peers.has(id)
        ) {
            continue;
        }

        if (meuId < id) {
            await criarOferta(id);
        }
    }
}

function sincronizarPeersComSala() {
    if (!canalSupabase) return;

    const ativos =
        new Set(
            Object.keys(
                canalSupabase.presenceState()
            )
        );

    for (const remoteId of peers.keys()) {
        if (!ativos.has(remoteId)) {
            removerPeer(remoteId);
        }
    }
}

/* ==========================================
   PRESENÇA VISÍVEL ANTES DE ENTRAR
========================================== */

async function observarSala(nomeSala) {
    const topico =
        `presenca-voz-${nomeSala.toLowerCase()}`;

    if (
        canalPresenca &&
        topicoPresencaAtual === topico
    ) {
        atualizarUsuarios();
        return;
    }

    if (canalPresenca) {
        try {
            await supabaseClient
                .removeChannel(canalPresenca);
        } catch (erro) {
            console.error(
                "Erro ao trocar presença:",
                erro
            );
        }

        canalPresenca = null;
    }

    topicoPresencaAtual = topico;

    usuariosCanal.innerHTML = "";
    criarEstadoVazio(
        "Carregando sala...",
        ""
    );

    canalPresenca =
        supabaseClient.channel(
            topico,
            {
                config: {
                    presence: {
                        key: meuId
                    }
                }
            }
        );

    const atualizar =
        () => atualizarUsuarios();

    canalPresenca.on(
        "presence",
        { event: "sync" },
        atualizar
    );

    canalPresenca.on(
        "presence",
        { event: "join" },
        atualizar
    );

    canalPresenca.on(
        "presence",
        { event: "leave" },
        atualizar
    );

    await new Promise(
        (resolve, reject) => {
            canalPresenca.subscribe(
                (status) => {
                    if (status === "SUBSCRIBED") {
                        atualizarUsuarios();
                        resolve();
                        return;
                    }

                    if (
                        status === "CHANNEL_ERROR" ||
                        status === "TIMED_OUT"
                    ) {
                        reject(
                            new Error(
                                "Erro ao observar sala."
                            )
                        );
                    }
                }
            );
        }
    );
}

async function marcarPresencaCall() {
    try {
        const topicoCorreto =
            `presenca-voz-${canalAtual.toLowerCase()}`;

        if (
            !canalPresenca ||
            topicoPresencaAtual !== topicoCorreto
        ) {
            await observarSala(canalAtual);
        }

        await canalPresenca.track({
            id: meuId,
            nome: meuNome,
            avatar_url: meuAvatar,
            online_at: new Date().toISOString()
        });

        atualizarUsuarios();
    } catch (erro) {
        console.error(
            "Erro na presença da call:",
            erro
        );
    }
}

async function removerPresencaCall() {
    if (!canalPresenca) return;

    try {
        await canalPresenca.untrack();
    } catch (erro) {
        console.error(
            "Erro ao sair da presença:",
            erro
        );
    }
}

/* ==========================================
   WEBRTC
========================================== */

function criarPeer(remoteId) {
    if (peers.has(remoteId)) {
        return peers.get(remoteId);
    }

    if (!streamMicrofone) {
        throw new Error(
            "Microfone não está ativo."
        );
    }

    const pc =
        new RTCPeerConnection(rtcConfig);

    streamMicrofone
        .getTracks()
        .forEach((track) => {
            pc.addTrack(
                track,
                streamMicrofone
            );
        });

    pc.onicecandidate = (event) => {
        if (!event.candidate) return;

        enviarSinal({
            tipo: "candidate",
            destino: remoteId,
            candidate: event.candidate
        });
    };

    pc.ontrack = (event) => {
        const stream = event.streams[0];

        if (!stream) return;

        monitorarFala(stream, remoteId);

        let audio =
            audiosRemotos.get(remoteId);

        if (!audio) {
            audio =
                document.createElement("audio");

            audio.autoplay = true;
            audio.playsInline = true;
            audio.muted = audioSilenciado;

            document.body.appendChild(audio);
            audiosRemotos.set(remoteId, audio);
        }

        audio.srcObject = stream;

        aplicarSaidaAudio(audio);

        audio.play().catch((erro) => {
            console.log("Autoplay:", erro);
        });
    };

    pc.onconnectionstatechange = () => {
        atualizarStatusConexao();

        if (
            pc.connectionState === "failed" ||
            pc.connectionState === "closed"
        ) {
            removerPeer(remoteId);
        }
    };

    peers.set(remoteId, pc);

    return pc;
}

async function criarOferta(remoteId) {
    const pc = criarPeer(remoteId);
    const oferta = await pc.createOffer();

    await pc.setLocalDescription(oferta);

    await enviarSinal({
        tipo: "offer",
        destino: remoteId,
        sdp: pc.localDescription
    });
}

async function receberSinal(dados) {
    const remoteId = dados.origem;

    if (!remoteId) return;

    let pc = peers.get(remoteId);

    if (dados.tipo === "offer") {
        if (!pc) {
            pc = criarPeer(remoteId);
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
            destino: remoteId,
            sdp: pc.localDescription
        });

        return;
    }

    if (dados.tipo === "answer") {
        if (!pc) return;

        await pc.setRemoteDescription(
            dados.sdp
        );

        await adicionarCandidatesPendentes(
            remoteId,
            pc
        );

        return;
    }

    if (dados.tipo === "candidate") {
        if (!dados.candidate) return;

        if (
            !pc ||
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
            console.error("Erro ICE:", erro);
        }
    }
}

function salvarCandidatePendente(
    remoteId,
    candidate
) {
    if (!candidatesPendentes.has(remoteId)) {
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
        candidatesPendentes.get(remoteId);

    if (!lista) return;

    for (const candidate of lista) {
        try {
            await pc.addIceCandidate(
                candidate
            );
        } catch (erro) {
            console.error(
                "Erro ao adicionar ICE:",
                erro
            );
        }
    }

    candidatesPendentes.delete(remoteId);
}

async function enviarSinal(dados) {
    if (!canalSupabase) return;

    await canalSupabase.send({
        type: "broadcast",
        event: "webrtc",
        payload: {
            ...dados,
            origem: meuId,
            nome: meuNome
        }
    });
}

function removerPeer(remoteId) {
    const pc = peers.get(remoteId);

    if (pc) {
        pc.onicecandidate = null;
        pc.ontrack = null;
        pc.onconnectionstatechange = null;

        pc.close();
        peers.delete(remoteId);
    }

    const monitor =
        monitoresFala.get(remoteId);

    if (monitor) {
        monitor.parar();
    }

    const audio =
        audiosRemotos.get(remoteId);

    if (audio) {
        audio.srcObject = null;
        audio.remove();

        audiosRemotos.delete(remoteId);
    }

    candidatesPendentes.delete(remoteId);
}

/* ==========================================
   DETECÇÃO DE FALA
========================================== */

function monitorarFala(
    stream,
    usuarioId
) {
    if (
        monitoresFala.has(usuarioId) ||
        !stream
    ) {
        return;
    }

    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContextClass) return;

    const audioContext =
        new AudioContextClass();

    const analyser =
        audioContext.createAnalyser();

    const source =
        audioContext
            .createMediaStreamSource(stream);

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
        analyser.getByteTimeDomainData(dados);

        let soma = 0;

        for (
            let i = 0;
            i < dados.length;
            i++
        ) {
            const valor =
                (dados[i] - 128) / 128;

            soma += valor * valor;
        }

        const volume =
            Math.sqrt(
                soma / dados.length
            );

        if (volume > 0.025) {
            ultimoSom = Date.now();
        }

        const falando =
            Date.now() - ultimoSom < 220;

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
            requestAnimationFrame(analisar);
    }

    analisar();

    monitoresFala.set(
        usuarioId,
        {
            parar() {
                if (animationId) {
                    cancelAnimationFrame(
                        animationId
                    );
                }

                try {
                    source.disconnect();
                } catch (_) {}

                audioContext.close()
                    .catch(() => {});

                monitoresFala.delete(
                    usuarioId
                );
            }
        }
    );
}

/* ==========================================
   USUÁRIOS NA SALA
========================================== */

function atualizarUsuarios() {
    if (!canalPresenca) return;

    const estado =
        canalPresenca.presenceState();

    usuariosCanal.innerHTML = "";
    usersGrid.innerHTML = "";

    let quantidade = 0;

    Object.entries(estado)
        .forEach(([id, presencas]) => {
            if (
                !presencas ||
                presencas.length === 0
            ) {
                return;
            }

            const usuario = presencas[0];

            const nome =
                String(
                    usuario.nome ||
                    "Usuário"
                );

            const avatar =
                usuario.avatar_url
                    ? String(
                        usuario.avatar_url
                    )
                    : null;

            quantidade++;

            usuariosCanal.appendChild(
                criarUsuarioSidebar(
                    nome,
                    avatar
                )
            );

            usersGrid.appendChild(
                criarCardUsuario(
                    id,
                    nome,
                    avatar
                )
            );
        });

    if (quantidade === 0) {
        criarEstadoVazio();
    }
}

function criarUsuarioSidebar(
    nome,
    avatar
) {
    const item =
        document.createElement("div");

    item.className =
        "usuario-canal";

    const foto =
        document.createElement("div");

    foto.className =
        "avatar-canal";

    aplicarAvatar(
        foto,
        nome,
        avatar
    );

    const nomeEl =
        document.createElement("span");

    nomeEl.className =
        "usuario-canal-nome";

    nomeEl.textContent =
        nome;

    item.append(
        foto,
        nomeEl
    );

    return item;
}

function criarCardUsuario(
    id,
    nome,
    avatar
) {
    const card =
        document.createElement("div");

    card.className =
        "user-card";

    card.dataset.userId =
        id;

    const foto =
        document.createElement("div");

    foto.className =
        "user-avatar";

    aplicarAvatar(
        foto,
        nome,
        avatar
    );

    const nomeEl =
        document.createElement("span");

    nomeEl.className =
        "user-name";

    nomeEl.textContent =
        nome;

    const mic =
        document.createElement("div");

    mic.className =
        "user-mic";

    mic.textContent =
        "🎙️";

    card.append(
        foto,
        nomeEl,
        mic
    );

    return card;
}

function aplicarAvatar(
    elemento,
    nome,
    avatar
) {
    if (avatar) {
        elemento.classList.add("tem-foto");

        elemento.style.backgroundImage =
            `url("${avatar.replace(/"/g, "%22")}")`;

        elemento.textContent = "";
    } else {
        elemento.classList.remove("tem-foto");
        elemento.style.backgroundImage = "none";
        elemento.textContent = primeiraLetra(nome);
    }
}

function atualizarStatusConexao() {
    if (!conectado) return;

    let conectados = 0;

    peers.forEach((pc) => {
        if (
            pc.connectionState ===
            "connected"
        ) {
            conectados++;
        }
    });

    statusSala.textContent =
        conectados === 0
            ? `Conectado em ${canalAtual} - aguardando amigos...`
            : `🔊 ${conectados + 1} pessoas conectadas`;
}

/* ==========================================
   MUTE / DEAFEN
========================================== */

btnMute.addEventListener(
    "click",
    alternarMute
);

profileMic.addEventListener(
    "click",
    () => {
        if (conectado) {
            alternarMute();
        }
    }
);

function alternarMute() {
    mutado = !mutado;

    if (streamMicrofone) {
        streamMicrofone
            .getAudioTracks()
            .forEach((track) => {
                track.enabled = !mutado;
            });
    }

    const icone =
        mutado
            ? "🔇"
            : "🎙️";

    btnMute.textContent = icone;
    profileMic.textContent = icone;

    btnMute.classList.toggle(
        "ativo",
        mutado
    );
}

btnAudio.addEventListener(
    "click",
    alternarAudio
);

profileAudio.addEventListener(
    "click",
    () => {
        if (conectado) {
            alternarAudio();
        }
    }
);

function alternarAudio() {
    audioSilenciado =
        !audioSilenciado;

    audiosRemotos.forEach((audio) => {
        audio.muted =
            audioSilenciado;
    });

    const icone =
        audioSilenciado
            ? "🔇"
            : "🎧";

    btnAudio.textContent = icone;
    profileAudio.textContent = icone;

    btnAudio.classList.toggle(
        "ativo",
        audioSilenciado
    );
}

/* ==========================================
   CANAIS DE VOZ
========================================== */

canaisVoz.forEach((canal) => {
    canal.addEventListener(
        "click",
        async () => {
            const canalClicado =
                canal.dataset.canal;

            if (
                conectado &&
                canalClicado === canalAtual
            ) {
                mostrarVoz();
                fecharMenuMobileSeNecessario();
                return;
            }

            if (
                conectado &&
                canalClicado !== canalAtual
            ) {
                alert(
                    "Saia da call antes de trocar de canal."
                );
                return;
            }

            canalAtual = canalClicado;

            document
                .querySelectorAll(".channel")
                .forEach((item) => {
                    item.classList.remove(
                        "ativo"
                    );
                });

            canal.classList.add("ativo");

            atualizarNomesSala();
            mostrarVoz();

            await observarSala(
                canalAtual
            );

            fecharMenuMobileSeNecessario();
        }
    );
});

/* ==========================================
   CHAT DE TEXTO
========================================== */

canaisTexto.forEach((canal) => {
    canal.addEventListener(
        "click",
        async () => {
            const nome =
                canal.dataset.canal;

            canalTextoAtual = nome;

            document
                .querySelectorAll(".channel")
                .forEach((item) => {
                    item.classList.remove(
                        "ativo"
                    );
                });

            canal.classList.add("ativo");

            chatCanalNome.textContent = nome;
            welcomeTitle.textContent =
                `Bem-vindo ao #${nome}`;

            chatInput.placeholder =
                `Mensagem em #${nome}`;

            mostrarChat();

            await carregarMensagens(nome);
            await conectarChatTempoReal(nome);

            fecharMenuMobileSeNecessario();
        }
    );
});

function mostrarChat() {
    voiceHero.classList.add("hidden");
    voiceContent.classList.add("hidden");
    voiceCallbar.classList.add("hidden");

    textView.classList.remove("hidden");
}

function mostrarVoz() {
    textView.classList.add("hidden");

    voiceHero.classList.remove("hidden");
    voiceContent.classList.remove("hidden");
    voiceCallbar.classList.remove("hidden");
}

async function carregarMensagens(canal) {
    messages.innerHTML = "";

    const welcome =
        document.createElement("div");

    welcome.className =
        "chat-welcome";

    const icone =
        document.createElement("div");

    icone.className =
        "welcome-icon";

    icone.textContent = "#";

    const titulo =
        document.createElement("h2");

    titulo.textContent =
        `Bem-vindo ao #${canal}`;

    const texto =
        document.createElement("p");

    texto.textContent =
        "Este é o começo deste canal.";

    welcome.append(
        icone,
        titulo,
        texto
    );

    messages.appendChild(welcome);

    mensagensExibidas.clear();

    const { data, error } =
        await supabaseClient
            .from("mensagens")
            .select(
                "id, canal, autor, texto, criado_em"
            )
            .eq("canal", canal)
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

    [...(data || [])]
        .reverse()
        .forEach((mensagem) => {
            adicionarMensagem(
                mensagem,
                false
            );
        });

    rolarChat();
}

chatForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        if (!canalTextoAtual) return;

        const texto =
            chatInput.value.trim();

        if (!texto) return;

        chatInput.value = "";

        const { data, error } =
            await supabaseClient
                .from("mensagens")
                .insert({
                    canal: canalTextoAtual,
                    autor: meuNome,
                    texto
                })
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
                type: "broadcast",
                event: "nova-mensagem",
                payload: data
            });
        }
    }
);

async function conectarChatTempoReal(canal) {
    if (realtimeTexto) {
        await supabaseClient
            .removeChannel(realtimeTexto);
    }

    realtimeTexto =
        supabaseClient.channel(
            `chat-${canal}`
        );

    realtimeTexto.on(
        "broadcast",
        {
            event: "nova-mensagem"
        },
        (evento) => {
            const mensagem =
                evento.payload;

            if (
                mensagem.canal !==
                canalTextoAtual
            ) {
                return;
            }

            adicionarMensagem(mensagem);
        }
    );

    realtimeTexto.subscribe();
}

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
        document.createElement("div");

    container.className =
        "message";

    const avatar =
        document.createElement("div");

    avatar.className =
        "message-avatar";

    avatar.textContent =
        primeiraLetra(mensagem.autor);

    const content =
        document.createElement("div");

    content.className =
        "message-content";

    const top =
        document.createElement("div");

    top.className =
        "message-top";

    const autor =
        document.createElement("span");

    autor.className =
        "message-author";

    autor.textContent =
        mensagem.autor;

    const hora =
        document.createElement("span");

    hora.className =
        "message-time";

    hora.textContent =
        formatarHora(
            mensagem.criado_em
        );

    const texto =
        document.createElement("div");

    texto.className =
        "message-text";

    texto.textContent =
        mensagem.texto;

    top.append(
        autor,
        hora
    );

    content.append(
        top,
        texto
    );

    container.append(
        avatar,
        content
    );

    messages.appendChild(container);

    if (rolar) {
        rolarChat();
    }
}

function formatarHora(data) {
    return new Date(data)
        .toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
}

function rolarChat() {
    messages.scrollTop =
        messages.scrollHeight;
}

/* ==========================================
   MENU MOBILE
========================================== */

function abrirMenuMobile() {
    sidebar.classList.add("aberta");
    mobileOverlay.classList.add("ativo");
}

function fecharMenuMobile() {
    sidebar.classList.remove("aberta");
    mobileOverlay.classList.remove("ativo");
}

function fecharMenuMobileSeNecessario() {
    if (window.innerWidth <= 768) {
        fecharMenuMobile();
    }
}

mobileMenuBtn.addEventListener(
    "click",
    () => {
        if (
            sidebar.classList.contains(
                "aberta"
            )
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

/* ==========================================
   ATUALIZAÇÃO DO APP
========================================== */

function rodandoComoAppInstalado() {

    const android =
        Boolean(
            window.Capacitor?.isNativePlatform?.()
        ) &&
        window.Capacitor.getPlatform() === "android";

    const electron =
        navigator.userAgent
            .toLowerCase()
            .includes("electron");

    return android || electron;
}


function compararVersoes(
    atual,
    minima
) {

    const a =
        atual
            .split(".")
            .map(Number);

    const b =
        minima
            .split(".")
            .map(Number);

    const tamanho =
        Math.max(
            a.length,
            b.length
        );

    for (
        let i = 0;
        i < tamanho;
        i++
    ) {

        const atualNumero =
            a[i] || 0;

        const minimoNumero =
            b[i] || 0;

        if (
            atualNumero <
            minimoNumero
        ) {
            return -1;
        }

        if (
            atualNumero >
            minimoNumero
        ) {
            return 1;
        }
    }

    return 0;
}


async function verificarAtualizacaoObrigatoria() {

    /*
        No navegador normal não bloqueia.
        Apenas APK e programa do PC.
    */

    if (!rodandoComoAppInstalado()) {
        return false;
    }

    try {

        const resposta =
            await fetch(
                `${UPDATE_URL}?t=${Date.now()}`,
                {
                    cache: "no-store"
                }
            );

        if (!resposta.ok) {

            console.warn(
                "Não foi possível consultar a versão."
            );

            return false;
        }

        const dados =
            await resposta.json();

        linkAtualizacao =
            dados.download_url ||
            linkAtualizacao;

        const desatualizado =
            dados.minimum &&
            compararVersoes(
                APP_VERSION,
                dados.minimum
            ) < 0;

        if (
            dados.obrigatoria === true &&
            desatualizado
        ) {

            versaoAtualTexto.textContent =
                APP_VERSION;

            versaoNovaTexto.textContent =
                dados.latest;

            updateModal.classList.remove(
                "hidden"
            );

            return true;
        }

    } catch (erro) {

        console.error(
            "Erro ao verificar atualização:",
            erro
        );
    }

    return false;
}


btnAtualizarApp.addEventListener(
    "click",
    function () {

        window.location.href =
            linkAtualizacao;
    }
);

/* ==========================================
   INICIALIZAÇÃO
========================================== */

async function inicializarApp() {

    atualizarNomesSala();

    const atualizacaoObrigatoria =
        await verificarAtualizacaoObrigatoria();

    if (atualizacaoObrigatoria) {
        return;
    }

    await verificarLogin();
}


inicializarApp();
