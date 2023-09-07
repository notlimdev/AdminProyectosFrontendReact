import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate} from "react-router-dom";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";
const ProyectosContext = createContext();

let socket;
const ProyectosProvider = ({ children }) => {

    const [proyectos, setProyectos] = useState([]);
    const [alerta, setAlerta] = useState({});
    const [proyecto, setProyecto] = useState({});
    const [cargando, setCargando] = useState(false);
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
    const [tarea, setTarea] = useState({});
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [colaborador, setColaborador] = useState({});
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false);
    const [buscador, setBuscador] = useState(false);
    

    const navigate = useNavigate();
    const {auth} = useAuth();
    
    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token')
                if(!token) return
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const {data} = await clienteAxios('/proyectos', config);
                setProyectos(data);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerProyectos();
    }, [auth])

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL,{
            reconnectionDelay: 1000,
            reconnection: true,
            reconnectionAttemps: 10,
            transports: ['websocket'],
            agent: false,
            upgrade: false,
            rejectUnauthorized: false
        });
        
    },[])

    const mostrarAlerta = alerta => {
        setAlerta(alerta);
        setTimeout(() => {
            setAlerta({});
        }, 5000);
       
    }

    const submitProyecto = async proyecto => {
        if(proyecto.idparams){ 
            await actualizarProyecto(proyecto)
        }else{
            await crearNuevoProyecto(proyecto)
        }
    }

    const crearNuevoProyecto = async proyecto => {
        
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post('/proyectos', proyecto, config)

            setProyectos([...proyectos, data])
            setAlerta({
                msg: 'Proyecto creado correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000)
        } catch (error) {
            console.log(error);
        }
    }
    const actualizarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.put(`/proyectos/${proyecto.idProyecto}`, proyecto, config)

            const  proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)
            setAlerta({
                msg: 'Proyecto actualizado correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000)
        } catch (error) {
            console.log(error);
        }
    }

    const obtenerProyecto = async id => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data)
            setAlerta({})

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }finally{
            setCargando(false)
        }
    }
    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.delete(`/proyectos/${id}`, config)
            const proyectoEliminado = proyectos.filter(proyecto => proyecto._id !== id)
            setProyectos(proyectoEliminado)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000)
        }
        catch (error) {
            console.log(error);
        }
    }
    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }
    const submitTarea = async tarea => {
        if (tarea.id) {
            await actualizarTarea(tarea)
            
            
        }else{
            await crearNuevaTarea(tarea)
            
        }
       
    }

    const handleModalEditarTarea = (tarea) => {
        setTarea(tarea)
        setModalFormularioTarea(!modalFormularioTarea)
        
    }

    
    const crearNuevaTarea = async (tarea) => {
        const {id,...tareanew} = tarea
       
        try {
            const token = localStorage.getItem('token')
                if(!token) return
    
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                
            const {data} = await clienteAxios.post('/tareas', tareanew, config)
            
           
            setAlerta({})
            setModalFormularioTarea(false)
            
            {/* SOCKET iO*/}
            socket.emit('nueva tarea', data)
            
        } catch (error) {
        console.log(error);
        }
    }
    const actualizarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
                if(!token) return
    
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            
            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
            
          
            setAlerta({})
            setModalFormularioTarea(false)

            //SOCKET
            socket.emit('actualizar tarea', data)
        } catch (error) {
        console.log(error);
        }
    }

    const handleModalEliminarTarea = tarea => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token')
                if(!token) return
    
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            
            const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`,config)
            
            setAlerta({
                msg: data.msg,
                error: false
            })
            
            setModalEliminarTarea(false)
            
            //SOCKET 
            
            socket.emit('eliminar tarea', tarea)
            setTarea({})
            setTimeout(() => {
                setAlerta({})
            }, 3000)
        } catch (error) {
        console.log(error);
        }
    }

    const submitColaborador = async email => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
                if(!token) return
    
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            
            const {data} = await clienteAxios.post(`/proyectos/colaboradores`, {email}, config)
            setColaborador(data)
            setAlerta({})
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            
        }finally{
            setCargando(false)
        }
    }

    const agregarColaborador = async (email) => {
        
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})

            setTimeout(() => {
                setAlerta({})
            }, 3000)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }
    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
    }

    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config)

            const proyectoActualizado = { ...proyecto }
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)
            setProyecto(proyectoActualizado)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setModalEliminarColaborador(false)

            setTimeout(() => {
                setAlerta({})
            }, 3000)

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            
        }
    }

    const completarTarea = async (id) => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            
            const {data} = await clienteAxios.put(`/tareas/estado/${id}`, {}, config)
            setTarea({})
            setAlerta({})

            //SOCKET 

            socket.emit('cambiar estado', data)

        } catch (error) {
            console.log(error.response.data.msg);
            
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    //Socket io

    const submitTareasProyecto = async (tarea) => {
         {/* Agrega la tarea al State */}
         const proyectoActualizado = { ...proyecto }
         proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
         setProyecto(proyectoActualizado)
    }
    const eliminarTareaProyecto = async (tarea) => {
        const proyectoActualizado = { ...proyecto }
            proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
            
            setProyecto(proyectoActualizado)
    }
    const actualizarTareaProyecto = async (tarea) => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const nuevoEstadoProyecto = (tarea) => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map((tareaState) => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }
    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})

    }
    return (
        <ProyectosContext.Provider 
            value={ {
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                handleBuscador,
                buscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                nuevoEstadoProyecto,
                cerrarSesionProyectos


            }}
        >
            { children } 
        </ProyectosContext.Provider>
    )
}

export {
    
    ProyectosProvider
}
export default ProyectosContext