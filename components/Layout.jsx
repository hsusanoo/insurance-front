import React from 'react'
import Sidebar from './sidebar'

const Layout = ({ children }) =>
  <div className='grid grid-cols-7 h-screen w-screen'>
    <Sidebar />
    <div className='col-span-6 w-full h-screen flex flex-col items-center'>
    {children}
    </div>
  </div>

export default Layout
