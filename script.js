// --- WIDGET METEO (Inizializzazione) ---
!function(d,s,id){
    var js,fjs=d.getElementsByTagName(s)[0];
    if(!d.getElementById(id)){
        js=d.createElement(s);
        js.id=id;
        js.src='https://weatherwidget.io/js/widget.min.js';
        fjs.parentNode.insertBefore(js,fjs);
    }
}(document,'script','weatherwidget-io-js');

function aggiornaDataOra() {
    const dataOggi = new Date();
    const opzioniData = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const opzioniOra = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    let stringaDataIT = dataOggi.toLocaleDateString('it-IT', opzioniData);
    let stringaOraIT = dataOggi.toLocaleTimeString('it-IT', opzioniOra);
    let stringaDataEN = dataOggi.toLocaleDateString('en-US', opzioniData);
    let stringaOraEN = dataOggi.toLocaleTimeString('en-US', opzioniOra);
    document.getElementById('data-meteo-it').innerText = stringaDataIT.charAt(0).toUpperCase() + stringaDataIT.slice(1) + " - " + stringaOraIT;
    document.getElementById('data-meteo-en').innerText = stringaDataEN.charAt(0).toUpperCase() + stringaDataEN.slice(1) + " - " + stringaOraEN;
}
aggiornaDataOra();
setInterval(aggiornaDataOra, 1000);

// --- GENERATORE CARTOLINA ---
// Percorso di default impostato su assets/
let cartolinaSelezionata = 'assets/cartolina1.jpg';

function cambiaCartolina(nomeFile, elementoImg) {
    cartolinaSelezionata = nomeFile;
    document.getElementById('preview-box').style.backgroundImage = `url('${nomeFile}')`;
    const thumbs = document.querySelectorAll('.thumb-img');
    thumbs.forEach(t => t.classList.remove('active'));
    elementoImg.classList.add('active');
}

function formattaData(date, lang) {
    return date.toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function formattaOra(date, lang) {
    return date.toLocaleTimeString(lang === 'it' ? 'it-IT' : 'en-US', { hour: '2-digit', minute: '2-digit' });
}

async function generaECondividiCartolina() {
    const lang = document.body.className || 'it';
    const btn = document.getElementById('btn-genera-cartolina');
    const canvas = document.getElementById('canvas-cartolina');
    const ctx = canvas.getContext('2d');
    
    btn.innerHTML = lang === 'it' ? '💡 Generazione...' : '💡 Generating...';
    btn.disabled = true;

    try {
        const imgBackground = new Image();
        imgBackground.src = cartolinaSelezionata; 
        imgBackground.crossOrigin = "Anonymous";

        await new Promise((resolve, reject) => {
            imgBackground.onload = resolve;
            imgBackground.onerror = () => reject(new Error("Immagine non trovata"));
        });

        canvas.width = 1200; 
        canvas.height = 900; 
        ctx.drawImage(imgBackground, 0, 0, 1200, 900);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'; 
        ctx.fillRect(0, 750, 1200, 150);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 60px Georgia';
        ctx.fillText('PadreSergio House', 50, 820); 

        const oraEsatta = new Date();
        const dataStr = formattaData(oraEsatta, lang);
        const oraStr = formattaOra(oraEsatta, lang);
        const testoData = lang === 'it' ? `Creata il: ${dataStr} ore ${oraStr}` : `Generated: ${dataStr} at ${oraStr}`;
        
        ctx.font = '40px Arial';
        ctx.fillText(testoData, 50, 870); 
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 10;
        ctx.strokeRect(10, 10, 1180, 880);

        canvas.toBlob(async (blob) => {
            const file = new File([blob], 'cartolina_padresergio.jpg', { type: 'image/jpeg' });
            const didascalia = lang === 'it' ? "La mia cartolina da PadreSergio House! ☀️" : "My postcard from PadreSergio House! ☀️";
            const urlSito = "https://padresergiohouseapulia.github.io/padresergio_web/"; 

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: 'PadreSergio House', text: didascalia + "\n" + urlSito });
            } else {
                const urlImmagine = URL.createObjectURL(blob);
                const linkDownload = document.createElement('a');
                linkDownload.href = urlImmagine;
                linkDownload.download = 'Cartolina_PadreSergio.jpg';
                linkDownload.click();
                alert(lang === 'it' ? "📸 Cartolina scaricata! Trovala nei Download." : "📸 Postcard downloaded! Check your Downloads.");
            }
            
            btn.innerHTML = lang === 'it' ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> Genera e Condividi' : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> Generate & Share';
            btn.disabled = false;
        }, 'image/jpeg', 0.9);

    } catch (error) {
        alert(lang === 'it' ? 'Errore: assicurati che le immagini siano caricate correttamente su GitHub.' : 'Error: make sure the images are uploaded correctly to GitHub.');
        btn.disabled = false;
        btn.innerHTML = lang === 'it' ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> Genera e Condividi' : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> Generate & Share';
    }
}

