import ManageUsers from '@/app/components/ManageUsers'
import { getCurrentAccessor } from '../../../../lib/getCurrentAccessor';
import React from 'react'

const page = async () => {
  const user = await getCurrentAccessor();
  if (!user) redirect("/signIn");
  if (!["admin", "manager"].includes(user.role)) redirect("/unauthorized");
  return (
    <ManageUsers role={user.role} />
  )
}

export default page