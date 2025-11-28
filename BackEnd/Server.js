/* Studente: Enrico Brasiello
Matricola: 0124002755
Componenti gruppo: 1
Nome progetto: JobAdvisor
* Esame: Tecnologie Web a.a 2024/2025
* Data appello: 02/12/2025
* */

const express = require('express');
const path = require('path');
const databasepool = require('./database.js');
const {query} = require("express");



const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../FrontEnd'))); // con questa linea di codice io posso entrare in altre cartelle, per facilitare la navigabiità

// definizione della porta da usare
const port = process.env.PORT || 3000;


// Forzo l'invio del file homepage.html quando vai su "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../FrontEnd/homepage.html'));
});




// un API per leggere gli utenti
app.get('/api/utente', async (req, res) => {
    let connessione;
    try {
        connessione = await databasepool.getConnection();
        //seleziono i dati dalla tabella utente
        const tupla = await connessione.query("SELECT * FROM utente");
        res.json(tupla);
    } catch (err) {
        console.error(err);
    }
    finally {
        if (connessione) await connessione.release();
    }
})

// un API per prendere tutte le recensioni più recenti
app.get('/api/recent_review',async (req, res) => {
    let connessione;
    try{
        connessione = await databasepool.getConnection();
        const tupla = await connessione.query("select recensione.*,azienda.nome_azienda as nome_azienda, utente.nome as nome_utente , utente.cognome as cognome_utente from recensione join azienda on recensione.p_iva = azienda.p_iva join utente on recensione.email = utente.email order by data_recensione DESC LIMIT 3 ");

        res.json(tupla);


    }catch(err){
        console.error(err);
        res.status(500).json({error: err});
    }finally
    {
        if (connessione) await connessione.release();
    }
});


// un API per prendere tutte le aziende
app.get('/api/azienda', async (req, res) => {
    let connessione;
    try {
        connessione = await databasepool.getConnection();
        const tupla = await connessione.query("SELECT * FROM azienda");
        res.json(tupla);
    } catch (err) {
        console.error(err);
    }
    finally {
        if (connessione) await connessione.release();
    }
})



 // un API che restituisce tutti i posti di lavoro e il loro determinato richiedente o occupante
app.get('/api/get_job_USER', async (req, res) => {
    let connessione;
    try{
        const partita_iva = req.query.partita_iva;
        connessione = await databasepool.getConnection();
        const tupla = "select * from posizione_lavoro where p_iva = ?";
        const risultato = await connessione.query(tupla,[partita_iva]);
        res.json(risultato);
    }catch(err){
        console.error(err);
        console.log("Error getting job USER");
    }
})





// API per ottenere le aziende per cui l'utente in questione ha lavorato.
app.get('/api/get_contract', async (req, res) => {
    let connessione ;
    try{
        connessione  = await databasepool.getConnection();
        const emailUtente = req.query.email;
        if(!emailUtente)
        {
            return res.status(400).json({error:"email missing!"});
        }
        const tupla = 'SELECT posizione_lavoro.nome_posizione,azienda.p_iva, azienda.nome_azienda, ricopre.data_inizio,ricopre.data_fine,ricopre.verificato from posizione_lavoro join ricopre on ricopre.nome_posizione = posizione_lavoro.nome_posizione join utente on utente.email = ricopre.email join azienda on azienda.p_iva = posizione_lavoro.p_iva where ricopre.email = ? order by ricopre.data_inizio DESC';

        const contratti = await connessione.query(tupla, [emailUtente]);
        res.json(contratti);


    }catch (err){
        console.error("errore caricamento dello storico", err);
    }finally {
        if (connessione) await connessione.release();
    }
})

