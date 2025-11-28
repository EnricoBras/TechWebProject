/* Studente: Enrico Brasiello
Matricola: 0124002755
Componenti gruppo: 1
Nome progetto: JobAdvisor
* Esame: Tecnologie Web a.a 2024/2025
* Data appello: 02/12/2025
* */



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

    const tbody = document.getElementById('contracts-body') // affidiamo a questa costante la struttura dei contratti stabilita nel html
    const tbodyr= document.getElementById('review-body'); // mentre a quest'altra costante va la struttura delle recensioni dell'utente



    try{ // utilizziamo il try e catch per prevenire eventuali errori
const response = await fetch(`/api/get_contract?email=${utente.email}`);
const contract = await response.json();

// se trova almeno un contratto, dobbiamo dire al sistema di aggiungere righe contenenti i dati del contratto sottoscritto dall'utente


        tbody.innerHTML = ""; // al momento tbody risulta essere vuoto e verrà riempito di volta in volta con i dati corrispondenti

        if (contract.length === 0){
            tbody.innerHTML = '<tr><td colspan="3"> No contract found yet.</td></tr>';
        }

        contract.forEach((item) => {
            const tr = document.createElement('tr');

            // Gestione delle date per formattarle
            const inizio = new Date(item.data_inizio).toLocaleDateString('it-IT');
            const fine = item.data_fine ? new Date(item.data_fine).toLocaleDateString('it-IT') : 'On going';
            let testoVerifica = '';

            let verifica = item.verificato;

            if (verifica > 0){
                testoVerifica = 'Yes';
            } else {
                testoVerifica = 'No';
            }


            tr.innerHTML = `
                <td style="font-weight: bold;">${item.nome_azienda}</td>
                <td>${item.nome_posizione}</td>
                <td>${inizio}</td>  <td>${fine}</td>
                <td>${testoVerifica}</td>
            `;
            const tdAction = document.createElement('td');
            const bottone = document.createElement('button');

            bottone.className = 'delete-button';
            bottone.innerText = 'Delete';



            bottone.onclick = async () =>{
                if (confirm('Are you sure to delete this contract?')){

                    await eliminaContratto(utente.email,item.nome_posizione);
                }
            };

            tdAction.appendChild(bottone);
            tr.appendChild(tdAction);

            tbody.appendChild(tr);
        })









    }catch (err){
        console.error(err);
        tbody.innerHTML = '<tr><td colspan="3" style="color:red;">Data loading failed.</td></tr>';
    }




    // adesso in questa sezione andrà la parte dedicata alle recensioni
    try{

        const responsereview = await fetch (`/api/get_review_from_user?email=${utente.email}`);

        const review = await responsereview.json();

        tbodyr.innerHTML = "";

        if (review.length === 0){
            tbodyr.innerHTML = '<tr><td colspan="6"> No Review found yet.</td></tr>';

        }

        review.forEach((itemr) => {
            const trr = document.createElement('tr');

            // Gestione delle date per formattarle
            const datarecensione = new Date(itemr.data_recensione).toLocaleDateString('it-IT');


            trr.innerHTML = `
                <td style="font-weight: bold;">${itemr.titolo}</td>
                <td>${itemr.nome_azienda}</td>
                <td>${itemr.id_recensione}</td>
                <td>${datarecensione}</td> 
                <td>${itemr.valutazione}</td>
            `;
            const tdrAction = document.createElement('td');
            const bottoner = document.createElement('button');

            bottoner.className = 'delete-button';
            bottoner.innerText = 'Delete';



            bottoner.onclick = async () =>{
                if (confirm('Are you sure to delete this review?')){
                    await eliminaRecensione(itemr.id_recensione);
                }
            };

            tdrAction.appendChild(bottoner);

            trr.appendChild(tdrAction);

            tbodyr.appendChild(trr);
        })




    }catch(err) {
        console.error(err);
        tbodyr.innerHTML = '<tr><td colspan="3" style="color:red;">Data loading failed.</td></tr>';

    }

async function eliminaRecensione(id){
    try {
        const risposta = await fetch(`/api/delete_review`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id_recensione: id,
            })

        });

        if (risposta.ok){
            alert("Review Successfully removed.");
            window.location.reload();
        } else {
            alert("internal server error");
        }
    }catch(err){
        console.error(err);}
}





async function eliminaContratto(email,posizione){
try {
    const risposta = await fetch(`/api/delete_contract`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: email,
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


});



