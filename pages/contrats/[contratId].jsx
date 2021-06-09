import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import ContratForm from '../../components/ContratForm'

const contratId = () => {

  const router = useRouter()
  const { contratId } = router.query

  useEffect(() => {
    console.log({ contratId })
  }, [])

  return (
    <ContratForm view id={contratId} />
  )
}

export default contratId
