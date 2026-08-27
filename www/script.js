const SUPABASE_URL = "https://jjkypbiyvhwqeztbztnx.supabase.co";
const SUPABASE_KEY = "sb_publishable_w-vZeqvzEWr_itftzILJoQ_NbXWky8y";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const $ = (id) => document.getElementById(id);

const APP_VERSION = "1.0.2";
const UPDATE_URL = "https://lzz-voice.vercel.app/version.json";
const DOWNLOAD_URL = "https://lzz-voicedownload.vercel.app";
const rtcConfig = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

/* =========================================================
   DOM
========================================================= */
const dom = {
  authScreen: $("authScreen"), app: $("appPrincipal"), tabLogin: $("tabLogin"), tabCadastro: $("tabCadastro"),
  loginForm: $("loginForm"), cadastroForm: $("cadastroForm"), authMessage: $("authMessage"),
  cadastroAvatar: $("cadastroAvatar"), avatarPreview: $("avatarPreview"), avatarPreviewText: $("avatarPreviewText"),
  serverList: $("serverList"), homeServerGrid: $("homeServerGrid"), btnServidorHome: $("btnServidorHome"),
  btnAbrirCriarServidor: $("btnAbrirCriarServidor"), btnAbrirEntrarServidor: $("btnAbrirEntrarServidor"),
  homeCriarServidor: $("homeCriarServidor"), homeEntrarServidor: $("homeEntrarServidor"),
  sidebarServidorNome: $("sidebarServidorNome"), channelSidebar: $("channelSidebar"),
  textChannelList: $("textChannelList"), voiceChannelList: $("voiceChannelList"),
  btnCriarCanalTexto: $("btnCriarCanalTexto"), btnCriarCanalVoz: $("btnCriarCanalVoz"), btnGerenciarServidor: $("btnGerenciarServidor"),
  profileAvatar: $("profileAvatar"), profileInitial: $("profileInitial"), profileUsername: $("profileUsername"),
  profileMic: $("profileMic"), profileAudio: $("profileAudio"), btnConfig: $("btnConfig"), btnLogout: $("btnLogout"),
  navAgora: $("navAgora"), navConversas: $("navConversas"), navArquivos: $("navArquivos"),
  workspaceKicker: $("workspaceKicker"), workspaceTitle: $("workspaceTitle"), btnConvidarServidor: $("btnConvidarServidor"),
  homeView: $("homeView"), voiceView: $("voiceView"), chatView: $("chatView"), dmView: $("dmView"), filesView: $("filesView"),
  servidorAtualNome: $("servidorAtualNome"), tituloSala: $("tituloSala"), status: $("status"), voiceMemberCount: $("voiceMemberCount"),
  usersGrid: $("usersGrid"), screenShareArea: $("screenShareArea"), btnEntrar: $("btnEntrar"), btnMute: $("btnMute"),
  btnAudio: $("btnAudio"), btnCompartilharTela: $("btnCompartilharTela"), btnSair: $("btnSair"), btnInviteFromVoice: $("btnInviteFromVoice"),
  screenShareModal: $("screenShareModal"), btnFecharScreenShare: $("btnFecharScreenShare"),
  screenSourceGrid: $("screenSourceGrid"), screenSourceNote: $("screenSourceNote"),
  screenQuality: $("screenQuality"), screenFps: $("screenFps"),
  btnRefreshScreenSources: $("btnRefreshScreenSources"), btnStartScreenShare: $("btnStartScreenShare"),
  screenShareStatus: $("screenShareStatus"),
  nomeCanal: $("nomeCanal"), miniCanalNome: $("miniCanalNome"), miniStatus: $("miniStatus"), usuariosCanal: $("usuariosCanal"),
  participantDrawer: $("participantDrawer"), participantDrawerList: $("participantDrawerList"),
  btnToggleParticipants: $("btnToggleParticipants"), btnCloseParticipants: $("btnCloseParticipants"),
  chatServerName: $("chatServerName"), chatCanalNome: $("chatCanalNome"), btnEditarCanalAtual: $("btnEditarCanalAtual"),
  messages: $("messages"), chatForm: $("chatForm"), chatInput: $("chatInput"), welcomeTitle: $("welcomeTitle"),
  dmList: $("dmList"), btnNovaConversa: $("btnNovaConversa"), dmEmptyState: $("dmEmptyState"), dmActive: $("dmActive"),
  dmTargetAvatar: $("dmTargetAvatar"), dmTargetName: $("dmTargetName"), dmMessages: $("dmMessages"), dmForm: $("dmForm"), dmInput: $("dmInput"),
  filesServerName: $("filesServerName"), serverFileInput: $("serverFileInput"), fileSearch: $("fileSearch"), fileUploadStatus: $("fileUploadStatus"), fileList: $("fileList"),
  settingsModal: $("settingsModal"), btnFecharConfig: $("btnFecharConfig"), configAvatarInput: $("configAvatarInput"),
  configAvatarPreview: $("configAvatarPreview"), configAvatarLetra: $("configAvatarLetra"), configUsername: $("configUsername"),
  btnSalvarPerfil: $("btnSalvarPerfil"), selectMicrofone: $("selectMicrofone"), selectSaida: $("selectSaida"), settingsStatus: $("settingsStatus"),
  serverModal: $("serverModal"), serverModalTitle: $("serverModalTitle"), btnFecharServidorModal: $("btnFecharServidorModal"),
  tabCriarServidor: $("tabCriarServidor"), tabEntrarServidor: $("tabEntrarServidor"), criarServidorForm: $("criarServidorForm"),
  entrarServidorForm: $("entrarServidorForm"), novoServidorNome: $("novoServidorNome"), conviteCodigo: $("conviteCodigo"),
  btnCriarServidor: $("btnCriarServidor"), btnEntrarServidor: $("btnEntrarServidor"), serverModalStatus: $("serverModalStatus"),
  channelModal: $("channelModal"), channelModalTitle: $("channelModalTitle"), btnFecharCanalModal: $("btnFecharCanalModal"),
  criarCanalForm: $("criarCanalForm"), novoCanalTipo: $("novoCanalTipo"), editarCanalId: $("editarCanalId"), novoCanalNome: $("novoCanalNome"),
  novoCanalPrivado: $("novoCanalPrivado"), channelRoleAccess: $("channelRoleAccess"), channelRoleChecks: $("channelRoleChecks"),
  btnApagarCanal: $("btnApagarCanal"), btnSalvarCanal: $("btnSalvarCanal"), channelModalStatus: $("channelModalStatus"),
  serverSettingsModal: $("serverSettingsModal"), settingsServerName: $("settingsServerName"), btnFecharServerSettings: $("btnFecharServerSettings"),
  editServerName: $("editServerName"), editServerDescription: $("editServerDescription"), btnSalvarServidor: $("btnSalvarServidor"), serverGeneralStatus: $("serverGeneralStatus"),
  memberSearch: $("memberSearch"), memberList: $("memberList"), roleList: $("roleList"), roleForm: $("roleForm"), roleEditId: $("roleEditId"),
  roleName: $("roleName"), roleColor: $("roleColor"), rolePermissionGrid: $("rolePermissionGrid"), btnNovoCargo: $("btnNovoCargo"), btnDeleteRole: $("btnDeleteRole"), roleStatus: $("roleStatus"),
  btnCriarConviteSettings: $("btnCriarConviteSettings"), inviteList: $("inviteList"), btnExcluirServidor: $("btnExcluirServidor"),
  memberRoleModal: $("memberRoleModal"), memberRoleTitle: $("memberRoleTitle"), btnCloseMemberRole: $("btnCloseMemberRole"),
  memberRoleChecks: $("memberRoleChecks"), btnRemoveMember: $("btnRemoveMember"), btnSaveMemberRoles: $("btnSaveMemberRoles"), memberRoleStatus: $("memberRoleStatus"),
  newDmModal: $("newDmModal"), btnCloseNewDm: $("btnCloseNewDm"), dmMemberList: $("dmMemberList"),
  updateModal: $("updateModal"), versaoAtualTexto: $("versaoAtualTexto"), versaoNovaTexto: $("versaoNovaTexto"), btnAtualizarApp: $("btnAtualizarApp"),
  mobileMenuBtn: $("mobileMenuBtn"), mobileOverlay: $("mobileOverlay")
};

/* =========================================================
   STATE
========================================================= */
const state = {
  user: null, profile: null,
  servers: [], server: null, channels: [], roles: [], currentPermissions: {},
  currentVoice: null, currentText: null, currentMode: "home", lastAgoraMode: "voice",
  connected: false, muted: false, deafened: false,
  micStream: null, screenStream: null, signaling: null,
  selectedScreenSourceId: null,
  screenShareConfig: {
    quality: localStorage.getItem("lzz_screen_quality") || "1080",
    fps: Number(localStorage.getItem("lzz_screen_fps") || "30")
  },
  peers: new Map(), remoteAudios: new Map(), pendingIce: new Map(), speakingMonitors: new Map(), remoteVideos: new Map(),
  presenceChannels: new Map(), presenceStates: new Map(),
  chatRealtime: null, dmRealtime: null, displayedMessages: new Set(),
  conversations: [], activeConversation: null,
  members: [], memberRoles: new Map(), editingMember: null,
  moderationStates: new Map(), kickBaseline: new Map(), serverMuted: false,
  files: [],
  micDevice: localStorage.getItem("lzz_microfone") || "default",
  outputDevice: localStorage.getItem("lzz_saida") || "default"
};

const ALL_PERMISSIONS = ["manage_server","manage_channels","manage_roles","manage_members","create_invite","manage_messages","manage_voice","view_private_channels","connect_private_voice"];
const esc = (s) => String(s ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const first = (s) => String(s || "U").trim().charAt(0).toUpperCase() || "U";
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const has = (permission) => state.server?.dono_id === state.user?.id || state.currentPermissions[permission] === true;

function setStatus(el, text = "", ok = false) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("ok", ok);
}
function openModal(el) { el?.classList.remove("hidden"); }
function closeModal(el) { el?.classList.add("hidden"); }
function applyAvatar(el, name, url) {
  if (!el) return;
  if (url) { el.style.backgroundImage = `url("${String(url).replace(/"/g,"%22")}")`; el.textContent = ""; }
  else { el.style.backgroundImage = "none"; el.textContent = first(name); }
}
function formatBytes(n = 0) {
  if (n < 1024) return `${n} B`;
  if (n < 1024*1024) return `${(n/1024).toFixed(1)} KB`;
  if (n < 1024*1024*1024) return `${(n/1024/1024).toFixed(1)} MB`;
  return `${(n/1024/1024/1024).toFixed(1)} GB`;
}
function fmtTime(date) { try { return new Date(date).toLocaleString("pt-BR", {day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}); } catch { return ""; } }