// --- DIZIONARIO ORACOLO ---
const dizionarioOracolo = {
    it: {
        titolo: "L'Oracolo del Mare",
        caricamento: "Lettura dei venti a Monopoli in corso... 🌬️",
        ventoAttuale: "Vento attuale:",
        errore: "Oggi l'Oracolo riposa. Ma a Monopoli il mare è quasi sempre uno spettacolo! Chiedici un consiglio su WhatsApp. 😉",
        venti: {
            nord: { nome: "Tramontana / Maestrale (da Nord)", consiglio: "Oggi il vento soffia da Nord. Il mare aperto potrebbe essere un po' mosso o increspato. <strong>Il nostro consiglio:</strong> Cerca calette ben riparate come <em>Cala Susca</em> o <em>Cala Monaci</em>, oppure scegli i lidi attrezzati con frangiflutti a Capitolo!" },
            est: { nome: "Levante (dal Mare)", consiglio: "Oggi il vento spinge direttamente dal mare verso la costa. <strong>Il nostro consiglio:</strong> Fai attenzione se fai il bagno in zone di scogliera aperta. È la giornata perfetta per esplorare il Centro Storico o rilassarsi nelle calette più profonde e protette all'interno della città." },
            sud: { nome: "Scirocco (da Sud)", consiglio: "Oggi soffia Scirocco, vento caldo da Sud! Le lunghe spiagge sabbiose di Capitolo potrebbero avere mare mosso. <strong>Il nostro consiglio:</strong> Resta nelle calette cittadine esposte a Nord come <em>Porta Vecchia</em>, oppure fai una gita verso nord, a Polignano a Mare!" },
            ovest: { nome: "Ponente / Libeccio (da Terra)", consiglio: "Splendide notizie! Il vento soffia da terra verso il mare. <strong>Il nostro consiglio:</strong> L'Adriatico oggi sarà piatto come una tavola! È la giornata perfetta per godersi l'acqua cristallina nelle grandi spiagge di <em>Capitolo</em> o a <em>Santo Stefano</em>. Approfittane!" }
        }
    },
    en: {
        titolo: "The Sea Oracle",
        caricamento: "Reading Monopoli's winds... 🌬️",
        ventoAttuale: "Current wind:",
        errore: "The Oracle is resting today. But the sea in Monopoli is almost always a show! Ask us for advice on WhatsApp. 😉",
        venti: {
            nord: { nome: "Tramontana / Maestrale (from North)", consiglio: "Today the wind blows from the North. The open sea might be a bit rough. <strong>Our advice:</strong> Look for well-sheltered coves like <em>Cala Susca</em> or <em>Cala Monaci</em>, or choose the equipped beach clubs with breakwaters in Capitolo!" },
            est: { nome: "Levante (from the Sea)", consiglio: "Today the wind pushes directly from the sea towards the coast. <strong>Our advice:</strong> Be careful if swimming in open cliff areas. It's the perfect day to explore the Historic Center or relax in the deeper, protected coves inside the city." },
            sud: { nome: "Scirocco (from South)", consiglio: "Scirocco is blowing today, a warm wind from the South! The long sandy beaches of Capitolo might have rough seas. <strong>Our advice:</strong> Stay in the city coves facing North like <em>Porta Vecchia</em>, or take a trip north to Polignano a Mare!" },
            ovest: { nome: "Ponente / Libeccio (from Land)", consiglio: "Great news! The wind is blowing from the land towards the sea. <strong>Our advice:</strong> The Adriatic Sea will be completely flat today! It's the perfect day to enjoy the crystal clear water in the large beaches of <em>Capitolo</em> or <em>Santo Stefano</em>. Enjoy!" }
        }
    }
};

let datiMeteoAttuali = null;

async function caricaOracolo() {
    try {
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=40.9559&longitude=17.2896&current_weather=true';
        const response = await fetch(url);
        datiMeteoAttuali = await response.json();
        mostraRisultatoOracolo();
    } catch (error) {
        const lang = document.body.className || 'it';
        document.getElementById('oracolo-contenuto').innerHTML = `<div class="oracolo-consiglio">${dizionarioOracolo[lang].errore}</div>`;
    }
}

