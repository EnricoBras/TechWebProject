/* Studente: Enrico Brasiello
Matricola: 0124002755
Componenti gruppo: 1
Nome progetto: JobAdvisor
* Esame: Tecnologie Web a.a 2024/2025
* Data appello: 02/12/2025
* */

// definizione del database, tecnologia utilizzata: mariaDB

const mariadb = require('mariadb'); // importo il pacchetto 'mariadb'


require('dotenv').config(); //importo dotenv per caricare le variabili dal file .env

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'main',
    password: 'main',
    database: 'jobreview',
    port: 3306,
    connectionLimit: 5, // limito a 5 le connessioni simultanee
});

module.exports = pool;
