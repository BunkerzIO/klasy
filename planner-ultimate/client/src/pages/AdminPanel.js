import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Upewnij się, że Link jest zaimportowany

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingNick, setUpdatingNick] = useState(null);
  const navigate = useNavigate();

  // Funkcja do wylogowania (pozostaje bez zmian)
   const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // ZMIANA: Przekierowanie na stronę główną
    navigate('/'); 
  };

  // Pobieranie danych przy załadowaniu komponentu
  useEffect(() => {
    const fetchUsers = async () => {
      // Usunięto pobieranie i sprawdzanie tokena
      try {
        // Zapytanie fetch nie zawiera już nagłówka 'x-access-token'
        const response = await fetch('http://localhost:5000/admin/users');
        const data = await response.json();

        if (data.status === 'ok') {
          setUsers(data.users);
        } else {
          throw new Error(data.error || 'Nie udało się pobrać danych');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Funkcja do banowania/odblokowywania użytkownika
  const handleToggleBan = async (nick, isCurrentlyBanned) => {
    setUpdatingNick(nick);
    // Usunięto pobieranie tokena

    try {
      const response = await fetch(`http://localhost:5000/admin/user/${nick}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Usunięto nagłówek 'x-access-token' z tego miejsca
        },
        body: JSON.stringify({ isBanned: !isCurrentlyBanned }),
      });
      const data = await response.json();

      if (data.status === 'ok') {
        setUsers(currentUsers =>
          currentUsers.map(u =>
            u.nick === nick ? { ...u, isBanned: !isCurrentlyBanned } : u
          )
        );
      } else {
        throw new Error(data.error || 'Akcja nie powiodła się');
      }
    } catch (err) {
      alert(`Błąd: ${err.message}`);
    } finally {
      setUpdatingNick(null);
    }
  };

  return (
    <div
      className="flex justify-center items-start h-screen p-4 pt-16 overflow-y-auto"
      style={{
        backgroundImage: "url(/img/bunker.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="bg-black/70 backdrop-blur-md shadow-xl rounded-lg p-8 w-full max-w-4xl text-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400 [text-shadow:0_0_8px_rgba(234,179,8,0.4)]">
          Panel Administratora
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-black/50">
              <tr>
                <th className="px-4 py-3 text-sm font-bold uppercase border-b border-gray-600">Nick</th>
                <th className="px-4 py-3 text-sm font-bold uppercase border-b border-gray-600">Email</th>
                <th className="px-4 py-3 text-sm font-bold uppercase border-b border-gray-600">Status</th>
                <th className="px-4 py-3 text-sm font-bold uppercase border-b border-gray-600">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" className="text-center py-4 text-gray-400 italic">Ładowanie użytkowników...</td></tr>
              ) : error ? (
                <tr><td colSpan="4" className="text-center py-4 text-red-500 italic">{error}</td></tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.nick} className="hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-4 py-3 border-b border-gray-700 font-medium">{user.nick}</td>
                    <td className="px-4 py-3 border-b border-gray-700">{user.email}</td>
                    <td className="px-4 py-3 border-b border-gray-700">
                      <div className="flex flex-col gap-1">
                        {user.isBanned && <span className="text-xs font-bold bg-red-600 text-white px-2 py-1 rounded-full text-center">ZBANOWANY</span>}
                        {user.isTester && <span className="text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded-full text-center">TESTER</span>}
                        {!user.isBanned && !user.isTester && <span className="text-xs text-gray-400">Użytkownik</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-700">
                      <button
                        onClick={() => handleToggleBan(user.nick, user.isBanned)}
                        disabled={updatingNick === user.nick}
                        className={`px-3 py-1 text-sm font-bold text-white rounded shadow-md transition-all duration-150 ${user.isBanned ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} ${updatingNick === user.nick ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {updatingNick === user.nick ? '...' : (user.isBanned ? 'Odblokuj' : 'Banuj')}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-4 text-gray-400 italic">Nie znaleziono żadnych użytkowników.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
<div className="mt-8 flex flex-wrap justify-center items-center gap-4">
  <Link to="/admin/ogloszenia/dodaj">
    <button className="px-10 py-3 bg-gradient-to-b from-green-600 to-green-800 ...">
      Dodaj Ogłoszenie
    </button>
  </Link>
  <Link to="/admin/ogloszenia">
    <button className="px-10 py-3 bg-gradient-to-b from-purple-600 to-purple-800 ...">
      Zarządzaj Ogłoszeniami
    </button>
  </Link>
  <Link to="/admin/uwagi">
    <button className="px-10 py-3 bg-gradient-to-b from-blue-600 to-blue-800 ...">
      Zobacz Uwagi
    </button>
  </Link>
  <button onClick={handleLogout} className="px-10 py-3 bg-gradient-to-b from-gray-600 to-gray-800 ...">
    Wyloguj
  </button>
</div>
      </div>
    </div>
  );
}