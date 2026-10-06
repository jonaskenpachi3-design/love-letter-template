/* ==========================================================
   LOVE LETTER — Interactive Website Template
   Parte 1/6
   Engine Principal • Canvas • Nebula Engine 2.0
========================================================== */

(() => {
"use strict";

/* ==========================================================
   ELEMENTOS
========================================================== */

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

const textCanvas = document.getElementById("textCanvas");
const textCtx = textCanvas.getContext("2d", {
    willReadFrequently: true
});

const root = document.documentElement;

const intro = document.getElementById("intro");
const startBtn = document.getElementById("startBtn");

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const vinyl = document.getElementById("vinyl");
const volumeSlider = document.getElementById("volumeSlider");
const progressBar = document.getElementById("progressBar");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const envelope = document.getElementById("envelope");
const timer = document.getElementById("timer");

/* ==========================================================
   APLICA A CONFIGURAÇÃO (js/config.js)
   Todo o conteúdo personalizável do site é lido de
   SITE_CONFIG e aplicado aqui, uma única vez, no início.
========================================================== */

const CONFIG = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {
    name: "Alguém Especial",
    sinceDate: "2024-01-01T00:00:00",
    photos: [],
    musicFile: "assets/music/musica.mp3"
};

(function applyConfig(){

    document.title = `${CONFIG.name} ♡ — A Sky Made of Love`;

    document
        .querySelectorAll('meta[property="og:title"],meta[name="twitter:title"]')
        .forEach(el => el.setAttribute(
            "content",
            `${CONFIG.name} ♡ — A Sky Made of Love`
        ));

    const introName = document.querySelector(".intro-name");
    if (introName) introName.textContent = CONFIG.name;

    const heroTitle = document.querySelector(".hero h1");
    if (heroTitle) {
        heroTitle.innerHTML =
            `${CONFIG.name} <span>♡</span>`;
    }

    const playerName = document.querySelector(".music-player .music-info span");
    if (playerName) playerName.textContent = `${CONFIG.name} ♡`;

    const endingTitle = document.querySelector(".ending h2");
    if (endingTitle) endingTitle.textContent = `${CONFIG.name} ♡`;

    if (music && CONFIG.musicFile) {
        music.querySelector("source")
            ? music.querySelector("source").src = CONFIG.musicFile
            : music.src = CONFIG.musicFile;
    }

    /* Gera os cards da galeria a partir de CONFIG.photos,
       em vez de depender de marcação fixa no HTML */

    const grid = document.querySelector(".gallery .grid");

    if (grid && Array.isArray(CONFIG.photos) && CONFIG.photos.length) {

        grid.innerHTML = CONFIG.photos.map(photo => `
            <figure class="card">
                <img
                    src="${photo.src}"
                    alt="${photo.alt || ""}"
                    loading="lazy"
                    decoding="async">
                <figcaption class="caption">
                    <h3>${photo.title || ""}</h3>
                    <p>${photo.caption || ""}</p>
                </figcaption>
            </figure>
        `).join("");

    }

})();

/* ==========================================================
   TAMANHO
========================================================== */

let w = window.innerWidth;
let h = window.innerHeight;

canvas.width = w;
canvas.height = h;

textCanvas.width = w;
textCanvas.height = h;

/* ==========================================================
   CÂMERA CINEMATOGRÁFICA
========================================================== */

const camera = {
    scale: 1,
    target: 1,
    rotation: 0
};

/* ==========================================================
   MOUSE SUAVE
========================================================== */

const mouse = {
    x: w / 2,
    y: h / 2,
    tx: w / 2,
    ty: h / 2
};

window.addEventListener("pointermove", e => {

    mouse.tx = e.clientX;
    mouse.ty = e.clientY;

});

/* ==========================================================
   FPS ADAPTATIVO
========================================================== */

let lastFrame = performance.now();
let fps = 60;

/* ==========================================================
   ESTADOS
========================================================== */

const STATE = {

    INTRO:0,
    SKY:1,
    CLUSTERS:2,
    CONSTELLATION:3,
    HEART:4

};

let currentState = STATE.INTRO;

/* ==========================================================
   NEBULA ENGINE 2.0
========================================================== */

const nebulas = [];

function createNebulas(){

    nebulas.length = 0;

    const count = isLowPower ? 5 : 9;

    for(let i=0;i<count;i++){

        nebulas.push({

            x:Math.random()*w,
            y:Math.random()*h,

            r:180+Math.random()*320,

            dx:(Math.random()-.5)*.12,
            dy:(Math.random()-.5)*.12,

            hue:315+Math.random()*28,

            alpha:.035+Math.random()*.035,

            depth:.25+Math.random()*.75

        });

    }

}

function updateNebulas(){

    nebulas.forEach(n=>{

        n.x += n.dx*n.depth;
        n.y += n.dy*n.depth;

        if(n.x<-n.r)n.x=w+n.r;
        if(n.x>w+n.r)n.x=-n.r;

        if(n.y<-n.r)n.y=h+n.r;
        if(n.y>h+n.r)n.y=-n.r;

    });

}

function renderNebulas(){

    nebulas.forEach(n=>{

        const g = ctx.createRadialGradient(

            n.x,n.y,0,
            n.x,n.y,n.r

        );

        g.addColorStop(
            0,
            `hsla(${n.hue},90%,60%,${n.alpha})`
        );

        g.addColorStop(
            .45,
            `hsla(${n.hue},90%,35%,${n.alpha*.55})`
        );

        g.addColorStop(1,"transparent");

        ctx.fillStyle = g;

        ctx.beginPath();
        ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
        ctx.fill();

    });

}

/* ==========================================================
   ESTRELAS
========================================================== */

const stars = [];

/* Menos partículas em telas pequenas/aparelhos mais fracos,
   para manter a animação fluida em celulares */

const isLowPower =
    window.innerWidth < 768 ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

const STAR_COUNT = isLowPower ? 900 : 2000;

let textPoints = [];
let drawProgress = 0;

function createStars(){

    stars.length = 0;

    for(let i=0;i<STAR_COUNT;i++){

        stars.push({

            x:Math.random()*w,
            y:Math.random()*h,

            baseX:Math.random()*w,
            baseY:Math.random()*h,

            tx:0,
            ty:0,

            vx:0,
            vy:0,

            size:.6+Math.random()*2.8,

            alpha:.25+Math.random()*.75,

            depth:.2+Math.random()*.8,

            twinkle:Math.random()*Math.PI*2,

            hue:320+Math.random()*18

        });

    }

}

/* ==========================================================
   TEXTO EM PARTÍCULAS
========================================================== */

function getTextPoints(){

    textCtx.clearRect(0,0,w,h);

    textCtx.fillStyle="#fff";

    textCtx.textAlign="center";
    textCtx.textBaseline="middle";

    /* Ajusta o tamanho da fonte ao comprimento do nome, para
       que nomes maiores também caibam dentro do canvas */

    const label = CONFIG.name || "Alguém Especial";

    let fontSize = Math.min(w/5.8,170);

    textCtx.font = `${fontSize}px Alex Brush`;

    const maxWidth = w * 0.86;

    while (
        textCtx.measureText(label).width > maxWidth &&
        fontSize > 24
    ) {

        fontSize -= 4;
        textCtx.font = `${fontSize}px Alex Brush`;

    }

    textCtx.fillText(label,w/2,h/2);

    const img=textCtx.getImageData(0,0,w,h).data;

    const pts=[];

    for(let y=0;y<h;y+=4){

        for(let x=0;x<w;x+=4){

            const i=(y*w+x)*4;

            if(img[i+3]>120){

                pts.push({x,y});

            }

        }

    }

    return pts;

}

function assignTextTargets(){

    if(!textPoints.length)return;

    stars.forEach((s,i)=>{

        const p=textPoints[i%textPoints.length];

        s.tx=p.x;
        s.ty=p.y;

    });

}

/* ==========================================================
   RESIZE
========================================================== */

function resize(){

    w=window.innerWidth;
    h=window.innerHeight;

    canvas.width=w;
    canvas.height=h;

    textCanvas.width=w;
    textCanvas.height=h;

    mouse.x=mouse.tx=w/2;
    mouse.y=mouse.ty=h/2;

    textPoints=getTextPoints();

    assignTextTargets();

    createNebulas();

}

window.addEventListener("resize",resize);

/* ==========================================================
   WARP
========================================================== */

let warp=false;

function startWarp(){

    if(warp)return;

    warp=true;

    stars.forEach(s=>{

        const a=Math.atan2(

            s.y-h/2,
            s.x-w/2

        );

        const speed=18+Math.random()*28;

        s.vx=Math.cos(a)*speed;
        s.vy=Math.sin(a)*speed;

    });

}

/* ==========================================================
   PARALLAX SUAVE
========================================================== */

function updateMouse(){

    mouse.x += (mouse.tx-mouse.x)*.08;
    mouse.y += (mouse.ty-mouse.y)*.08;

    root.style.setProperty("--x",mouse.x+"px");
    root.style.setProperty("--y",mouse.y+"px");

}

/* ==========================================================
   PREPARAÇÃO
========================================================== */

createStars();
createNebulas();
resize();

/* Garante que a fonte "Alex Brush" já esteja carregada antes de
   recalcular os pontos do texto — caso contrário as estrelas podem
   desenhar o nome com a fonte de fallback na primeira execução */

if (document.fonts?.ready) {

    document.fonts.ready.then(() => {

        textPoints = getTextPoints();
        assignTextTargets();

    });

}
/* ==========================================================
   Parte 2/6
   Constellation Engine • Clusters • Assinatura
========================================================== */

/* ==========================================================
   CLUSTERS (AGRUPAMENTO)
========================================================== */

function updateDrawProgress(){

    if(currentState !== STATE.CONSTELLATION) return;

    drawProgress += 0.0035;

    if(drawProgress > 1){
        drawProgress = 1;
    }

}

function moveToClusters(star){

    const angle = Math.atan2(star.baseY - h/2, star.baseX - w/2);

    const radius = 140 + star.depth * 220;

    const tx = w/2 + Math.cos(angle) * radius;
    const ty = h/2 + Math.sin(angle) * radius;

    star.vx += (tx - star.x) * 0.01;
    star.vy += (ty - star.y) * 0.01;

}

/* ==========================================================
   HEART MODE
========================================================== */

let heartPoints = [];

function createHeart(){

    heartPoints = [];

    const scale = Math.min(w,h)/34;

    for(let t=0;t<Math.PI*2;t+=0.06){

        const x = 16*Math.pow(Math.sin(t),3);

        const y = -(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));

        heartPoints.push({

            x:w/2+x*scale,
            y:h/2+y*scale

        });

    }

}

/* ==========================================================
   ATUALIZAÇÃO DAS PARTÍCULAS
========================================================== */

function updateParticles(){

    updateDrawProgress();

    stars.forEach((star,index)=>{

        if(warp){

            star.x += star.vx;
            star.y += star.vy;

            if(
                star.x<-120||
                star.x>w+120||
                star.y<-120||
                star.y>h+120
            ){

                star.x=w/2;
                star.y=h/2;

            }

            return;

        }

        let targetX = star.baseX;
        let targetY = star.baseY;

        switch(currentState){

            case STATE.SKY:

                targetX = star.baseX;
                targetY = star.baseY;
                break;

            case STATE.CLUSTERS:

                moveToClusters(star);
                break;

            case STATE.CONSTELLATION:{

                const limit = Math.max(
                    1,
                    Math.floor(textPoints.length*drawProgress)
                );

                const p = textPoints[index%limit]||textPoints[0];

                targetX=p.x;
                targetY=p.y;

                break;
            }

            case STATE.HEART:{

                const p = heartPoints[index%heartPoints.length];

                targetX=p.x;
                targetY=p.y;

                break;
            }

        }

        if(currentState!==STATE.CLUSTERS){

            star.vx += (targetX-star.x)*0.02;
            star.vy += (targetY-star.y)*0.02;

        }

        /* Cursor */

        const dx=star.x-mouse.x;
        const dy=star.y-mouse.y;

        const dist=Math.hypot(dx,dy);

        if(dist<120){

            const force=(120-dist)/120;

            star.vx += dx*0.02*force;
            star.vy += dy*0.02*force;

        }

        star.vx*=0.92;
        star.vy*=0.92;

        star.x+=star.vx;
        star.y+=star.vy;

        star.twinkle+=0.02;

    });

}

/* ==========================================================
   RENDER DAS ESTRELAS
========================================================== */

function renderStars(){

    stars.forEach(star=>{

        const pulse=Math.sin(star.twinkle)*0.15;

        ctx.beginPath();

        ctx.fillStyle=
        `rgba(255,${170+pulse*100},220,${star.alpha})`;

        ctx.arc(

            star.x,
            star.y,

            star.size+pulse,

            0,
            Math.PI*2

        );

        ctx.fill();

    });

}

/* ==========================================================
   CONEXÕES INTELIGENTES
========================================================== */

function renderConnections(){

    if(currentState!==STATE.CONSTELLATION)return;

    const limit=Math.max(
        1,
        Math.floor(stars.length*Math.min(drawProgress,1))
    );

    for(let i=0;i<limit;i++){

        const a=stars[i];

        for(let j=i+1;j<i+10&&j<limit;j++){

            const b=stars[j];

            const d=Math.hypot(

                a.x-b.x,
                a.y-b.y

            );

            if(d<18){

                ctx.beginPath();

                ctx.strokeStyle=
                `rgba(255,77,165,${1-d/18})`;

                ctx.lineWidth=0.7;

                ctx.moveTo(a.x,a.y);
                ctx.lineTo(b.x,b.y);

                ctx.stroke();

            }

        }

    }

}

/* ==========================================================
   TRANSIÇÕES DE ESTADO
========================================================== */

function goToClusters(){

    currentState=STATE.CLUSTERS;

}

function goToConstellation(){

    currentState=STATE.CONSTELLATION;

    drawProgress=0;

    assignTextTargets();

}

function goToSky(){

    currentState=STATE.SKY;

}

function showHeart(){

    currentState=STATE.HEART;

    createHeart();

    setTimeout(()=>{

        currentState=STATE.SKY;

    },2500);

}

/* ==========================================================
   DUPLO CLIQUE → CORAÇÃO
========================================================== */

window.addEventListener("dblclick",showHeart);

/* ==========================================================
   TIMELINE CINEMATOGRÁFICA
========================================================== */

setTimeout(()=>{

    if(intro){

        intro.style.display="none";

    }

    goToSky();

},3500);

setTimeout(()=>{

    goToClusters();

},5200);

setTimeout(()=>{

    startWarp();

},7000);

setTimeout(()=>{

    warp=false;

    goToConstellation();

},8700);

setTimeout(()=>{

    document.body.classList.add("hero-ready");

},11300);
/* ==========================================================
   Parte 3/6
   Warp Speed • Meteor Shower • Camera FX
========================================================== */

/* ==========================================================
   CAMERA FX
========================================================== */

function updateCamera(){

    camera.scale += (camera.target-camera.scale)*0.05;

    root.style.setProperty(
        "--camera-scale",
        camera.scale.toFixed(3)
    );

}

/* ==========================================================
   ZOOM DE CÂMERA VINCULADO AO SCROLL
   Conforme o usuário desce a página, a câmera do céu (que
   fica fixa atrás de todo o conteúdo) dá um leve zoom,
   como se estivéssemos avançando pelas estrelas.
========================================================== */

function updateScrollCamera(){

    if(warp)return;

    const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress = maxScroll > 0
        ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1)
        : 0;

    camera.target = 1 + progress * 0.1;

}

