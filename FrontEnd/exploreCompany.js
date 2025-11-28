/* Studente: Enrico Brasiello
Matricola: 0124002755
Componenti gruppo: 1
Nome progetto: JobAdvisor
* Esame: Tecnologie Web a.a 2024/2025
* Data appello: 02/12/2025
* */




document.addEventListener("DOMContentLoaded", async () => {
    const contenuto = document.getElementById('company-list');// prendiamo la lista in html vuota delle aziende

    try{
        const risposta = await fetch('/api/azienda'); // richiamo l'api per ricevere tutte le aziende

        const aziende = await risposta.json();

        contenuto.innerHTML = '';// creiamo un innerHTML per poter inserire i dati dinamicamente


        if(aziende.length === 0){
            contenuto.innerHTML= '<p>No data found.</p>';
            return;

        }

        aziende.forEach(element => {// creazione dinamica della card contenente i dettagli dell'azienda
            const tabella = document.createElement('div');
            tabella.className='company-card';

            tabella.innerHTML = `
                <div class="card-icon"> 
                    <i class="fa-solid fa-building"></i> 
                </div> 
                <i class="fa-solid fa-star"></i>
                <span>${element.media_voto} <span style="font-size: 0.8em; color: #000000; font-weight: normal;"></span></span>
                <div class="card-info">
                    <h3>${element.nome_azienda || element.nome}</h3> 
                    <p>Location: ${element.sede || 'Sede non specificata'}</p>
                </div>
            `;


// stabisco un comando che, quando cliccato, mi porta nella pagina company.html utilizzando la partita iva dell azienda scelta
        tabella.onclick = () => {
            window.location.href = `company.html?id=${element.p_iva}`; // con questo comando, quando clicchiamo, passiamo direttamente alla pagina dell'azienda in questione
        };
            contenuto.appendChild(tabella);
        });


    }catch (error){
        console.error("Error loading company list",error);
        contenuto.innerHTML = '<p>Error</p>';
    }




});