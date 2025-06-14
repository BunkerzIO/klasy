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

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'secret123'; // Przeniesione na górę dla spójności

// ====================================================================
// =================== KLASA UŻYTKOWNIKA ==============================
// ====================================================================
class Uzytkownik {
  #email;
  #nickname;
  #haslo; // Zaszyfrowane
  #isBanned = false;
  #isAdmin = false;
  #isTester = false;

  constructor(email, nickname, haslo) {
    this.#email = email;
    this.#nickname = nickname;
    this.#haslo = haslo;
  }

  // ===== Gettery =====
  get email() { return this.#email; }
  get nickname() { return this.#nickname; }
  get haslo() { return this.#haslo; }
  get isBanned() { return this.#isBanned; }
  get isAdmin() { return this.#isAdmin; }
  get isTester() { return this.#isTester; }

  // ===== Settery =====
  set email(value) { this.#email = value; }
  set nickname(value) { this.#nickname = value; }
  set haslo(value) { this.#haslo = value; }
  set isBanned(value) { this.#isBanned = value; }
  set isAdmin(value) { this.#isAdmin = value; }
  set isTester(value) { this.#isTester = value; }

  /**
   * Kluczowa metoda do serializacji obiektu.
   * JSON.stringify() automatycznie wywoła tę metodę.
   * Bez niej, prywatne pola (#) nie zostałyby zapisane w pliku JSON.
   */
  toJSON() {
    return {
      email: this.#email,
      nickname: this.#nickname,
      password: this.#haslo, // Zmieniamy nazwę pola na 'password' dla spójności z resztą kodu
      isBanned: this.#isBanned,
      isAdmin: this.#isAdmin,
      isTester: this.#isTester,
    };
  }
}

// ====================================================================
// =================== ENDPOINTY API ==================================
// ====================================================================

/**
 * Rejestracja użytkownika przy użyciu klasy Uzytkownik
 */
app.post("/register", async (req, res) => {
  const { email, nick, password } = req.body;

  try {
    const usersDir = path.join(__dirname, "users");
    const filePath = path.join(usersDir, `${nick}.json`);

    // Sprawdzenie czy plik użytkownika już istnieje
    if (require('fs').existsSync(filePath)) {
      return res.json({ status: 'error', error: "User Exists" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    // Tworzenie nowej instancji klasy Uzytkownik
    const newUser = new Uzytkownik(email, nick, encryptedPassword);

    // Zapewnienie, że katalog 'users' istnieje
    await fsPromises.mkdir(usersDir, { recursive: true });

    // Zapisz obiekt do pliku. `JSON.stringify` użyje metody `newUser.toJSON()`
    await fsPromises.writeFile(filePath, JSON.stringify(newUser, null, 2));

    res.send({ status: "ok" });
  } catch (error) {
    console.error("Registration error:", error);
    res.send({ status: "error", error: "An unexpected error occurred" });
  }
});

/**
 * Logowanie użytkownika
 */
app.post('/login', async (req, res) => {
  const { nick, password } = req.body;
  const filePath = path.join(__dirname, "users", `${nick}.json`);

  try {
    // Wczytanie danych użytkownika z pliku
    const data = await fsPromises.readFile(filePath, 'utf8');
    const userFromFile = JSON.parse(data); // userFromFile to teraz obiekt z polami: email, nickname, password, isAdmin itp.

    // Porównanie hasła (tekstowego) z hashem z pliku
    const isPasswordValid = await bcrypt.compare(password, userFromFile.password);

if (isPasswordValid) {
  // Tworzenie tokenu JWT z dodatkowymi danymi
  const token = jwt.sign(
    {
      nickname: userFromFile.nickname,
      email: userFromFile.email,
      isAdmin: userFromFile.isAdmin,
      isBanned: userFromFile.isBanned,
      isTester: userFromFile.isTester, // <-- DODAJ TĘ LINIĘ
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  return res.json({ status: 'ok', user: token });
} else {
      return res.json({ status: 'error', user: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.json({ status: 'error', user: false, message: 'Invalid credentials' });
    }
    console.error("Login error:", err);
    return res.json({ status: 'error', user: false, message: 'Server error' });
  }
});


/**
 * Zwraca listę wszystkich użytkowników, którzy nie są adminami
 */

app.get('/admin/users', async (req, res) => {
    try {
        const usersDir = path.join(__dirname, 'users');
        const files = await fsPromises.readdir(usersDir);
        
        const allUsersData = await Promise.all(
          files
            .filter(file => file.endsWith('.json'))
            .map(async (file) => {
              const filePath = path.join(usersDir, file);
              const data = await fsPromises.readFile(filePath, 'utf8');
              return JSON.parse(data);
            })
        );

        const nonAdminUsers = allUsersData
            .filter(user => user.isAdmin !== true)
            .map(user => {
                return {
                    nick: user.nickname,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    isBanned: user.isBanned,
                    isTester: user.isTester,
                };
            });
        
        res.json({ status: 'ok', users: nonAdminUsers });

    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.json({ status: 'ok', users: [] });
        }
        console.error('Error fetching users for admin:', error);
        res.status(500).json({ status: 'error', error: 'Could not retrieve user list' });
    }
});

// === DODAJ TEN FRAGMENT TUTAJ ===
app.put('/admin/user/:nick', async (req, res) => {
    const { nick } = req.params;
    const updates = req.body;
    const filePath = path.join(__dirname, "users", `${nick}.json`);
    try {
        if (!require('fs').existsSync(filePath)) {
            return res.status(404).json({ status: 'error', error: 'User not found' });
        }
        const data = await fsPromises.readFile(filePath, 'utf8');
        const userData = JSON.parse(data);
        if (updates.hasOwnProperty('isBanned')) {
            userData.isBanned = updates.isBanned;
        }
        if (updates.hasOwnProperty('isTester')) {
            userData.isTester = updates.isTester;
        }
        await fsPromises.writeFile(filePath, JSON.stringify(userData, null, 2));
        res.json({ status: 'ok', message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ status: 'error', error: 'Could not update user' });
    }
});
// ================================
app.post('/uwagi', async (req, res) => {
    const { reportText, gameVersion, nick } = req.body;

    if (!reportText || !gameVersion || !nick) {
        return res.status(400).json({ status: 'error', error: 'Missing data' });
    }

    const uwagiDir = path.join(__dirname, 'uwagi');
    const filePath = path.join(uwagiDir, 'uwagi.json');

    try {
        await fsPromises.mkdir(uwagiDir, { recursive: true });

        let uwagi = [];
        try {
            const data = await fsPromises.readFile(filePath, 'utf8');

            // === POPRAWKA JEST TUTAJ ===
            // Sprawdzamy, czy plik nie jest pusty, zanim go sparsujemy
            if (data.trim() !== '') {
                uwagi = JSON.parse(data);
            }
            // ===========================
            
            if (!Array.isArray(uwagi)) {
                uwagi = [];
            }
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
        
        const nowaUwaga = {
            data: new Date().toISOString(),
            wersjagry: gameVersion,
            treść: reportText,
            autor: nick
        };

        uwagi.push(nowaUwaga);

        await fsPromises.writeFile(filePath, JSON.stringify(uwagi, null, 2));

        res.json({ status: 'ok', message: 'Uwaga została pomyślnie dodana.' });

    } catch (error) {
        console.error("Error saving report to JSON:", error);
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
});


app.get('/admin/uwagi', async (req, res) => {
    const uwagiDir = path.join(__dirname, 'uwagi');
    const filePath = path.join(uwagiDir, 'uwagi.json');

    try {
        const data = await fsPromises.readFile(filePath, 'utf8');
        const uwagi = JSON.parse(data);
        res.json({ status: 'ok', uwagi: uwagi });

    } catch (error) {
        // Jeśli plik nie istnieje, zwracamy pustą tablicę - to nie jest błąd krytyczny.
        if (error.code === 'ENOENT') {
            return res.json({ status: 'ok', uwagi: [] });
        }
        console.error('Error reading issues file:', error);
        res.status(500).json({ status: 'error', error: 'Could not retrieve issues list' });
    }
});

app.post('/admin/ogloszenia', async (req, res) => {
    const { autor, tytul, tresc } = req.body;

    if (!autor || !tytul || !tresc) {
        return res.status(400).json({ status: 'error', error: 'Missing data' });
    }

    const ogloszeniaDir = path.join(__dirname, 'ogloszenia');
    const filePath = path.join(ogloszeniaDir, 'ogloszenia.json');

    try {
        await fsPromises.mkdir(ogloszeniaDir, { recursive: true });

        let ogloszenia = [];
        try {
            const data = await fsPromises.readFile(filePath, 'utf8');
            if (data.trim() !== '') {
                ogloszenia = JSON.parse(data);
            }
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;
        }

        const noweOgloszenie = {
            data: new Date().toISOString(),
            autor,
            tytul,
            tresc
        };

        ogloszenia.push(noweOgloszenie);

        await fsPromises.writeFile(filePath, JSON.stringify(ogloszenia, null, 2));

        res.json({ status: 'ok', message: 'Ogłoszenie zostało dodane.' });
    } catch (error) {
        console.error("Error saving announcement:", error);
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
});

app.get('/ogloszenia', async (req, res) => {
    const ogloszeniaDir = path.join(__dirname, 'ogloszenia');
    const filePath = path.join(ogloszeniaDir, 'ogloszenia.json');

    try {
        const data = await fsPromises.readFile(filePath, 'utf8');
        const ogloszenia = JSON.parse(data);
        res.json({ status: 'ok', ogloszenia: ogloszenia });
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.json({ status: 'ok', ogloszenia: [] });
        }
        res.status(500).json({ status: 'error', error: 'Could not retrieve announcements' });
    }
});

app.delete('/admin/ogloszenia/:id', async (req, res) => {
    const { id } = req.params; // Pobieramy ID z adresu URL

    const ogloszeniaDir = path.join(__dirname, 'ogloszenia');
    const filePath = path.join(ogloszeniaDir, 'ogloszenia.json');

    try {
        let ogloszenia = [];
        try {
            const data = await fsPromises.readFile(filePath, 'utf8');
            if (data.trim() !== '') {
                ogloszenia = JSON.parse(data);
            }
        } catch (error) {
            // Jeśli plik nie istnieje, to nie ma czego usuwać
            if (error.code === 'ENOENT') {
                return res.status(404).json({ status: 'error', error: 'Announcements file not found.' });
            }
            throw error;
        }

        // Filtrujemy tablicę, aby usunąć ogłoszenie o pasującym ID (data)
        const zaktualizowaneOgloszenia = ogloszenia.filter(o => o.data !== id);

        // Sprawdzamy, czy cokolwiek zostało usunięte
        if (ogloszenia.length === zaktualizowaneOgloszenia.length) {
            return res.status(404).json({ status: 'error', error: 'Announcement not found.' });
        }

        // Zapisujemy nową, krótszą tablicę z powrotem do pliku
        await fsPromises.writeFile(filePath, JSON.stringify(zaktualizowaneOgloszenia, null, 2));

        res.json({ status: 'ok', message: 'Ogłoszenie zostało usunięte.' });

    } catch (error) {
        console.error("Error deleting announcement:", error);
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
}); 
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});