window.addEventListener("scroll", updateScrollCamera, { passive:true });

updateScrollCamera();

/* ==========================================================
   WARP SPEED AVANÇADO
========================================================== */

function updateWarp(){

    if(!warp)return;

    camera.target=1.12;

    stars.forEach(star=>{

        const angle=Math.atan2(
            star.y-h/2,
            star.x-w/2
        );

        star.vx+=Math.cos(angle)*1.1;
        star.vy+=Math.sin(angle)*1.1;

    });

}

function stopWarp(){

    warp=false;

    camera.target=1;

}

/* ==========================================================
   METEOR SHOWER
========================================================== */

const meteors=[];

function spawnMeteor(){

    meteors.push({

        x:Math.random()*w,
        y:-80,

        vx:-7-Math.random()*6,
        vy:7+Math.random()*6,

        length:120+Math.random()*120,

        alpha:1,

        life:90+Math.random()*40

    });

}

setInterval(()=>{

    if(currentState===STATE.SKY&&Math.random()<0.55){

        spawnMeteor();

    }

},2200);

function updateMeteors(){

    for(let i=meteors.length-1;i>=0;i--){

        const m=meteors[i];

        m.x+=m.vx;
        m.y+=m.vy;

        m.life--;
        m.alpha-=0.01;

        if(m.life<=0){

            meteors.splice(i,1);

        }

    }

}

