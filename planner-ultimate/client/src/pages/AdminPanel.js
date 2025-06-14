import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
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
    // Ta funkcja pobiera teraz tylko AKTYWNYCH użytkowników (dzięki zmianie na backendzie)
    const fetchUsers = async () => {
      try {
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

  const updateUserStatus = async (nick, updateData) => {
    setUpdatingNick(nick);
    try {
      const response = await fetch(`http://localhost:5000/admin/user/${nick}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      if (data.status === 'ok') {
        // Po zbanowaniu, użytkownik powinien zniknąć z tej listy
        if (updateData.isBanned) {
          setUsers(currentUsers => currentUsers.filter(u => u.nick !== nick));
        } else {
          // W innych przypadkach (np. nadanie testera) aktualizujemy stan
          setUsers(currentUsers => currentUsers.map(u => u.nick === nick ? { ...u, ...updateData } : u));
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
    if (!window.confirm(`Czy na pewno chcesz zbanować użytkownika ${nick}?`)) return;
    updateUserStatus(nick, { isBanned: true });
  };
  
  const handleGrantTester = (nick) => {
    updateUserStatus(nick, { isTester: true });
  };

  return (
    <div className="flex justify-center items-start h-screen p-4 pt-16 overflow-y-auto" style={{ backgroundImage: "url(/img/bunker.jpg)", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <div className="bg-black/70 backdrop-blur-md shadow-xl rounded-lg p-8 w-full max-w-5xl text-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">Panel Administratora - Aktywni Użytkownicy</h1>
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
              {isLoading ? <tr><td colSpan="4" className="text-center p-4">Ładowanie...</td></tr> :
               error ? <tr><td colSpan="4" className="text-center p-4 text-red-500">{error}</td></tr> :
               users.length > 0 ? users.map((user) => (
                  <tr key={user.nick} className="hover:bg-gray-800/50">
                    <td className="p-4 border-b border-gray-700">{user.nick}</td>
                    <td className="p-4 border-b border-gray-700">{user.email}</td>
                    <td className="p-4 border-b border-gray-700">
                      {user.isTester && <span className="text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded-full">TESTER</span>}
                      {!user.isTester && <span className="text-xs text-gray-400">Użytkownik</span>}
                    </td>
                    <td className="p-4 border-b border-gray-700">
                      <div className="flex gap-2">
                        <button onClick={() => handleBan(user.nick)} disabled={updatingNick === user.nick} className="px-3 py-1 bg-red-600 hover:bg-red-700 ...">Banuj</button>
                        {/* ZMIANA: Przycisk jest widoczny tylko, gdy użytkownik NIE JEST testerem */}
                        {!user.isTester && (
                          <button onClick={() => handleGrantTester(user.nick)} disabled={updatingNick === user.nick} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 ...">Nadaj Testera</button>
                        )}
                      </div>
                    </td>
                  </tr>
               )) : <tr><td colSpan="4" className="text-center p-4 italic text-gray-400">Brak aktywnych użytkowników.</td></tr>
              }
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
          <Link to="/admin/banned"><button className="px-10 py-3 bg-red-800 ...">Zarządzaj Zbanowanymi</button></Link>
          <Link to="/admin/ogloszenia/dodaj"><button className="px-10 py-3 bg-green-600 ...">Dodaj Ogłoszenie</button></Link>
          <Link to="/admin/ogloszenia"><button className="px-10 py-3 bg-purple-600 ...">Zarządzaj Ogłoszeniami</button></Link>
          <Link to="/admin/uwagi"><button className="px-10 py-3 bg-blue-600 ...">Zobacz Uwagi</button></Link>
          <button onClick={handleLogout} className="px-10 py-3 bg-gray-600 ...">Wyloguj</button>
        </div>
      </div>
    </div>
  );
}