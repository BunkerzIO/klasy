/**
 * Schemat użytkownika
 * 
*/
const mongoose = require("mongoose");

const UserDetailsScehma = new mongoose.Schema(
  {
    email: { type: String, unique: true }, // email użytkownika
    nick: String,//y nick użytkownika
    password: String,// hasło użytkownika
    events: [ //tablica które przechowuje obiekty - wydarzenia
      {
        title:  String,//tytuł wydarzenia
        descryption: String,//opis wydarzenia
        EventDate: String //data w którym wydarzenie nastąpi
      } 

    ]
  },
  {
    collection: "UserInfo", // kolekcja w której przechowywani są użytkownicy
  },
);

mongoose.model("UserInfo", UserDetailsScehma);