function renderMeteors(){

    meteors.forEach(m=>{

        const grad=ctx.createLinearGradient(

            m.x,
            m.y,

            m.x-m.vx*8,
            m.y-m.vy*8

        );

        grad.addColorStop(0,`rgba(255,255,255,${m.alpha})`);
        grad.addColorStop(1,"rgba(255,77,165,0)");

        ctx.strokeStyle=grad;
        ctx.lineWidth=2;

        ctx.beginPath();

        ctx.moveTo(m.x,m.y);

        ctx.lineTo(
            m.x-m.vx*8,
            m.y-m.vy*8
        );

        ctx.stroke();

    });

}

/* ==========================================================
   STAR BURST
========================================================== */

const bursts=[];

function createBurst(x,y){

    for(let i=0;i<45;i++){

        bursts.push({

            x,
            y,

            vx:(Math.random()-.5)*8,
            vy:(Math.random()-.5)*8,

            size:1+Math.random()*2,

            alpha:1,

            life:40+Math.random()*20

        });

    }

}

window.addEventListener("click",e=>{

    if(currentState===STATE.SKY){

        createBurst(e.clientX,e.clientY);

    }

});

function updateBursts(){

    for(let i=bursts.length-1;i>=0;i--){

        const b=bursts[i];

        b.x+=b.vx;
        b.y+=b.vy;

        b.vx*=0.96;
        b.vy*=0.96;

        b.alpha-=0.03;
        b.life--;

        if(b.life<=0){

            bursts.splice(i,1);

        }

    }

}

