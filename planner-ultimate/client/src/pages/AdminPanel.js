import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingNick, setUpdatingNick] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/'); 
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/admin/users');
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

  const updateUserStatus = async (nick, updateData) => {
    setUpdatingNick(nick);
    try {
      const response = await fetch(`/admin/user/${nick}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      if (data.status === 'ok') {
        if (updateData.isBanned) {
          setUsers(currentUsers => currentUsers.filter(u => u.nick !== nick));
        } else {
          setUsers(currentUsers =>
            currentUsers.map(u => (u.nick === nick ? { ...u, ...updateData } : u))
          );
        }
      } else {
        throw new Error(data.error || 'Akcja nie powiodła się');
      }
    } catch (err) {
      alert(`Błąd: ${err.message}`);
    } finally {
      setUpdatingNick(null);
    }
  };

  const handleBan = (nick) => {
    if (window.confirm(`Czy na pewno chcesz zbanować użytkownika ${nick}?`)) {
      updateUserStatus(nick, { isBanned: true });
    }
  };
  
  const handleGrantTester = (nick) => {
    updateUserStatus(nick, { isTester: true });
  };

  // ZMIANA: Logika filtrowania - jeśli wyszukiwanie jest puste, pokazujemy wszystkich
  const filteredUsers = searchTerm.trim() === ''
    ? users // Jeśli pole wyszukiwania jest puste, pokaż wszystkich użytkowników
    : users.filter(user =>
        // Filtrujemy tylko po nicku
        user.nick.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="flex justify-center items-start h-screen p-4 pt-16 overflow-y-auto" style={{ backgroundImage: "url(/img/bunker.jpg)", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <div className="bg-black/70 backdrop-blur-md shadow-xl rounded-lg p-8 w-full max-w-5xl text-white">
        <h1 className="text-3xl font-bold mb-4 text-center text-yellow-400 [text-shadow:0_0_8px_rgba(234,179,8,0.4)]">Panel Administratora</h1>
        
        <div className="mb-6">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Szukaj po nicku..."
            className="w-full p-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-black/50">
              <tr>
                <th className="px-4 py-3">Nick</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" className="text-center py-4 text-gray-400 italic">Ładowanie...</td></tr>
              ) : error ? (
                <tr><td colSpan="4" className="text-center py-4 text-red-500 italic">{error}</td></tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.nick} className="hover:bg-gray-800/50">
                    <td className="p-4 border-b border-gray-700">{user.nick}</td>
                    <td className="p-4 border-b border-gray-700">{user.email}</td>
                    <td className="p-4 border-b border-gray-700">
                      {user.isTester ? <span className="text-xs font-bold bg-blue-600 ...">TESTER</span> : <span className="text-xs text-gray-400">Użytkownik</span>}
                    </td>
                    <td className="p-4 border-b border-gray-700">
                      <div className="flex gap-2">
                        {!user.isAdmin && (
                          <>
                            <button onClick={() => handleBan(user.nick)} disabled={updatingNick === user.nick} className="px-3 py-1 bg-red-600 hover:bg-red-700 ...">Banuj</button>
                            {!user.isTester && (
                              <button onClick={() => handleGrantTester(user.nick)} disabled={updatingNick === user.nick} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 ...">Nadaj Testera</button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // ZMIANA: Prosty komunikat, gdy wyszukiwanie nie dało wyników
                <tr><td colSpan="4" className="text-center py-4 text-gray-400 italic">
                  Nie znaleziono użytkowników.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
          <Link to="/admin/banned"><button className="...">Zbanowani</button></Link>
          <Link to="/admin/ogloszenia/dodaj"><button className="...">Dodaj Ogłoszenie</button></Link>
          <Link to="/admin/ogloszenia"><button className="...">Zarządzaj Ogłoszeniami</button></Link>
          <Link to="/admin/uwagi"><button className="...">Zobacz Uwagi</button></Link>
          <button onClick={handleLogout} className="...">Wyloguj</button>
        </div>
      </div>
    </div>
  );
}