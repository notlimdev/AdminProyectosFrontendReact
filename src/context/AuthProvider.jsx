import { useState, useEffect, createContext} from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const navigate = useNavigate()
    const [auth, setAuth] = useState({})
    const [cargando, setCargando] = useState(true)
    
    

    useEffect(() => {
        
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                setCargando(false)
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const {data} = await clienteAxios('/usuarios/perfil', config)
                setAuth(data)
                navigate('/proyectos')
            } catch (error) {
                setAuth({})
                
            }
            setCargando(false)
            
            
        }
        
        autenticarUsuario()
    }, [auth._id])

    const cerrarAuth = () => {
        setAuth({})
        localStorage.removeItem('token')
    }
    return (
        <AuthContext.Provider 
            value={{
                auth,
                setAuth,
                cargando,
                cerrarAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider}

export default AuthContext