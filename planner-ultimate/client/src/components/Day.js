import React, {useEffect, useState } from "react"
import dayjs from "dayjs"
import EventDIv from "./Eventdiv";
import { Link } from "react-router-dom"
//komponent odpowiadający za poszczególny dzień oraz sprawdza czy w danym dniu występuje jakieś wydarzenie
export default function Day ({day, rowIdx}) {
  //funkcja wyświetlający obecny dzień  
  function getCurrentDayClass() {
        return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") 
          ? "bg-blue-600 text-white rounded-full w-7"
          : "";
      }
        let [titles, setTitle] = useState('')
        let [dates, setDates] =  useState('')
        let[descryption, setDescryption] = useState('')
    




        //funkcja pobierająca z bazy danych wydarzenia przypisane dla aktualnie zalogowanego użytkownika. Wykonuje się przy każdym załadowaniu komponentu
      async function getuserInfo() {
        const res = await fetch('http://localhost:5000/userinfo', {
          headers: {
            'x-access-token': localStorage.getItem('token'),
          },
        })
      
    
        const data = await res.json()
        //sprawdzenie statusu zapytania
        if (data.status === 'ok') {
          data.events.map(event =>{ setDates(elem => [...elem, event.EventDate])
         setTitle(elem => [...elem, event.title])
         setDescryption(elem => [...elem, event.descryption])
          })
        } else {
          alert(data.error)
        }
    }
    //funkcja odpowiadająca za sprawdzenie czy w danym dniu występują wydarzenia oraz wyświetlenie ich. Wykonywane przy załadowaniu komponentu
 function showEvent(day)
      {
        //wszystkie wydarzenia
       let divs = new Array
       //pętla wykonująca się dla każdego wydarzenia
        for(let i = 0; i < titles.length;i++) 
        {
            //sprawdzenie czy w danym dniu występuje wydarzenie
          if(day.format("YYYY-MM-DD") === dates[i])
          {     
            //zbieranie informacji o konkretnym wydarzeniu do przekazania dalej
              const info = {
                title: titles[i],
                descryption: descryption[i],
                EventDate: dates[i]
              }
              //dodawanie wydarzenia do tablicy divs
            divs.push(
              <Link to="/show" state={info}>
            <EventDIv title={titles[i]} />
            </Link>
            )
          }
          else
          {
            continue 
          }
         
        }
        return divs
      }

      //wykonuje się    przy załadowaniu komponentu
    useEffect(() => {
      getuserInfo()
     }, [])
     


  //dzień
    return (
        <div className="border border-gray-200 flex flex-col">
            <header className="flex flex-col items-center">
               <p className="font-black text-xl">{dayjs(day).format('ddd')}</p>
            
                <p className={`my-1 text-2xl text-center  ${getCurrentDayClass()}`}  >
            {dayjs(day).format('DD')}
            </p>
            </header>
            {showEvent(day)}
        </div>
    )
}