// un api per ottenere tutte le recensioni che l'utente ha fatto a diverse aziende
app.get('/api/get_review_from_user', async (req, res) => {
    let connessione;

    try{
        connessione = await databasepool.getConnection();
        const emailUtente = req.query.email;
        if (!emailUtente){
            return res.status(400).json({error:"email missing!"});
        }



        const tupla = 'select recensione.titolo, azienda.nome_azienda,recensione.id_recensione,recensione.data_recensione,recensione.valutazione from recensione join azienda on recensione.p_iva = azienda.p_iva  where recensione.email = ? ';
    const recensione = await connessione.query(tupla, [emailUtente]);
    res.json(recensione);
    }catch(err){
        console.error(err);
    }finally{
        if (connessione) await connessione.release();
    }

})





//api che prende l'azienda quotata meglio tra le recensioni

app.get('/api/top_company', async (req, res) => {
    let connessione;
    try{
        connessione = await databasepool.getConnection();

        const query = 'select * from azienda order by azienda.media_voto DESC LIMIT 3';

        const risultato = await connessione.query(query);

        res.json(risultato);
    }catch(err){
        console.error("Error searching top companies",err);

    }finally {
        if (connessione) await connessione.release();
    }
})

//----------------------------------------API dedicate alla creazione dinamica delle pagine---------------------------------

//richiesta di dettagli dell'azienda
app.get('/api/company_details', async (req, res) => {
    let connessione;
    try{
        const partita_iva = req.query.id; // con questa linea di codice, cerchiamo l'id dentro l'url, che sarebbe ?id=...
        connessione = await databasepool.getConnection();
        const tupla = await connessione.query("select * from azienda where p_iva = ?",[partita_iva]);
        res.json(tupla[0]);

    }catch(err){
        console.error("Error searching company",err);
    }finally {
        if (connessione) await connessione.release();
    }
});


//richiesta lavori collegati all'azienda

app.get('/api/company_jobs', async (req, res) => {
    let connessione;
    try {
        const partita_iva = req.query.id; // con questa linea di codice, cerchiamo l'id dentro l'url, che sarebbe ?id=...
        connessione = await databasepool.getConnection();
        const tupla = await connessione.query("select * from posizione_lavoro where p_iva = ?", [partita_iva]);
        res.json(tupla);
    }catch(err){
        console.error("Error searching company jobs",err);
    }
    finally{
        if (connessione) await connessione.release();
    }
})

//richiesta di tutti i lavori da parte di tutte le aziende
app.get('/api/all_jobs_company', async (req, res) => {
    let connessione
    try{
        connessione = await databasepool.getConnection();
        const tupla = await connessione.query("select posizione_lavoro.*,azienda.nome_azienda from posizione_lavoro join azienda on azienda.p_iva = posizione_lavoro.p_iva");
        res.json(tupla);
    }catch(err){
        console.error("Error searching all company Jobs",err);
    }finally{
        if (connessione) await connessione.release();
    }
})


// richiesta ultime recensioni collegate all'azienda
app.get('/api/company_reviews', async (req, res) => {
    let connessione;
    try{
        const partita_iva = req.query.id;
        connessione = await databasepool.getConnection();
        const tupla = await connessione.query("select recensione.*,utente.nome,utente.cognome from recensione join utente on utente.email = recensione.email where p_iva = ?", [partita_iva]);
        res.json(tupla);
    }catch(err){
        console.error("Error loading reviews",err);
    }finally{
        if (connessione) await connessione.release();
    }
})

//----------------------------------------API dedicate alla creazione dinamica delle pagine---------------------------------


// --- NUOVO ENDPOINT DI TEST CONNESSIONE --- Usato in origine per i test di connessione, non è importante
app.get('/api/test-db', async (req, res) => {
    console.log("Ricevuta richiesta di TEST connessione DB...");
    let conn;
    try {
        // Proviamo solo a ottenere una connessione
        conn = await databasepool.getConnection();

        // Se arriva qui, HA FUNZIONATO!
        console.log("Connessione al DB riuscita!");
        res.status(200).json({ message: "Connessione al database RIUSCITA!" });

    } catch (error) {
        // Se fallisce, vedrai lo stesso errore 'pool timeout'
        console.error("TEST FALLITO:", error);
        res.status(500).json({
            message: "TEST CONNESSIONE FALLITO",
            error: error.message,
            code: error.code
        });
    } finally {
        // Rilasciamo la connessione
        if (conn) {
            await conn.release();
        }
    }
});

