import React, {useState} from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";
//powoduje, że kalendarz wie który mamy miesiąc oraz pozwala na zmianę wyświetlanego miesiąca
export default function ContextWrapper(props) {
    const [monthIndex, setMonthIndex] = useState(dayjs().month())
    return (
        <GlobalContext.Provider value={{ monthIndex, setMonthIndex }}>
            {props.children}
        </GlobalContext.Provider>

    )
}
