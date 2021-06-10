import axios from 'axios'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ContratsList from './ContratsList'

const ClientForm = ({ view, add, id }) => {

  const { register, handleSubmit, setValue } = useForm()

  const [mode, setMode] = useState(view ? 'view' : add ? 'add' : 'edit')
  const [functions, setFunctions] = useState([])

  useEffect(async () => {

    //  Redirect if invalid id
    if (mode !== 'add' && !(/\d/g.test(id))) {
      await Router.push('/clients')
    }

    //  Fill form initial data
    if (mode !== 'add') {
      console.log({id})
      const clientRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clients/${id}?projection=${process.env.NEXT_PUBLIC_CLIENT_PROJECTION}`)
      const clientData = clientRes.data

      //  Extract zip from address
      let [zip, ...address] = clientData.adresse.split(', ').reverse()
      address = address.reverse().join(', ')

      setValue('First name', clientData.prenom)
      setValue('Last name', clientData.nom)
      setValue('cin', clientData.cin.toUpperCase())
      setValue('address', address)
      setValue('zip', zip)
      setValue('status', mode === 'view' ? clientData.status : clientData.status.toLowerCase())
      setValue('function', mode === 'view' ? clientData.fonction.intitule : clientData.fonction.id)
    }

    if (mode === 'add' || mode === 'edit') {
      const fonctions = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/fonctions?projection=${process.env.NEXT_PUBLIC_FONCTION_PROJECTION}`)
      setFunctions(fonctions.data._embedded.fonctions)
      console.log({fonctions: fonctions.data._embedded.fonctions})
    }

  }, [mode])

  const handleDelete = async () => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/deleteClient?id=${id}`)
    alert(`Client with id ${id} deleted!`)
    await Router.push('/clients')
  }

  const onSubmit = async data => {
    //  Format Client object to send
    const client = {
      cin: data.cin,
      prenom: data['First name'],
      nom: data['Last name'],
      adresse: data.address + ', ' + data.zip,
      fonction: {id: data.function },
      status: data.status
    }

    //  Post/Put Client
    if (mode === 'add') {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/addClient?projection=${process.env.NEXT_PUBLIC_CLIENT_PROJECTION}`,
        client
      )
      await Router.push(`/clients`)
    } else {
      //  Update
      client.id = id
      console.log({client})
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/editClient`,
        client
      )

      //  Display changed/added client
      setMode('view')
    }

  }

  return (
    <>
      <div className="w-full max-w-lg mt-20 mb-10 flex justify-between">
        {
          mode === 'view'
            ? <>
              <button title={'Delete Client'}
                      onClick={handleDelete}
                      className={'bg-red-300 hover:bg-red-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'}>
                Delete
              </button>
              <button title={'Update Client'}
                      onClick={() => setMode('edit')}
                      className={'bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'}>
                Update
              </button>
            </>
            : mode === 'edit'
            ? <button type={'button'} title={'Cancel Update'}
                      onClick={() => setMode('view')}
                      className={'bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'}>
              Cancel
            </button>
            : ''

        }
      </div>
      <form className="w-full max-w-lg mt-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="first-name">
              First Name
            </label>
            <input {...(mode === 'view' && ({ readOnly: true }))}
                   className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                   {...register('First name', { required: true, maxLength: 80 })}
                   id="first-name" type="text" />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="last-name">
              Last Name
            </label>
            <input {...(mode === 'view' && ({ readOnly: true }))}
                   className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                   {...register('Last name', { required: true, maxLength: 80 })}
                   id="last-name" type="text" />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="cin">
              CIN
            </label>
            <input {...(mode === 'view' && ({ readOnly: true }))}
                   className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                   {...register('cin', { required: true })}
                   id="cin" type="text" />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="address">
              Address
            </label>
            <input {...(mode === 'view' && ({ readOnly: true }))}
                   className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                   {...register('address', { required: true })}
                   id="address" type="text" />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="zip">
              Zip
            </label>
            <input {...(mode === 'view' && ({ readOnly: true }))}
                   className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                   {...register('zip', { required: true })}
                   id="zip" type="text" placeholder="00000" />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-8">
          <div className="w-full md:w-1/2 px-3 md-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="function">
              Function
            </label>
            {
              mode === 'view'
                ? <input {...(mode === 'view' && ({ readOnly: true }))}
                         className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                         {...register('function', { required: true })}
                         id="function" type="text" />
                : <div className="relative">
                  <select {...(mode === 'view' && ({ readOnly: true }))}
                          className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          {...register('function', { required: true })}
                          id="function">
                    {functions.map(f => <option key={f.id} value={f.id}>{f.intitule}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
            }
          </div>
          <div className="w-full md:w-1/2 px-3 md-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="status">
              Status
            </label>
            {
              mode === 'view'
                ? <input {...(mode === 'view' && ({ readOnly: true }))}
                         className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                         {...register('status', { required: true })}
                         id="status" type="text" />
                : <div className="relative">
                  <select {...(mode === 'view' && ({ readOnly: true }))}
                          className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          {...register('status', { required: true })}
                          id="status">
                    <option value={'single'}>Single</option>
                    <option value={'married'}>Married</option>
                    <option value={'divorced'}>Divorced</option>
                    <option value={'widow'}>Widow(er)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
            }
          </div>
        </div>
        {
          mode !== 'view' &&
          <div className="flex items-center justify-center">
            <input
              className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit" value={mode === 'add' ? 'Add Client' : 'Update Client'} />
          </div>
        }
      </form>
      {mode === 'view' &&

       <div className="w-full max-w-lg mt-20 mb-20">
         <h2 className={'mb-8'}>Contracts</h2>
         <hr />
         <ContratsList className={'mt-20'} clientId={id} />
       </div>
      }
    </>
  )
}

export default ClientForm
