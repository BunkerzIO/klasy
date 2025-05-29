
import { Link } from "react-router-dom"
//widok strony tytułowej zawierający przycisk do rejestracji oraz logowania



export function Home() {

    return (
        
        <>
        <div className="flex justify-center items-center h-screen"> 
        <div className="home">
        <section>
        <div className=" p-2">
            <h1 className="bg-purple-600 text-white text-3xl rounded-md font-bold inline px-2 box-decoration-slice">Bunker</h1>
        </div>
        <div className="ml-4 ">
        <Link to="/login">
        <button className=" mb-2 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
             Login
        </button> 
        </Link>
        </div> 
        <div className="ml-4">
        <Link to="/register">
        <button className="mb-2 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
             Register
        </button>
        </Link>
        </div>
        </section>
        </div>
       </div>
    </>
    )
}