function mostraRisultatoOracolo() {
    const lang = document.body.className || 'it';
    const testi = dizionarioOracolo[lang];

    if (!datiMeteoAttuali) {
        document.getElementById('testo-titolo').innerText = testi.titolo;
        const caricamentoEl = document.getElementById('testo-caricamento');
        if(caricamentoEl) caricamentoEl.innerText = testi.caricamento;
        return;
    }

    const ventoDir = datiMeteoAttuali.current_weather.winddirection;
    const ventoVel = datiMeteoAttuali.current_weather.windspeed;
    
    let chiaveVento = "";
    let emoji = "🧭";

    if (ventoDir >= 315 || ventoDir <= 45) { chiaveVento = "nord"; emoji = "🌊"; } 
    else if (ventoDir > 45 && ventoDir < 135) { chiaveVento = "est"; emoji = "💨"; } 
    else if (ventoDir >= 135 && ventoDir <= 225) { chiaveVento = "sud"; emoji = "🌴"; } 
    else { chiaveVento = "ovest"; emoji = "🏖️"; }

    document.getElementById('testo-titolo').innerText = testi.titolo;
    document.getElementById('oracolo-emoji').innerText = emoji;
    document.getElementById('oracolo-contenuto').innerHTML = `
        <div class="oracolo-dati">${testi.ventoAttuale} ${testi.venti[chiaveVento].nome} (${ventoVel} km/h)</div>
        <div class="oracolo-consiglio">${testi.venti[chiaveVento].consiglio}</div>
    `;
}

// AUTO-RILEVAMENTO LINGUA INTELLIGENTE
window.onload = () => {
    const saved = localStorage.getItem('pref-lang');
    if (saved) {
        changeLang(saved);
    } else {
        const userLang = navigator.language || navigator.userLanguage;
        if (userLang.toLowerCase().startsWith('it')) {
            changeLang('it');
        } else {
            changeLang('en');
        }
    }
};

// --- GESTIONE LINGUA PRINCIPALE ---
function setLang(lang) {
    document.body.className = lang;
    document.getElementById('btn-it').classList.remove('active');
    document.getElementById('btn-en').classList.remove('active');
    document.getElementById('btn-' + lang).classList.add('active');
    mostraRisultatoOracolo();
}
// Alias per compatibilità
const changeLang = setLang;

// --- TASTO MAGICO WI-FI ---
function copiaWiFi() {
    const pwd = document.getElementById('wifi-pwd').value;
    const btn = document.getElementById('btn-copia-txt');
    const originalHTML = btn.innerHTML;
    
    navigator.clipboard.writeText(pwd).then(() => {
        btn.style.backgroundColor = "#27ae60";
        if(document.body.className === 'it') {
            btn.innerHTML = '✔️ Password Copiata!';
        } else {
            btn.innerHTML = '✔️ Password Copied!';
        }
        
        setTimeout(() => {
            btn.style.backgroundColor = "var(--verde-primario)";
            btn.innerHTML = originalHTML;
        }, 3000);
    }).catch(err => {
        alert('Errore durante la copia: ' + err);
    });
}

// --- FUNZIONE COPIA WI-FI (UX AVANZATA) ---
function copiaWiFi() {
    const pwd = document.getElementById('wifi-pwd').value;
    
    // Usa le API moderne per copiare negli appunti
    navigator.clipboard.writeText(pwd).then(() => {
        const btn = document.getElementById('btn-copia-txt');
        
        // 1. Cambia colore in verde "successo" e aggiorna il testo col checkmark
        btn.style.backgroundColor = "#27ae60"; 
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span lang="it">Copiata! Incolla in Impostazioni</span>
            <span lang="en">Copied! Paste in Settings</span>
        `;
        
        // 2. Feedback tattile: fa vibrare leggermente il telefono se supportato
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // 3. Reset automatico: dopo 5 secondi fa tornare il bottone come prima
        setTimeout(() => {
            btn.style.backgroundColor = "var(--verde-primario)";
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <span lang="it">Copia Password</span>
                <span lang="en">Copy Password</span>
            `;
        }, 5000);
        
    }).catch(err => {
        // Fallback di sicurezza in caso di browser molto vecchi
        alert("La password è: PadreSergio2022*");
    });
}

// --- AVVIA L'ORACOLO ALL'APERTURA DELLA PAGINA ---
window.addEventListener('DOMContentLoaded', caricaOracolo);