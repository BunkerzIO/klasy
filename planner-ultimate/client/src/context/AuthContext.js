// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const LOGOUT_TIMER = 15 * 60 * 1000; // 15 minut w milisekundach

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  // Funkcja wylogowująca, którą można wywołać z dowolnego miejsca
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      if (isLoggedIn) {
        timeoutId = setTimeout(logout, LOGOUT_TIMER);
      }
    };

    // Definiujemy, jakie zdarzenia resetują timer
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

    if (isLoggedIn) {
      // Ustawiamy nasłuchiwanie na zdarzenia
      events.forEach(event => window.addEventListener(event, resetTimer));
      // Uruchamiamy timer po raz pierwszy
      resetTimer();
    }

    // Funkcja czyszcząca - usuwa nasłuchiwanie, gdy komponent jest odmontowywany lub użytkownik się wyloguje
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [isLoggedIn, logout]);

  // Wartości, które udostępniamy w całej aplikacji
  const value = {
    isLoggedIn,
    login: () => setIsLoggedIn(true),
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook ułatwiający korzystanie z kontekstu
export const useAuth = () => {
  return useContext(AuthContext);
};