
import React from "react";
//tworzy kontekst zawierający domyślnie obecny miesiąc 
const GlobalContext = React.createContext({
  monthIndex: 0,
  setMonthIndex: (index) => {},
  
});

export default GlobalContext;