/* =========================================================
   UPDATE
========================================================= */
function installedApp() {
  const android = Boolean(window.Capacitor?.isNativePlatform?.()) && window.Capacitor.getPlatform() === "android";
  const electron = navigator.userAgent.toLowerCase().includes("electron");
  return android || electron;
}
function compareVersions(a,b) {
  const aa=String(a).split(".").map(Number), bb=String(b).split(".").map(Number), n=Math.max(aa.length,bb.length);
  for(let i=0;i<n;i++){ if((aa[i]||0)<(bb[i]||0)) return -1; if((aa[i]||0)>(bb[i]||0)) return 1; } return 0;
}
async function checkUpdate() {
  if (!installedApp()) return false;
  try {
    const res = await fetch(`${UPDATE_URL}?t=${Date.now()}`, {cache:"no-store"});
    if (!res.ok) return false;
    const d = await res.json();
    if (d.obrigatoria === true && d.minimum && compareVersions(APP_VERSION,d.minimum)<0) {
      dom.versaoAtualTexto.textContent=APP_VERSION; dom.versaoNovaTexto.textContent=d.latest || d.minimum;
      dom.btnAtualizarApp.onclick=()=>location.href=d.download_url || DOWNLOAD_URL; openModal(dom.updateModal); return true;
    }
  } catch(e){ console.warn("Update:",e); }
  return false;
}

/* =========================================================
   AUTH + PROFILE
========================================================= */
dom.tabLogin.onclick=()=>{dom.tabLogin.classList.add("ativo");dom.tabCadastro.classList.remove("ativo");dom.loginForm.classList.remove("hidden");dom.cadastroForm.classList.add("hidden");setStatus(dom.authMessage)};
dom.tabCadastro.onclick=()=>{dom.tabCadastro.classList.add("ativo");dom.tabLogin.classList.remove("ativo");dom.cadastroForm.classList.remove("hidden");dom.loginForm.classList.add("hidden");setStatus(dom.authMessage)};
dom.cadastroAvatar.onchange=()=>previewFile(dom.cadastroAvatar.files?.[0],dom.avatarPreview,dom.avatarPreviewText);
function previewFile(file, box, textEl){ if(!file)return; const r=new FileReader(); r.onload=()=>{box.style.backgroundImage=`url("${r.result}")`; if(textEl)textEl.style.display="none"}; r.readAsDataURL(file); }

async function uploadAvatar(user, file) {
  if (!file) return null;
  const ext=(file.name.split(".").pop()||"jpg").toLowerCase();
  const path=`${user.id}/avatar-${Date.now()}.${ext}`;
  const {error}=await supabaseClient.storage.from("avatars").upload(path,file,{upsert:true}); if(error) throw error;
  return supabaseClient.storage.from("avatars").getPublicUrl(path).data.publicUrl;
}

dom.loginForm.onsubmit=async(e)=>{
  e.preventDefault(); setStatus(dom.authMessage,"Entrando...",true);
  const {data,error}=await supabaseClient.auth.signInWithPassword({email:$("loginEmail").value.trim(),password:$("loginSenha").value});
  if(error)return setStatus(dom.authMessage,error.message); await startUser(data.user);
};
dom.cadastroForm.onsubmit=async(e)=>{
  e.preventDefault();
  const name=$("cadastroUsername").value.trim(), email=$("cadastroEmail").value.trim(), pass=$("cadastroSenha").value, confirm=$("cadastroConfirmarSenha").value;
  if(pass!==confirm)return setStatus(dom.authMessage,"As senhas não coincidem.");
  setStatus(dom.authMessage,"Criando conta...",true);
  const {data,error}=await supabaseClient.auth.signUp({email,password:pass,options:{data:{username:name}}}); if(error)return setStatus(dom.authMessage,error.message);
  if(!data.user)return setStatus(dom.authMessage,"Conta criada. Confirme o e-mail e entre.",true);
  let avatar=null; try{avatar=await uploadAvatar(data.user,dom.cadastroAvatar.files?.[0]);}catch(err){console.warn(err)}
  await supabaseClient.from("perfis").upsert({id:data.user.id,username:name,avatar_url:avatar},{onConflict:"id"});
  if(data.session) await startUser(data.user); else { setStatus(dom.authMessage,"Conta criada. Agora entre.",true); dom.tabLogin.click(); }
};

async function startUser(user){
  state.user=user;
  const {data,error}=await supabaseClient.from("perfis").select("id,username,avatar_url").eq("id",user.id).maybeSingle();
  if(error) return setStatus(dom.authMessage,"Não foi possível carregar o perfil.");
  state.profile=data || {id:user.id,username:user.user_metadata?.username || "Usuário",avatar_url:null};
  renderProfile(); dom.authScreen.classList.add("hidden"); dom.app.classList.remove("hidden");
  await loadAudioDevices(); await loadServers(); await acceptInviteFromUrl();
}
function renderProfile(){
  dom.profileUsername.textContent=state.profile?.username || "Usuário";
  applyAvatar(dom.profileAvatar,state.profile?.username,state.profile?.avatar_url);
  dom.profileInitial.textContent=first(state.profile?.username);
}
async function restoreSession(){ const {data}=await supabaseClient.auth.getSession(); if(data.session?.user) await startUser(data.session.user); }

dom.btnLogout.onclick=async()=>{ await leaveCall(); await clearServerRealtime(); await supabaseClient.auth.signOut(); Object.assign(state,{user:null,profile:null,servers:[],server:null,channels:[],roles:[],currentPermissions:{}}); dom.app.classList.add("hidden");dom.authScreen.classList.remove("hidden"); };

dom.btnConfig.onclick=()=>{ dom.configUsername.value=state.profile?.username||""; applyAvatar(dom.configAvatarPreview,state.profile?.username,state.profile?.avatar_url); dom.configAvatarLetra.textContent=first(state.profile?.username); openModal(dom.settingsModal); loadAudioDevices(); };
dom.btnFecharConfig.onclick=()=>closeModal(dom.settingsModal);
dom.configAvatarInput.onchange=()=>previewFile(dom.configAvatarInput.files?.[0],dom.configAvatarPreview,dom.configAvatarLetra);
dom.btnSalvarPerfil.onclick=async()=>{
  const name=dom.configUsername.value.trim(); if(name.length<2)return setStatus(dom.settingsStatus,"Nome muito curto.");
  try{
    let avatar=state.profile?.avatar_url || null; const f=dom.configAvatarInput.files?.[0]; if(f) avatar=await uploadAvatar(state.user,f);
    const {error}=await supabaseClient.from("perfis").update({username:name,avatar_url:avatar}).eq("id",state.user.id); if(error)throw error;
    state.profile={...state.profile,username:name,avatar_url:avatar}; renderProfile(); setStatus(dom.settingsStatus,"Perfil atualizado.",true);
  }catch(err){setStatus(dom.settingsStatus,err.message)}
};

/* =========================================================
   AUDIO DEVICES
========================================================= */
async function loadAudioDevices(){
  try{
    let list=await navigator.mediaDevices.enumerateDevices();
    if(list.some(d=>d.kind==="audioinput"&&!d.label)){ try{const s=await navigator.mediaDevices.getUserMedia({audio:true});s.getTracks().forEach(t=>t.stop());list=await navigator.mediaDevices.enumerateDevices()}catch{} }
    dom.selectMicrofone.innerHTML='<option value="default">Padrão do sistema</option>';
    dom.selectSaida.innerHTML='<option value="default">Padrão do sistema</option>';
    list.filter(d=>d.kind==="audioinput").forEach((d,i)=>dom.selectMicrofone.add(new Option(d.label||`Microfone ${i+1}`,d.deviceId)));
    if(typeof HTMLMediaElement.prototype.setSinkId==="function") list.filter(d=>d.kind==="audiooutput").forEach((d,i)=>dom.selectSaida.add(new Option(d.label||`Saída ${i+1}`,d.deviceId)));
    else dom.selectSaida.add(new Option("Controlado pelo sistema","system"));
    if([...dom.selectMicrofone.options].some(o=>o.value===state.micDevice))dom.selectMicrofone.value=state.micDevice;
    if([...dom.selectSaida.options].some(o=>o.value===state.outputDevice))dom.selectSaida.value=state.outputDevice;
  }catch(e){console.warn("devices",e)}
}
dom.selectMicrofone.onchange=async()=>{state.micDevice=dom.selectMicrofone.value;localStorage.setItem("lzz_microfone",state.micDevice);if(state.connected)await replaceMicrophone()};
dom.selectSaida.onchange=async()=>{state.outputDevice=dom.selectSaida.value;localStorage.setItem("lzz_saida",state.outputDevice);for(const a of state.remoteAudios.values())await applyOutput(a)};
function micConstraints(){const a={echoCancellation:true,noiseSuppression:true,autoGainControl:true};if(state.micDevice!=="default")a.deviceId={exact:state.micDevice};return a}
async function applyOutput(audio){if(typeof audio.setSinkId!=="function"||state.outputDevice==="system")return;try{await audio.setSinkId(state.outputDevice)}catch(e){console.warn(e)}}
async function replaceMicrophone(){const s=await navigator.mediaDevices.getUserMedia({audio:micConstraints()});const t=s.getAudioTracks()[0];t.enabled=!state.muted;for(const pc of state.peers.values()){const sender=pc.getSenders().find(x=>x.track?.kind==="audio");if(sender)await sender.replaceTrack(t)}state.micStream?.getTracks().forEach(x=>x.stop());state.micStream=s;monitorSpeaking(s,state.user.id)}

