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
    </Routes>
    </>
  )
}

export default App;
