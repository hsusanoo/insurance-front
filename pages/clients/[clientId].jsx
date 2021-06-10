import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ClientForm from '../../components/ClientForm'

const contratId = () => {

  const router = useRouter()
  const [clientId, setClientId] = useState(undefined)

  useEffect(() => {
    setClientId(router.query.clientId)
  })

  return (
    <ClientForm view id={clientId} />
  )
}

export default contratId