/* =========================================================
   SERVERS
========================================================= */
async function loadServers(preferId=null){
  const {data,error}=await supabaseClient.from("servidores").select("id,nome,descricao,foto_url,dono_id,criado_em").order("criado_em");
  if(error){console.error(error);return}
  state.servers=data||[]; renderServerRail(); renderHomeServers();
  const saved=preferId||localStorage.getItem("lzz_servidor_atual"); const chosen=state.servers.find(s=>s.id===saved)||state.servers[0];
  if(chosen) await selectServer(chosen.id); else showHome();
}
function renderServerRail(){
  dom.serverList.innerHTML="";
  dom.btnServidorHome.classList.toggle("ativo", !state.server || state.currentMode === "home");
  state.servers.forEach(s=>{
    const b=document.createElement("button");
    b.className="server-item"+(state.server?.id===s.id?" ativo":"");
    b.title=s.nome;
    if(s.foto_url){
      const img=document.createElement("img");
      img.src=s.foto_url;
      img.alt=s.nome;
      b.appendChild(img);
    }else{
      b.textContent=first(s.nome);
    }
    b.onclick=()=>selectServer(s.id);
    dom.serverList.appendChild(b);
  });
}
function renderHomeServers(){
  dom.homeServerGrid.innerHTML="";
  if(!state.servers.length){
  dom.homeServerGrid.innerHTML=
    '<div class="empty-pane">' +
      '<div class="empty-icon"><img src="img/logo.png" alt="LZZ Voice"></div>' +
      '<h2>Nenhum servidor</h2>' +
      '<p>Crie o primeiro ou entre por convite.</p>' +
    '</div>';

  return;
}
  state.servers.forEach(s=>{const c=document.createElement("button");c.className="home-server-card";c.innerHTML=`<div class="home-server-icon">${esc(first(s.nome))}</div><strong>${esc(s.nome)}</strong><span>${s.dono_id===state.user.id?"Você é o dono":"Membro"}</span>`;c.onclick=()=>selectServer(s.id);dom.homeServerGrid.appendChild(c)});
}
async function selectServer(id){
  const s=state.servers.find(x=>x.id===id); if(!s)return;
  if(state.server?.id!==id){await leaveCall();await clearServerRealtime()}
  state.server=s;localStorage.setItem("lzz_servidor_atual",id);dom.sidebarServidorNome.textContent=s.nome;dom.settingsServerName.textContent=s.nome;dom.editServerName.value=s.nome;dom.editServerDescription.value=s.descricao||"";
  await Promise.all([loadRolesAndPermissions(),loadChannels()]); renderServerRail();renderHomeServers(); updatePermissionUI();
  const voice=state.channels.find(c=>c.tipo==="voz"), text=state.channels.find(c=>c.tipo==="texto"); state.currentVoice=voice||null;state.currentText=text||null;
  await setupAllPresence();
  if(state.currentVoice) await selectVoiceChannel(state.currentVoice.id,false); else if(state.currentText) await selectTextChannel(state.currentText.id,false); else showHome();
}
async function clearServerRealtime(){
  if(state.chatRealtime){await supabaseClient.removeChannel(state.chatRealtime);state.chatRealtime=null}
  for(const ch of state.presenceChannels.values()){try{await supabaseClient.removeChannel(ch)}catch{}} state.presenceChannels.clear();state.presenceStates.clear();
}
function extractInvite(v){const raw=String(v||"").trim();try{const u=new URL(raw);return (u.searchParams.get("invite")||u.pathname.split("/").filter(Boolean).pop()||"").toUpperCase()}catch{return raw.replace(/^invite:/i,"").toUpperCase()}}
function showServerModal(mode="create"){openModal(dom.serverModal);const create=mode==="create";dom.tabCriarServidor.classList.toggle("ativo",create);dom.tabEntrarServidor.classList.toggle("ativo",!create);dom.criarServidorForm.classList.toggle("hidden",!create);dom.entrarServidorForm.classList.toggle("hidden",create);dom.serverModalTitle.textContent=create?"Criar servidor":"Entrar com convite";setStatus(dom.serverModalStatus)}
dom.btnAbrirCriarServidor.onclick=()=>showServerModal("create");dom.homeCriarServidor.onclick=()=>showServerModal("create");dom.btnAbrirEntrarServidor.onclick=()=>showServerModal("join");dom.homeEntrarServidor.onclick=()=>showServerModal("join");dom.btnFecharServidorModal.onclick=()=>closeModal(dom.serverModal);dom.tabCriarServidor.onclick=()=>showServerModal("create");dom.tabEntrarServidor.onclick=()=>showServerModal("join");
dom.criarServidorForm.onsubmit=async(e)=>{e.preventDefault();try{const name=dom.novoServidorNome.value.trim();const {data,error}=await supabaseClient.rpc("criar_servidor",{p_nome:name,p_foto_url:null});if(error)throw error;dom.novoServidorNome.value="";closeModal(dom.serverModal);await loadServers(data)}catch(err){setStatus(dom.serverModalStatus,err.message)}};
dom.entrarServidorForm.onsubmit=async(e)=>{e.preventDefault();try{const code=extractInvite(dom.conviteCodigo.value);const {data,error}=await supabaseClient.rpc("aceitar_convite",{p_codigo:code});if(error)throw error;dom.conviteCodigo.value="";closeModal(dom.serverModal);await loadServers(data);history.replaceState({},"",location.pathname)}catch(err){setStatus(dom.serverModalStatus,err.message)}};
async function acceptInviteFromUrl(){const code=new URLSearchParams(location.search).get("invite");if(code){dom.conviteCodigo.value=code;showServerModal("join")}}
async function createInvite(copy=true){if(!state.server)return;try{const {data,error}=await supabaseClient.rpc("criar_convite",{p_servidor_id:state.server.id,p_expira_em:null,p_max_usos:null});if(error)throw error;const link=`https://lzz-voice.vercel.app/?invite=${encodeURIComponent(data)}`;if(copy){try{await navigator.clipboard.writeText(link);alert(`Convite copiado!\n\n${link}`)}catch{prompt("Copie o convite:",link)}}return link}catch(e){alert(e.message)}}
dom.btnConvidarServidor.onclick=()=>createInvite(true);dom.btnInviteFromVoice.onclick=()=>createInvite(true);
dom.btnServidorHome.onclick=()=>showHome();

/* =========================================================
   ROLES + PERMISSIONS
========================================================= */
async function loadRolesAndPermissions(){
  if(!state.server)return;
  const [{data:roles},{data:assignments}]=await Promise.all([
    supabaseClient.from("cargos").select("id,servidor_id,nome,cor,posicao,sistema,permissoes").eq("servidor_id",state.server.id).order("posicao",{ascending:false}),
    supabaseClient.from("membro_cargos").select("cargo_id").eq("servidor_id",state.server.id).eq("usuario_id",state.user.id)
  ]);
  state.roles=roles||[];state.currentPermissions={};
  if(state.server.dono_id===state.user.id) ALL_PERMISSIONS.forEach(p=>state.currentPermissions[p]=true);
  else (assignments||[]).forEach(a=>{const r=state.roles.find(x=>x.id===a.cargo_id);if(r?.permissoes)ALL_PERMISSIONS.forEach(p=>{if(r.permissoes[p]===true)state.currentPermissions[p]=true})});
}
function updatePermissionUI(){
  dom.btnCriarCanalTexto.classList.toggle("hidden",!has("manage_channels"));
  dom.btnCriarCanalVoz.classList.toggle("hidden",!has("manage_channels"));
  dom.btnGerenciarServidor.classList.toggle("hidden",!(has("manage_server")||has("manage_members")||has("manage_roles")||has("create_invite")));
  dom.btnConvidarServidor.classList.toggle("hidden",!has("create_invite"));
  dom.btnInviteFromVoice.classList.toggle("hidden",!has("create_invite"));
  dom.btnEditarCanalAtual.classList.toggle("hidden",!has("manage_channels"));
}

/* =========================================================
   CHANNELS + PRESENCE SIDEBAR
========================================================= */
async function loadChannels(){
  if(!state.server)return;
  const {data,error}=await supabaseClient.from("canais").select("id,servidor_id,nome,tipo,privado,ordem,criado_por").eq("servidor_id",state.server.id).order("ordem");if(error){console.error(error);state.channels=[]}else state.channels=data||[];
  renderChannels();
}
function renderChannels(){
  dom.textChannelList.innerHTML="";dom.voiceChannelList.innerHTML="";
  state.channels.filter(c=>c.tipo==="texto").forEach(c=>dom.textChannelList.appendChild(channelNode(c)));
  state.channels.filter(c=>c.tipo==="voz").forEach(c=>{const wrap=document.createElement("div");wrap.className="voice-channel-wrap";wrap.appendChild(channelNode(c));const p=document.createElement("div");p.className="voice-presence-list";p.dataset.presenceFor=c.id;wrap.appendChild(p);dom.voiceChannelList.appendChild(wrap)});
  if(!dom.textChannelList.children.length)dom.textChannelList.innerHTML='<div class="voice-presence-user">Nenhum canal</div>';
  if(!dom.voiceChannelList.children.length)dom.voiceChannelList.innerHTML='<div class="voice-presence-user">Nenhuma call</div>';
  renderAllPresence();
}
function channelNode(c){
  const row=document.createElement("div");
  row.className="channel-row";
  const b=document.createElement("button");
  b.className="channel"+((c.tipo==="texto"&&state.currentText?.id===c.id)||(c.tipo==="voz"&&state.currentVoice?.id===c.id)?" ativo":"");
  b.innerHTML=`<span class="channel-icon">${c.tipo==="texto"?"#":"◉"}</span><span class="channel-name">${esc(c.nome)}</span>${c.privado?'<span class="channel-lock">🔒</span>':""}`;
  b.onclick=()=>c.tipo==="texto"?selectTextChannel(c.id):selectVoiceChannel(c.id);
  row.appendChild(b);
  if(has("manage_channels")){
    const g=document.createElement("button");
    g.className="channel-settings-mini";
    g.textContent="⚙";
    g.title="Editar canal";
    g.onclick=e=>{e.stopPropagation();openChannelModal(c.tipo,c)};
    row.appendChild(g);
  }
  return row;
}
async function selectTextChannel(id,updateMode=true){const c=state.channels.find(x=>x.id===id&&x.tipo==="texto");if(!c)return;state.currentText=c;state.lastAgoraMode="chat";renderChannels();if(updateMode)showView("chat");dom.chatServerName.textContent=state.server.nome;dom.chatCanalNome.textContent=c.nome;dom.workspaceKicker.textContent=state.server.nome;dom.workspaceTitle.textContent=`# ${c.nome}`;dom.chatInput.placeholder=`Mensagem em #${c.nome}`;dom.channelSidebar.classList.remove("aberta");dom.mobileOverlay.classList.add("hidden");await loadChannelMessages();await connectChannelChat()}
async function selectVoiceChannel(id,updateMode=true){const c=state.channels.find(x=>x.id===id&&x.tipo==="voz");if(!c)return;if(state.connected&&state.currentVoice?.id!==id){alert("Saia da call antes de trocar de canal.");return}state.currentVoice=c;state.lastAgoraMode="voice";renderChannels();if(updateMode)showView("voice");dom.servidorAtualNome.textContent=state.server.nome;dom.tituloSala.textContent=c.nome;dom.nomeCanal.textContent=c.nome;dom.miniCanalNome.textContent=c.nome;dom.workspaceKicker.textContent=state.server.nome;dom.workspaceTitle.textContent=c.nome;dom.channelSidebar.classList.remove("aberta");dom.mobileOverlay.classList.add("hidden");renderSelectedPresence();await syncMyModeration(c.id,{baselineOnly:true});if(dom.participantDrawer&&!dom.participantDrawer.classList.contains("hidden"))await renderParticipantDrawer()}

