// src/pages/TesterPanel.jsx
import { useNavigate, Link } from 'react-router-dom';

export default function TesterPanel() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleNotImplemented = () => {
    alert('Funkcja w przygotowaniu!');
  };

  return (
    <div
      className="flex justify-center items-center h-screen p-4"
      style={{
        backgroundImage: "url(/img/bunker.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="bg-black/70 backdrop-blur-md shadow-xl rounded-lg p-8 w-full max-w-2xl text-white text-center">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-400 [text-shadow:0_0_8px_rgba(96,165,250,0.5)]">
          Panel Testera
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button onClick={handleNotImplemented} className="px-6 py-4 bg-gradient-to-b from-yellow-600 to-orange-800 text-white font-bold uppercase tracking-wider rounded-lg shadow-lg hover:shadow-xl hover:from-yellow-500 hover:to-orange-700 transition-all duration-150">
            Stwórz Testową Grę
          </button>
          
          <button onClick={handleNotImplemented} className="px-6 py-4 bg-gradient-to-b from-yellow-600 to-orange-800 text-white font-bold uppercase tracking-wider rounded-lg shadow-lg hover:shadow-xl hover:from-yellow-500 hover:to-orange-700 transition-all duration-150">
            Dołącz do Testowej Gry
          </button>

          {/* === ZMIANA JEST TUTAJ === */}
          <Link to="/uwagi" className="px-6 py-4 bg-gradient-to-b from-green-600 to-green-800 text-white font-bold uppercase tracking-wider rounded-lg shadow-lg hover:shadow-xl hover:from-green-500 hover:to-green-700 transition-all duration-150 flex items-center justify-center">
            Zgłoś Uwagę
          </Link>
          {/* ======================= */}
          
          <button onClick={handleLogout} className="px-6 py-4 bg-gradient-to-b from-gray-600 to-gray-800 text-white font-bold uppercase tracking-wider rounded-lg shadow-lg hover:shadow-xl hover:from-gray-500 hover:to-gray-700 transition-all duration-150">
            Wyloguj
          </button>
        </div>
      </div>
    </div>
  );
}