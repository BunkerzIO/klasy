/**server.js - serwer tworzący api które pozwalają na wykonywanie różnych operacji takie jak
*tworzenie 
*logowanie użytkownika
*dodawanie i usuwanie wydarzeń
*odczyt wydarzeń
*/

const express = require("express")
const app = express()
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

const fs = require('fs');//do jsona



app.use(cors()); //umożliwia połączenie między domenami (łączy frontend i backend)

app.use(express.json()); //uruchomienie aplikacji - serwera

const mongoUrl =  "" //baza danych

//łączenie się  z bazą danuch
mongoose
.connect(mongoUrl, {
    useNewUrlParser: true
})
//komunikat w przypdaku poprawnego połączenia
.then (()=> {
    console.log("Connected to database");
})//komunikat w przypdaku błędu
.catch((e)=> console.log(e));
//pobranie schematu użytkownika
require("./schemas/userDetails");
//przypisanie użytkownika do zmiennej
const User = mongoose.model("UserInfo");





/**
 * logowanie użytkownika
 * pobiera email i hasło i sprawdza prawidłowość danych
 * @param  req - dane przesyłane z frontendu
 * @param  res - odpowiedź 
 */
app.post('/login', async (req, res) => {
  const { nick, password } = req.body;

  const filePath = path.join(__dirname, "users", `${nick}.json`);

  try {
    // Wczytanie danych użytkownika z pliku
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);

    console.log('Z frontendu:', password);
    console.log('Z pliku JSON (hash):', json.password);

    // Porównanie hasła (tekstowego) z hashem z pliku
    const isPasswordValid = await bcrypt.compare(password, json.password);

    if (isPasswordValid) {
      // Tworzenie tokenu JWT
      const token = jwt.sign(
        {
          name: json.nick,
          email: json.email,
        },
        'secret123'
      );

      return res.json({ status: 'ok', user: token });
    } else {
      return res.json({ status: 'error', user: false, message: 'Invalid password' });
    }

  } catch (err) {
    console.error("Login error:", err);
    return res.json({ status: 'error', user: false, message: 'User not found' });
  }
});

/**
 * pobieranie danuch użytkownika
 * pobiera token, wyciąga dane (emial i nick) powiązane z nim oraz na podstawie tych danych podaje wydarzenia przypisane do tego użytkownika
 * @param  req - dane przesyłane z frontendu
 * @param  res - odpowiedź 
 */


app.get("/userinfo", async (req,res) => {
    //token
    const token = req.headers['x-access-token']
    try {
      //pobieranie danych z tokenu użytkownika
        const decoded = jwt.verify(token, 'secret123')
		//email użytkownika
        const email = decoded.email
        //wyszukiwanie użytkownika po emailu
        const user = await User.findOne({ email: email })
        //zwracanie wydarzeń użytkownika z tablicy events oraz komunikatu o pomyślnym wykonaniu
        return res.json({ status: 'ok', events: user.events })
       
	} catch (error) {
    //komunikat w przypadku błędu
		res.json({ status: 'error', error: 'invalid token' })
	}

})




