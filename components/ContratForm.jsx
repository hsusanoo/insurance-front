import axios from 'axios'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const ContratForm = ({ view, add, edit, id }) => {

  const { register, handleSubmit, setValue } = useForm()

  const [mode, setMode] = useState(view ? 'view' : add ? 'add' : 'edit')
  const [categories, setCategories] = useState([])
  const [agencies, setAgencies] = useState([])
  const [clients, setClients] = useState([])

  const handleDelete = async () => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/deleteContrat?id=${id}`)
    alert(`Contrat with id ${id} deleted!`)
    await Router.push('/contrats')
  }

  useEffect(async () => {

    //  Redirect if invalid id
    if (mode !== 'add' && !(/\d/g.test(id))) {
      await Router.push('/contacts')
    }

    if (mode !== 'add') {
      const contratRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contrats/${id}?projection=${process.env.NEXT_PUBLIC_CONTRAT_PROJECTION}`)

      const contrat = contratRes.data

      console.log({ contrat })

      setValue('matricule', contrat?.matricule)
      setValue('categorie', mode === 'view' ? contrat?.categorie?.intitule : contrat?.categorie?.id)
      setValue('agence', mode === 'view' ? contrat?.agence?.nom : contrat?.agence?.id)
      setValue('client', mode === 'view'
        ? `${contrat?.client?.cin}: ${contrat?.client?.nom} ${contrat?.client?.prenom}`
        : contrat?.client?.id)
    }

    //  Fill form initial data
    if (mode === 'add' || mode === 'edit') {

      const categoriesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories?projection=${process.env.NEXT_PUBLIC_CATEGORIE_PROJECTION}`)
      const agenciesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/agences?projection=${process.env.NEXT_PUBLIC_AGENCE_PROJECTION}`)
      const clientsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clients?projection=${process.env.NEXT_PUBLIC_CLIENT_PROJECTION}`)

      setCategories(categoriesRes.data._embedded.categories)
      setAgencies(agenciesRes.data._embedded.agences)
      setClients(clientsRes.data._embedded.clients)

    }

  }, [mode])

  const onSubmit = async data => {
    const contract = {
      ...data,
      categorie: {id: data.categorie},
      client: {id: data.client},
      agence: {id: data.agence}
    }

    if (mode === 'add') {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/addContrat`, contract)
      await Router.push(`/contrats`)
    } else {
      contract.id = id
      await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/editContrat`, contract)
      setMode('view')
    }

  }

  return (
    <>
      <div className="w-full max-w-lg mt-20 mb-10 flex justify-between">
        {
          mode === 'view'
            ? <>
              <button title={'Delete Contact'}
                      onClick={handleDelete}
                      className={'bg-red-300 hover:bg-red-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'}>
                Delete
              </button>
              <button title={'Update Contact'}
                      onClick={() => setMode('edit')}
                      className={'bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'}>
                Update
              </button>
            </>
            : mode === 'edit'
            ? <button title={'Cancel Update'}
                      onClick={() => setMode('view')}
                      className={'bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'}>
              Cancel
            </button>
            : ''

        }
      </div>
      <form className="w-full max-w-lg mt-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="matricule">
              Matrricule
            </label>
            <input {...(mode === 'view' && ({ readOnly: true }))}
                   className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                   {...register('matricule', { required: true })}
                   id="matricule" type="text" />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-full px-3 md-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="categorie">
              Categorie
            </label>
            {mode === 'view'
              ? <input {...(mode === 'view' && ({ readOnly: true }))}
                       className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                       {...register('categorie', { required: true })}
                       id="categorie" type="text" />
              :
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  {...register('categorie', { required: true })}
                  id="categorie">
                  {
                    categories.map(category => <option key={category.id} id={category.id}
                                                       value={`${category.id}`}>
                        {category.intitule}
                      </option>
                    )
                  }
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
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-full px-3 md-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="agence">
              Agency
            </label>
            {mode === 'view'
              ? <input {...(mode === 'view' && ({ readOnly: true }))}
                       className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                       {...register('agence', { required: true })}
                       id="agence" type="text" />
              : <div className="relative">
                <select
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  {...register('agence', { required: true })}
                  id="agence">
                  {
                    agencies.map(agence => <option id={agence.id} key={agence.id}
                                                   value={`${agence.id}`}>
                      {agence.nom}</option>)
                  }
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
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-full px-3 md-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="client">
              Client
            </label>
            {mode === 'view'
              ? <input {...(mode === 'view' && ({ readOnly: true }))}
                       className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                       {...register('client', { required: true })}
                       id="client" type="text" />
              :
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  {...register('client', { required: true })}
                  id="client">
                  {
                    clients.map(client => <option key={client.id} value={`${client.id}`}>
                      {`${client.cin}: ${client.prenom} ${client.nom}`}
                    </option>)
                  }
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
              type="submit" value={mode === 'add' ? 'Add Contract' : 'Update Contract'} />
          </div>
        }
      </form>
    </>
  )
}

export default ContratForm