// api per richiedere tutte le richieste di lavoro ad una determinata azienda data la partita iva
app.get('/api/get_request_job', async (req, res) => {
    let connessione;
    try{
        const partita_iva = req.query.it;
        connessione = await databasepool.getConnection();
        const tupla = await connessione.query("select ricopre.*,utente.nome,utente.cognome from ricopre join utente on utente.email = ricopre.email where p_iva = ?", [partita_iva]);
    res.json(tupla);

    }catch(err){
        console.error("Error getting request job",err);
    }
    finally{
        if (connessione) await connessione.release();
    }
})
// IN QUESTA PARTE CI SOONO TUTTE LE API POST


//Api per aggiungere una recensione
app.post('/api/add_review',async (req, res) => {
    let connessione
    try{
        const {email,p_iva,titolo,valutazione,descrizione} = req.body; //dichiaro delle costanti con i dati raccolti nel form input


        if(!email||!p_iva||!titolo||!valutazione||!descrizione){ //controllo se ci sono elementi omessi
            return res.status(400).json({error: "Missing Fields!"});
        }

        connessione = await databasepool.getConnection();//stabilisco la connessione

        const data_attuale = new Date().toISOString().split('T')[0]; //prendo la data attuale di quando è stata fatta la recensione

        const tupla = ' insert into recensione(email,p_iva,titolo,valutazione,descrizione,data_recensione) values (?,?,?,?,?,?)';

        await connessione.query(tupla,[email,p_iva,titolo,valutazione,descrizione,data_attuale]);

        res.status(201).json({message:"Successfully inserted review"});

    }catch(err){
        if (err.code === 'ER_SIGNAL_EXCEPTION'){ // tramite il trigger nel database, se ritrovo il codice 'ER_SIGNAL_EXCEPTION che riguarda proprio il mio trigger, segnalo l'errore seguente
            return res.status(409).json({error: " You have already compiled a review for this company!"});
        }
        console.error("Error adding review",err);

    }finally {
        if (connessione) await connessione.release();
    }
})



// api per aggiungere un lavoro
app.post('/api/add_job',async (req, res) => {
    let connessione
    try{

        const {partita_iva,nome_pos,benefit,stipendio,competenze} = req.body;

        if(!nome_pos || !benefit || !stipendio || !competenze){
            return res.status(400).json({error: "Missing Fields!"});
        }

        connessione = await databasepool.getConnection();
        const tupla = ' insert into posizione_lavoro (nome_posizione,p_iva,benefit,stipendio,competenze) values (?,?,?,?,?)';

        await connessione.query(tupla,[nome_pos,partita_iva,benefit,stipendio,competenze]);

        res.status(201).json({message:"Successfully inserted job"});

    }catch(err){
        console.error("Error adding job",err);
    }finally{
        if (connessione) await connessione.release();
    }
})

// --API per gestione del login --
app.post('/api/login',async (req, res) => {
    let conn;
    try{
        const{ email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({error: "Email and password required!"});
        }
        conn = await databasepool.getConnection();


        //ricerca dell'utente
        const query = 'select * from utente where email=? and password_hash=?'; // seleziono tutto con la query, sono certo di trovare una singola tupla perchè email è PK
        const values =await conn.query(query,[email, password]);

        if (values.length > 0) {
            const findUser = values[0];

            delete findUser.password_hash;

            res.json({
                user: findUser,
                success: true,
                message: "Login successfull"
            });
        } else {
            res.status(401).json({error: "Email or password wrong!"});
        }
    } catch (error) {
        console.error("TEST FALLITO:", error);
    } finally {
        if (conn) {
            await conn.release();
        }
    }
});

