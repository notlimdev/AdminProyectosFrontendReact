import React from 'react'
import { Link } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import Busqueda from './Busqueda'
import useAuth from '../hooks/useAuth'

const Header = () => {
    const {cerrarAuth} = useAuth()
    const {handleBuscador,cerrarSesionProyectos} = useProyectos()

    const handleCerarSesion = () => {
        cerrarSesionProyectos()
        cerrarAuth()
    }
  return (
    <header className='px-4 py-5 bg-white border-b'>
        <div className='md:flex md:justify-between'>
            <h2 className='text-4xl text-sky-600 font-black text-center mb-5 md:mb-0'>
                UpTask
            </h2>
            <div className='flex flex-col md:flex-row items-center gap-4'>
                <button 
                    type='button'
                    className='font-bold uppercase'
                    onClick={handleBuscador}
                >
                    Buscar Proyecto
                </button>
                <Link
                    to='/proyectos'
                    className=' text-gray-600 hover:text-black rounded-md uppercase font-bold text-sm'
                >Proyectos</Link>

                <button
                    type='button'
                    className='bg-sky-600 px-5 py-2 text-white rounded-md uppercase font-bold text-sm'
                    onClick={handleCerarSesion}
                >Cerrar Sesión</button>

                <Busqueda />
            </div>
        </div>
    </header>
  )
}

export default Header