import { Link } from "react-router-dom";

// Widok strony tytułowej zawierający przycisk do rejestracji oraz logowania
export function Home() {
  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{
        backgroundImage: "url(/img/bunker.jpg)", // Upewnij się, że obrazek jest w public/img/
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-center">
        <div className="mb-12">
          {/* === ZMIANA JEST TUTAJ === */}
          <h1
            className="
              text-white text-7xl font-bold 
              [text-shadow:-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,2px_2px_0_#000]
            "
          >
            Bunker
          </h1>
          {/* === KONIEC ZMIANY === */}
        </div>

        <div className="flex justify-center gap-x-8">
          <Link to="/login">
            <button className="
              px-10 py-3 
              bg-gradient-to-b from-yellow-600 to-orange-800 
              text-white font-bold uppercase text-sm tracking-wider
              border-2 border-black/30 rounded-lg 
              shadow-lg hover:shadow-xl
              hover:from-yellow-500 hover:to-orange-700
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500
              active:shadow-inner active:translate-y-px
              transition-all duration-150 ease-in-out
            ">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="
              px-10 py-3 
              bg-gradient-to-b from-yellow-600 to-orange-800 
              text-white font-bold uppercase text-sm tracking-wider
              border-2 border-black/30 rounded-lg 
              shadow-lg hover:shadow-xl
              hover:from-yellow-500 hover:to-orange-700
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500
              active:shadow-inner active:translate-y-px
              transition-all duration-150 ease-in-out
            ">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}