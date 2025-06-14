import { useState } from 'react'

// Strona zawierająca formularz rejestracji
function Register() {
	const [nick, setNick] = useState('') // Zmieniłem setName na setNick dla spójności
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	// Funkcja rejestrująca użytkownika
	async function registerUser(event) {
		event.preventDefault()

		const response = await fetch('http://localhost:5000/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
        nick,
				password,
			}),
		})

		const data = await response.json()
		
		if (data.status === 'ok') {
			alert("Rejestracja pomyślna! Możesz się teraz zalogować.") // Lepiej, gdy alert jest przed przekierowaniem
			window.location.href = '/login'
		} else {
      alert("Użytkownik z tym adresem email już istnieje.")
    }
	}

	return (
		<div 
			className='flex justify-center items-center h-screen'
			style={{
				backgroundImage: "url(/img/bunker.jpg)", // Upewnij się, że obrazek jest w public/img/
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			{/* Formularz rejestracji ze zmienionym stylem */}
			<form 
				className='bg-black/60 backdrop-blur-sm shadow-xl rounded-lg px-8 pt-6 pb-8 w-full max-w-sm' 
				onSubmit={registerUser}
			>
				<div className='mb-4'>
					<label className='block text-gray-200 text-sm font-bold mb-2'>
						Nazwa użytkownika:
					</label>
					<input 
						className='shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-800/50 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-yellow-500'
						value={nick}
						onChange={(e) => setNick(e.target.value)}
						type="text"
						placeholder="Wprowadź nick"
					/>	
				</div>
				<div className='mb-4'>
					<label className='block text-gray-200 text-sm font-bold mb-2'>
						Adres email:
					</label>
					<input 
						className='shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-800/50 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-yellow-500'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						type="email"
						placeholder="Wprowadź email"
					/>	
				</div>
				<div className='mb-6'>
					<label className='block text-gray-200 text-sm font-bold mb-2'>
						Hasło:
					</label>
					<input 
						className='shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-800/50 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-yellow-500'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						type="password"
						placeholder="••••••••••"
					/>
					<p className='text-gray-400 text-xs italic mt-2'>Pamiętaj, że hasło musi spełniać wymogi bezpieczeństwa.</p>
				</div>
				<div className='flex items-center justify-center'>
					<button type="submit" className='
						px-10 py-3 
						bg-gradient-to-b from-yellow-600 to-orange-800 
						text-white font-bold uppercase text-sm tracking-wider
						border-2 border-black/30 rounded-lg 
						shadow-lg hover:shadow-xl
						hover:from-yellow-500 hover:to-orange-700
						focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500
						active:shadow-inner active:translate-y-px
						transition-all duration-150 ease-in-out
					'>
						Zarejestruj
					</button>
				</div>
			</form>
		</div>
	)
}

export default Register