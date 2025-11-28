/* Studente: Enrico Brasiello
Matricola: 0124002755
Componenti gruppo: 1
Nome progetto: JobAdvisor
* Esame: Tecnologie Web a.a 2024/2025
* Data appello: 02/12/2025
* */



// Questo documento serve a esplorare tutti gli annunci di lavoro presenti nel sito

document.addEventListener("DOMContentLoaded", async () => {
    const contenuto = document.getElementById('company-list');

    try{
        const risposta = await fetch('/api/all_jobs_company'); // richiamo l'api per ricevere tutti i lavori da parte delle aziende

        const lavori = await risposta.json();

        contenuto.innerHTML = '';// come sempre creo un contenuto che si riempie dinamicamente


        if(lavori.length === 0){
            contenuto.innerHTML= '<p>No data found.</p>';
            return;

        }

        lavori.forEach(element => {// per ogni lavoro creo un DIV contenente le caratteristiche del lavoro
            const tabella = document.createElement('div');
            tabella.className='company-card';

            tabella.innerHTML = `
                <div class="card-icon"> 
                    <i class="fa-solid fa-building"></i> 
                </div> 
                <div class="card-info">
                 <h2>${element.nome_azienda}</h2> 
                    <h3>${element.nome_posizione}</h3> 
                   
                    <p>Salary: ${element.stipendio || 'no Salary'}</p>
                    <p>Required Skills: ${element.competenze}</p>
                </div>
            `;



            tabella.onclick = () => {// come per le aziende, anche qui se cliccato, passo i suoi dati e accedo all'azienda
                window.location.href = `company.html?id=${element.p_iva}`; // con questo comando, quando clicchiamo, passiamo direttamente alla pagina dell'azienda in questione
            };
            contenuto.appendChild(tabella);
        });


    }catch (error){
        console.error("Error loading company jobs list",error);
        contenuto.innerHTML = '<p>Error</p>';
    }




});