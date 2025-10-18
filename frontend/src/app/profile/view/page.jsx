import { getCurrentUser } from '@/lib/getCurrentUser'
import React from 'react'
import PrViewClientWrapper from '../PrViewClientWrapper';

const page = async() => {
const user = await getCurrentUser();
  return (
    <PrViewClientWrapper data={user}/>   
  )
}

export default page