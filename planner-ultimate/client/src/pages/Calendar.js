import React, { useState,useContext,useEffect } from "react";
import {getMonth} from "../utility/getMonth"
import Month from "../components/Month"
import CalendarHeader from "../components/CalendarHeader" //nagłówek strony
import GlobalContext from "../context/GlobalContext"; //manipulowanie miesiącem
//wikok kalendarza
export default function Calendar(){
  const [currenMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex } = useContext(GlobalContext);

  //ustala obecny miesiąc
  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

    return (
      
        <>    
             <CalendarHeader/>
            <div className="h-5/6 flex flex-columns">
              <Month month={currenMonth}/>
            </div>
        </>
           )

}