async function setupAllPresence(){
  for(const ch of state.presenceChannels.values()){try{await supabaseClient.removeChannel(ch)}catch{}}state.presenceChannels.clear();state.presenceStates.clear();
  for(const c of state.channels.filter(x=>x.tipo==="voz")){
    const topic=`server:${state.server.id}:presence:${c.id}`;
    const ch=supabaseClient.channel(topic,{config:{private:true,presence:{key:state.user.id}}});
    ch.on("presence",{event:"sync"},()=>{state.presenceStates.set(c.id,ch.presenceState());renderPresenceFor(c.id);if(state.connected&&state.currentVoice?.id===c.id){syncPeersWithPresence();connectExistingPeers().catch(console.warn)}});
    ch.on("presence",{event:"join"},()=>{state.presenceStates.set(c.id,ch.presenceState());renderPresenceFor(c.id)});
    ch.on("presence",{event:"leave"},()=>{state.presenceStates.set(c.id,ch.presenceState());renderPresenceFor(c.id)});
    ch.on("broadcast",{event:"moderacao"},async(event)=>{
      const payload=event.payload||{};
      if(payload.canal_id!==c.id)return;

      if(payload.usuario_id===state.user?.id){
        await syncMyModeration(
          c.id,
          {fromEvent:true}
        );
      }

      if(
        state.currentVoice?.id===c.id &&
        dom.participantDrawer &&
        !dom.participantDrawer.classList.contains("hidden")
      ){
        await renderParticipantDrawer();
      }
    });
    await new Promise(resolve=>ch.subscribe(s=>{if(s==="SUBSCRIBED"||s==="CHANNEL_ERROR"||s==="TIMED_OUT")resolve()}));state.presenceChannels.set(c.id,ch);state.presenceStates.set(c.id,ch.presenceState());
  }
  renderAllPresence();
}
function presenceUsers(channelId){const raw=state.presenceStates.get(channelId)||{};const out=[];for(const [key,arr] of Object.entries(raw)){if(!arr?.length)continue;const p=arr[0];out.push({key,id:p.user_id||key,name:p.nome||"Usuário",avatar:p.avatar_url||null})}return out}
function renderPresenceFor(id){
  const box=document.querySelector(`[data-presence-for="${id}"]`);

  if(box){
    box.innerHTML="";

    presenceUsers(id).forEach(u=>{
      const row=document.createElement("div");
      row.className="voice-presence-user";

      const av=document.createElement("div");
      av.className="tiny-avatar";
      applyAvatar(av,u.name,u.avatar);

      row.append(
        av,
        Object.assign(
          document.createElement("span"),
          {textContent:u.name}
        )
      );

      box.appendChild(row);
    });
  }

  if(state.currentVoice?.id===id){
    renderSelectedPresence();

    if(
      dom.participantDrawer &&
      !dom.participantDrawer.classList.contains("hidden")
    ){
      renderParticipantDrawer().catch(console.warn);
    }
  }
}

function renderAllPresence(){
  state.channels
    .filter(c=>c.tipo==="voz")
    .forEach(c=>renderPresenceFor(c.id));
}

function renderFooterPresence(users){
  if(!dom.usuariosCanal)return;

  dom.usuariosCanal.innerHTML="";

  users.slice(0,8).forEach(u=>{
    const row=document.createElement("div");
    row.className="usuario-canal";

    const av=document.createElement("div");
    av.className="avatar-canal";
    applyAvatar(av,u.name,u.avatar);

    const name=document.createElement("span");
    name.className="usuario-canal-nome";
    name.textContent=u.name;

    row.append(av,name);
    dom.usuariosCanal.appendChild(row);
  });

  if(users.length>8){
    const more=document.createElement("span");
    more.className="usuario-canal";
    more.textContent=`+${users.length-8}`;
    dom.usuariosCanal.appendChild(more);
  }
}

function renderSelectedPresence(){
  dom.usersGrid.innerHTML="";

  const users=
    state.currentVoice
      ? presenceUsers(state.currentVoice.id)
      : [];

  dom.voiceMemberCount.textContent=
    `${users.length} na sala`;

  renderFooterPresence(users);

  if(!users.length){
    dom.usersGrid.innerHTML=
      '<div class="empty-state"><div class="empty-state-orbit"><span></span></div><h3>Ninguém conectado</h3><p>Entre na sala para começar.</p></div>';

    return;
  }

  users.forEach(u=>{
    const card=document.createElement("div");
    card.className="user-card";
    card.dataset.userId=u.id;

    const av=document.createElement("div");
    av.className="user-avatar";
    applyAvatar(av,u.name,u.avatar);

    const name=document.createElement("strong");
    name.className="user-name";
    name.textContent=u.name;

    const small=document.createElement("small");
    small.className="user-mic";
    small.textContent="na call";

    card.append(av,name,small);
    dom.usersGrid.appendChild(card);
  });
}

/* =========================================================
   DRAWER DE PARTICIPANTES / MODERAÇÃO DA CALL
========================================================= */

function moderationRowFor(userId){
  return state.moderationStates.get(userId) || {
    usuario_id:userId,
    server_muted:false,
    kick_version:0
  };
}

async function loadModerationStates(channelId){
  state.moderationStates.clear();

  if(!channelId)return;

  const {data,error}=
    await supabaseClient
      .from("call_moderacao")
      .select("usuario_id,server_muted,kick_version")
      .eq("canal_id",channelId);

  if(error){
    console.warn("Moderação da call:",error);
    return;
  }

  (data||[]).forEach(row=>{
    state.moderationStates.set(row.usuario_id,row);
  });
}

function applyServerMuteVisual(){
  const forced=state.serverMuted===true;

  if(state.connected){
    state.micStream
      ?.getAudioTracks()
      .forEach(track=>{
        track.enabled=
          !state.muted &&
          !forced;
      });
  }

  dom.btnMute?.classList.toggle(
    "server-muted",
    forced
  );

  if(dom.btnMute){
    dom.btnMute.title=
      forced
        ? "Mutado por um moderador"
        : "Microfone";
  }

  if(dom.profileMic){
    dom.profileMic.textContent=
      forced
        ? "🔇"
        : state.muted
          ? "🔇"
          : "🎙";
  }
}

async function syncMyModeration(
  channelId,
  {
    fromEvent=false,
    baselineOnly=false
  }={}
){
  if(!channelId||!state.user)return;

  const {data,error}=
    await supabaseClient
      .from("call_moderacao")
      .select("usuario_id,server_muted,kick_version")
      .eq("canal_id",channelId)
      .eq("usuario_id",state.user.id)
      .maybeSingle();

  if(error){
    console.warn("Estado da moderação:",error);
    return;
  }

  const row=
    data || {
      usuario_id:state.user.id,
      server_muted:false,
      kick_version:0
    };

  const previous=
    state.kickBaseline.get(channelId);

  if(previous===undefined || baselineOnly){
    state.kickBaseline.set(
      channelId,
      Number(row.kick_version||0)
    );
  }else if(
    fromEvent &&
    Number(row.kick_version||0) >
      Number(previous||0)
  ){
    state.kickBaseline.set(
      channelId,
      Number(row.kick_version||0)
    );

    if(
      state.connected &&
      state.currentVoice?.id===channelId
    ){
      await leaveCall();

      alert(
        "Você foi removido da call por um moderador."
      );
    }
  }else{
    state.kickBaseline.set(
      channelId,
      Math.max(
        Number(previous||0),
        Number(row.kick_version||0)
      )
    );
  }

  if(state.currentVoice?.id===channelId){
    state.serverMuted=
      row.server_muted===true;

    applyServerMuteVisual();
  }
}

async function broadcastModeration(
  channelId,
  userId,
  type
){
  const ch=
    state.presenceChannels.get(channelId);

  if(!ch)return;

  try{
    await ch.send({
      type:"broadcast",
      event:"moderacao",
      payload:{
        canal_id:channelId,
        usuario_id:userId,
        tipo:type,
        ts:Date.now()
      }
    });
  }catch(error){
    console.warn(
      "Broadcast de moderação:",
      error
    );
  }
}

async function moderateMuteUser(
  userId,
  shouldMute
){
  if(!state.currentVoice)return;

  const {error}=
    await supabaseClient.rpc(
      "definir_mute_call",
      {
        p_canal_id:state.currentVoice.id,
        p_usuario_id:userId,
        p_mutado:shouldMute
      }
    );

  if(error){
    alert(error.message);
    return;
  }

  await broadcastModeration(
    state.currentVoice.id,
    userId,
    shouldMute ? "mute" : "unmute"
  );

  await renderParticipantDrawer();
}

async function kickUserFromCall(userId){
  if(!state.currentVoice)return;

  const user=
    presenceUsers(state.currentVoice.id)
      .find(x=>x.id===userId);

  if(
    !confirm(
      `Expulsar ${user?.name||"este usuário"} da call?`
    )
  ){
    return;
  }

  const {error}=
    await supabaseClient.rpc(
      "expulsar_da_call",
      {
        p_canal_id:state.currentVoice.id,
        p_usuario_id:userId
      }
    );

  if(error){
    alert(error.message);
    return;
  }

  await broadcastModeration(
    state.currentVoice.id,
    userId,
    "kick"
  );
}

async function renderParticipantDrawer(){
  if(!dom.participantDrawerList)return;

  const users=
    state.currentVoice
      ? presenceUsers(state.currentVoice.id)
      : [];

  dom.participantDrawerList.innerHTML="";

  if(!state.currentVoice){
    dom.participantDrawerList.innerHTML=
      '<div class="participant-drawer-empty">Selecione uma call primeiro.</div>';
    return;
  }

  await loadModerationStates(
    state.currentVoice.id
  );

  if(!users.length){
    dom.participantDrawerList.innerHTML=
      '<div class="participant-drawer-empty">Ninguém está nessa call.</div>';
    return;
  }

  users.forEach(user=>{
    const moderation=
      moderationRowFor(user.id);

    const row=
      document.createElement("div");

    row.className="participant-row";

    const avatar=
      document.createElement("div");

    avatar.className=
      "participant-row-avatar";

    applyAvatar(
      avatar,
      user.name,
      user.avatar
    );

    const copy=
      document.createElement("div");

    copy.className=
      "participant-row-copy";

    const name=
      document.createElement("strong");

    name.textContent=
      user.id===state.user.id
        ? `${user.name} (você)`
        : user.name;

    const status=
      document.createElement("span");

    if(moderation.server_muted){
      status.textContent=
        "Mutado por moderador";

      status.className=
        "server-muted-label";
    }else{
      status.textContent="Na call";
    }

    copy.append(name,status);

    row.append(avatar,copy);

    if(
      has("manage_voice") &&
      user.id!==state.user.id
    ){
      const actions=
        document.createElement("div");

      actions.className=
        "participant-row-actions";

      const muteBtn=
        document.createElement("button");

      muteBtn.type="button";
      muteBtn.textContent=
        moderation.server_muted
          ? "Desmutar"
          : "Mutar";

      muteBtn.onclick=()=>moderateMuteUser(
        user.id,
        !moderation.server_muted
      );

      const kickBtn=
        document.createElement("button");

      kickBtn.type="button";
      kickBtn.className=
        "participant-kick-btn";

      kickBtn.textContent="Expulsar";

      kickBtn.onclick=()=>kickUserFromCall(
        user.id
      );

      actions.append(
        muteBtn,
        kickBtn
      );

      row.appendChild(actions);
    }

    dom.participantDrawerList.appendChild(row);
  });
}

function openParticipantDrawer(){
  dom.participantDrawer?.classList.remove(
    "hidden"
  );

  if(dom.btnToggleParticipants){
    dom.btnToggleParticipants.textContent="⇩";
    dom.btnToggleParticipants.setAttribute(
      "aria-expanded",
      "true"
    );
  }

  renderParticipantDrawer().catch(console.warn);
}

function closeParticipantDrawer(){
  dom.participantDrawer?.classList.add(
    "hidden"
  );

  if(dom.btnToggleParticipants){
    dom.btnToggleParticipants.textContent="⇧";
    dom.btnToggleParticipants.setAttribute(
      "aria-expanded",
      "false"
    );
  }
}

dom.btnToggleParticipants?.addEventListener(
  "click",
  ()=>{
    if(
      dom.participantDrawer?.classList.contains(
        "hidden"
      )
    ){
      openParticipantDrawer();
    }else{
      closeParticipantDrawer();
    }
  }
);

dom.btnCloseParticipants?.addEventListener(
  "click",
  closeParticipantDrawer
);


