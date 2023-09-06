import React, { useState, useEffect } from 'react'
import useProyectos from '../hooks/useProyectos'
import Alerta from '../components/Alerta'
import { useParams } from 'react-router-dom'

const FormularioProyecto = () => {

  {/*State de camos del formulario*/}
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fechaEntrega, setFechaEntrega] = useState('')
  const [cliente, setCliente] = useState('')

  {/*Obtener el id para actualizar el proyecto*/}
  const params = useParams()
  const {id} = params
  const idparams  = id

  {/*Obtener los diferntes parametros del hooks useProyectos*/}
  const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos()

  {/*Obteniendo el id de un proyecto en particular*/}
  const {_id} = proyecto
  const idProyecto = _id

  useEffect(() => {
    if (params.id) {
      setNombre(proyecto.nombre)
      setDescripcion(proyecto.descripcion)
      setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
      setCliente(proyecto.cliente)
    } 
  }, [params])


  const handleSubmit = async e => {
    e.preventDefault()

    if ([nombre, descripcion, fechaEntrega, cliente].includes('')) {
      mostrarAlerta({
        error: true,
        msg: 'Todos los campos son obligatorios'
      })
      return
    }

    //Pasar los datos hacia el provider
    await submitProyecto({ idProyecto,idparams,nombre, descripcion, fechaEntrega, cliente })
    setNombre('')
    setDescripcion('')
    setFechaEntrega('')
    setCliente('')

  }
  const { msg } = alerta
  return (
    <form

      action="" className='bg-white py-10 px-5 md:w-1/2 rounded-sm shadow'
      onSubmit={handleSubmit}
    >

      {msg && <Alerta alerta={alerta} />}

      {/*Nombre del Proyecto*/}
      <div>
        <label
          htmlFor="nombre"
          className='text-gray-700 uppercase font-bold text-sm'
        >Nombre Proyectos</label>

        <input
          id='nombre'
          type="text"
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-sm'
          placeholder='Nombre del Proyecto'
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
      </div>

      {/*Descripcion del Proyecto*/}
      <div>
        <label
          htmlFor="descripcion"
          className='text-gray-700 uppercase font-bold text-sm'
        >Descripcion del proyecto</label>

        <textarea
          id='descripcion'
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-sm'
          placeholder='Descripcion del Proyecto'
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
      </div>

      {/*Fecha Entrega del Proyecto*/}
      <div>
        <label
          htmlFor="fecha-entrega"
          className='text-gray-700 uppercase font-bold text-sm'
        >Fecha Entrega</label>

        <input
          id='fecha-entrega'
          type="date"
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-sm'
          value={fechaEntrega}
          onChange={e => setFechaEntrega(e.target.value)}
        />
      </div>
      {/*Cliente del Proyecto*/}
      <div>
        <label
          htmlFor="cliente"
          className='text-gray-700 uppercase font-bold text-sm'
        >Nombre Proyectos</label>

        <input
          id='cliente'
          type="text"
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-sm'
          placeholder='Nombre del Cliente'
          value={cliente}
          onChange={e => setCliente(e.target.value)}
        />
      </div>

      <input
        type="submit"
        value={params.id ? 'Actualizar Proyecto' : 'Crear Proyecto'}
        className='bg-sky-700 w-full p-3 text-white uppercase font-bold hover:bg-sky-800 cursor-pointer transition-all mt-5 rounded-lg'

      />
    </form>
  )
}

export default FormularioProyecto