//API per la registrazione degli utenti
app.post('/api/register',async (req, res) => {
    console.log("Dati ricevuti dal Frontend:", req.body);
    let conn;
    try{
        // in questa sezione verranno ricevuti i dati dal frontend
        const {
            nome, cognome, sesso,email, password, data_nascita
        } = req.body;
        if (!nome || !cognome || !email || !password || !data_nascita || !sesso) {
            return res.status(400).json({error: "All fields are required!"});
        }

        conn = await databasepool.getConnection();

        // in questa parte verrà definita la query per l'inserimento dei dati nel database

        const querytemp = 'INSERT INTO UTENTE (nome,cognome,sesso,email,password_hash,data_nascita) VALUES (?,?,?,?,?,?)';
        // values sono i valori che passiamo tramite il const che sta nel body


        // in questa sezione la query viene eseguita passando i valori
        const result = await conn.query(querytemp,[nome,cognome,sesso,email,password,data_nascita]); // result aspetta la connessione e la query, dove prende la query selezionata e gli elementi corrispettivi

        if (result.affectedRows > 0) { // se il risultato ha avuto effetto su almeno una tupla
            res.status(201).json({
                message:'User successfully registered! Welcome to JobAdvisor!'
            });
        } else
        {
           throw new Error("no line inserted");
        }
    }catch(err){
        console.error("DATABASE FALLITO:", err); //gestione delle eccezioni. Se ritrova errori o se la mail esiste già, allora in questo caso partono eccezioni e termina il comando
        if (err.code === 'ER_DUP_ENTRY'){
            res.status(400).json({error: "Email already exists!"});
        }
        else{
            res.status(500).json({error: "Internal Server Error"});
        }
    } finally {
        if (conn) {
            await conn.release();
        }
    }
})

app.post('/api/add_contract',async (req, res) => {
    let connessione;
    try{
        const  { email, nome_posizione, p_iva} = req.body;

        if (!email || !nome_posizione || !p_iva){
            return res.status(400).json({error: "Missing fields!"});
        }

        connessione = await databasepool.getConnection();

        const query ='insert into ricopre(email,nome_posizione,p_iva,verificato) values (?,?,?,0)';

        await connessione.query(query,[email,nome_posizione,p_iva]);
        res.status(201).json({ message: "Job request sent! Waiting for company verification." });
    }catch(err){
        console.error("error add contract",err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: "You have already added this job position!" });
        } else {
            res.status(500).json({ error: "Server Error while adding job." });
        }
    } finally {
        // 3. Rilascio connessione
        if (connessione) await connessione.release();
    }
})

// api per registrare le aziende
app.post('/api/register_company',async (req, res) => {
    console.log("Dati ricevuti dal Frontend:", req.body); // in questa api le aziende e gli utenti vengono creati insieme
    let conn;
    try {
        conn = await databasepool.getConnection();

        // in questa sezione verranno ricevuti i dati dal frontend
        const {
            nome, cognome, sesso, email, password, data_nascita, partita_iva
            , nome_azienda, sede, tipo_azienda
        } = req.body;


        if (!nome || !cognome || !email || !password || !data_nascita || !sesso ) {
            return res.status(400).json({error: "All fields are required!"});
        }

        if (!partita_iva || !nome_azienda || !sede || !tipo_azienda ) {
            return res.status(400).json({error: "All fields are required!"});
        }

        await conn.beginTransaction();
        try{


            const queryAzienda = 'INSERT INTO AZIENDA (p_iva,nome_azienda,sede,media_voto,tipo_azienda) VALUES (?,?,?,?,?)'; // viene creata prima l'azienda per rispettare il vincolo di moderator
            const resultCompany = await conn.query(queryAzienda, [partita_iva, nome_azienda, sede, 0, tipo_azienda]);
            // In pratica, moderator deve collegarsi alla partita iva di un azienda. Se quell'azienda non esiste allora il codice fallisce.

            // viene creato l'utente.
            const queryUtente = 'INSERT INTO UTENTE (nome,cognome,sesso,email,password_hash,data_nascita,moderator) VALUES (?,?,?,?,?,?,?)'; // inserisco il moderator, e inserisco la partita iva dell'azienda
            const resultUser = await conn.query(queryUtente, [nome, cognome, sesso, email, password, data_nascita, partita_iva]);




            await conn.commit();

            if (resultUser.affectedRows > 0 && resultCompany.affectedRows > 0) { // se il risultato ha avuto effetto su almeno una tupla
                res.status(201).json({
                    message: 'User Company successfully registered! Welcome to JobAdvisor!'
                });
            } else {
                throw new Error("no line inserted");
            }


        }catch(sqlError){
            await conn.rollback();
            throw sqlError;
        }
        // eseguo un try and catch innestato per evitare di avere dati corrotti

    }catch(error){
        console.error("INSERIMENTO AZIENDA FALLITO:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: "Email or VAT Number already exists!" });
        } else {
            // AGGIUNGI QUESTO ELSE FONDAMENTALE
            res.status(500).json({ error: "Errore server: " + error.message });
        }
    }finally{
        if (conn) { await conn.release();}
    }

})