/* =========================================================
   CHANNEL MODAL / PRIVATE CHANNELS
========================================================= */
async function loadChannelRoleChecks(selected=[]){dom.channelRoleChecks.innerHTML="";state.roles.filter(r=>r.nome!=="Dono").forEach(r=>{const l=document.createElement("label");l.innerHTML=`<input type="checkbox" value="${r.id}" ${selected.includes(r.id)?"checked":""}> <span style="color:${esc(r.cor)}">${esc(r.nome)}</span>`;dom.channelRoleChecks.appendChild(l)})}
async function openChannelModal(type,channel=null){
  if(!has("manage_channels"))return;dom.novoCanalTipo.value=type;dom.editarCanalId.value=channel?.id||"";dom.channelModalTitle.textContent=channel?`Editar ${channel.nome}`:`Criar canal de ${type}`;dom.novoCanalNome.value=channel?.nome||"";dom.novoCanalPrivado.checked=channel?.privado||false;dom.btnApagarCanal.classList.toggle("hidden",!channel);setStatus(dom.channelModalStatus);
  let selected=[];if(channel){const {data}=await supabaseClient.from("canal_cargos").select("cargo_id").eq("canal_id",channel.id);selected=(data||[]).map(x=>x.cargo_id)}await loadChannelRoleChecks(selected);dom.channelRoleAccess.classList.toggle("hidden",!dom.novoCanalPrivado.checked);openModal(dom.channelModal);dom.novoCanalNome.focus();
}
dom.novoCanalPrivado.onchange=()=>dom.channelRoleAccess.classList.toggle("hidden",!dom.novoCanalPrivado.checked);
dom.btnCriarCanalTexto.onclick=()=>openChannelModal("texto");dom.btnCriarCanalVoz.onclick=()=>openChannelModal("voz");dom.btnFecharCanalModal.onclick=()=>closeModal(dom.channelModal);dom.btnEditarCanalAtual.onclick=()=>state.currentText&&openChannelModal("texto",state.currentText);
dom.criarCanalForm.onsubmit=async(e)=>{e.preventDefault();try{const id=dom.editarCanalId.value||null,name=dom.novoCanalNome.value.trim(),priv=dom.novoCanalPrivado.checked,roles=[...dom.channelRoleChecks.querySelectorAll("input:checked")].map(x=>x.value);let error;if(id)({error}=await supabaseClient.rpc("atualizar_canal",{p_canal_id:id,p_nome:name,p_privado:priv,p_cargo_ids:roles}));else({error}=await supabaseClient.rpc("criar_canal",{p_servidor_id:state.server.id,p_nome:name,p_tipo:dom.novoCanalTipo.value,p_privado:priv,p_cargo_ids:roles}));if(error)throw error;closeModal(dom.channelModal);await loadChannels();await setupAllPresence();updatePermissionUI()}catch(err){setStatus(dom.channelModalStatus,err.message)}};
dom.btnApagarCanal.onclick=async()=>{const id=dom.editarCanalId.value;if(!id||!confirm("Apagar este canal?"))return;const {error}=await supabaseClient.rpc("apagar_canal",{p_canal_id:id});if(error)return setStatus(dom.channelModalStatus,error.message);closeModal(dom.channelModal);await loadChannels();state.currentText=state.channels.find(c=>c.tipo==="texto")||null;state.currentVoice=state.channels.find(c=>c.tipo==="voz")||null;await setupAllPresence();state.currentVoice?selectVoiceChannel(state.currentVoice.id):showHome()};

/* =========================================================
   CHAT CHANNEL
========================================================= */
function messageHtml(m){return `<div class="message"><div class="message-avatar" style="${m.autor_avatar?`background-image:url('${esc(m.autor_avatar)}')`:""}">${m.autor_avatar?"":esc(first(m.autor_nome))}</div><div><div class="message-top"><span class="message-author">${esc(m.autor_nome)}</span><span class="message-time">${fmtTime(m.criado_em)}</span></div><div class="message-text">${esc(m.texto)}</div></div></div>`}
async function loadChannelMessages(){
  if(!state.currentText)return;dom.messages.innerHTML=`<div class="chat-welcome"><div class="welcome-icon">#</div><h2>Bem-vindo ao #${esc(state.currentText.nome)}</h2><p>Este é o começo deste canal.</p></div>`;state.displayedMessages.clear();
  const {data,error}=await supabaseClient.from("mensagens_canal").select("*").eq("canal_id",state.currentText.id).order("criado_em").limit(150);if(error){console.error(error);return}(data||[]).forEach(addChannelMessage);dom.messages.scrollTop=dom.messages.scrollHeight;
}
function addChannelMessage(m){if(state.displayedMessages.has(m.id))return;state.displayedMessages.add(m.id);dom.messages.insertAdjacentHTML("beforeend",messageHtml(m));dom.messages.scrollTop=dom.messages.scrollHeight}
async function connectChannelChat(){if(state.chatRealtime){await supabaseClient.removeChannel(state.chatRealtime);state.chatRealtime=null}if(!state.currentText)return;const topic=`server:${state.server.id}:chat:${state.currentText.id}`;const ch=supabaseClient.channel(topic,{config:{private:true}});ch.on("broadcast",{event:"message"},e=>{if(e.payload?.canal_id===state.currentText?.id)addChannelMessage(e.payload)});ch.subscribe();state.chatRealtime=ch}
dom.chatForm.onsubmit=async(e)=>{e.preventDefault();if(!state.currentText)return;const text=dom.chatInput.value.trim();if(!text)return;dom.chatInput.value="";const payload={servidor_id:state.server.id,canal_id:state.currentText.id,autor_id:state.user.id,autor_nome:state.profile.username,autor_avatar:state.profile.avatar_url,texto:text};const {data,error}=await supabaseClient.from("mensagens_canal").insert(payload).select().single();if(error){alert(error.message);return}addChannelMessage(data);await state.chatRealtime?.send({type:"broadcast",event:"message",payload:data})};

/* =========================================================
   VOICE + WEBRTC + SCREEN SHARE
========================================================= */
async function startCallService(){try{await window.Capacitor?.Plugins?.CallService?.start()}catch(e){console.warn(e)}}
async function stopCallService(){try{await window.Capacitor?.Plugins?.CallService?.stop()}catch(e){console.warn(e)}}
async function joinCall(){
  if(state.connected||!state.currentVoice)return;
  try{
    state.micStream=await navigator.mediaDevices.getUserMedia({audio:micConstraints()});dom.status.textContent="Conectando...";
    await syncMyModeration(state.currentVoice.id,{baselineOnly:true});
    applyServerMuteVisual();
    const topic=`server:${state.server.id}:voice:${state.currentVoice.id}`;state.signaling=supabaseClient.channel(topic,{config:{private:true}});
    state.signaling.on("broadcast",{event:"webrtc"},e=>receiveSignal(e.payload));
    await new Promise((resolve,reject)=>state.signaling.subscribe(s=>{if(s==="SUBSCRIBED")resolve();if(s==="CHANNEL_ERROR"||s==="TIMED_OUT")reject(new Error("Falha na conexão da call."))}));
    const p=state.presenceChannels.get(state.currentVoice.id);if(p)await p.track({user_id:state.user.id,nome:state.profile.username,avatar_url:state.profile.avatar_url,online_at:new Date().toISOString()});
    state.connected=true;dom.btnEntrar.classList.add("hidden");dom.btnMute.disabled=false;dom.btnAudio.disabled=false;dom.btnCompartilharTela.disabled=false;dom.btnSair.disabled=false;dom.status.textContent=`Conectado em ${state.currentVoice.nome}`;dom.miniStatus.textContent="Conectado";monitorSpeaking(state.micStream,state.user.id);await connectExistingPeers();await startCallService();
  }catch(e){console.error(e);alert(e.message);await leaveCall()}
}
async function leaveCall(){
  if(!state.connected&&!state.micStream&&!state.signaling)return;state.connected=false;
  if(state.currentVoice){try{await state.presenceChannels.get(state.currentVoice.id)?.untrack()}catch{}}
  await stopScreenShare();for(const pc of state.peers.values())pc.close();state.peers.clear();state.pendingIce.clear();for(const m of state.speakingMonitors.values())m.stop();state.speakingMonitors.clear();for(const a of state.remoteAudios.values()){a.srcObject=null;a.remove()}state.remoteAudios.clear();for(const v of state.remoteVideos.values())v.remove();state.remoteVideos.clear();state.micStream?.getTracks().forEach(t=>t.stop());state.micStream=null;if(state.signaling){await supabaseClient.removeChannel(state.signaling);state.signaling=null}await stopCallService();dom.btnEntrar.classList.remove("hidden");dom.btnMute.disabled=true;dom.btnAudio.disabled=true;dom.btnCompartilharTela.disabled=true;dom.btnSair.disabled=true;dom.btnMute.classList.remove("ativo");dom.btnAudio.classList.remove("ativo");dom.status.textContent="Você não está conectado.";state.muted=false;state.deafened=false;
}
function createPeer(remoteId){
  if(state.peers.has(remoteId))return state.peers.get(remoteId);const pc=new RTCPeerConnection(rtcConfig);state.micStream?.getTracks().forEach(t=>pc.addTrack(t,state.micStream));const vt=pc.addTransceiver("video",{direction:"sendrecv"});const screenTrack=state.screenStream?.getVideoTracks?.()[0];if(screenTrack){vt.sender.replaceTrack(screenTrack).then(()=>configureScreenSender(vt.sender,state.screenShareConfig.fps)).catch(console.warn);}
  pc.onicecandidate=e=>{if(e.candidate)sendSignal({tipo:"candidate",destino:remoteId,candidate:e.candidate})};
  pc.ontrack=e=>{const stream=e.streams[0]||new MediaStream([e.track]);if(e.track.kind==="audio")attachRemoteAudio(remoteId,stream);else attachRemoteVideo(remoteId,stream)};
  pc.onconnectionstatechange=()=>{if(["failed","closed","disconnected"].includes(pc.connectionState))removePeer(remoteId)};state.peers.set(remoteId,pc);return pc;
}
async function connectExistingPeers(){const users=presenceUsers(state.currentVoice.id).filter(u=>u.id!==state.user.id);for(const u of users){if(!state.peers.has(u.id)&&state.user.id<u.id)await makeOffer(u.id)}}
function syncPeersWithPresence(){if(!state.currentVoice)return;const active=new Set(presenceUsers(state.currentVoice.id).map(u=>u.id));for(const id of state.peers.keys())if(!active.has(id))removePeer(id)}
async function makeOffer(id){const pc=createPeer(id);const offer=await pc.createOffer();await pc.setLocalDescription(offer);await sendSignal({tipo:"offer",destino:id,sdp:pc.localDescription})}
async function sendSignal(data){await state.signaling?.send({type:"broadcast",event:"webrtc",payload:{...data,origem:state.user.id}})}
async function receiveSignal(d){if(!d||d.origem===state.user.id||(d.destino&&d.destino!==state.user.id))return;const id=d.origem;let pc=state.peers.get(id);if(d.tipo==="offer"){pc=pc||createPeer(id);await pc.setRemoteDescription(d.sdp);await flushIce(id,pc);const ans=await pc.createAnswer();await pc.setLocalDescription(ans);await sendSignal({tipo:"answer",destino:id,sdp:pc.localDescription})}else if(d.tipo==="answer"&&pc){await pc.setRemoteDescription(d.sdp);await flushIce(id,pc)}else if(d.tipo==="candidate"&&d.candidate){if(!pc||!pc.remoteDescription){const a=state.pendingIce.get(id)||[];a.push(d.candidate);state.pendingIce.set(id,a)}else try{await pc.addIceCandidate(d.candidate)}catch(e){console.warn(e)}}}
async function flushIce(id,pc){for(const c of state.pendingIce.get(id)||[])try{await pc.addIceCandidate(c)}catch{}state.pendingIce.delete(id)}
function removePeer(id){const pc=state.peers.get(id);if(pc){pc.close();state.peers.delete(id)}const a=state.remoteAudios.get(id);if(a){a.remove();state.remoteAudios.delete(id)}const v=state.remoteVideos.get(id);if(v){v.remove();state.remoteVideos.delete(id)}state.speakingMonitors.get(id)?.stop()}
function attachRemoteAudio(id,stream){let a=state.remoteAudios.get(id);if(!a){a=document.createElement("audio");a.autoplay=true;a.playsInline=true;document.body.appendChild(a);state.remoteAudios.set(id,a)}a.muted=state.deafened;a.srcObject=stream;applyOutput(a);a.play().catch(()=>{});monitorSpeaking(stream,id)}
function attachRemoteVideo(id,stream){let tile=state.remoteVideos.get(id);if(!tile){tile=document.createElement("div");tile.className="screen-tile";const v=document.createElement("video");v.autoplay=true;v.playsInline=true;const label=document.createElement("span");label.textContent=presenceUsers(state.currentVoice?.id).find(x=>x.id===id)?.name||"Tela compartilhada";tile.append(v,label);dom.screenShareArea.appendChild(tile);state.remoteVideos.set(id,tile)}tile.querySelector("video").srcObject=stream;dom.screenShareArea.classList.remove("hidden")}
function monitorSpeaking(stream,id){if(state.speakingMonitors.has(id)||!stream?.getAudioTracks().length)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ctx=new AC(),an=ctx.createAnalyser(),src=ctx.createMediaStreamSource(stream);src.connect(an);an.fftSize=256;const buf=new Uint8Array(an.fftSize);let raf,last=0;const run=()=>{an.getByteTimeDomainData(buf);let sum=0;for(const x of buf){const v=(x-128)/128;sum+=v*v}if(Math.sqrt(sum/buf.length)>.025)last=Date.now();document.querySelector(`[data-user-id="${id}"]`)?.classList.toggle("falando",Date.now()-last<220);raf=requestAnimationFrame(run)};run();state.speakingMonitors.set(id,{stop(){cancelAnimationFrame(raf);src.disconnect();ctx.close().catch(()=>{});state.speakingMonitors.delete(id)}})}
function screenQualityConfig(value){
  const map={
    "720":{width:1280,height:720,label:"720p"},
    "1080":{width:1920,height:1080,label:"1080p"},
    "1440":{width:2560,height:1440,label:"1440p"},
    "2160":{width:3840,height:2160,label:"4K"}
  };
  return map[String(value)]||map["1080"];
}

