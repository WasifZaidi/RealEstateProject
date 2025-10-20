import { getCurrentUser } from '@/lib/getCurrentUser'
import React from 'react'
import ScheduleTourWrapper from '../../ScheduleTourWrapper';

const page = async() => {
  const user = await getCurrentUser();
  return (
<ScheduleTourWrapper userData={{ email: user.Email, phoneNumber: user.PhoneNumber, Name: user.userName }} />
  )
}

export default page