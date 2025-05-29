import React from "react"

//komponent wyświetlany w widoku kalendarza reprezentujący wydarzenie
export default function EventDIv({title})
{
    return <h3 className="text-sm italic text-center text-white bg-sky-600 rounded-2xl mb-2">{title}</h3>
}