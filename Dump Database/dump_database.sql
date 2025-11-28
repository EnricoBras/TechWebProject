-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versione server:              12.0.2-MariaDB - mariadb.org binary distribution
-- S.O. server:                  Win64
-- HeidiSQL Versione:            12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dump della struttura del database jobreview
DROP DATABASE IF EXISTS `jobreview`;
CREATE DATABASE IF NOT EXISTS `jobreview` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `jobreview`;

-- Dump della struttura di tabella jobreview.azienda
DROP TABLE IF EXISTS `azienda`;
CREATE TABLE IF NOT EXISTS `azienda` (
  `p_iva` varchar(20) NOT NULL,
  `nome_azienda` varchar(50) NOT NULL,
  `sede` varchar(40) NOT NULL,
  `media_voto` decimal(10,2) DEFAULT 0.00,
  `tipo_azienda` varchar(30) NOT NULL,
  PRIMARY KEY (`p_iva`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dump dei dati della tabella jobreview.azienda: ~5 rows (circa)
DELETE FROM `azienda`;
INSERT INTO `azienda` (`p_iva`, `nome_azienda`, `sede`, `media_voto`, `tipo_azienda`) VALUES
	('11112222333', 'Digital Solutions Srl', 'Napoli', 4.50, 'Tech'),
	('13576212333', 'Steam S.r.l', 'Canada', 4.33, 'Tech'),
	('14263789873', 'Ubisoft Montréal s.r.l', 'Canada', 2.00, 'Tech'),
	('44445555666', 'Fast Logistics SpA', 'Milano', 0.00, 'Logistic'),
	('77778888999', 'Ristorante La Perla Nera', 'Genova', 3.60, 'Restoration');

-- Dump della struttura di tabella jobreview.posizione_lavoro
DROP TABLE IF EXISTS `posizione_lavoro`;
CREATE TABLE IF NOT EXISTS `posizione_lavoro` (
  `nome_posizione` varchar(30) NOT NULL,
  `p_iva` varchar(20) NOT NULL,
  `benefit` varchar(100) DEFAULT NULL,
  `stipendio` decimal(10,2) DEFAULT NULL,
  `competenze` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`nome_posizione`,`p_iva`),
  KEY `fk2_p_iva` (`p_iva`),
  CONSTRAINT `fk2_p_iva` FOREIGN KEY (`p_iva`) REFERENCES `azienda` (`p_iva`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dump dei dati della tabella jobreview.posizione_lavoro: ~10 rows (circa)
DELETE FROM `posizione_lavoro`;
INSERT INTO `posizione_lavoro` (`nome_posizione`, `p_iva`, `benefit`, `stipendio`, `competenze`) VALUES
	('AI Developer', '11112222333', 'Mensa, Palestra', 81000.00, 'Machine Learning, IA'),
	('Back End Developer', '13576212333', 'Chill Room', 21000.00, 'C++,Python,C'),
	('Backend Developer', '11112222333', 'Mensa, Smart Working', 32000.00, 'PHP, Laravel, MySQL'),
	('Cameriere di Sala', '77778888999', 'Vitto, Mance', 22000.00, 'Inglese, Gestione comande'),
	('Chef', '77778888999', 'None', 13000.00, 'Master Cooking'),
	('Front End Developer', '13576212333', 'Chill Room', 15000.00, 'HTML5,Python,CSS'),
	('Frontend Developer', '11112222333', 'Mensa, Palestra', 31000.00, 'React, CSS, Javascript'),
	('Magazziniere', '44445555666', 'Buoni pasto, Turni flessibili', 24000.00, 'Uso muletto, Picking'),
	('Maitre', '77778888999', 'Vitto, Mance, Assicurazione', 32000.00, 'Inglese, Gestione comande, Gestione camerieri'),
	('Office Cleaner', '14263789873', 'None', 21000.00, 'None'),
	('Pulizia Ufficio', '11112222333', 'Buoni Pasto', 12000.00, NULL),
	('Videogame Programmer', '14263789873', 'Smart-working', 31000.00, 'C#,C++,Blender');

-- Dump della struttura di tabella jobreview.recensione
DROP TABLE IF EXISTS `recensione`;
CREATE TABLE IF NOT EXISTS `recensione` (
  `id_recensione` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `p_iva` varchar(20) NOT NULL,
  `valutazione` int(11) DEFAULT NULL CHECK (`valutazione` between 1 and 5),
  `descrizione` varchar(850) DEFAULT NULL,
  `data_recensione` date NOT NULL,
  `titolo` varchar(50) NOT NULL,
  PRIMARY KEY (`id_recensione`),
  KEY `fk1_email_utente` (`email`),
  KEY `fk1_p_iva_azienda` (`p_iva`),
  CONSTRAINT `fk1_email_utente` FOREIGN KEY (`email`) REFERENCES `utente` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk1_p_iva_azienda` FOREIGN KEY (`p_iva`) REFERENCES `azienda` (`p_iva`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dump dei dati della tabella jobreview.recensione: ~3 rows (circa)
DELETE FROM `recensione`;
INSERT INTO `recensione` (`id_recensione`, `email`, `p_iva`, `valutazione`, `descrizione`, `data_recensione`, `titolo`) VALUES
	('burcom20251126190940', 'birraperoni@gmail.com', '11112222333', 4, 'Tutto ok', '2025-11-26', 'Mi sono trovato bene'),
	('ciccom20251123203936', 'cicciobello837@gmail.com', '11112222333', 5, 'Mi sono trovato molto bene!', '2025-11-23', 'Incredibile'),
	('ciccom20251128102125', 'cicciobello837@gmail.com', '13576212333', 3, 'Paga non molto alta e ambiente stressante', '2025-11-28', 'Un esperienza decente'),
	('Forcom20251128101934', 'ForzaNapoli@gmail.com', '13576212333', 5, 'Adoro i videogiochi e lavorare per steam è un sogno', '2025-11-28', 'Un incredibile esperienza'),
	('giocom20251128012706', 'giornogiovanna@gmail.com', '13576212333', 5, 'Ho avuto modo di fare tanta esperienza e mi sono divertito', '2025-11-28', 'Un ambiente incantevole'),
	('sancom20251128103226', 'santostefano@gmail.com', '14263789873', 2, 'Le scadenze non vengono mai rispettate', '2025-11-28', 'Frustrante');

-- Dump della struttura di tabella jobreview.ricopre
DROP TABLE IF EXISTS `ricopre`;
CREATE TABLE IF NOT EXISTS `ricopre` (
  `email` varchar(30) NOT NULL,
  `nome_posizione` varchar(30) NOT NULL,
  `p_iva` varchar(20) NOT NULL,
  `data_inizio` date DEFAULT NULL,
  `data_fine` date DEFAULT NULL,
  `verificato` int(1) DEFAULT NULL,
  PRIMARY KEY (`email`,`nome_posizione`,`p_iva`),
  KEY `fk3_posizione` (`nome_posizione`,`p_iva`),
  CONSTRAINT `fk3_email` FOREIGN KEY (`email`) REFERENCES `utente` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk3_posizione` FOREIGN KEY (`nome_posizione`, `p_iva`) REFERENCES `posizione_lavoro` (`nome_posizione`, `p_iva`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dump dei dati della tabella jobreview.ricopre: ~9 rows (circa)
DELETE FROM `ricopre`;
INSERT INTO `ricopre` (`email`, `nome_posizione`, `p_iva`, `data_inizio`, `data_fine`, `verificato`) VALUES
	('birraperoni@gmail.com', 'AI Developer', '11112222333', '2023-11-26', '2025-11-26', 1),
	('cicciobello837@gmail.com', 'Back End Developer', '13576212333', '2025-11-28', NULL, 1),
	('cicciobello837@gmail.com', 'Backend Developer', '11112222333', '1995-11-12', NULL, 1),
	('ForzaNapoli@gmail.com', 'Back End Developer', '13576212333', '2025-11-28', NULL, 1),
	('giornogiovanna@gmail.com', 'Front End Developer', '13576212333', '2024-11-28', NULL, 1),
	('pincopallino@gmail.com', 'Cameriere di Sala', '77778888999', '2025-11-28', NULL, 1),
	('provaemailutente@gmail.com', 'Back End Developer', '13576212333', '2025-11-28', NULL, 1),
	('santograal@gmail.com', 'Magazziniere', '44445555666', '2021-06-15', '2023-12-31', 1),
	('santostefano@gmail.com', 'Frontend Developer', '11112222333', '2023-03-01', NULL, 1),
	('santostefano@gmail.com', 'Videogame Programmer', '14263789873', '2025-11-28', NULL, 1);

-- Dump della struttura di tabella jobreview.utente
DROP TABLE IF EXISTS `utente`;
CREATE TABLE IF NOT EXISTS `utente` (
  `email` varchar(30) NOT NULL,
  `nome` varchar(25) NOT NULL,
  `cognome` varchar(25) NOT NULL,
  `data_nascita` date NOT NULL,
  `password_hash` varchar(50) NOT NULL,
  `sesso` varchar(1) NOT NULL,
  `moderator` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`email`),
  KEY `fk_moderator` (`moderator`),
  CONSTRAINT `fk_moderator` FOREIGN KEY (`moderator`) REFERENCES `azienda` (`p_iva`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dump dei dati della tabella jobreview.utente: ~20 rows (circa)
DELETE FROM `utente`;
INSERT INTO `utente` (`email`, `nome`, `cognome`, `data_nascita`, `password_hash`, `sesso`, `moderator`) VALUES
	('birraperoni@gmail.com', 'Santo', 'Iovine', '1969-11-12', 'password', 'M', NULL),
	('cicciobello837@gmail.com', 'Giorgio', 'Rossi', '1995-11-12', 'PasspassPP', 'M', NULL),
	('cuoregrande@gmail.com', 'Sara', 'Caputo', '2003-03-12', 'gdf555ds', 'M', '44445555666'),
	('fionamoro@gmail.com', 'Fiona', 'Del Moro', '1999-04-14', 'sessopazzo', 'F', NULL),
	('ForzaNapoli@gmail.com', 'Luigi', 'Esposito', '2001-09-11', 'Napoli1926', 'M', NULL),
	('furiosocane@gmail.com', 'Silvio', 'Berlusconi', '1999-12-12', 'password321', 'O', NULL),
	('gallogig88@gmail.com', 'Luigi', 'Gallo', '2003-09-02', 'trenotreno1234', 'M', NULL),
	('giornogiovanna@gmail.com', 'Giorno', 'Giovanna', '2000-11-15', 'giogio1234', 'M', NULL),
	('javabarc@gmail.com', 'Marco', 'Merrino', '2000-01-14', 'pistacchiosa', 'M', NULL),
	('marcopunto@gmail.com', 'Marco', 'Punto', '1988-02-12', 'passawdawd23477', 'M', NULL),
	('mariorossi87@gmail.com', 'Mario', 'Rossi', '1985-09-07', 'rossi1234', 'M', NULL),
	('pazzofurioso@gmail.com', 'Sergio', 'Mattarella', '1999-12-14', 'italia', 'M', NULL),
	('pincopallino@gmail.com', 'Gerardo', 'Gen', '1997-02-03', 'mustafa', 'M', NULL),
	('provaemailazienda@gmail.com', 'Marco', 'Polo', '1999-12-12', 'admin', 'M', '13576212333'),
	('provaemailutente@gmail.com', 'Prova', 'Utente', '2003-07-15', 'admin', 'O', NULL),
	('santogen@gmail.com', 'Santo', 'Genovese', '2000-12-21', 'santo4321', 'M', '77778888999'),
	('santograal@gmail.com', 'Mario', 'Baluastro', '1985-09-12', 'passs4356', 'M', NULL),
	('santostefano@gmail.com', 'Nicola', 'Rossi', '1999-09-12', 'pasdg2938sword657', 'M', NULL),
	('santostefano4324@gmail.com', 'Cristiano', 'Ronaldo', '2000-02-15', 'maccaroni11', 'M', NULL),
	('ubisoftmail@gmail.com', 'Marco', 'Monthreal', '1975-03-13', 'ubiubi1234', 'O', '14263789873');

-- Dump della struttura di trigger jobreview.blocca_duplicati_ricopre
DROP TRIGGER IF EXISTS `blocca_duplicati_ricopre`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER blocca_duplicati_ricopre
BEFORE INSERT ON ricopre
FOR EACH ROW
BEGIN
    DECLARE cnt INT DEFAULT 0;

    SELECT COUNT(*) INTO cnt
    FROM ricopre
    WHERE email = NEW.email
      AND p_iva = NEW.p_iva;

    IF cnt > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Errore: esiste già un rapporto lavorativo per questo utente e questa azienda.';
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dump della struttura di trigger jobreview.Gestione_date_lavori
DROP TRIGGER IF EXISTS `Gestione_date_lavori`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER Gestione_date_lavori
BEFORE INSERT ON ricopre
FOR EACH ROW
BEGIN
    SET NEW.data_inizio = NOW();
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dump della struttura di trigger jobreview.gestione_id_recensione
DROP TRIGGER IF EXISTS `gestione_id_recensione`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER gestione_id_recensione
BEFORE INSERT ON recensione
FOR EACH ROW
BEGIN
    DECLARE temp_mail VARCHAR(255);

    SET temp_mail = NEW.email;

    SET NEW.id_recensione = CONCAT(
        SUBSTR(temp_mail, 1, 3),
        SUBSTR(temp_mail, -3),
        DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')
    );
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dump della struttura di trigger jobreview.gestione_maggiorenni_ins
DROP TRIGGER IF EXISTS `gestione_maggiorenni_ins`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER gestione_maggiorenni_ins
BEFORE INSERT ON utente
FOR EACH ROW
BEGIN
    IF TIMESTAMPDIFF(YEAR, NEW.data_nascita, CURDATE()) < 18 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'utente inserito deve essere maggiorenne';
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dump della struttura di trigger jobreview.gestione_maggiorenni_upd
DROP TRIGGER IF EXISTS `gestione_maggiorenni_upd`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER gestione_maggiorenni_upd
BEFORE UPDATE ON utente
FOR EACH ROW
BEGIN
    IF TIMESTAMPDIFF(YEAR, NEW.data_nascita, CURDATE()) < 18 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'utente aggiornato deve essere maggiorenne';
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dump della struttura di trigger jobreview.gestione_spam_recensioni
DROP TRIGGER IF EXISTS `gestione_spam_recensioni`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER gestione_spam_recensioni
BEFORE INSERT ON recensione
FOR EACH ROW
BEGIN
    DECLARE num INT DEFAULT 0;

    SELECT COUNT(*) INTO num
    FROM recensione
    WHERE email = NEW.email
      AND p_iva = NEW.p_iva;

    IF num > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Impossibile creare più recensioni per una azienda.';
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dump della struttura di trigger jobreview.media_azienda_cancella_recensione
DROP TRIGGER IF EXISTS `media_azienda_cancella_recensione`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER media_azienda_cancella_recensione
AFTER DELETE ON recensione
FOR EACH ROW
BEGIN
    UPDATE azienda
    SET media_voto = (
        SELECT AVG(valutazione)
        FROM recensione
        WHERE p_iva = OLD.p_iva
    )
    WHERE p_iva = OLD.p_iva;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dump della struttura di trigger jobreview.media_azienda_modifica_recensione
DROP TRIGGER IF EXISTS `media_azienda_modifica_recensione`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER media_azienda_modifica_recensione
AFTER UPDATE ON recensione
FOR EACH ROW
BEGIN
    UPDATE azienda
    SET media_voto = (
        SELECT AVG(valutazione)
        FROM recensione
        WHERE p_iva = NEW.p_iva
    )
    WHERE p_iva = NEW.p_iva;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dump della struttura di trigger jobreview.media_azienda_nuova_recensione
DROP TRIGGER IF EXISTS `media_azienda_nuova_recensione`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER media_azienda_nuova_recensione
AFTER INSERT ON recensione
FOR EACH ROW
BEGIN
    UPDATE azienda
    SET media_voto = (
        SELECT AVG(valutazione)
        FROM recensione
        WHERE p_iva = NEW.p_iva
    )
    WHERE p_iva = NEW.p_iva;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dump della struttura di trigger jobreview.verifica_contratto_recensione
DROP TRIGGER IF EXISTS `verifica_contratto_recensione`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER verifica_contratto_recensione
BEFORE INSERT ON recensione
FOR EACH ROW
BEGIN
    DECLARE lavoro_attuale VARCHAR(30);
    DECLARE verifica INT;

   
    SELECT nome_posizione, verificato
    INTO lavoro_attuale, verifica
    FROM ricopre
    WHERE email = NEW.email
      AND p_iva = NEW.p_iva
    LIMIT 1;

    -- Se nessun lavoro è stato trovato
    IF lavoro_attuale IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Utente non ha mai lavorato per questa azienda';
    END IF;

    -- Se non è verificato
    IF verifica = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Utente non si ritrova nello stato di dipendente verificato.';
    END IF;

END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
