import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'



const Registrar = () => {

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repetirPassword, setRepetirPassword] = useState('')
  const [alerta, setAlerta] = useState({})

  const handleSubmit = async e => {
    e.preventDefault();

    if ([nombre, email, password, repetirPassword].includes('')) {
      setAlerta({
        error: true,
        msg: 'Todos los campos son obligatorios'
      })
      return
    } 
    if (password !== repetirPassword) {
      setAlerta({
        error: true,
        msg: 'Las contraseñas no son iguales'
      })
      return
      
    }
    if (password.length < 6) {
      setAlerta({
        error: true,
        msg: 'La contraseña debe tener al menos 6 caracteres'
      })
      return
      
    }
    setAlerta({})

    //Crear el usuario en la API
    try {
      const { data } = await clienteAxios.post('/usuarios', 
      { nombre, email, password })
      setAlerta({
        error: false,
        msg: data.msg
      })

      setNombre('')
      setEmail('')
      setPassword('')
      setRepetirPassword('')
    } catch (error) {
      setAlerta({
        error: true,
        msg: error.response.data.msg
      })
      
    }

  }

  const { msg } = alerta
  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Crea Tu Cuenta y Administra tus
        <span className='text-slate-700'>Proyetos</span>
      </h1>

      {msg && <Alerta alerta={alerta} />}
      <form 
      
        className='my-10 bg-white shadow rounded-lg px-10 py-5'
        onSubmit={handleSubmit}
      
      >
        <div className='my-5'>
          <label
            className='uppercase text-gray-600 block text-xl font-bold'
            htmlFor='nombre'
          >Nombre</label>
          <input
            id='nombre'
            type="text"
            placeholder='Tu Nombre'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>
        <div className='my-5'>
          <label
            className='uppercase text-gray-600 block text-xl font-bold'
            htmlFor='email'
          >Email</label>
          <input
            id='email'
            type="email"
            placeholder='Email de Registro'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className='my-5'>
          <label
            className='uppercase text-gray-600 block text-xl font-bold'
            htmlFor='password'
          >password</label>
          <input
            id='password'
            type="password"
            placeholder='Password de Registro'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className='my-5'>
          <label
            className='uppercase text-gray-600 block text-xl font-bold'
            htmlFor='comparepassword'
          >Repetir Password</label>
          <input
            id='comparepassword'
            type="password"
            placeholder='Repetir tu passowrd'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={repetirPassword}
            onChange={e => setRepetirPassword(e.target.value)}
          />
        </div>
        <input
          type="submit"
          value={'Iniciar Sesion'}
          className='bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'

        />
      </form>

      <nav
        className='lg:flex lg:justify-between'
      >
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to={'/'}
        >
          ¿ya tienes una cuenta? Inicia Sesión
        </Link>

        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to={'/olvide-password'}
        >
          Olvide mi contraseña
        </Link>

      </nav>
    </>
  )
}

export default Registrar