function isElectronDesktop(){
  return Boolean(
    window.lzzDesktop?.getScreenSources
  );
}

function screenVideoSender(pc){
  const transceiver=
    pc.getTransceivers?.().find(
      item =>
        item.receiver?.track?.kind === "video"
    );

  return (
    transceiver?.sender ||
    pc.getSenders?.().find(
      sender =>
        sender.track?.kind === "video"
    ) ||
    null
  );
}

function setScreenShareStatus(text,ok=false){
  if(!dom.screenShareStatus)return;

  dom.screenShareStatus.textContent=
    text || "";

  dom.screenShareStatus.classList.toggle(
    "sucesso",
    Boolean(ok)
  );
}

function closeScreenShareModal(){
  dom.screenShareModal?.classList.add(
    "hidden"
  );

  setScreenShareStatus("");
}

async function loadElectronScreenSources(){
  if(!dom.screenSourceGrid)return;

  dom.screenSourceGrid.innerHTML="";
  state.selectedScreenSourceId=null;

  if(!isElectronDesktop()){
    dom.screenSourceGrid.classList.add(
      "browser-mode"
    );

    dom.screenSourceGrid.textContent=
      "O navegador abrirá o seletor de tela/janela quando você clicar em Compartilhar.";

    dom.screenSourceNote.textContent=
      "Escolha qualidade e FPS primeiro.";

    return;
  }

  dom.screenSourceGrid.classList.remove(
    "browser-mode"
  );

  dom.screenSourceNote.textContent=
    "Escolha qual tela ou janela deseja transmitir.";

  setScreenShareStatus(
    "Carregando telas e janelas..."
  );

  try{
    const sources=
      await window.lzzDesktop
        .getScreenSources();

    if(!sources?.length){
      setScreenShareStatus(
        "Nenhuma tela ou janela encontrada."
      );

      return;
    }

    sources.forEach(
      (source,index)=>{
        const btn=
          document.createElement(
            "button"
          );

        btn.type="button";
        btn.className=
          "screen-source-card";

        btn.dataset.sourceId=
          source.id;

        const img=
          document.createElement(
            "img"
          );

        img.src=
          source.thumbnail || "";

        img.alt="";

        const name=
          document.createElement(
            "span"
          );

        name.textContent=
          source.name ||
          `Fonte ${index+1}`;

        btn.append(
          img,
          name
        );

        btn.onclick=()=>{
          state.selectedScreenSourceId=
            source.id;

          dom.screenSourceGrid
            .querySelectorAll(
              ".screen-source-card"
            )
            .forEach(
              item =>
                item.classList.toggle(
                  "ativo",
                  item===btn
                )
            );
        };

        dom.screenSourceGrid
          .appendChild(btn);

        if(index===0){
          btn.click();
        }
      }
    );

    setScreenShareStatus("");
  }catch(error){
    console.error(
      "Fontes de tela:",
      error
    );

    setScreenShareStatus(
      "Não foi possível carregar as telas e janelas."
    );
  }
}

async function openScreenShareModal(){
  if(!state.connected)return;

  if(
    window.Capacitor
      ?.getPlatform?.() === "android"
  ){
    alert(
      "No Android, o compartilhamento de tela ainda precisa do módulo nativo MediaProjection."
    );

    return;
  }

  if(
    !navigator.mediaDevices
      ?.getDisplayMedia
  ){
    alert(
      "Compartilhamento de tela não é suportado neste dispositivo."
    );

    return;
  }

  dom.screenQuality.value=
    state.screenShareConfig
      .quality || "1080";

  dom.screenFps.value=
    String(
      state.screenShareConfig
        .fps || 30
    );

  dom.screenShareModal
    ?.classList.remove(
      "hidden"
    );

  await loadElectronScreenSources();
}

async function applyScreenTrackConfig(
  track,
  quality,
  fps
){
  const cfg=
    screenQualityConfig(
      quality
    );

  track.contentHint="detail";

  try{
    await track.applyConstraints({
      width:{
        ideal:cfg.width,
        max:cfg.width
      },
      height:{
        ideal:cfg.height,
        max:cfg.height
      },
      frameRate:{
        ideal:Number(fps),
        max:Number(fps)
      }
    });
  }catch(error){
    console.warn(
      "Limites de captura:",
      error
    );
  }

  return cfg;
}

async function configureScreenSender(
  sender,
  fps
){
  if(!sender)return;

  try{
    const params=
      sender.getParameters();

    params.encodings=
      params.encodings?.length
        ? params.encodings
        : [{}];

    params.encodings[0]
      .maxFramerate=
        Number(fps);

    params.degradationPreference=
      "maintain-resolution";

    await sender.setParameters(
      params
    );
  }catch(error){
    console.warn(
      "Limite do encoder:",
      error
    );
  }
}

async function startScreenShare(){
  if(!state.connected)return;

  const quality=
    dom.screenQuality?.value ||
    state.screenShareConfig
      .quality ||
    "1080";

  const fps=
    Number(
      dom.screenFps?.value ||
      state.screenShareConfig
        .fps ||
      30
    );

  state.screenShareConfig={
    quality,
    fps
  };

  localStorage.setItem(
    "lzz_screen_quality",
    quality
  );

  localStorage.setItem(
    "lzz_screen_fps",
    String(fps)
  );

  try{
    dom.btnStartScreenShare.disabled=
      true;

    setScreenShareStatus(
      "Iniciando compartilhamento..."
    );

    if(isElectronDesktop()){
      if(
        !state.selectedScreenSourceId
      ){
        setScreenShareStatus(
          "Escolha uma tela ou janela."
        );

        return;
      }

      await window.lzzDesktop
        .selectScreenSource(
          state.selectedScreenSourceId
        );
    }

    const stream=
      await navigator.mediaDevices
        .getDisplayMedia({
          video:true,
          audio:false
        });

    const track=
      stream.getVideoTracks()[0];

    if(!track){
      throw new Error(
        "A captura não retornou vídeo."
      );
    }

    const q=
      await applyScreenTrackConfig(
        track,
        quality,
        fps
      );

    state.screenStream=
      stream;

    for(
      const pc of
        state.peers.values()
    ){
      const sender=
        screenVideoSender(pc);

      if(sender){
        await sender.replaceTrack(
          track
        );

        await configureScreenSender(
          sender,
          fps
        );
      }
    }

    let tile=
      $("localScreenTile");

    if(!tile){
      tile=
        document.createElement(
          "div"
        );

      tile.className=
        "screen-tile";

      tile.id=
        "localScreenTile";

      const video=
        document.createElement(
          "video"
        );

      video.autoplay=true;
      video.muted=true;
      video.playsInline=true;

      const label=
        document.createElement(
          "span"
        );

      tile.append(
        video,
        label
      );

      dom.screenShareArea
        .appendChild(tile);
    }

    tile.querySelector(
      "video"
    ).srcObject=
      stream;

    tile.querySelector(
      "span"
    ).textContent=
      `Sua tela • ${q.label} • ${fps} FPS`;

    dom.screenShareArea
      .classList.remove(
        "hidden"
      );

    dom.btnCompartilharTela
      .classList.add(
        "ativo"
      );

    track.onended=()=>{
      stopScreenShare();
    };

    closeScreenShareModal();
  }catch(error){
    if(
      error?.name !==
        "NotAllowedError" &&
      error?.name !==
        "AbortError"
    ){
      console.error(
        "Erro ao compartilhar tela:",
        error
      );

      setScreenShareStatus(
        error?.message ||
        "Não foi possível compartilhar a tela."
      );
    }
  }finally{
    if(dom.btnStartScreenShare){
      dom.btnStartScreenShare.disabled=
        false;
    }
  }
}

