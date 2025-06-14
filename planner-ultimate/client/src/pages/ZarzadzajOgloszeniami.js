// src/pages/ZarzadzajOgloszeniami.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ZarzadzajOgloszeniami() {
  const [wszystkieOgloszenia, setWszystkieOgloszenia] = useState([]);
  const [filtrowaneOgloszenia, setFiltrowaneOgloszenia] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pobieranie danych
  useEffect(() => {
    const fetchOgloszenia = async () => {
      try {
        const response = await fetch('http://localhost:5000/ogloszenia');
        const data = await response.json();
        if (data.status === 'ok') {
          const sorted = data.ogloszenia.sort((a, b) => new Date(b.data) - new Date(a.data));
          setWszystkieOgloszenia(sorted);
          setFiltrowaneOgloszenia(sorted);
        } else {
          throw new Error(data.error || 'Błąd serwera');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOgloszenia();
  }, []);

  // Filtrowanie na żywo
  useEffect(() => {
    const wyniki = wszystkieOgloszenia.filter(o => 
      o.tytul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.tresc.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltrowaneOgloszenia(wyniki);
  }, [searchTerm, wszystkieOgloszenia]);

  // Usuwanie ogłoszenia
  const handleDelete = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to ogłoszenie?')) {
      return;
    }
    try {
      const response = await fetch(`/admin/ogloszenia/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.status === 'ok') {
        // Usuwamy ogłoszenie z lokalnego stanu dla natychmiastowego efektu
        setWszystkieOgloszenia(prev => prev.filter(o => o.data !== id));
        alert('Ogłoszenie usunięte.');
      } else {
        throw new Error(data.error || 'Nie udało się usunąć ogłoszenia.');
      }
    } catch (err) {
      alert(`Błąd: ${err.message}`);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-4 pt-16" style={{ backgroundImage: "url(/img/bunker.jpg)", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="bg-black/70 backdrop-blur-md shadow-xl rounded-lg p-8 w-full max-w-4xl text-white">
        <h1 className="text-3xl font-bold mb-4 text-center text-yellow-400 [text-shadow:0_0_8px_rgba(234,179,8,0.4)]">Zarządzaj Ogłoszeniami</h1>
        <div className="mb-6">
          <input type="search" placeholder="Szukaj po tytule lub treści..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500" />
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {isLoading ? <p>Ładowanie...</p> : error ? <p className="text-red-500">{error}</p> :
            filtrowaneOgloszenia.length > 0 ? filtrowaneOgloszenia.map(ogloszenie => (
              <div key={ogloszenie.data} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{ogloszenie.tytul}</h3>
                    <p className="text-xs text-gray-400 mb-2">Autor: {ogloszenie.autor} | {new Date(ogloszenie.data).toLocaleString('pl-PL')}</p>
                    <p className="text-sm whitespace-pre-wrap">{ogloszenie.tresc}</p>
                  </div>
                  <button onClick={() => handleDelete(ogloszenie.data)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-colors duration-150 ml-4 flex-shrink-0">Usuń</button>
                </div>
              </div>
            )) : <p className="text-center text-gray-400 italic">Nie znaleziono ogłoszeń pasujących do kryteriów.</p>
          }
        </div>
        <div className="mt-8 text-center">
          <Link to="/admin">
            <button className="px-10 py-3 bg-gradient-to-b from-blue-600 to-blue-800 ...">Wróć do Panelu Admina</button>
          </Link>
        </div>
      </div>
    </div>
  );
}