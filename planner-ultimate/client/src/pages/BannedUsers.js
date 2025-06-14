// src/pages/BannedUsers.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function BannedUsers() {
  const [bannedUsers, setBannedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBannedUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin/users/banned');
        const data = await response.json();
        if (data.status === 'ok') {
          setBannedUsers(data.users);
        } else {
          throw new Error(data.error || 'Błąd serwera');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBannedUsers();
  }, []);

  const handleUnban = async (nick) => {
    if (!window.confirm(`Czy na pewno chcesz odblokować użytkownika ${nick}?`)) return;
    try {
      const response = await fetch(`http://localhost:5000/admin/user/${nick}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBanned: false }),
      });
      const data = await response.json();
      if (data.status === 'ok') {
        setBannedUsers(prev => prev.filter(u => u.nick !== nick));
        alert('Użytkownik został odblokowany.');
      } else {
        throw new Error(data.error || 'Nie udało się odblokować użytkownika.');
      }
    } catch (err) {
      alert(`Błąd: ${err.message}`);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-4 pt-16" style={{ backgroundImage: "url(/img/bunker.jpg)", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="bg-black/70 backdrop-blur-md shadow-xl rounded-lg p-8 w-full max-w-4xl text-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400 [text-shadow:0_0_8px_rgba(234,179,8,0.4)]">Zarządzaj Zbanowanymi</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-black/50">
              <tr>
                <th className="px-4 py-3">Nick</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan="3" className="text-center p-4">Ładowanie...</td></tr> :
               error ? <tr><td colSpan="3" className="text-center p-4 text-red-500">{error}</td></tr> :
               bannedUsers.length > 0 ? bannedUsers.map(user => (
                <tr key={user.nick} className="hover:bg-gray-800/50">
                  <td className="p-4 border-b border-gray-700">{user.nick}</td>
                  <td className="p-4 border-b border-gray-700">{user.email}</td>
                  <td className="p-4 border-b border-gray-700">
                    <button onClick={() => handleUnban(user.nick)} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded">Odblokuj</button>
                  </td>
                </tr>
               )) : <tr><td colSpan="3" className="text-center p-4 italic text-gray-400">Brak zbanowanych użytkowników.</td></tr>
              }
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center">
          <Link to="/admin">
            <button className="px-10 py-3 bg-gradient-to-b from-blue-600 to-blue-800 text-white ...">Wróć do Panelu Admina</button>
          </Link>
        </div>
      </div>
    </div>
  );
}