function renderBursts(){

    bursts.forEach(b=>{

        ctx.beginPath();

        ctx.fillStyle=
        `rgba(255,180,220,${b.alpha})`;

        ctx.arc(
            b.x,
            b.y,
            b.size,
            0,
            Math.PI*2
        );

        ctx.fill();

    });

}

/* ==========================================================
   BRILHO DA ASSINATURA
========================================================== */

function renderSignatureGlow(){

    if(currentState!==STATE.CONSTELLATION)return;

    if(!textPoints.length)return;

    const index=Math.floor(
        drawProgress*(textPoints.length-1)
    );

    const p=textPoints[index];

    if(!p)return;

    const g=ctx.createRadialGradient(

        p.x,
        p.y,
        0,

        p.x,
        p.y,
        55

    );

    g.addColorStop(0,"rgba(255,255,255,.95)");
    g.addColorStop(.4,"rgba(255,77,165,.35)");
    g.addColorStop(1,"transparent");

    ctx.fillStyle=g;

    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        55,
        0,
        Math.PI*2
    );

    ctx.fill();

}

/* ==========================================================
   CÂMERA DRIFT
========================================================== */

setInterval(()=>{

    if(currentState===STATE.SKY){

        camera.target=1+(Math.random()-.5)*0.03;

    }

},3500);

/* ==========================================================
   SHAKE SUAVE
========================================================== */

function cameraShake(intensity=.8){

    camera.rotation=(Math.random()-.5)*intensity;

    setTimeout(()=>{

        camera.rotation=0;

    },120);

}

/* Pequeno shake ao entrar na constelação */

setTimeout(cameraShake,8750);

/* ==========================================================
   FUNÇÃO DE EFEITOS
========================================================== */

