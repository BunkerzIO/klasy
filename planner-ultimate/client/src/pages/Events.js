import React, { useState } from "react";
import { Link } from "react-router-dom";


//storna z  formularzem dodającym wydaarzenia
const Events = () => {
    let [EventDate, setEventDate] = useState();
    const [title, setTitle] = useState('')
    const [descryption, setDescryption] = useState('')

    //funkcja, która wykonuje zapytanie do danych podając dane wydarzenia i pobiera komunikat o statusie   
    async function addEvent(event) {
      event.preventDefault()
      EventDate = EventDate.replace('T', ' ')
      const response = await fetch('http://localhost:5000/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'), //token zawierający email
        },
        body: JSON.stringify({
          title,
            descryption,
           EventDate,
        }),
       
      
      })
     EventDate.replace('T', ' ') //dostosowywanie danych do późniejszych wymagań
     

      
      const data = await response.json()
  //spawdza czy zapytanie działa
      if (data.status === 'ok') {
              alert("działa")
              window.location.href = '/calendar'
      }
          else {
              alert("nie")
          }
  //przenosi z powrotem do kalendarza
        
    }
 
 
      //formularz pobierający Stringi: tytuł, opis i datę 
    return (
      <>
      <Link to="/calendar"><button className="border-2  rounded py-2 px-4 border-dashed text-blue-50 font-normal hover:font-bold bg-purple-900">Powrót</button></Link>
      <div className="flex justify-center items-center h-screen">
      {/* formularz dodawania wydarzenia */}
     <form onSubmit={addEvent}>
     <input className="block appearance-none w-full text-fuchsia-900 bg-white border border-gray-400 hover:border-fuchsia-900 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
      type="text" placeholder="NAZWA WYDARZENIA" maxLength="20"  required="required" onChange={(e) => setTitle(e.target.value)}/>
     <input type="date"   required="required" onChange={(e) => setEventDate(e.target.value)}/>
      

      <input type="text" required="required"   placeholder="OPIS" onChange={(e) => setDescryption(e.target.value)}/>
      <input className="mb-2 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" type="submit"/>
      </form>
      </div>
      </>
    );
      }

  export default Events