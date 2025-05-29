
import React  from "react"
import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"

//strona ukazująca dane konkretnego wydarzenia
export default function ShowE(){
//pobieranie danych (tytuł i opis) które zostały przesłane za pomocą lokacji
const location = useLocation()

const title = location.state.title
const descryption = location.state.descryption
const EventDate = location.state.EventDate.toString()


//funkcja usuwająca wydarzenie wywoływana w przypdaku kliknięcia w przeznaczony do tego przycisk
async function deleteEvent(event) {
    event.preventDefault()

    const response = await fetch('http://localhost:5000/deleteevent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
           title: {title},
            descryption: {descryption},
            EventDate: {EventDate}
           
        }),
    })

    const data = await response.json()
    //w przypadku powodzenia przenosi do widoku kalendarza
    if (data.status === 'ok') {
        window.location.href = '/calendar'
    }
    else {
        alert("error")
    }
}











return (
    <>
    <div className="flex justify-center items-center h-screen text-fuchsia-900 ">
        <div className="mb-4">
        <label className="block text-blue-900 text-sm font-bold mb-2">NAZWA:</label>
            <div className="px-8 pt-6 pb-8 mb-4 bg-white bg-opacity-40 backdrop-blur-lg rounded drop-shadow-lg">
          <h1>{title}</h1>
          </div>
          <label className="block text-blue-900 text-sm font-bold mb-2">OPIS:</label>
          <div className="px-8 pt-6 pb-8 mb-4 bg-white bg-opacity-40 backdrop-blur-lg rounded drop-shadow-lg overflow-y-scroll max-w-xl max-h-96">
          <p >{descryption}</p>
          </div>
          <button className="bg-red-600 hover:bg-red-800 text-slate-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline " onClick={deleteEvent}>Usuń wydarzenie</button>
          <Link to="/calendar">
          <button className="float-right bg-blue-600 hover:bg-blue-700 text-slate-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Powrót do kalendarza</button>
          </Link>
        </div>

    </div>
    </>
)








}