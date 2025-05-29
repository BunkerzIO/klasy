import React from "react"
import Day from "./Day"
//komponent wyświetlający widok miesięczy dla miesiąca podawanego w pliku "Calendar.js"
export default function Month({month}) {
return(
    <div className="flex-1 grid grid-cols-7 grid-rows-5 w-full  p-4  text-fuchsia-900 bg-white rounded-2xl shadow-xl ">
      {/*odpowidnik foreach dla tablicy miesięcy przypisujący dzień dla każdego rzędu*/}
       {month.map((row, i) => (
            <React.Fragment key={i}>
                {row.map((day,idx) => (
                    <Day day={day} key={idx} rowIdx={i}/>
                ))}
            </React.Fragment>
       ))}
    </div>
    )
} 

