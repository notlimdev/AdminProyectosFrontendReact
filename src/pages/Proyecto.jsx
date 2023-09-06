import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import ModalFormularioTarea from '../components/ModalFormularioTarea'
import Tarea from '../components/Tarea'
import ModalEliminarTarea from '../components/ModalEliminarTarea'

import Colaborador from '../components/Colaborador'
import ModalEliminarColaborador from '../components/ModalEliminarColaborador'
import useAdmin from '../hooks/useAdmin'

import io from 'socket.io-client'

let socket;
const Proyecto = () => {

    const params = useParams()

    const { obtenerProyecto, proyecto, cargando,handleModalTarea,submitTareasProyecto,eliminarTareaProyecto,actualizarTareaProyecto,nuevoEstadoProyecto } = useProyectos()
    
    const admin = useAdmin()
    useEffect(() => {
        obtenerProyecto(params.id)
    }, [])

    useEffect(() => {
       socket = io(import.meta.env.VITE_BACKEND_URL)
       socket.emit('abrir proyecto', params.id)
    },[])

    
    useEffect(() => {
        {/*recibir del backend socket.io el parametro  tal cual como lo enviamos en este caso "tarea agregada" */}
        socket.on("tarea agregada",(tareanueva)=>{
            if (tareanueva.proyecto === proyecto._id) {
                
                submitTareasProyecto(tareanueva)
            }
        })
    {/*recibir del backend socket.io el parametro  tal cual como lo enviamos en este caso "tarea eliminada" */}
        socket.on("tarea eliminada", (tareaBorrada)=>{
            if (tareaBorrada.proyecto === proyecto._id) {
                eliminarTareaProyecto(tareaBorrada)
            }
        })

        socket.on("tarea actualizada", (tarea)=>{
            if (tarea.proyecto._id === proyecto._id) {
                actualizarTareaProyecto(tarea)
            }
        })

        socket.on("nuevo estado", (tarea)=>{
            if (tarea.proyecto._id === proyecto._id) {
                nuevoEstadoProyecto(tarea)
            }
        })
    })


    const { nombre } = proyecto

    if(cargando) return 'Cargando...'
    
    return (
        
        
            <>
                <div className='flex justify-between'>
                    <h1 className='text-4xl font-black'>{nombre}</h1>

                {admin && (
                        
                    
                    <div className='flex items-center gap-2 text-gray-400 hover:text-black'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 
                    112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 
                    1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 
                    0L19.5 7.125M18 14v4.75A2.25 2.25 
                    0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 
                    0 015.25 6H10"
                            />
                        </svg>

                        <Link
                            to={`/proyectos/editar/${proyecto._id}`}
                            className='uppercase font-bold'
                        >Editar</Link>

                    </div>
                )}

                </div>

                {admin && (
                    
                
                    <button
                        onClick={handleModalTarea}
                        type='button'
                        className='bg-sky-600 px-5 py-3 w-full md:w-auto text-white text-center rounded-lg uppercase font-bold text-sm mt-5 hover:bg-sky-700 flex gap-2'

                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>

                    Nueva Tarea</button>
                )}

                <p className='font-bold text-xl mt-10'>Tareas del Proyecto</p>

                <div className='flex justify-center'>

                    <div className='md:w-1/3 lg:w-1/4'>

                    
                    </div>
                </div>
                <div className='bg-white shadow mt-10 rounded-e-lg'>
                    {proyecto.tareas?.length ? 
                    
                        proyecto.tareas.map(tarea => (
                            <Tarea 
                                key={tarea._id} 
                                tarea={tarea} 
                            />
                        ))
                    :
                        <p className='text-center text-gray-600 uppercase p-5'>No hay Tareas</p>
                    }
                </div>

                {admin && (
                    <>
                
                        <div className='flex itms-center justify-between mt-10'>
                            <p className='font-bold text-xl mt-10'>Colaboradores</p>

                            <Link
                                to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                                className='text-gray-400 hover:text-black uppercase font-bold'
                            >Añadir</Link>
                        </div>
                        <div className='bg-white shadow mt-10 rounded-e-lg'>
                            {proyecto.colaboradores?.length ? 
                            
                                proyecto.colaboradores.map(colaborador => (
                                    <Colaborador 
                                        key={colaborador._id} 
                                        colaborador={colaborador} 
                                    />
                                ))
                            :
                                <p className='text-center text-gray-600 uppercase p-5'>No hay Colaboradores en este Proyecto</p>
                            }
                        </div>
                    </>
                )}

                <ModalFormularioTarea />
                <ModalEliminarTarea />
                <ModalEliminarColaborador />
            </>

        )
    
}

export default Proyecto