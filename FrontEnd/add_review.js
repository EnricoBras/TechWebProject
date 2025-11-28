/* Studente: Enrico Brasiello
Matricola: 0124002755
Componenti gruppo: 1
Nome progetto: JobAdvisor
* Esame: Tecnologie Web a.a 2024/2025
* Data appello: 02/12/2025
* */


//Questo documento Javascript permette di aggiungere dinamicamente le recensioni tramite apposito form, utilizzando l'api creato

document.addEventListener('DOMContentLoaded', async () => {
    const storedUser = sessionStorage.getItem('userlogged');// prendo l'utente corrente dalla sessione
    if (!storedUser) { // in questa parte ho la certezza che se accedo a questa pagina non avendo fatto il login, anche se impossibile, mi da errore e riaccede alla pagina principale
        alert('Access Denied. User logged out!');// se l'utente non ha fatto accesso, ritorno alla pagina principale
        window.location.href = 'homepage.html';
        return;
    }

const userOggetto = JSON.parse(storedUser); // devo trasformare la stringa in oggetto per poter prendere l'email senza doverla mettere autonomamente, questo perchè storedUser è un oggetto
    const selezioneAzienda = document.getElementById('Review-company-selection');// prendo l'elemento html con il seguente ID


//popolamento tramite select aziende
    try{
        const risposta = await fetch(`api/get_contract?email=${userOggetto.email}`);// prendo i lavori che ha fatto l'utente
        const contratti = await risposta.json(); // riprendo l'output del api


        selezioneAzienda.innerHTML = '<option value="" disabled selected>Select Company you worked for</option>'; // aggiungo la sezione non utilizzata per indicare che cosa si deve scegliere

        if (contratti.length === 0){// se l'utente non ha lavori salvati
            alert("No verificated experience found.");
            window.location.href = 'homepage.html';
            return;
        }

        contratti.forEach(element => { // questa parte è fondamentale per essere coerente con il DB
            const contrattiOption = document.createElement('option');
            contrattiOption.value = element.p_iva; // il value è P_IVA
            contrattiOption.textContent = `${element.nome_azienda} - (${element.nome_posizione})`;
            selezioneAzienda.appendChild(contrattiOption);
        })
        // questo perchè le posizioni lavorative sono etichettate tramite la partita iva, vado a prendere tutti gli elementi che siano di quella partita iva
    }catch(error){
       console.error("error loading contract",error);
    }



    const riquadroRecensione = document.getElementById('review-form');

if (riquadroRecensione) {
    riquadroRecensione.addEventListener('submit',inviaRecensione);
}



// funzione di invio recensione
   async function inviaRecensione(event) {
       event.preventDefault();

//raccolta dei dati
       const company = document.getElementById('Review-company-selection').value;
       const rating = document.getElementById('Review-rating').value;
       const context = document.getElementById('Review-context').value;
       const title = document.getElementById('Review-title').value;


       //controllo della presenza dell'azienda scelta
       if (!company) {
           alert('No companies selected!');
           return;
       }

       const nuovaRecensione = {
           email: userOggetto.email, //l'email presa dalla sessione
           p_iva: company,
           titolo: title,
           valutazione: rating,
           descrizione: context
       };

       try{
           const risp = await fetch('api/add_review', {
               method: 'POST',
               headers: {'content-type': 'application/json'},
               body: JSON.stringify(nuovaRecensione)
           });

           const risultato = await risp.json();

           if (risp.ok){
               alert("Review completed successfully!");
               window.location.href = 'homepage.html';
           } else{
               alert("error" + risultato.error);
           }
       }catch(error){
           console.error("error Sending Review",error);
       }
   }

});