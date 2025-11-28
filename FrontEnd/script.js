/* Studente: Enrico Brasiello
Matricola: 0124002755
Componenti gruppo: 1
Nome progetto: JobAdvisor
* Esame: Tecnologie Web a.a 2024/2025
* Data appello: 02/12/2025
* */



// funzioni di utilizzo generale
document.addEventListener('DOMContentLoaded',  () => {
    caricautenti();
controllaLogin();
caricaRecensioniRecenti();
    caricaTopAziende();
    suggerimentiRicerca();
});


async function caricautenti() {
    const tbody = document.getElementById('tabella-utenti');
    try {
        const risposta = await fetch ('api/utente');
        const convert_risp = await risposta.json();
        console.log (`Risultato`, convert_risp);

        tbody.innerHTML = '';
        convert_risp.forEach((utente) => { // andiamo a creare per ogni utente lo spazio apposito per i dati.
            const tr = document.createElement('tr');


            let dataNascita = utente.data_nascita;
            if(dataNascita) {
                dataNascita = new Date(dataNascita).toLocaleDateString('it-IT');
            } else {
                dataNascita = '-';
            }

            tr.innerHTML = `
                <td>${utente.nome}</td>
                <td>${utente.cognome}</td>
                <td>${utente.email}</td>
                <td>${dataNascita}</td>
            `;
          
            tbody.appendChild(tr);
            

        }); 
        
    }catch(err) {
    console.log(err);
    } 
  
}

function controllaLogin(){
    const login = sessionStorage.getItem('userlogged'); // ci serve per ricevere l'utente appena connesso.
    const loginButton = document.getElementById('auth-btn'); // ci serve per poter modificare il bottone "login"
    const addprofile= document.getElementById('profile-btn');
    const addReview = document.getElementById('review-btn');
    const addJobs = document.getElementById('jobs-btn');
    const addCompany = document.getElementById('manage-companu-btn');


    if (login) {
        const user = JSON.parse(login);
if (addprofile) { // verifica se il bottone per accedere al profilo ci sta
    if(user.moderator){
        addprofile.style.display = 'none';
        addReview.style.display = 'none';
        addJobs.style.display = 'block';
        addCompany.style.display = 'block';
    }else{
        addprofile.style.display = 'block';
        addReview.style.display = 'block';
        addJobs.style.display = 'none';
        addCompany.style.display = 'none';
    }
}

        //modifica del titolo h1
        const title = document.querySelector('h1');
        title.textContent = `Welcome back, ${user.nome}`; // bentornato, nome utente


        loginButton.textContent = 'Logout'; // Rinominiamo il bottone "logout"
        loginButton.style.backgroundColor = '#800808'; //applichiamo un colore rosso per richiamare il senso del bottone


        loginButton.removeAttribute('href');
        loginButton.style.cursor = 'pointer';


        // questa funzione creata al momento mi permette di effettuare il logout cancellando in memoria direttamente, lo user attualmente loggato.
        // facendo questo ricarica la pagina e tutto torna come prima
        loginButton.onclick = function () {
            const conferma = confirm('Are you sure you want to log out?');
            if (conferma) {
                sessionStorage.removeItem('userlogged');
                window.location.reload();
            }
        };

    }else { // quando nessuno è loggato, questa parte viene presa in considerazione
        const barra = document.querySelector('h1');
        if(addprofile){  // se nessuno ha fatto accesso allora il bottone scompare
            addprofile.style.display = 'none';
            addReview.style.display = 'none';
            addJobs.style.display = 'none';
            addCompany.style.display = 'none';
        }
        barra.textContent = 'Welcome to JobAdvisor, Guest.';
        loginButton.style.backgroundColor = '#2e5077';
        loginButton.textContent = 'Login';
        loginButton.onclick = null; //rimuoviamo se non siamo loggati, la funzionalità di uscire dall'account
        loginButton.setAttribute('href', 'login.html');
    }
}



