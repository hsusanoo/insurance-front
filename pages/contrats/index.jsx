import axios from 'axios'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import Table from '../../components/Table'

const Clients = () => {

  const columns = [
    { accessor: 'id', Header: 'ID' },
    { accessor: 'matricule', Header: 'Matricule' },
    { accessor: 'categorie', Header: 'Categorie' },
    { accessor: 'agence', Header: 'Agence' },
    { accessor: 'client', Header: 'Client CIN' }
  ]

  const [data, setData] = useState([])

  // Fetch data
  useEffect(async () => {

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contrats?projection=${process.env.NEXT_PUBLIC_CONTRAT_PROJECTION}`)

    const formattedData = res.data._embedded.contrats.map(c => ({
      ...c,
      categorie: c.categorie.intitule,
      client: c.client.cin,
      agence: c.agence.nom
    }))

    console.log({ formattedData })

    setData(formattedData)

  }, [])

  return (
    <>
      <div className="flex flex-col">
        <div className="w-full mt-32 mb-8 flex flex-row-reverse justify-between">
          <button title={'Add Contract'}
                  onClick={() => Router.push('/contrats/add')}
                  className={'bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'}>
            New
          </button>
        </div>
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <Table columns={columns} data={data} rowClickEnabled rowClickBasePath={'/contrats'} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Clients
