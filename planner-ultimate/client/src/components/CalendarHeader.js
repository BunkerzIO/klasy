import React, {useContext} from "react"
import GlobalContext from "../context/GlobalContext"
import dayjs from "dayjs";
import { Link } from "react-router-dom"
export default function  CalendarHeader() {
  //nagłówek widoku kalendarza


  //funkcje służą do zmiany miesięcy poprzez zmianę indexu 
    const {monthIndex, setMonthIndex}  = useContext(GlobalContext)
    function handlePrevMonth() {
        setMonthIndex(monthIndex - 1);
        console.log(monthIndex)
      }
      function handleNextMonth() {
        setMonthIndex(monthIndex + 1)
        console.log(monthIndex)
      }

      //funkcja przywracająca obecny miesiąc
      function handleReset() {
        setMonthIndex(
          monthIndex === dayjs().month()
            ? monthIndex + Math.random()
            : dayjs().month()
        );
      }






return(
        <header className="px-4 py-2 flex items-center justify-between">
                <h1 className="text-4xl mr-20  text-purple-900 font-bold ">Planer</h1>

            <button className="border-2 rounded py-2 px-6 hover:bg-sky-700 border-purple-900" onClick={handleReset}>Today</button>
            <button onClick={handlePrevMonth}><span className="material-symbols-outlined ml-10 text-2xl cursor-pointer">arrow_back_ios</span>
            </button>
            
            
            <button onClick={handleNextMonth} >
            <span className="material-symbols-outlined  text-2xl cursor-pointer "  >arrow_forward_ios</span>
            </button>
              <h2 className="text-teal-100 text-xl w-90">{dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM-YYYY")}</h2>

            <Link to={'/event'}>
            <button className="border-2  rounded py-2 px-4 hover:bg-sky-700 border-purple-900">Event</button>
            </Link>
           <Link to={'/'}> <button className="border-2  rounded py-2 px-4 border-dashed text-blue-50 font-normal hover:font-bold bg-purple-900">Logout</button></Link>

        </header>
    )
} 
