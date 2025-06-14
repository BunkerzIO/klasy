// src/pages/Uwagi.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GAME_VERSION = '0.2.1-alpha';

export default function Uwagi() {
  const [reportText, setReportText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Zaktualizowana funkcja handleSave
  const handleSave = async () => {
    if (reportText.trim() === '') {
      alert('Proszę wpisać treść uwagi przed zapisaniem.');
      return;
    }

    // Pobieramy nick zalogowanego użytkownika z localStorage
    const userNick = localStorage.getItem('user');
    if (!userNick) {
        alert('Błąd: Nie można zidentyfikować użytkownika. Proszę zalogować się ponownie.');
        navigate('/login');
        return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('http://localhost:5000/uwagi', { // Używamy proxy
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // NIE wysyłamy już tokena w nagłówku
        },
        body: JSON.stringify({
          reportText,
          gameVersion: GAME_VERSION,
          nick: userNick, // DOŁĄCZAMY nick do ciała żądania
        }),
      });

      const data = await response.json();

      if (data.status === 'ok') {
        alert('Dziękujemy! Twoja uwaga została zapisana.');
        navigate(-1);
      } else {
        throw new Error(data.error || 'Nie udało się zapisać uwagi.');
      }
    } catch (error) {
      alert(`Wystąpił błąd: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div
      className="flex justify-center items-center h-screen p-4"
      style={{
        backgroundImage: "url(/img/bunker.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black/70 backdrop-blur-md shadow-xl rounded-lg p-8 w-full max-w-2xl text-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400 [text-shadow:0_0_8px_rgba(234,179,8,0.4)]">
          Zgłoś Uwagę (Wersja: {GAME_VERSION})
        </h1>

        <div className="mb-6">
          <label htmlFor="report" className="block text-gray-300 text-sm font-bold mb-2">
            Opisz znaleziony błąd lub sugestię:
          </label>
          <textarea
            id="report"
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            rows="8"
            className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-800/50 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-yellow-500"
            placeholder="Np. Przycisk 'Dołącz do gry' nie działa na urządzeniach mobilnych..."
            disabled={isSaving}
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg shadow-md transition-colors duration-150 disabled:opacity-50"
          >
            Cofnij
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-colors duration-150 disabled:opacity-50"
          >
            {isSaving ? 'Zapisywanie...' : 'Zapisz Uwagę'}
          </button>
        </div>
      </div>
    </div>
  );
}