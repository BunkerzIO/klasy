// src/pages/UwagiAdmin.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function UwagiAdmin() {
  const [uwagi, setUwagi] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUwagi = async () => {
      try {
        // Używamy ścieżki względnej (dzięki proxy)
        const response = await fetch('http://localhost:5000/admin/uwagi');
        const data = await response.json();

        if (data.status === 'ok') {
          // Sortujemy uwagi od najnowszych do najstarszych
          setUwagi(data.uwagi.sort((a, b) => new Date(b.data) - new Date(a.data)));
        } else {
          throw new Error(data.error || 'Nie udało się pobrać danych');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUwagi();
  }, []);

  return (
    <div
      className="flex justify-center items-start min-h-screen p-4 pt-16 overflow-y-auto"
      style={{
        backgroundImage: "url(/img/bunker.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="bg-black/70 backdrop-blur-md shadow-xl rounded-lg p-8 w-full max-w-4xl text-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400 [text-shadow:0_0_8px_rgba(234,179,8,0.4)]">
          Zgłoszone Uwagi
        </h1>

        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-gray-400 italic">Ładowanie uwag...</p>
          ) : error ? (
            <p className="text-center text-red-500 italic">{error}</p>
          ) : uwagi.length > 0 ? (
            uwagi.map((uwaga, index) => (
              <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                  <span>Data: {new Date(uwaga.data).toLocaleString('pl-PL')}</span>
                  <span>Wersja: {uwaga.wersjagry}</span>
                </div>
                {/* Używamy pre-wrap, aby zachować entery w tekście uwagi */}
                <p className="text-gray-200 whitespace-pre-wrap">{uwaga.treść}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 italic">Brak zgłoszonych uwag.</p>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link to="/admin">
            <button className="px-10 py-3 bg-gradient-to-b from-blue-600 to-blue-800 text-white font-bold uppercase text-sm tracking-wider border-2 border-black/30 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-blue-700 transition-all duration-150">
              Wróć do Panelu Admina
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}