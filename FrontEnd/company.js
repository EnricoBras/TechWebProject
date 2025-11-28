/* Studente: Enrico Brasiello
Matricola: 0124002755
Componenti gruppo: 1
Nome progetto: JobAdvisor
* Esame: Tecnologie Web a.a 2024/2025
* Data appello: 02/12/2025
* */


// questo file serve a caricare le pagine azienda dinamicamente


document.addEventListener("DOMContentLoaded", async () => {


    //estrazione dell'id dall'url, questo perchè tramite API assegno al URL la partita iva dell'azienda corrente
    const parametro = new URLSearchParams(window.location.search);
    const idAzienda = parametro.get('id'); // facendo questo passaggio ho la certezza che io stia vedendo in quella pagina quella determinata azienda


    if (!idAzienda) {
        alert("azienda non specificata!");
        window.location.href = "homepage.html";
        return;
    }


    // caricamento dati dell'azienda

    try{
        const rispostaAzienda = await fetch(`/api/company_details?id=${idAzienda}`);// sfrutto l'api utilizzando la partita iva
        const informazioni = await rispostaAzienda.json();// riprendo l'output del API e lo inserisco in una costante

        document.getElementById('company-name').textContent = informazioni.nome_azienda;
        document.getElementById('company-info').textContent = `P.IVA: ${informazioni.p_iva} - Location: ${informazioni.sede} - Sector: ${informazioni.tipo_azienda}`;
    } catch (error) {
        console.error(error);
    }

    // caricamento dati delle posizioni del lavoro

    try{
        const rispostaLavoro = await fetch(`/api/company_jobs?id=${idAzienda}`);
        const informazioniLav = await rispostaLavoro.json();


        const contenitoreLavoro = document.getElementById('jobs-container');

        contenitoreLavoro.innerHTML = '';
        if (informazioniLav.length === 0) {
            contenitoreLavoro.innerHTML = '<p> No position found.</p>';
        }


        // in questa parte nascondo un bottone ai moderator, questo bottone serve a candidarsi ai rispettivi annunci di lavoro.
        const utenteStored = sessionStorage.getItem('userlogged');
        let utente = null;
        if (utenteStored) utente = JSON.parse(utenteStored);


        informazioniLav.forEach(lavoro =>{
            const sezione = document.createElement('div');
            sezione.style = "background: #f9f9f9; padding: 15px; margin-bottom: 10px; border-left: 4px solid #2e5077;";
            sezione.innerHTML = `<h3 style="font-size: 2.0em ">${lavoro.nome_posizione}</h3><p style = "font-size: 1.5em ;color: #6e6a6a">Benefit: ${lavoro.benefit || 'None'}</p> <p>Salary: ${lavoro.stipendio || 'None'} $ Per Year </p> <p style ="color: #3692ea">Skills: ${lavoro.competenze || 'None'}</p>`;
            contenitoreLavoro.appendChild(sezione);

            if (utente && !utente.moderator) {// se allo stesso tempo l'utente è loggato e non è moderatore
                const btnRichiesta = document.createElement('button');
                btnRichiesta.className = "btn-login"; // Stile standard
                btnRichiesta.style = "background-color: #28a745; font-size: 0.9em; padding: 8px 15px;"; // Verde
                btnRichiesta.textContent = "Request job";
                btnRichiesta.addEventListener("click", async () => {
                    if(confirm(`Confirm that you work as ${lavoro.nome_posizione} at this company?`)){
                        await inviaRichiestaLavoro(utente.email, lavoro.nome_posizione, idAzienda);
                    }
                });
                sezione.appendChild(btnRichiesta);
            }
            contenitoreLavoro.appendChild(sezione);
        })


    } catch (error) {
        console.error("error loading jobs",error);
    }

    // caricamento recensioni

    try {
        const resReviews = await fetch(`/api/company_reviews?id=${idAzienda}`); // API di richiesta delle recensioni azienda
        const reviews = await resReviews.json();
        const reviewsContainer = document.getElementById('reviews-container');

        // Puliamo il contenitore dal testo
        reviewsContainer.innerHTML = '';
// questa logica è copiata dalla pagina homepage.html nella parte dedicata alle recensioni più recenti
        if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p>This company does not have reviews yet.</p>';
        } else {
            reviews.forEach(review => {
                const card = document.createElement('div');
                card.className = 'review-card'; // Ricicliamo la classe CSS della home

                // Calcolo delle stelle
                let stelleHtml = '';
                const voto = review.valutazione;

                for (let i = 1; i <= 5; i++) {
                    if (i <= voto) {
                        stelleHtml += '<i class="fa-solid fa-star"></i>';
                    } else {
                        stelleHtml += '<i class="fa-regular fa-star"></i>';
                    }
                }

                // Formattazione data
                const dataRec = new Date(review.data_recensione).toLocaleDateString('it-IT');

                // inserimento dinamico delle tabelle
                card.innerHTML = `
                        <div class="card-icon" style="background-color: #e3f2fd; color: #1565c0;">
                            <i class="fa-solid fa-user"></i>
                        </div>
                        <div class="card-info">
                            <h4 style="font-size: 1.5em; color: black; font-weight: bold">${review.titolo || 'Recensione'}</h4>
                            <h5 style="font-size: 0.8em; color: #6e6a6a; font-weight: normal;">From: ${review.nome} ${review.cognome}</h5> 
                            
                            <span style="font-size: 0.8em; color: #6e6a6a; font-weight: normal;" class="job-title">Date:${dataRec}</span>
                        </div>
                    </div>

                    <div class="review-rating">
                        ${stelleHtml}
                    </div>

                    <p class="review-text">
                        "${review.testo || review.descrizione || ''}"
                    </p>
                `;

                reviewsContainer.appendChild(card);
            });
        }

    } catch (e) {
        console.error("Errore caricamento recensioni:", e);
        document.getElementById('reviews-container').innerHTML = '<p style="color:red">Errore nel caricamento delle recensioni.</p>';
    }



})


//funzione helper per effettuare richieste di lavoro

async function inviaRichiestaLavoro(email,posizione,partita_iva){
    try{
        const ris = await fetch('/api/add_contract',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                nome_posizione: posizione,
                p_iva: partita_iva
            })
        })

        const result = await ris.json();

        if(ris.ok){
            alert("Request sent!");
        } else {
            alert("error",result.error);
        }
    }catch(e){
        console.error(e);
    }
}