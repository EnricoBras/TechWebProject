/* Studente: Enrico Brasiello
Matricola: 0124002755
Componenti gruppo: 1
Nome progetto: JobAdvisor
* Esame: Tecnologie Web a.a 2024/2025
* Data appello: 02/12/2025
* */

// File javascript dedicata al login, parte importante perchè permette di salvare in memoria l'utente corrente

document.getElementById('login-form').addEventListener('submit', async function (event){
   event.preventDefault();

   const email = document.getElementById('login-email').value;
   const password = document.getElementById('login-password').value;

// sfruttando l'API login, memorizzo in memoria della sessione, l'utente in questione alla quale ha fatto l'accesso
   try{
       const response = await fetch('api/login',{
           method: 'POST',
           body: JSON.stringify({email, password}),
           headers: {'Content-Type': 'application/json'}
       });
       const data = await response.json();
       if (response.ok){
           sessionStorage.setItem('userlogged', JSON.stringify(data.user));
           alert("Logged in, welcome back!");
           window.location.href= 'homepage.html';
       } else {
           alert("Login failed");
       }
   } catch (error) {
       alert(error.message);
   }

});