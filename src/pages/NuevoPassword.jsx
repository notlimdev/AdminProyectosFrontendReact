
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'

const NuevoPassword = () => {
  const [password, setPassword] = useState('')
  const [tokenValido, setTokenValido] = useState(false)
  const [alerta, setAlerta] = useState({})
  const [passwordModificado, setPasswordModificado] = useState(false)
  const params = useParams()
  const { token } = params
  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await clienteAxios(`/usuarios/confirmar/${token}`)
        setTokenValido(true)
      } catch (error) {
        setAlerta({
          error: true,
          msg: error.response.data.msg
        })
      }
    }
    comprobarToken()
  }, [])


  const handleSubmit = async e => {
    e.preventDefault()

    if (password === '' || password.length < 6) {
      setAlerta({
        error: true,
        msg: 'La contraseña debe tener al menos 6 caracteres'
      })
      return
    }

    try {
      const url = `/usuarios/olvide-password/${token}`
      const { data } = await clienteAxios.post(url, { password })
      setAlerta({
        error: false,
        msg: data.msg
      })
      setPasswordModificado(true)
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
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Restablece tu password y no pierdas acceso a tus {' '}
        <span className='text-slate-700'>Proyetos</span>
      </h1>

      {msg && <Alerta alerta={alerta} />}
      {tokenValido && (
        <form
          onSubmit={handleSubmit}
          className='my-10 bg-white shadow rounded-lg px-10 py-5'
        >

          <div className='my-5'>
            <label
              className='uppercase text-gray-600 block text-xl font-bold'
              htmlFor='password'
            >Nuevo password</label>
            <input
              id='password'
              type="password"
              placeholder='Escribe tu Nuevo Password'
              className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <input
            type="submit"
            value={'Guardar Nuevo Password'}
            className='bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'

          />
        </form>
      )}

      {passwordModificado && (
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to={'/'}
        >
          Inicia Sesión
        </Link>
      )}
    </>
  )
}

export default NuevoPassword