import React from 'react'
import { formatearFecha } from '../helpers/formatearFecha'
import useProyectos from '../hooks/useProyectos'
import useAdmin from '../hooks/useAdmin'

const Tarea = ({ tarea }) => {

    const {handleModalEditarTarea,handleModalEliminarTarea,completarTarea} = useProyectos()
    const { nombre, descripcion, prioridad, fechaEntrega, _id,estado } = tarea

    
    return (
        <div className='border-b p-5 flex justify-between items-center'>
            <div className='flex flex-col items-start'>
                <p className='mb-2 text-xl'>{nombre}</p>
                <p className='mb-2 text-sm text-gray-500 uppercase'>{descripcion}</p>
                <p className='mb-2 text-xl'>{formatearFecha(fechaEntrega)}</p>
                <p className='mb-2 text-gray-600'>{prioridad}</p>

                {estado && <p className='text-xs bg-green-600 uppercase p-1 rounded-lg text-white'>Completada por :{tarea.completado.nombre}</p>}
            </div>

            <div className='flex flex-col lg:flex-row gap-4'>
                {useAdmin() && (
                    <button
                       
                        className='bg-indigo-600 px-5 py-2 text-white uppercase font-bold text-sm rounded-lg'
                        onClick={() => handleModalEditarTarea(tarea)}
                    >Editar</button>
                )}
               
                <button
                    
                    className={` ${estado ? 'bg-sky-600' : 'bg-gray-600'} px-5 py-2 text-white uppercase font-bold text-sm rounded-lg`}
                    onClick={() => {completarTarea(_id)}}
                >{estado ? 'Completa' : 'Incompleta'}</button>

                {useAdmin() && (
                    <button
                       
                        className='bg-red-600 px-5 py-2 text-white uppercase font-bold text-sm rounded-lg'
                        onClick={() => handleModalEliminarTarea(tarea)}

                    >Eliminar</button>
                )}
            </div>
        </div>
    )
}

export default Tarea