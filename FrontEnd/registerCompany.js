/* Studente: Enrico Brasiello
Matricola: 0124002755
Componenti gruppo: 1
Nome progetto: JobAdvisor
* Esame: Tecnologie Web a.a 2024/2025
* Data appello: 02/12/2025
* */



// questa sezione è dedicata al inserimento di dati dell'AZIENDA tramite il sito
document.getElementById('register-company-form').addEventListener('submit', creazioneUtenteAzienda);



async function creazioneUtenteAzienda(event) {
event.preventDefault();// come fatto in precedenza, evitiamo che la pagina ricarichi a vuoto.

    //dedicato alla parte utente
    const const_nome = document.getElementById('register-nome').value;
    const const_cognome = document.getElementById('register-surname').value;
    const const_email = document.getElementById('register-email').value;
    const const_datanascita = document.getElementById('register-birth').value;
    const const_password = document.getElementById('register-password').value;
    const const_sesso = document.getElementById('register-sex').value;


    //dedicato alla parte azienda
    const const_nome_azienda = document.getElementById('register-name-company').value;
    const const_partitaIVA = document.getElementById('register-IVA-company').value;
    const const_tipo_azienda = document.getElementById('register-type-company').value;
    const const_sede_azienda = document.getElementById('register-location-company').value;




    const ObjectComplete = {
        nome: const_nome,
        cognome: const_cognome,
        sesso: const_sesso,
        email: const_email,
        password: const_password,
        data_nascita: const_datanascita,
        nome_azienda: const_nome_azienda,
        sede: const_sede_azienda,
        partita_iva: const_partitaIVA,
        tipo_azienda: const_tipo_azienda,
    }


    // comunicazione con il server
    try{

        const risposta = await fetch('api/register_company',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(ObjectComplete)});


        const data = await risposta.json();

        if (risposta.ok){
            alert("Registration User and company complete. Please log in.");
            window.location.href="homepage.html";
        } else{
            // QUI MOSTRIAMO L'ERRORE DEL SERVER (es. "Email already exists")
            alert("Registration failed: " + data.error)
        }
    }catch(err){
        console.error(err);
        alert("Connection Error: " + err.message);
    }







}