async function stopScreenShare(){
  if(!state.screenStream)return;

  state.screenStream
    .getTracks()
    .forEach(
      track =>
        track.stop()
    );

  for(
    const pc of
      state.peers.values()
  ){
    const sender=
      screenVideoSender(pc);

    if(sender){
      try{
        await sender.replaceTrack(
          null
        );
      }catch(error){
        console.warn(error);
      }
    }
  }

  state.screenStream=null;

  $("localScreenTile")
    ?.remove();

  dom.btnCompartilharTela
    .classList.remove(
      "ativo"
    );

  if(!state.remoteVideos.size){
    dom.screenShareArea
      .classList.add(
        "hidden"
      );
  }
}

dom.btnFecharScreenShare
  ?.addEventListener(
    "click",
    closeScreenShareModal
  );

dom.screenShareModal
  ?.addEventListener(
    "click",
    event=>{
      if(
        event.target ===
          dom.screenShareModal
      ){
        closeScreenShareModal();
      }
    }
  );

dom.btnRefreshScreenSources
  ?.addEventListener(
    "click",
    loadElectronScreenSources
  );

dom.btnStartScreenShare
  ?.addEventListener(
    "click",
    startScreenShare
  );

dom.btnEntrar.onclick=
  joinCall;

dom.btnSair.onclick=
  leaveCall;

dom.btnMute.onclick=()=>{
  if(state.serverMuted){
    alert(
      "Seu microfone foi mutado por um moderador."
    );

    return;
  }

  state.muted=
    !state.muted;

  state.micStream
    ?.getAudioTracks()
    .forEach(
      track =>
        track.enabled=
          !state.muted
    );

  dom.btnMute
    .classList.toggle(
      "ativo",
      state.muted
    );

  dom.profileMic.textContent=
    state.muted
      ? "🔇"
      : "🎙";
};

dom.profileMic.onclick=()=>{
  if(state.connected){
    dom.btnMute.click();
  }
};

dom.btnAudio.onclick=()=>{
  state.deafened=
    !state.deafened;

  for(
    const audio of
      state.remoteAudios.values()
  ){
    audio.muted=
      state.deafened;
  }

  dom.btnAudio
    .classList.toggle(
      "ativo",
      state.deafened
    );

  dom.profileAudio.textContent=
    state.deafened
      ? "🔇"
      : "🎧";
};

dom.profileAudio.onclick=()=>{
  if(state.connected){
    dom.btnAudio.click();
  }
};

dom.btnCompartilharTela.onclick=()=>{
  state.screenStream
    ? stopScreenShare()
    : openScreenShareModal();
};


/* =========================================================
   SERVER SETTINGS / MEMBERS / ROLES / INVITES
========================================================= */
function openServerSettings(tab="geral"){if(!state.server)return;openModal(dom.serverSettingsModal);dom.settingsServerName.textContent=state.server.nome;dom.editServerName.value=state.server.nome;dom.editServerDescription.value=state.server.descricao||"";switchSettingsTab(tab)}
function switchSettingsTab(tab){document.querySelectorAll(".settings-tab").forEach(b=>b.classList.toggle("ativo",b.dataset.settingsTab===tab));document.querySelectorAll(".settings-page").forEach(p=>p.classList.toggle("hidden",p.dataset.settingsPage!==tab));if(tab==="membros")loadMembers();if(tab==="cargos")renderRoles();if(tab==="convites")loadInvites()}
dom.btnGerenciarServidor.onclick=()=>openServerSettings("geral");dom.btnFecharServerSettings.onclick=()=>closeModal(dom.serverSettingsModal);document.querySelectorAll(".settings-tab").forEach(b=>b.onclick=()=>switchSettingsTab(b.dataset.settingsTab));
dom.btnSalvarServidor.onclick=async()=>{const {error}=await supabaseClient.rpc("atualizar_servidor",{p_servidor_id:state.server.id,p_nome:dom.editServerName.value.trim(),p_descricao:dom.editServerDescription.value.trim()||null});if(error)return setStatus(dom.serverGeneralStatus,error.message);setStatus(dom.serverGeneralStatus,"Salvo.",true);await loadServers(state.server.id)};
dom.btnExcluirServidor.onclick=async()=>{if(!confirm(`Excluir "${state.server.nome}" permanentemente?`))return;const {error}=await supabaseClient.rpc("apagar_servidor",{p_servidor_id:state.server.id});if(error)return alert(error.message);closeModal(dom.serverSettingsModal);state.server=null;await loadServers()};

async function loadMembers(){
  const {data:sm,error}=await supabaseClient.from("servidor_membros").select("usuario_id,entrou_em").eq("servidor_id",state.server.id);if(error){dom.memberList.textContent=error.message;return}const ids=(sm||[]).map(x=>x.usuario_id);let profiles=[];if(ids.length){const r=await supabaseClient.from("perfis").select("id,username,avatar_url").in("id",ids);profiles=r.data||[]}
  const {data:mr}=await supabaseClient.from("membro_cargos").select("usuario_id,cargo_id").eq("servidor_id",state.server.id);state.memberRoles=new Map();(mr||[]).forEach(x=>{const a=state.memberRoles.get(x.usuario_id)||[];a.push(x.cargo_id);state.memberRoles.set(x.usuario_id,a)});state.members=(sm||[]).map(x=>({...x,profile:profiles.find(p=>p.id===x.usuario_id)||{id:x.usuario_id,username:"Usuário",avatar_url:null}}));renderMembers();
}
function renderMembers(){const q=dom.memberSearch.value.trim().toLowerCase();dom.memberList.innerHTML="";state.members.filter(m=>m.profile.username.toLowerCase().includes(q)).forEach(m=>{const roles=(state.memberRoles.get(m.usuario_id)||[]).map(id=>state.roles.find(r=>r.id===id)).filter(Boolean);const row=document.createElement("div");row.className="member-row";const av=document.createElement("div");av.className="mini-avatar";applyAvatar(av,m.profile.username,m.profile.avatar_url);row.appendChild(av);const info=document.createElement("div");info.className="member-info";info.innerHTML=`<strong>${esc(m.profile.username)}</strong><span>${m.usuario_id===state.server.dono_id?"Dono do servidor":"Membro"}</span>`;row.appendChild(info);const badges=document.createElement("div");badges.className="role-badges";roles.forEach(r=>badges.insertAdjacentHTML("beforeend",`<span class="role-badge" style="color:${esc(r.cor)}">${esc(r.nome)}</span>`));row.appendChild(badges);const b=document.createElement("button");b.textContent="Gerenciar";b.disabled=!has("manage_roles")&&!has("manage_members");b.onclick=()=>openMemberRoles(m);row.appendChild(b);dom.memberList.appendChild(row)})}
dom.memberSearch.oninput=renderMembers;
function openMemberRoles(m){state.editingMember=m;dom.memberRoleTitle.textContent=m.profile.username;dom.memberRoleChecks.innerHTML="";const current=state.memberRoles.get(m.usuario_id)||[];state.roles.filter(r=>r.nome!=="Dono").forEach(r=>{const l=document.createElement("label");l.innerHTML=`<input type="checkbox" value="${r.id}" ${current.includes(r.id)?"checked":""} ${r.nome==="Membro"?"disabled":""}> <span style="color:${esc(r.cor)}">${esc(r.nome)}</span>`;dom.memberRoleChecks.appendChild(l)});dom.btnRemoveMember.classList.toggle("hidden",m.usuario_id===state.server.dono_id||!has("manage_members"));openModal(dom.memberRoleModal);setStatus(dom.memberRoleStatus)}
dom.btnCloseMemberRole.onclick=()=>closeModal(dom.memberRoleModal);dom.btnSaveMemberRoles.onclick=async()=>{const ids=[...dom.memberRoleChecks.querySelectorAll("input:checked")].map(x=>x.value);const {error}=await supabaseClient.rpc("definir_cargos_membro",{p_servidor_id:state.server.id,p_usuario_id:state.editingMember.usuario_id,p_cargo_ids:ids});if(error)return setStatus(dom.memberRoleStatus,error.message);setStatus(dom.memberRoleStatus,"Cargos salvos.",true);await loadMembers();await loadRolesAndPermissions();updatePermissionUI()};dom.btnRemoveMember.onclick=async()=>{if(!confirm(`Remover ${state.editingMember.profile.username} do servidor?`))return;const {error}=await supabaseClient.rpc("remover_membro",{p_servidor_id:state.server.id,p_usuario_id:state.editingMember.usuario_id});if(error)return setStatus(dom.memberRoleStatus,error.message);closeModal(dom.memberRoleModal);await loadMembers()};

function renderRoles(){dom.roleList.innerHTML="";state.roles.forEach(r=>{const b=document.createElement("button");b.className="role-list-item";b.innerHTML=`<span class="role-color" style="background:${esc(r.cor)}"></span><span>${esc(r.nome)}</span>`;b.onclick=()=>editRole(r);dom.roleList.appendChild(b)});if(!dom.roleEditId.value)resetRoleForm()}
function resetRoleForm(){dom.roleEditId.value="";dom.roleName.value="";dom.roleColor.value="#5865f2";dom.rolePermissionGrid.querySelectorAll("input").forEach(i=>i.checked=false);dom.btnDeleteRole.classList.add("hidden");setStatus(dom.roleStatus)}
function editRole(r){dom.roleEditId.value=r.id;dom.roleName.value=r.nome;dom.roleColor.value=r.cor||"#5865f2";dom.rolePermissionGrid.querySelectorAll("input").forEach(i=>i.checked=r.permissoes?.[i.dataset.permission]===true);dom.btnDeleteRole.classList.toggle("hidden",r.sistema);setStatus(dom.roleStatus)}
dom.btnNovoCargo.onclick=resetRoleForm;dom.roleForm.onsubmit=async(e)=>{e.preventDefault();const perms={};dom.rolePermissionGrid.querySelectorAll("input").forEach(i=>perms[i.dataset.permission]=i.checked);let error;if(dom.roleEditId.value)({error}=await supabaseClient.rpc("atualizar_cargo",{p_cargo_id:dom.roleEditId.value,p_nome:dom.roleName.value.trim(),p_cor:dom.roleColor.value,p_permissoes:perms}));else({error}=await supabaseClient.rpc("criar_cargo",{p_servidor_id:state.server.id,p_nome:dom.roleName.value.trim(),p_cor:dom.roleColor.value,p_permissoes:perms}));if(error)return setStatus(dom.roleStatus,error.message);setStatus(dom.roleStatus,"Cargo salvo.",true);await loadRolesAndPermissions();renderRoles();updatePermissionUI()};dom.btnDeleteRole.onclick=async()=>{if(!dom.roleEditId.value||!confirm("Excluir este cargo?"))return;const {error}=await supabaseClient.rpc("apagar_cargo",{p_cargo_id:dom.roleEditId.value});if(error)return setStatus(dom.roleStatus,error.message);await loadRolesAndPermissions();resetRoleForm();renderRoles()};

