import { createContext ,useState} from "react";

export const AppContext = createContext()

export const AppContextProvider = (props)=>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin,setIsLoggedin] = useState(false)
    const [userData,setserData] = useState(false)

    const value ={
        backendUrl,
        isLoggedin,setIsLoggedin,
        userData,setserData

    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>    )

}
export default AppContext ;