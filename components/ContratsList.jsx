import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Table from './Table'

const ContratsList = ({ clientId }) => {

  const columns = [
    { accessor: 'id', Header: 'ID' },
    // {
    //   Header: 'Agency',
    //   columns: [
    //     { accessor: 'nom', Header: 'Name' },
    //     { accessor: 'adresse', Header: 'Address' }
    //   ]
    // },
    { accessor: 'matricule', Header: 'Matriculate' },
    // { accessor: 'categorie', Header: 'Category' }
  ]

  const [data, setData] = useState([])

  useEffect(async () => {

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clients/${clientId}/contrats?projection=${process.env.NEXT_PUBLIC_CONTRAT_PROJECTION}`)

    const contracts = res.data._embedded.contrats.map(c => ({
      id: c.id,
      matricule: c.matricule,
      // agence: c.agence.nom

    }))

    setData(contracts)

  }, [])

  return data.length > 0
  ? <Table columns={columns} data={data} rowClickEnabled rowClickBasePath={'/contrats'} />
    : <div className={'block flex justify-center w-full bg-gray-100 border rounded py-3 px-4 uppercase tracking-wide text-gray-500 text-xs font-bold mb-2'}>
      This client has no contracts.
    </div>
}

export default ContratsList
