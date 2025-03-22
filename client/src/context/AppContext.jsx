import { createContext ,useState} from "react";

export const AppContext = createContext()

export const AppContextProvider = (props)=>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin,setIsLoggedin] = useState(false)
    const [userData,setUserData] = useState(false)

    const getUserData = async ()=>{
        try{
            const{data} = await axios.post(backendUrl+'/api/user/login')
            data.success ? setUserData(data.userData): toast.error(data.message)

        }catch (error){
            toast.error(data.message)
        }

    }

    console.log("Backend URL:", backendUrl);


    const value ={
        backendUrl,
        isLoggedin,setIsLoggedin,
        userData,setUserData,
        getUserData

    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>    )

}
export default AppContext ;