import { getCurrentAccessor } from '@/lib/getCurrentAccessor'
import React from 'react'
import Navbar from './Navbar';

const NavbarWrapper = async () => {
    const user = await getCurrentAccessor();
    return (
        <Navbar user={user} />
    )
}

export default NavbarWrapper