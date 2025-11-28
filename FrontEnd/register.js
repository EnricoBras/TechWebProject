/* Studente: Enrico Brasiello
Matricola: 0124002755
Componenti gruppo: 1
Nome progetto: JobAdvisor
* Esame: Tecnologie Web a.a 2024/2025
* Data appello: 02/12/2025
* */


// questa sezione è dedicata al inserimento di dati tramite il sito
document.getElementById('register-form').addEventListener('submit', creazioneUtente);



async function creazioneUtente(event) {
    event.preventDefault();// evitiamo che la pagina ricarica a vuoto


    // raccolta dei valori da html
    const const_nome = document.getElementById('register-nome').value;
    const const_cognome = document.getElementById('register-surname').value;
    const const_email = document.getElementById('register-email').value;
    const const_datanascita = document.getElementById('register-birth').value;
    const const_password = document.getElementById('register-password').value;
    const const_sesso = document.getElementById('register-sex').value;



    // creazione dell'oggetto da inviare

    const newuser ={
        nome: const_nome,
        cognome: const_cognome,
        sesso: const_sesso,
        email: const_email,
        password: const_password,
        data_nascita: const_datanascita,
    }


    // parte importante, comunicazione con il server

    try{


        const response = await fetch('api/register',{
            method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newuser)}); // aspetta il fetch dall' api del server seguendo dei parametri

        const data = await response.json();


        // gestione della risposta

        if (response.ok){
            alert("registration complete, please login");
            window.location.href='login.html';
        } else {
            alert(data.error);
        }

    }catch(error){
        alert(error.message);
    }



}