// IN QUESTA PARTE CI SONO TUTTE LE API VOLTE A CANCELLARE UN QUALCOSA


//api per cancellare i contratti di lavoro
app.delete ('/api/delete_contract',async (req, res) => {
    let connessione
    try{
        connessione = await databasepool.getConnection();
        const { email,nome_posizione} = req.body;

        console.log("Tentativo cancellazione:", { email, nome_posizione});

        const tuplacancella = 'DELETE FROM ricopre where email = ? and nome_posizione = ? ';

        await connessione.query(tuplacancella, [email, nome_posizione]);



        res.json({message: "Contract eliminated."});

    }catch(err){
        res.status(500).json({error: "Error cancelling contract."});
    }finally{
        if (connessione) {
            await connessione.release();
        }
    }
})

// api per cancellare le recensioni
app.delete ('/api/delete_review',async (req, res) => {
    let connessione
    try{
        const { id_recensione} = req.body;
        connessione = await databasepool.getConnection();

        const tuplacancella = 'DELETE FROM recensione where id_recensione= ?';
        await connessione.query(tuplacancella, [id_recensione]);
        res.json({message: "Review eliminated."});

    }catch(err){
        res.status(500).json({error: "Error cancelling review."});
    }finally{
        if (connessione) {
            await connessione.release();
        }
    }
})

//api per cancellare le posizioni di lavoro
app.delete ('/api/delete_job',async (req, res) => {
    let connessione
    try{
        const { nome_posizione,p_iva} = req.body;
        connessione = await databasepool.getConnection();

        const tuplacancella = 'DELETE FROM posizione_lavoro where p_iva= ? and nome_posizione= ?';
        await connessione.query(tuplacancella, [p_iva,nome_posizione]);
        res.json({message: "job eliminated."});

    }catch(err){
        res.status(500).json({error: "Error cancelling job."});
    }finally{
        if (connessione) {
            await connessione.release();
        }
    }
})


//--------------PARTE DEDICATA ALLE RICHIESTE DI LAVORO -------------------------
app.get('/api/company_request',async (req, res) => {
    let connessione;
    try{
        const p_iva = req.query.id;
        connessione = await databasepool.getConnection();


        const tupla = 'Select ricopre.*,utente.nome,utente.cognome from ricopre join utente on utente.email = ricopre.email where ricopre.p_iva = ?';

        const ris = await connessione.query(tupla,[p_iva]);
        res.json(ris);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Error requesting company"});
    }finally{
        if (connessione) {
            await connessione.release();
        }
    }
})


// 2. PUT Validare Richiesta
app.put('/api/validate_request', async (req, res) => {
    let connessione;
    try {
        // Ci servono le 3 chiavi primarie per identificare la riga univoca
        const { email, nome_posizione } = req.body;



        connessione = await databasepool.getConnection();

        const query = `
            UPDATE ricopre 
            SET verificato = 1 
            WHERE email = ? AND nome_posizione = ? 
        `;

        await connessione.query(query, [email, nome_posizione]);
        res.json({ message: "Verified!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Validation Error"});
    } finally {
        if(connessione) await connessione.release();
    }
})



// --- FINE ENDPOINT DI TEST ---

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    console.log(`go on http://localhost:${port}/ to test`);
});