import React from 'react'
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ListadoProyectos = ({proyecto}) => {
  const {auth} = useAuth();
  const {_id,nombre, cliente,creador} = proyecto;
  
  return (
    <div className='border-b p-5 flex flex-col md:flex-row justify-between'>

        <div className='flex items-center gap-2 '>

          <p className='flex-1'>
              {nombre}

              <span className='text-sm text-gray-500 uppercase'>{' '} {cliente}</span>
          </p>

          {auth._id !== creador && (
            
            <p className='p-1 uppercase text-xs  text-white bg-green-500 rounded-lg font-bold'>Colaborador</p>
          )}

        </div>
        <Link
            to={`${_id}`}
            className='text-gray-600 hover:text-gray-800 uppercase font-bold text-sm '
        >Ver Proyecto</Link>
    </div>
  )
}

export default ListadoProyectos