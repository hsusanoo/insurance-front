import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Table from './Table'

const ContratsList = ({ clientId }) => {

  const columns = [
    { accessor: 'id', Header: 'ID' },
    {
      Header: 'Agency',
      columns: [
        { accessor: 'nom', Header: 'Name' },
        { accessor: 'adresse', Header: 'Address' }
      ]
    },
    { accessor: 'matricule', Header: 'Matriculate' },
    { accessor: 'categorie', Header: 'Category' }
  ]

  const [data, setData] = useState([])

  useEffect(async () => {

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contrats/search/findByClient?id=${clientId}&projection=${process.env.NEXT_PUBLIC_CONTRAT_PROJECTION}`)

    const contracts = res.data._embedded.contrats.map(c => ({
      id: c.id,
      matricule: c.matricule,
      agence: c.agence.nom

    }))

    setData(contracts)

  }, [])

  return <Table columns={columns} data={data} />
}

export default ContratsList
