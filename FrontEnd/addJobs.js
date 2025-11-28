/* Studente: Enrico Brasiello
Matricola: 0124002755
Componenti gruppo: 1
Nome progetto: JobAdvisor
* Esame: Tecnologie Web a.a 2024/2025
* Data appello: 02/12/2025
* */




document.addEventListener('DOMContentLoaded', async () => {

// l'utente viene salvato in sessione
    const storedUser = sessionStorage.getItem('userlogged');// prendo l'utente corrente dalla sessione
    if (!storedUser) { // in questa parte ho la certezza che se accedo a questa pagina non avendo fatto il login, anche se impossibile, mi da errore e riaccede alla pagina principale
        alert('Access Denied. User logged out!');
        window.location.href = 'homepage.html';
        return;
    }
// utilizzo una costante contenente l'utente salvato e convertito in stringa
    const userObj = JSON.parse(storedUser);

    // se il sudddetto utente non modera alcuna azienda allora esce da questa pagina perchè noon ne ha il permesso
    if(!userObj.moderator) {
        alert('Access Denied. User is no longer moderator!');
        window.location.href = 'homepage.html';
        return;
    }

    // form per la registrazione
    const form = document.getElementById('register-form');

    // piazzo un listener quando premo su "submit"
    form.addEventListener('submit', async (event) => {

        event.preventDefault();


// variabili con tutti i parametri del lavoro da inserire
        const job_position = document.getElementById('job-position').value;
        const job_benefit = document.getElementById('job-benefit').value;
        const job_salary = document.getElementById('job-salary').value;
        const job_skills = document.getElementById('job-skills').value;


// insieme di costanti alla quale associamo i valori definiti in precedenza
        const nuovojob = {
            partita_iva:userObj.moderator,
            nome_pos:job_position,
            benefit:job_benefit,
            stipendio:job_salary,
            competenze:job_skills,
        };

        // definiamo un try and catch
        try{// inseriamo l'insieme di costanti definiti prima all'interno della API, verrà poi eseguito con quei dati --> query
            const risposta = await fetch('/api/add_job',{
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(nuovojob),
            });


            const risultato = await risposta.json();
// se è tutto ok allora lo segnaliamo, portandoci alla pagina di prima
            if(risposta.ok){
                alert("Job Successfully Added!");
                window.location.href="manageCompany.html";

            }else{
                alert("error"+risultato.error);
            }
        }catch(err){
            console.log(err);
        }


    })





});