import React from 'react'
import useProyectos from '../hooks/useProyectos'

const Colaborador = ({colaborador}) => {

    const {handleModalEliminarColaborador} = useProyectos()
    const {nombre, email} = colaborador
  return (
    <div className='border-b p-5 flex justify-between'>
        <div>
            <p>{nombre}</p>
            <p className='text-sm text-gray-500 '>{email}</p>
        </div>

        <div>
            <button
                type='button'
                className='bg-red-600 px-5 py-2 text-white uppercase font-bold text-sm rounded-lg'
                onClick={() => handleModalEliminarColaborador(colaborador)}
            >Eliminar</button>
        </div>
    </div>
  )
}

export default Colaborador