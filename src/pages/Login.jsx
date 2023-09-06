import React,{useState} from 'react'
import { Link,Navigate } from 'react-router-dom'
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'
import useAuth from '../hooks/useAuth'


const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alerta, setAlerta] = useState({})

  const {setAuth} = useAuth()


  const handleSubmit = async e => {
    
    e.preventDefault()

    if ([email, password].includes('')) {
      setAlerta({
        error: true,
        msg: 'Todos los campos son obligatorios'
      })
      return
    }

    try {
      const {data} = await clienteAxios.post('/usuarios/login', {email, password})
      setAlerta({})
      localStorage.setItem('token', data.token)
      setAuth(data)
    } catch (error) {
      setAlerta({
        error: true,
        msg: error.response.data.msg
      })
    }
  }

  const {msg} = alerta
  return (
   <>
    <h1 className='text-sky-600 font-black text-6xl capitalize'>Inicia Sessión y Administra tus 
      <span className='text-slate-700'>Proyetos</span>
    </h1>

    {msg && <Alerta alerta={alerta} />}
    <form 
      onSubmit={handleSubmit}
      className='my-10 bg-white shadow rounded-lg px-10 py-5'
    >
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
          placeholder='Email de Registro'
          className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
          value={password}
          onChange={e => setPassword(e.target.value)}
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
        to={'registrar'}
      >
        ¿No tienes una cuenta? Registrate
      </Link>

      <Link 
        className='block text-center my-5 text-slate-500 uppercase text-sm'
        to={'olvide-password'}
      >
        Olvide mi contraseña
      </Link>

    </nav>
   </>
  )
}

export default Login