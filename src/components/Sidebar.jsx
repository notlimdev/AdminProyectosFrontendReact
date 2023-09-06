import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Sidebar = () => {
  const { auth} = useAuth()
  return (
    <aside className='md:w-1/3 lg:w-1/5 xl:w-1/6 px-5 py-10'>
        <p className='text-xl font-bold'>Hola: {auth.nombre}</p>

        <Link
          to='crear-proyecto'
          className='bg-sky-600 w-full px-5 py-2 mt-10 text-white rounded-md uppercase font-bold text-sm block'
        >
            Nuevo Proyecto
        </Link>
    </aside>
)
}

export default Sidebar