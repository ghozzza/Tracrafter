import { Navbar } from '@/components/navbar'
import React from 'react'
import LandingPage from './landing'

const HomePage = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Navbar />
        <LandingPage />
    </div>
  )
}

export default HomePage