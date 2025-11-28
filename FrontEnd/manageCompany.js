/* Studente: Enrico Brasiello
Matricola: 0124002755
Componenti gruppo: 1
Nome progetto: JobAdvisor
* Esame: Tecnologie Web a.a 2024/2025
* Data appello: 02/12/2025
* */


// questo file serve a caricare la pagina di gestione delle aziende dinamicamente


// file javascript dedicato alla visione e editing del profilo
document.addEventListener('DOMContentLoaded', async () => {
    const storedUser = sessionStorage.getItem('userlogged');// prendo l'utente corrente dalla sessione
    if (!storedUser) { // in questa parte ho la certezza che se accedo a questa pagina non avendo fatto il login, anche se impossibile, mi da errore e riaccede alla pagina principale
        alert('Access Denied. User logged out!');
        window.location.href = 'homepage.html';
        return;
    }

    const utente = JSON.parse(storedUser);

    document.getElementById('prof-name').textContent = utente.nome; // vado a prendere dal DB tutti i dati corrispondenti
    document.getElementById('prof-surname').textContent = utente.cognome; // allo stesso tempo, collego utilizzando l'id dell'elemento e utilizzando l'oggetto document le parti della pagina
    document.getElementById('prof-email').textContent = utente.email;
    document.getElementById('prof-gender').textContent = utente.sesso;
    if (utente.data_nascita){ // la data viene formattata per non far vedere l'orario
        document.getElementById('prof-nascita').textContent = new Date(utente.data_nascita).toLocaleDateString('it-IT');
    }

    const Azienda = await fetch(`/api/company_details?id=${utente.moderator}`);
    const infoAzienda = await Azienda.json();

    document.getElementById('prof-name-company').textContent = infoAzienda.nome_azienda;
    document.getElementById('prof-location-company').textContent = infoAzienda.sede;
    document.getElementById('prof-type-company').textContent = infoAzienda.tipo_azienda;
    document.getElementById('prof-rating-company').textContent = infoAzienda.media_voto;
    document.getElementById('prof-IVA-company').textContent = infoAzienda.p_iva;

    const tbodyJobs = document.getElementById('contracts-body'); // Tabella Annunci
    try {
        const resJobs = await fetch(`/api/company_jobs?id=${utente.moderator}`);
        const jobs = await resJobs.json();

        tbodyJobs.innerHTML = "";

        jobs.forEach(job => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${job.nome_posizione}</td>
                <td>${job.benefit}</td>
                <td>${job.stipendio}</td>
                <td>${job.competenze}</td>
            `;

            const tdAction = document.createElement('td');
            const btnDelete = document.createElement('button');
            btnDelete.className = 'delete-button';
            btnDelete.innerText = 'Delete';

            btnDelete.onclick = async () => {
                if(confirm('Are you sure you want to delete this job?')) {
                    await eliminaContratto2(job.p_iva,job.nome_posizione);
                }

            };

            tdAction.appendChild(btnDelete);
            tr.appendChild(tdAction);
            tbodyJobs.appendChild(tr);
        });
    } catch(err) { console.error(err); }


    // --- 2. CARICA I DIPENDENTI (RICHIESTE) ---
    const tbodyRequests = document.getElementById('review-body'); // Tabella Richieste (Rinominala nel HTML se puoi)
    try {
        const resReq = await fetch(`/api/company_request?id=${utente.moderator}`);
        const requests = await resReq.json();

        tbodyRequests.innerHTML = "";

        requests.forEach(req => {
            const tr = document.createElement('tr');
            const verified = req.verificato ? '<span style="color:green; font-weight:bold;">Verified</span>' : '<span style="color:orange; font-weight:bold;">Pending</span>';

            tr.innerHTML = `
                <td>${req.nome} ${req.cognome}</td>
                <td>${req.nome_posizione}</td>
                <td>${req.email}</td>
                <td>${verified}</td> 
            `;

            const tdAction = document.createElement('td');

            if(!req.verificato){
                const btnValidate = document.createElement('button');
                btnValidate.innerHTML = 'Validate';
                btnValidate.className = 'validate-button';
                btnValidate.style = "margin-right: 5px; cursor: pointer;";


                btnValidate.onclick = async () => {
                    await validaDipendente(req.email,req.nome_posizione);
                };
                tdAction.appendChild(btnValidate);
            }

            const btnDelete = document.createElement('button');
            btnDelete.innerHTML = 'Delete';
            btnDelete.onclick = async () => {
                if(confirm('Are you sure you want to delete?')) {
                    await eliminaDipendente(req.email,req.nome_posizione,req.data_inizio);
                }
            };
            tdAction.appendChild(btnDelete);
            tr.appendChild(tdAction);

            // Qui puoi aggiungere i bottoni Validate/Reject se vuoi

            tbodyRequests.appendChild(tr);

        });
    } catch(err) { console.error(err); }

});


// ho dovuto differenziare la funzione eliminaContratto per evitare che il compilatore desse noie
async function eliminaContratto2(partita_iva,posizione){
    try {
        const risposta = await fetch(`/api/delete_job`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                p_iva:partita_iva,
                nome_posizione: posizione
            })

        });

        if (risposta.ok){
            alert("Contract Successfully removed.");
            window.location.reload();
        } else {
            alert("internal server error");
        }
    }catch(err){
        console.error(err);}
}

// Funzione per validare (Chiama l'API PUT che dovresti avere nel server)
async function validaDipendente(email, posizione) {
    try {



        const res = await fetch('/api/validate_request', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, nome_posizione: posizione })
        });

        if(res.ok) {
            alert("Employee Verified!");
            window.location.reload();
        } else {
            alert("Error validating employee");
        }
    } catch(e) { console.error(e); }
}


async function eliminaDipendente(email, posizione, data) {
    try {
        // La tua API delete_contract si aspetta email e nome_posizione.
        // Se serve anche la data per unicità, assicurati che il Server la gestisca.
        // Se il Server usa solo email+posizione, basta così:
        const res = await fetch('/api/delete_contract', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, nome_posizione: posizione })
        });

        if(res.ok) {
            alert("Employee removed/rejected.");
            window.location.reload();
        } else {
            alert("Error removing employee");
        }
    } catch(e) { console.error(e); }
}