function updateEffects(){

    updateCamera();
    updateWarp();

    updateMeteors();
    updateBursts();

}

function renderEffects(){

    renderMeteors();
    renderBursts();

    renderSignatureGlow();

}
/* ==========================================================
   Parte 4/6
   Player Apple Music • Carta • Contador
   Cursor Magnético • Scroll Reveal
========================================================== */

/* ==========================================================
   PLAYER APPLE MUSIC PREMIUM
========================================================== */

if (music && musicBtn) {

    const musicInfo = document.querySelector(".music-info");

    /* Cria as ondas automaticamente */

    let wave = musicInfo?.querySelector(".sound-wave");

    if (!wave && musicInfo) {

        wave = document.createElement("div");

        wave.className = "sound-wave";

        wave.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        `;

        musicInfo.appendChild(wave);

    }

    function formatTime(sec) {

        if (isNaN(sec)) return "0:00";

        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);

        return `${m}:${String(s).padStart(2, "0")}`;

    }

    music.addEventListener("loadedmetadata", () => {

        duration.textContent = formatTime(music.duration);

    });

    /* Se o arquivo de áudio não existir/carregar, avisa
       em vez de deixar o botão travado sem explicação */

    music.addEventListener("error", () => {

        musicBtn.disabled = true;
        musicBtn.textContent = "♪";
        musicBtn.title = "Música indisponível (verifique assets/music/musica.mp3)";

        console.warn(
            "Não foi possível carregar assets/music/musica.mp3. " +
            "Adicione o arquivo de áudio nessa pasta para o player funcionar."
        );

    });

    music.addEventListener("timeupdate", () => {

        currentTime.textContent = formatTime(music.currentTime);

        if (music.duration) {

            progressBar.style.width =
                `${music.currentTime / music.duration * 100}%`;

        }

    });

    async function toggleMusic() {

        if (music.paused) {

            try {

                await music.play();

                vinyl.classList.add("playing");

                wave?.classList.add("playing");

                musicBtn.textContent = "❚❚";

            } catch (err) {

                console.log(
                    "Não foi possível tocar a música (autoplay bloqueado " +
                    "pelo navegador ou arquivo ausente):",
                    err
                );

            }

        } else {

            music.pause();

            vinyl.classList.remove("playing");

            wave?.classList.remove("playing");

            musicBtn.textContent = "▶";

        }

    }

    musicBtn.addEventListener("click", toggleMusic);

    /* Controle de volume */

    if (volumeSlider) {

        music.volume = Number(volumeSlider.value);

        volumeSlider.addEventListener("input", () => {

            music.volume = Number(volumeSlider.value);

        });

    }

    document.addEventListener("visibilitychange", () => {

        if (document.hidden && !music.paused) {

            music.pause();

            vinyl.classList.remove("playing");

            wave?.classList.remove("playing");

            musicBtn.textContent = "▶";

        }

    });

}

/* ==========================================================
   CARTA COM MÁQUINA DE ESCREVER
========================================================== */

if (envelope) {

    const paper = envelope.querySelector(".paper p");

    const original = paper.textContent;

    paper.textContent = "";

    let started = false;

    function typeWriter() {

        if (started) return;

        started = true;

        let i = 0;

        function write() {

            if (i < original.length) {

                paper.textContent += original[i];

                i++;

                setTimeout(write, 36);

            }

        }

        write();

    }

    envelope.addEventListener("click", () => {

        envelope.classList.toggle("open");

        if (envelope.classList.contains("open")) {

            typeWriter();

            createBurst(w / 2, h / 2);

        }

    });

}

/* ==========================================================
   CONTADOR PREMIUM
========================================================== */

if (timer) {

    const startDate = new Date(CONFIG.sinceDate || "2024-01-01T00:00:00");

    let lastValues = {};

    function updateTimer() {

        const total =
            Math.floor((Date.now() - startDate) / 1000);

        const days = Math.floor(total / 86400);

        const hours =
            Math.floor(total % 86400 / 3600);

        const minutes =
            Math.floor(total % 3600 / 60);

        const seconds = total % 60;

        const values = { days, hours, minutes, seconds };

        /* Primeira renderização: monta a estrutura uma única vez */

        if (!timer.dataset.built) {

            timer.innerHTML = [

                [days, "Dias", "days"],
                [hours, "Horas", "hours"],
                [minutes, "Min", "minutes"],
                [seconds, "Seg", "seconds"]

            ].map(([v, l, key]) => `

                <div>

                    <div class="num" data-key="${key}">${v}</div>

                    <div class="lbl">${l}</div>

                </div>

            `).join("");

            timer.dataset.built = "true";

        } else {

            /* Nas próximas vezes, só troca (com efeito de "tick")
               os dígitos que realmente mudaram, como um odômetro */

            Object.entries(values).forEach(([key, v]) => {

                if (lastValues[key] === v) return;

                const el = timer.querySelector(`.num[data-key="${key}"]`);

                if (!el) return;

                el.textContent = v;

                el.classList.remove("tick");

                void el.offsetWidth; // reinicia a animação CSS

                el.classList.add("tick");

            });

        }

        lastValues = values;

    }

    updateTimer();

    setInterval(updateTimer, 1000);

}

/* ==========================================================
   CURSOR MAGNÉTICO
========================================================== */

const magneticItems = [

    ...document.querySelectorAll(".card"),
    ...document.querySelectorAll("button"),
    ...document.querySelectorAll(".music-player")

];

magneticItems.forEach(item => {

    item.addEventListener("mousemove", e => {

        const rect = item.getBoundingClientRect();

        const x = e.clientX - rect.left - rect.width / 2;

        const y = e.clientY - rect.top - rect.height / 2;

        item.style.transform =
            `translate(${x * .08}px,${y * .08}px)`;

    });

    item.addEventListener("mouseleave", () => {

        item.style.transform = "";

    });

});

/* ==========================================================
   HERO PARALLAX
========================================================== */

const heroContent = document.querySelector(".hero-content");

function updateHeroParallax() {

    if (!heroContent) return;

    const x = (mouse.x / w - .5) * 14;

    const y = (mouse.y / h - .5) * 8;

    heroContent.style.transform =
        `translate(${x}px,${y}px)`;

}

/* ==========================================================
   SCROLL REVEAL
========================================================== */

const revealObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.animate([

                {
                    opacity: 0,
                    transform: "translateY(60px)",
                    filter: "blur(8px)"
                },

                {
                    opacity: 1,
                    transform: "translateY(0)",
                    filter: "blur(0)"
                }

            ], {

                duration: 900,
                easing: "cubic-bezier(.22,1,.36,1)",
                fill: "forwards"

            });

            revealObserver.unobserve(entry.target);

        }

    });

}, {
    threshold: .18
});

document
.querySelectorAll(".gallery,.letter,.counter,.ending")
.forEach(section => {

    section.style.opacity = 0;

    revealObserver.observe(section);

});

/* ==========================================================
   ENTRADA ESCALONADA DOS CARDS DA GALERIA
   Cada foto surge com um pequeno atraso em relação à anterior,
   em vez de toda a galeria aparecer de uma vez só.
========================================================== */

const cardRevealObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const card = entry.target;
            const delay = Number(card.dataset.staggerIndex || 0) * 130;

            const anim = card.animate([

                {
                    opacity: 0,
                    transform: "translateY(40px) scale(.96)"
                },

                {
                    opacity: 1,
                    transform: "translateY(0) scale(1)"
                }

            ], {

                duration: 700,
                delay,
                easing: "cubic-bezier(.22,1,.36,1)",
                fill: "forwards"

            });

            /* Ao terminar, solta o transform via animate() para não
               travar o efeito de inclinação 3D no hover dos cards */

            anim.finished
                .then(() => {

                    card.style.opacity = 1;
                    card.style.transform = "";

                    anim.cancel();

                })
                .catch(() => {});

            cardRevealObserver.unobserve(card);

        }

    });

}, {
    threshold: .2
});

document.querySelectorAll(".card").forEach((card, i) => {

    card.style.opacity = 0;
    card.dataset.staggerIndex = i;

    cardRevealObserver.observe(card);

});

/* ==========================================================
   CHUVA DE ESTRELAS AO CHEGAR NO FINAL
   Quando a seção final entra na tela, dispara algumas
   estrelas cadentes para fechar a experiência.
========================================================== */

const endingSection = document.querySelector(".ending");

if (endingSection) {

    const endingObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                for (let i = 0; i < 6; i++) {

                    setTimeout(() => spawnMeteor(), i * 260);

                }

                endingObserver.unobserve(entry.target);

            }

        });

    }, {
        threshold: .4
    });

    endingObserver.observe(endingSection);

}

/* ==========================================================
   BOTÃO COMEÇAR
========================================================== */

startBtn?.addEventListener("click", () => {

    window.scrollTo({

        top: window.innerHeight,

        behavior: "smooth"

    });

});

/* Efeito de "onda" (ripple) ao clicar, para dar feedback visual */

function createRipple(e){

    const btn = e.currentTarget;

    const rect = btn.getBoundingClientRect();

    const ripple = document.createElement("span");

    ripple.className = "btn-ripple";

    const size = Math.max(rect.width, rect.height) * 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    btn.appendChild(ripple);

    ripple.addEventListener("animationend", () => ripple.remove());

}

startBtn?.addEventListener("click", createRipple);

/* ==========================================================
   BRILHO ALEATÓRIO DAS ESTRELAS
========================================================== */

setInterval(() => {

    stars.forEach(star => {

        if (Math.random() < 0.08) {

            star.size += 0.35;

            setTimeout(() => {

                star.size = Math.max(.6, star.size - .35);

            }, 260);

        }

    });

}, 500);
/* ==========================================================
   Parte 5/6
   Lightbox FLIP • Gestos • Navegação Premium
========================================================== */

/* ==========================================================
   LIGHTBOX
========================================================== */

const galleryImages = [...document.querySelectorAll(".card img")];

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

const closeBtn = document.getElementById("closeLightbox");
const nextBtn = document.getElementById("nextPhoto");
const prevBtn = document.getElementById("prevPhoto");

let currentPhoto = 0;
let touchStartX = 0;
let touchEndX = 0;

/* ==========================================================
   ABRIR COM FLIP
========================================================== */

function openLightbox(index){

    if(!lightbox||!lightboxImg)return;

    currentPhoto=index;

    const thumb=galleryImages[index];

    const first=thumb.getBoundingClientRect();

    lightbox.classList.add("open");

    lightboxImg.src=thumb.src;
    lightboxImg.alt=thumb.alt;

    requestAnimationFrame(()=>{

        const last=lightboxImg.getBoundingClientRect();

        const dx=first.left-last.left;
        const dy=first.top-last.top;

        const sx=first.width/last.width;
        const sy=first.height/last.height;

        lightboxImg.animate([

            {
                transform:
                `translate(${dx}px,${dy}px) scale(${sx},${sy})`,
                opacity:.6
            },

            {
                transform:"translate(0,0) scale(1)",
                opacity:1
            }

        ],{

            duration:450,
            easing:"cubic-bezier(.22,1,.36,1)",
            fill:"both"

        });

    });

}

/* ==========================================================
   TROCAR FOTO
========================================================== */

function showPhoto(index){

    currentPhoto=(index+galleryImages.length)%galleryImages.length;

    const img=galleryImages[currentPhoto];

    lightboxImg.animate([

        {
            opacity:.2,
            transform:"scale(.96)"
        },

        {
            opacity:1,
            transform:"scale(1)"
        }

    ],{

        duration:220,
        easing:"ease"

    });

    lightboxImg.src=img.src;
    lightboxImg.alt=img.alt;

}

/* ==========================================================
   FECHAR
========================================================== */

function closeLightbox(){

    if(!lightbox.classList.contains("open"))return;

    const thumb=galleryImages[currentPhoto];

    const last=thumb.getBoundingClientRect();

    const first=lightboxImg.getBoundingClientRect();

    const dx=last.left-first.left;
    const dy=last.top-first.top;

    const sx=last.width/first.width;
    const sy=last.height/first.height;

    const anim=lightboxImg.animate([

        {
            transform:"translate(0,0) scale(1)",
            opacity:1
        },

        {
            transform:
            `translate(${dx}px,${dy}px) scale(${sx},${sy})`,
            opacity:.4
        }

    ],{

        duration:350,
        easing:"cubic-bezier(.4,0,.2,1)",
        fill:"both"

    });

    anim.onfinish=()=>{

        lightbox.classList.remove("open");

    };

}

/* ==========================================================
   EVENTOS
========================================================== */

galleryImages.forEach((img,i)=>{

    img.addEventListener("click",()=>{

        openLightbox(i);

    });

});

closeBtn?.addEventListener("click",closeLightbox);

nextBtn?.addEventListener("click",()=>{

    showPhoto(currentPhoto+1);

});

prevBtn?.addEventListener("click",()=>{

    showPhoto(currentPhoto-1);

});

/* Fechar clicando fora */

lightbox?.addEventListener("click",e=>{

    if(e.target===lightbox){

        closeLightbox();

    }

});

/* ==========================================================
   TECLADO
========================================================== */

window.addEventListener("keydown",e=>{

    if(!lightbox.classList.contains("open"))return;

    switch(e.key){

        case"Escape":

            closeLightbox();

            break;

        case"ArrowRight":

            showPhoto(currentPhoto+1);

            break;

        case"ArrowLeft":

            showPhoto(currentPhoto-1);

            break;

    }

});

/* ==========================================================
   GESTOS (MOBILE)
========================================================== */

lightbox?.addEventListener("touchstart",e=>{

    touchStartX=e.changedTouches[0].clientX;

},{passive:true});

lightbox?.addEventListener("touchend",e=>{

    touchEndX=e.changedTouches[0].clientX;

    const delta=touchEndX-touchStartX;

    if(Math.abs(delta)<45)return;

    if(delta>0){

        showPhoto(currentPhoto-1);

    }else{

        showPhoto(currentPhoto+1);

    }

},{passive:true});

/* ==========================================================
   ZOOM SUAVE
========================================================== */

let zoom=1;

lightboxImg?.addEventListener("wheel",e=>{

    e.preventDefault();

    zoom+=e.deltaY*-0.001;

    zoom=Math.min(Math.max(.8,zoom),2.6);

    lightboxImg.style.transform=`scale(${zoom})`;

},{passive:false});

lightbox?.addEventListener("dblclick",()=>{

    zoom=1;

    lightboxImg.style.transform="scale(1)";

});

/* ==========================================================
   CURSOR CINEMATOGRÁFICO
========================================================== */

const cursorGlow=document.createElement("div");

cursorGlow.style.cssText=`
position:fixed;
left:0;
top:0;
width:14px;
height:14px;
border-radius:50%;
pointer-events:none;
background:rgba(255,77,165,.65);
filter:blur(6px);
z-index:9999;
transition:transform .08s linear;
`;

document.body.appendChild(cursorGlow);

window.addEventListener("pointermove",e=>{

    cursorGlow.style.transform=
    `translate(${e.clientX-7}px,${e.clientY-7}px)`;

});

/* ==========================================================
   IDLE AMBIENCE
========================================================== */

let idle=0;

window.addEventListener("pointermove",()=>idle=0);

setInterval(()=>{

    idle++;

    if(idle>8&&currentState===STATE.SKY){

        camera.target=1.01+Math.sin(Date.now()/2500)*0.01;

    }

},1000);

/* ==========================================================
   PARALLAX DOS CARDS
========================================================== */

document.querySelectorAll(".card").forEach(card=>{

    card.addEventListener("mousemove",e=>{

        const rect=card.getBoundingClientRect();

        const x=(e.clientX-rect.left)/rect.width-.5;
        const y=(e.clientY-rect.top)/rect.height-.5;

        card.style.transform=`
            perspective(1000px)
            rotateY(${x*12}deg)
            rotateX(${-y*12}deg)
            translateY(-10px)
        `;

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="";

    });

});

/* ==========================================================
   PREPARAÇÃO PARA O LOOP FINAL
========================================================== */

function updatePremiumUI(){

    updateHeroParallax();

}
/* ==========================================================
   Parte 6/6
   Loop Final • Performance Manager • Inicialização
========================================================== */

/* ==========================================================
   PERFORMANCE MANAGER
========================================================== */

let frameCounter = 0;
let lastFPSUpdate = performance.now();

function updatePerformance(now){

    const delta = now - lastFrame;
    lastFrame = now;

    frameCounter++;

    if(now - lastFPSUpdate >= 1000){

        fps = frameCounter;
        frameCounter = 0;
        lastFPSUpdate = now;

    }

    return delta;

}

/* ==========================================================
   CÂMERA CINEMATOGRÁFICA
========================================================== */

function applyCamera(){

    ctx.setTransform(
        camera.scale,
        0,
        0,
        camera.scale,
        (1-camera.scale)*w/2,
        (1-camera.scale)*h/2
    );

}

/* ==========================================================
   FUNDO ESTRELADO DISTANTE
========================================================== */

const farStars = [];

const FAR_STAR_COUNT = isLowPower ? 160 : 320;

for(let i=0;i<FAR_STAR_COUNT;i++){

    farStars.push({

        x:Math.random()*w,
        y:Math.random()*h,

        size:.3+Math.random()*.9,

        alpha:.12+Math.random()*.25,

        speed:.05+Math.random()*.08

    });

}

function renderFarStars(){

    farStars.forEach(s=>{

        s.y -= s.speed;

        if(s.y<0){

            s.y=h;
            s.x=Math.random()*w;

        }

        ctx.beginPath();

        ctx.fillStyle=`rgba(255,255,255,${s.alpha})`;

        ctx.arc(s.x,s.y,s.size,0,Math.PI*2);

        ctx.fill();

    });

}

/* ==========================================================
   VINHETA
========================================================== */

function renderVignette(){

    const g=ctx.createRadialGradient(

        w/2,h/2,
        h*.18,

        w/2,h/2,
        h*.72

    );

    g.addColorStop(0,"rgba(0,0,0,0)");
    g.addColorStop(1,"rgba(0,0,0,.42)");

    ctx.fillStyle=g;
    ctx.fillRect(0,0,w,h);

}

/* ==========================================================
   FILME (GRAIN)
========================================================== */

function renderFilmGrain(){

    if(fps<28)return;

    ctx.save();

    ctx.globalAlpha=.025;

    for(let i=0;i<70;i++){

        ctx.fillStyle="white";

        ctx.fillRect(

            Math.random()*w,
            Math.random()*h,

            1,
            1

        );

    }

    ctx.restore();

}

/* ==========================================================
   LOOP PRINCIPAL
========================================================== */

function animate(now=performance.now()){

    updatePerformance(now);

    updateMouse();
    updateCamera();
    updateEffects();
    updateParticles();
    updatePremiumUI();

    ctx.setTransform(1,0,0,1,0,0);

    ctx.fillStyle="rgba(5,2,10,.18)";
    ctx.fillRect(0,0,w,h);

    applyCamera();

    renderFarStars();
    renderNebulas();
    renderStars();
    renderConnections();
    renderEffects();

    ctx.setTransform(1,0,0,1,0,0);

    renderVignette();
    renderFilmGrain();

    requestAnimationFrame(animate);

}

/* ==========================================================
   INICIALIZAÇÃO FINAL
========================================================== */

createHeart();

textPoints=getTextPoints();

assignTextTargets();

camera.target=1;

document.body.classList.remove("hero-ready");

requestAnimationFrame(animate);

/* ==========================================================
   LOG
========================================================== */

console.log(
    `%c${CONFIG.name} ♡ — Love Letter Template`,
    "color:#ff7ec4;font-size:24px;font-weight:bold;"
);

console.log("Nebula Engine 2.0 carregado.");
console.log("Constellation Engine carregado.");
console.log("Warp Speed ativo.");
console.log("Meteor Shower ativo.");
console.log("Heart Explosion ativo.");
console.log("Apple Music Player ativo.");
console.log("Lightbox FLIP ativo.");
console.log("Tudo carregado com sucesso. ✨");

/* ==========================================================
   FIM DO ARQUIVO
========================================================== */

})();