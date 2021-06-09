import { useRouter } from 'next/router'
import React from 'react'
import ClientForm from '../../components/ClientForm'

const contratId = () => {

  const router = useRouter()
  const { clientId } = router.query

  return (
    <ClientForm view id={clientId}/>
  )
}

export default contratId
