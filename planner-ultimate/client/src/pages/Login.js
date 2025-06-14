import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import hooka do nawigacji
import { jwtDecode } from 'jwt-decode'; // 2. Import biblioteki do dekodowania tokena

// Strona zawierająca formularz logowania
export default function Login() {
	const [nick, setNick] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate(); // 3. Inicjalizacja hooka

	// Zaktualizowana funkcja logowania
	async function loginUser(event) {
		event.preventDefault();

		try {
			const response = await fetch('http://localhost:5000/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					nick,
					password,
				}),
			});
			
			const data = await response.json();
			
			// Sprawdzamy, czy logowanie się powiodło i otrzymaliśmy token
			if (data.status === 'ok' && data.user) {
				// Zapisujemy token i nick w localStorage
				localStorage.setItem('token', data.user);
				localStorage.setItem('user', nick);

				// 4. Dekodujemy token, aby uzyskać dostęp do jego zawartości (payload)
				const decodedToken = jwtDecode(data.user);

				// 5. Sprawdzamy, czy użytkownik nie jest zbanowany
				if (decodedToken.isBanned) {
					alert('Twoje konto zostało zablokowane. Skontaktuj się z administratorem.');
					localStorage.clear(); // Czyścimy localStorage na wszelki wypadek
					return;
				}
				
				alert('Logowanie pomyślne!');

				// 6. Przekierowanie w zależności od roli użytkownika
				if (decodedToken.isAdmin) {
					navigate('/admin'); // 1. Admini idą do panelu admina
				} else if (decodedToken.isTester) {
					navigate('/tester'); // 2. Testerzy idą do swojego panelu
				} else {
					navigate('/calendar'); // 3. Reszta idzie do kalendarza
				}
			} else {
				// 7. Wyświetlamy konkretny błąd zwrócony przez serwer
				alert(data.message || 'Sprawdź swój nick i hasło.');
			}
		} catch (error) {
			console.error("Błąd logowania:", error);
			alert("Wystąpił błąd podczas próby logowania. Spróbuj ponownie.");
		}
	}

	return (
		<div 
			className='flex justify-center items-center h-screen'
			style={{
				backgroundImage: "url(/img/bunker.jpg)",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<form 
				className='bg-black/60 backdrop-blur-sm shadow-xl rounded-lg px-8 pt-6 pb-8 w-full max-w-sm' 
				onSubmit={loginUser}
			>
				{/* ... reszta formularza (bez zmian) ... */}
                <div className='mb-4'>
                    <label className='block text-gray-200 text-sm font-bold mb-2'>Nick:</label>
                    <input 
                        className='shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-800/50 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-yellow-500'
                        value={nick}
                        onChange={(e) => setNick(e.target.value)}
                        type="text"
                        placeholder="Wprowadź nick"
                    />	
                </div>
                <div className='mb-6'>
                    <label className='block text-gray-200 text-sm font-bold mb-2'>Hasło:</label>
                    <input 
                        className='shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-800/50 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-yellow-500'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="••••••••••"
                    />
                </div>
                <div className='flex items-center justify-center'>
                    <button type="submit" className='px-10 py-3 bg-gradient-to-b from-yellow-600 to-orange-800 text-white font-bold uppercase text-sm tracking-wider border-2 border-black/30 rounded-lg shadow-lg hover:shadow-xl hover:from-yellow-500 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500 active:shadow-inner active:translate-y-px transition-all duration-150 ease-in-out'>
                        Zaloguj
                    </button>
                </div>
			</form>
		</div>
	)
}