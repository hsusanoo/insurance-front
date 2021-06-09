import axios from 'axios'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import Table from '../../components/Table'

const Clients = () => {

  const columns = [
    { accessor: 'cin', Header: 'CIN' },
    { accessor: 'prenom', Header: 'First Name' },
    { accessor: 'nom', Header: 'Last Name' },
    { accessor: 'fonction', Header: 'Function' },
    { accessor: 'adresse', Header: 'Address' },
    { accessor: 'status', Header: 'Status' }
  ]

  const [data, setData] = useState([])

  // Fetch data
  useEffect(async () => {

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clients?projection=${process.env.NEXT_PUBLIC_CLIENT_PROJECTION}`)

    const formattedData = res.data._embedded.clients.map(c => ({ ...c, fonction: c.fonction.intitule }))

    setData(formattedData)

  }, [])

  return (
    <>
      <div className="flex flex-col">
        <div className="w-full mt-32 mb-8 flex flex-row-reverse justify-between">
          <button title={'Add Client'}
                  onClick={() => Router.push('/clients/add')}
                  className={'bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'}>
            New
          </button>
        </div>
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <Table columns={columns} data={data} rowClickEnabled rowClickBasePath={'/clients'} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Clients