// Questa funzione carica tutte le aziende con miglior media voto tramite un API
async function caricaTopAziende() {
    const contenitore = document.getElementById('top-companies-container');

    try{
        const response = await fetch('/api/top_company');
        const company = await response.json();

        contenitore.innerHTML = '';


        if(company.length === 0){
            container.innerHTML = '<p> No data Available.</p>';
            return;
        }

        company.forEach((company) => {
            const card = document.createElement('div');
            card.className = 'review-card'; // riciclo lo stile delle recensioni per risparmiare tempo

            card.innerHTML = `
                <div class="review-header">
                    <div class="company-icon" style="background-color: #fff9c4; color: #fbc02d">
                        <i class="fa-solid fa-trophy"></i>
                    </div>
                    <div>
                        <h4 style="font-size: 25px; padding-top: 10px">${company.nome_azienda }</h4>
                        <span class="job-title">Location: ${company.sede}</span>
                    </div>
                </div>

                <div class="review-rating" style="
                    display: flex; 
                    align-items: center; 
                    gap: 10px; 
                    margin: 15px 0; 
                    font-size: 1.4em; 
                    font-weight: bold; 
                    color: #333;">
                    
                    <span style="color: #ffc107;">
                        <i class="fa-solid fa-star"></i>
                    </span>
                    
                    <span>${company.media_voto} <span style="font-size: 0.6em; color: #777; font-weight: normal;">/ 5</span></span>
                </div>

            `;

            contenitore.appendChild(card);

        })

    }catch(err){
        console.log('error from top company',err);
    }

}



// Questa funzione carica tutte le recensioni più recenti e li inserisce nella pagina
async function caricaRecensioniRecenti() {
    const container = document.getElementById('reviews-container');

    try {
        const response = await fetch('/api/recent_review');
        const reviews = await response.json();

        container.innerHTML = ''; // puliamo il loader

        if (reviews.length === 0) {
            container.innerHTML = '<p>No Reviews Found</p>';
            return;
        }

        reviews.forEach((review) => {
            const tabellaRecensione = document.createElement('div');
            tabellaRecensione.className= 'review-card';

            let stelleTabella = '';
            const voto_tot = review.valutazione ; //se il voto non viene inserito, automaticamente è basso.


            for (let i = 1; i<=5 ; i++){
                if (i <= voto_tot) {
                    // Se siamo sotto il voto, stampa stella PIENA
                    stelleTabella += '<i class="fa-solid fa-star"></i>';
                } else {
                    // Altrimenti stampa stella VUOTA (bordo)
                    stelleTabella += '<i class="fa-regular fa-star"></i>';
                }
            }
            const dataOgg = new Date(review.data_recensione).toLocaleDateString('it-IT');


            tabellaRecensione.innerHTML = `
                <div class="review-header">
                    <div class="company-icon">
                        <i class="fa-solid fa-building"></i>
                    </div>
                    <div>
                        <h4>${review.nome_azienda || 'Azienda'}</h4> 
                        <h5> From: ${review.nome_utente }</h5>
                        <span class="job-title">${review.titolo || 'Recensione'}</span>
                    </div>
                </div>

                <div class="review-rating">
                    ${stelleTabella}
                </div>

                <p class="review-text">
                    "${review.testo || review.descrizione || ''}"
                </p>

                <div class="review-footer">
                    <small>Posted on: ${dataOgg}</small>
                </div>
            `;

            container.appendChild(tabellaRecensione);
        });


    }catch (error){
        console.log(error);
    }





}


// questa funzione aggiunge dei suggerimenti nella barra di ricerca, che permette di cercare le aziende (se ci sono) in una tendina sotto suggerendo all'utente l'azienda da cercare
async function suggerimentiRicerca() {
    // Assicurati che nel tuo HTML l'ID del datalist sia 'nomi-aziende'
    const listaDati = document.getElementById('nomi-aziende');

    // ATTENZIONE: Nel tuo HTML l'ID del bottone era 'search-btn', qui avevi scritto 'search-button'
    const btnCerca = document.getElementById('search-btn') || document.getElementById('search-button');

    try {
        const risposta = await fetch('/api/azienda');
        const aziende = await risposta.json(); // Ora 'aziende' contiene l'array completo con Nomi e P_IVA

        // 1. Riempiamo il datalist
        listaDati.innerHTML = ''; // Pulizia preventiva
        aziende.forEach((azienda) => {
            const opzione = document.createElement('option');
            opzione.value = azienda.nome_azienda;
            listaDati.appendChild(opzione);
        });

        // 2. Gestiamo il click su CERCA
        if (btnCerca) {
            btnCerca.onclick = () => {
                const valoreCercato = document.getElementById('search-input').value;

                if (valoreCercato) {
                    // Cerca nell'array l'azienda che ha quel nome esatto
                    const aziendaTrovata = aziende.find(a => a.nome_azienda === valoreCercato);

                    if (aziendaTrovata) {
                        // REINDIRIZZAMENTO: Passiamo l'ID (P_IVA) alla pagina di dettaglio
                        window.location.href = `company.html?id=${aziendaTrovata.p_iva}`;
                    } else {
                        alert("Company not found in our database.");
                    }
                }
            };
        }

    } catch (err) {
        console.error("Errore caricamento suggerimenti", err);
    }
}