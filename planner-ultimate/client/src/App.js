import { Route, Routes } from 'react-router-dom';
import {Home} from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Calendar from "./pages/Calendar"
import {getMonth} from './utility/getMonth'
import React, {useState, useContext, useEffect} from 'react';
import GlobalContext from './context/GlobalContext';
import Events from './pages/Events';
import ShowE from './pages/Show'
import AdminPanel from './pages/AdminPanel'; // Zaimportuj nowy komponent
import TesterPanel from './pages/TesterPanel'; // 1. Zaimportuj nowy komponent
import Uwagi from './pages/Uwagi';
import UwagiAdmin from './pages/UwagiAdmin'; // 1. Zaimportuj nową stronę
import DodajOgloszenie from './pages/DodajOgloszenie'; // 1. Zaimportuj
import ZarzadzajOgloszeniami from './pages/ZarzadzajOgloszeniami'; // 1. Zaimportuj
import BannedUsers from './pages/BannedUsers';
//routing frontendu
function App(){
  const [currentMonth, setCurrentMonth ] = useState(getMonth())
  const {monthIndex}  = useContext(GlobalContext)

  useEffect(() => {
    setCurrentMonth(monthIndex)
  }, [monthIndex]); //pobieranie obecnego miesiąca
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/calendar" element={<Calendar/>} />
    <Route path="/event" element={<Events/>} />
    <Route path="/show" element={<ShowE/>} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/uwagi" element={<UwagiAdmin />} /> {/* 2. Dodaj nową ścieżkę */}
      <Route path="/tester" element={<TesterPanel />} /> {/* 2. Dodaj nową ścieżkę */}
        <Route path="/uwagi" element={<Uwagi />}/>
           <Route path="/admin/ogloszenia/dodaj" element={<DodajOgloszenie />} />
        <Route path="/admin/ogloszenia" element={<ZarzadzajOgloszeniami />} /> {/* 2. Dodaj nową ścieżkę */}
         <Route path="/admin/banned" element={<BannedUsers />} /> {/* 2. Dodaj nową ścieżkę */}
    </Routes>
    </>
  )
}

export default App;