app.post("/register", async (req, res) => {
  const { email, nick, password } = req.body;

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);

    const usersDir = path.join(__dirname, "users");
    const filePath = path.join(usersDir, `${nick}.json`);

    // Sprawdzenie czy plik istnieje — próba odczytu pliku
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const existingUser = JSON.parse(data);
      return res.json({ error: "User Exists" });
    } catch (err) {
      // Jeśli plik nie istnieje, kontynuujemy — brak błędu
      if (err.code !== 'ENOENT') {
        throw err; // inne błędy niż "plik nie istnieje" są istotne
      }
    }

    // Tworzenie danych użytkownika
    const userData = {
      email,
      nick,
      password: encryptedPassword,
    };

    // Upewnij się, że katalog istnieje
    await fsPromises.mkdir(usersDir, { recursive: true });

    // Zapisz dane do pliku
    await fsPromises.writeFile(filePath, JSON.stringify(userData, null, 2));

    console.log("Z frontendu:", req.body.password); // logowanie oryginalnego hasła
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Registration error:", error);
    res.send({ status: "error" });
  }
});
// /**
//  * logowanie użytkownika
//  * pobiera email i hasło i sprawdza prawidłowość danych
//  * @param  req - dane przesyłane z frontendu
//  * @param  res - odpowiedź 
//  */
// app.post('/login', async (req, res) => {
// 	//wyszukiwanie użytkownika po emailu
//   const user = await User.findOne({
// 		email: req.body.email,
// 	})
//   //sprawdza czy użytkownik istnieje i zwraca błąd, jeżeli użytkownik o podanym e-mailu nie istnieje
// 	if (!user) {
// 		return { status: 'error', error: 'Invalid login' }
// 	}
//   //sprawdza prawidłowość hasła i zwraca boolean
// 	const isPasswordValid = await bcrypt.compare(
// 		req.body.password,
// 		user.password
// 	)
//     //w przypdadku podania prawidłowego hasła tworzy token (o nazwie secret123)i przypisuje do niego email i nick
// 	if (isPasswordValid) {
// 		const token = jwt.sign(
// 			{
// 				name: user.name,
// 				email: user.email,
// 			},
// 			'secret123'
// 		)
//       //zwraca komikaty w przypadku powodzenia
// 		return res.json({ status: 'ok', user: token })
// 	} else {
// 		return res.json({ status: 'error', user: false })
// 	}
// })









// /**
//  * rejestracja użytkownika
//  * pobiera email, nick i hasło i tworzy w bazie danych nowego użytkownika
//  * @param  req - dane przesyłane z frontendu
//  * @param  res - odpowiedź 
//  */
// app.post("/register", async (req, res) => {
//   //przypisanie danych z frondtednu 
//     const { email,nick, password } = req.body;
//   //szyfrowanie hasła
//   const encryptedPassword = await bcrypt.hash(password, 10);
//   try {
//     //wyszukiwanie czy użytkownik o podanym mailu istnieje
//     const oldUser = await User.findOne({ email });
//     //sprawdzanie czy email jest już wykorzystywany
//     if (oldUser) {
//       return res.json({ error: "User Exists" });
//     }

//     //towrzenie nowego użytkownika
//     await User.create({
//       email,
//       nick,
//       password: encryptedPassword,
//     });
//     //komunikat wysyłany jeżeli operacja zakończy się powodzeniem
//     res.send({ status: "ok" });
//   } catch (error) {
//     res.send({ status: "error" });
//   }
// });

// /**
//  * logowanie użytkownika
//  * pobiera email i hasło i sprawdza prawidłowość danych
//  * @param  req - dane przesyłane z frontendu
//  * @param  res - odpowiedź 
//  */
// app.post('/login', async (req, res) => {
// 	//wyszukiwanie użytkownika po emailu
//   const user = await User.findOne({
// 		email: req.body.email,
// 	})
//   //sprawdza czy użytkownik istnieje i zwraca błąd, jeżeli użytkownik o podanym e-mailu nie istnieje
// 	if (!user) {
// 		return { status: 'error', error: 'Invalid login' }
// 	}
//   //sprawdza prawidłowość hasła i zwraca boolean
// 	const isPasswordValid = await bcrypt.compare(
// 		req.body.password,
// 		user.password
// 	)
//     //w przypdadku podania prawidłowego hasła tworzy token (o nazwie secret123)i przypisuje do niego email i nick
// 	if (isPasswordValid) {
// 		const token = jwt.sign(
// 			{
// 				name: user.name,
// 				email: user.email,
// 			},
// 			'secret123'
// 		)
//       //zwraca komikaty w przypadku powodzenia
// 		return res.json({ status: 'ok', user: token })
// 	} else {
// 		return res.json({ status: 'error', user: false })
// 	}
// })