async function loadInvites(){const {data,error}=await supabaseClient.from("convites").select("id,codigo,usos,max_usos,ativo,expira_em,criado_em").eq("servidor_id",state.server.id).order("criado_em",{ascending:false});dom.inviteList.innerHTML="";if(error){dom.inviteList.textContent=error.message;return}(data||[]).forEach(i=>{const row=document.createElement("div");row.className="invite-row";const link=`https://lzz-voice.vercel.app/?invite=${i.codigo}`;row.innerHTML=`<div class="file-icon">↗</div><div class="file-main"><strong>${esc(i.codigo)}</strong><span>${i.ativo?"Ativo":"Revogado"} • ${i.usos} uso(s)</span></div><div class="file-meta">${fmtTime(i.criado_em)}</div>`;const actions=document.createElement("div");actions.className="file-actions";const copy=document.createElement("button");copy.textContent="Copiar";copy.onclick=()=>navigator.clipboard.writeText(link).catch(()=>prompt("Convite",link));actions.appendChild(copy);if(i.ativo){const revoke=document.createElement("button");revoke.textContent="Revogar";revoke.onclick=async()=>{const {error}=await supabaseClient.rpc("revogar_convite",{p_convite_id:i.id});if(error)alert(error.message);else loadInvites()};actions.appendChild(revoke)}row.appendChild(actions);dom.inviteList.appendChild(row)})}
dom.btnCriarConviteSettings.onclick=async()=>{await createInvite(false);await loadInvites()};

/* =========================================================
   DMs / CONVERSATIONS
========================================================= */
async function showConversations(){showView("dm");dom.workspaceKicker.textContent="LZZ Voice";dom.workspaceTitle.textContent="Conversas";await loadConversations()}
async function loadConversations(){
  const {data:mine,error}=await supabaseClient.from("conversa_membros").select("conversa_id").eq("usuario_id",state.user.id);if(error){console.error(error);return}const ids=[...new Set((mine||[]).map(x=>x.conversa_id))];state.conversations=[];if(!ids.length){renderDmList();return}
  const {data:all}=await supabaseClient.from("conversa_membros").select("conversa_id,usuario_id").in("conversa_id",ids);const otherIds=[...new Set((all||[]).filter(x=>x.usuario_id!==state.user.id).map(x=>x.usuario_id))];let profiles=[];if(otherIds.length){profiles=(await supabaseClient.from("perfis").select("id,username,avatar_url").in("id",otherIds)).data||[]}
  state.conversations=ids.map(id=>{const om=(all||[]).find(x=>x.conversa_id===id&&x.usuario_id!==state.user.id);return{id,target:profiles.find(p=>p.id===om?.usuario_id)||{id:om?.usuario_id,username:"Usuário",avatar_url:null}}});renderDmList();
}
function renderDmList(){dom.dmList.innerHTML="";if(!state.conversations.length){dom.dmList.innerHTML='<div class="voice-presence-user">Nenhuma conversa ainda.</div>';return}state.conversations.forEach(c=>{const b=document.createElement("button");b.className="dm-item"+(state.activeConversation?.id===c.id?" ativo":"");const av=document.createElement("div");av.className="mini-avatar";applyAvatar(av,c.target.username,c.target.avatar_url);const cp=document.createElement("div");cp.className="dm-item-copy";cp.innerHTML=`<strong>${esc(c.target.username)}</strong><span>Mensagem direta</span>`;b.append(av,cp);b.onclick=()=>openConversation(c);dom.dmList.appendChild(b)})}
async function openConversation(c){state.activeConversation=c;renderDmList();dom.dmEmptyState.classList.add("hidden");dom.dmActive.classList.remove("hidden");dom.dmTargetName.textContent=c.target.username;applyAvatar(dom.dmTargetAvatar,c.target.username,c.target.avatar_url);await loadDmMessages();await connectDmRealtime()}
async function loadDmMessages(){dom.dmMessages.innerHTML="";state.displayedMessages.clear();const {data,error}=await supabaseClient.from("mensagens_diretas").select("*").eq("conversa_id",state.activeConversation.id).order("criado_em").limit(150);if(error){console.error(error);return}(data||[]).forEach(addDmMessage);dom.dmMessages.scrollTop=dom.dmMessages.scrollHeight}
function addDmMessage(m){if(state.displayedMessages.has(m.id))return;state.displayedMessages.add(m.id);dom.dmMessages.insertAdjacentHTML("beforeend",messageHtml(m));dom.dmMessages.scrollTop=dom.dmMessages.scrollHeight}
async function connectDmRealtime(){if(state.dmRealtime){await supabaseClient.removeChannel(state.dmRealtime);state.dmRealtime=null}const ch=supabaseClient.channel(`dm:${state.activeConversation.id}`,{config:{private:true}});ch.on("broadcast",{event:"message"},e=>addDmMessage(e.payload));ch.subscribe();state.dmRealtime=ch}
dom.dmForm.onsubmit=async(e)=>{e.preventDefault();if(!state.activeConversation)return;const text=dom.dmInput.value.trim();if(!text)return;dom.dmInput.value="";const p={conversa_id:state.activeConversation.id,autor_id:state.user.id,autor_nome:state.profile.username,autor_avatar:state.profile.avatar_url,texto:text};const {data,error}=await supabaseClient.from("mensagens_diretas").insert(p).select().single();if(error)return alert(error.message);addDmMessage(data);await state.dmRealtime?.send({type:"broadcast",event:"message",payload:data})};
dom.btnNovaConversa.onclick=async()=>{if(!state.server)return alert("Entre em um servidor primeiro.");await loadMembers();dom.dmMemberList.innerHTML="";state.members.filter(m=>m.usuario_id!==state.user.id).forEach(m=>{const b=document.createElement("button");b.className="dm-member-option";const av=document.createElement("div");av.className="mini-avatar";applyAvatar(av,m.profile.username,m.profile.avatar_url);b.append(av,Object.assign(document.createElement("span"),{textContent:m.profile.username}));b.onclick=()=>startDmWith(m.usuario_id);dom.dmMemberList.appendChild(b)});openModal(dom.newDmModal)};dom.btnCloseNewDm.onclick=()=>closeModal(dom.newDmModal);
async function startDmWith(userId){const {data,error}=await supabaseClient.rpc("abrir_conversa_com_usuario",{p_usuario_id:userId});if(error)return alert(error.message);closeModal(dom.newDmModal);await loadConversations();const c=state.conversations.find(x=>x.id===data);if(c)openConversation(c)}

/* =========================================================
   FILES
========================================================= */
async function showFiles(){showView("files");dom.workspaceKicker.textContent=state.server?.nome||"LZZ Voice";dom.workspaceTitle.textContent="Arquivos";dom.filesServerName.textContent=state.server?.nome||"Nenhum servidor";await loadFiles()}
async function loadFiles(){if(!state.server){dom.fileList.innerHTML='<div class="empty-pane"><h2>Selecione um servidor</h2></div>';return}const {data,error}=await supabaseClient.from("arquivos").select("*").eq("servidor_id",state.server.id).order("criado_em",{ascending:false});if(error){dom.fileList.textContent=error.message;return}state.files=data||[];renderFiles()}
function renderFiles(){const q=dom.fileSearch.value.trim().toLowerCase();dom.fileList.innerHTML="";const arr=state.files.filter(f=>f.nome.toLowerCase().includes(q));if(!arr.length){dom.fileList.innerHTML='<div class="empty-pane"><h2>Nenhum arquivo</h2><p>Envie o primeiro arquivo deste servidor.</p></div>';return}arr.forEach(f=>{const row=document.createElement("div");row.className="file-row";row.innerHTML=`<div class="file-icon">FILE</div><div class="file-main"><strong>${esc(f.nome)}</strong><span>${esc(f.autor_nome)} • ${fmtTime(f.criado_em)}</span></div><div class="file-meta">${esc(f.mime_type||"arquivo")}</div><div class="file-meta">${formatBytes(f.tamanho)}</div>`;const actions=document.createElement("div");actions.className="file-actions";const down=document.createElement("button");down.textContent="Baixar";down.onclick=()=>downloadFile(f);actions.appendChild(down);if(f.autor_id===state.user.id||has("manage_server")){const del=document.createElement("button");del.textContent="Excluir";del.onclick=()=>deleteFile(f);actions.appendChild(del)}row.appendChild(actions);dom.fileList.appendChild(row)})}
dom.fileSearch.oninput=renderFiles;dom.serverFileInput.onchange=async()=>{const file=dom.serverFileInput.files?.[0];if(!file||!state.server)return;setStatus(dom.fileUploadStatus,"Enviando...",true);try{const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"_");const path=`${state.server.id}/${state.user.id}/${Date.now()}-${safe}`;const {error}=await supabaseClient.storage.from("server-files").upload(path,file);if(error)throw error;const meta={servidor_id:state.server.id,canal_id:state.currentText?.id||null,autor_id:state.user.id,autor_nome:state.profile.username,nome:file.name,storage_path:path,mime_type:file.type||null,tamanho:file.size};const r=await supabaseClient.from("arquivos").insert(meta);if(r.error)throw r.error;setStatus(dom.fileUploadStatus,"Enviado.",true);await loadFiles()}catch(e){setStatus(dom.fileUploadStatus,e.message)}finally{dom.serverFileInput.value=""}};
async function downloadFile(f){const {data,error}=await supabaseClient.storage.from("server-files").createSignedUrl(f.storage_path,60);if(error)return alert(error.message);window.open(data.signedUrl,"_blank")}
async function deleteFile(f){if(!confirm(`Excluir ${f.nome}?`))return;const s=await supabaseClient.storage.from("server-files").remove([f.storage_path]);if(s.error)return alert(s.error.message);const r=await supabaseClient.from("arquivos").delete().eq("id",f.id);if(r.error)return alert(r.error.message);await loadFiles()}

/* =========================================================
   VIEW NAVIGATION
========================================================= */
function showView(name){
  state.currentMode=name;
  [dom.homeView,dom.voiceView,dom.chatView,dom.dmView,dom.filesView].forEach(v=>v.classList.add("hidden"));
  const map={home:dom.homeView,voice:dom.voiceView,chat:dom.chatView,dm:dom.dmView,files:dom.filesView};
  map[name]?.classList.remove("hidden");
  dom.navAgora.classList.toggle("ativo",name==="voice"||name==="chat"||name==="home");
  dom.navConversas.classList.toggle("ativo",name==="dm");
  dom.navArquivos.classList.toggle("ativo",name==="files");
  renderServerRail();
}
function showHome(){showView("home");dom.workspaceKicker.textContent="LZZ Voice";dom.workspaceTitle.textContent="Início";renderServerRail();renderHomeServers()}
dom.navAgora.onclick=()=>{if(!state.server)return showHome();if(state.lastAgoraMode==="chat"&&state.currentText)selectTextChannel(state.currentText.id);else if(state.currentVoice)selectVoiceChannel(state.currentVoice.id);else if(state.currentText)selectTextChannel(state.currentText.id);else showHome()};dom.navConversas.onclick=showConversations;dom.navArquivos.onclick=showFiles;

/* =========================================================
   MOBILE
========================================================= */
dom.mobileMenuBtn.onclick=()=>{dom.channelSidebar.classList.toggle("aberta");dom.mobileOverlay.classList.toggle("hidden",!dom.channelSidebar.classList.contains("aberta"))};dom.mobileOverlay.onclick=()=>{dom.channelSidebar.classList.remove("aberta");dom.mobileOverlay.classList.add("hidden")};

/* =========================================================
   START
========================================================= */
(async()=>{if(await checkUpdate())return;await restoreSession()})();