// /**
//  * pobieranie danuch użytkownika
//  * pobiera token, wyciąga dane (emial i nick) powiązane z nim oraz na podstawie tych danych podaje wydarzenia przypisane do tego użytkownika
//  * @param  req - dane przesyłane z frontendu
//  * @param  res - odpowiedź 
//  */


// app.get("/userinfo", async (req,res) => {
//     //token
//     const token = req.headers['x-access-token']
//     try {
//       //pobieranie danych z tokenu użytkownika
//         const decoded = jwt.verify(token, 'secret123')
// 		//email użytkownika
//         const email = decoded.email
//         //wyszukiwanie użytkownika po emailu
//         const user = await User.findOne({ email: email })
//         //zwracanie wydarzeń użytkownika z tablicy events oraz komunikatu o pomyślnym wykonaniu
//         return res.json({ status: 'ok', events: user.events })
       
// 	} catch (error) {
//     //komunikat w przypadku błędu
// 		res.json({ status: 'error', error: 'invalid token' })
// 	}

// })


// /**
//  * dodawanie wydarzenia
//  * pobiera token, wyciąga dane (emial i nick) z tokenu oraz  tytuł, opis i datę wydarzenie i przypisuje nowy obiekt wydarzenia do użytkownika
//  * @param  req - dane przesyłane z frontendu
//  * @param  res - odpowiedź 
//  */

// app.post("/event", async (req,res) => {
//         //pobieranie danych z tokenu użytkownika
//   const token = req.headers['x-access-token']  
//   //pobranie tytułu, opisu  i daty wydarzenia
//   const {  title, descryption, EventDate } = req.body;
//     try {
//         //odczytanie danych z tokena
//       const decoded = jwt.verify(token, 'secret123')
//     	const email = decoded.email
// //dodaje do tablicy evnents przechowującej wydarzenie nowy obiekt o podanym tytule(title), opisie(descryption) i dacie wydarzenia(EventDate)
        
//              User.updateOne({email: email}, { $push: { events: { title, descryption, EventDate}} })
//              .then((data) => {
//               //wykonyje się jeżeli poprawnie dodano obiekt
//               res.send({ status: "ok"})
//               console.log("działa")
//           })
//           //jeżeli wystąpił błąd
//           .catch((error) => {
//               res.send({status: "error", data: error})
//               console.log("niedziała")
//           })
//     } catch (error) {
        
//     }
// })

// /**
//  * dodawanie wydarzenia
//  * pobiera token, wyciąga dane (emial i nick) z tokenu oraz  tytuł, opis i datę wydarzenie i usuwa wydarzenie o podanych danych
//  * @param  req - dane przesyłane z frontendu
//  * @param  res - odpowiedź 
//  */
// app.post('/deleteevent', async (req, res) => {
//   //token
//   const token = req.headers['x-access-token'] 
//   //dane: tytuł , opis i data wydarzenia. Wszystkie dane są obiektami przechowującej parametr o takim samej nazwie typu String i przesyłane są z frontendu 
//   let {  title, descryption, EventDate } = req.body;

//     try {
//        //odczytanie danych z tokena
//       const decoded = jwt.verify(token, 'secret123')
//       //email użytkownika
//     	const email = decoded.email
//         //wyciąga z tablicy events przechowującej obiekty reprezentujące wydarzenia użytkownika o podanym wcześnie
//       User.updateOne({email: email},{$pull: {events:{title: title.title, descryption: descryption.descryption, EventDate: EventDate.EventDate}}}).then((data) => {
//         res.send({ status: "ok", data: data})
//         console.log("działa")
//     })
//     .catch((error) => {
//         res.send({status: "error", data: error})
//         console.log("niedziała")
//     })
// } catch (error) {
    
// }
// })


//stawia serwer na porcie 5000
app.listen(5000,() => {
    console.log("hello world")
})
