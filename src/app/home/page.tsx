import { Navbar } from '@/components/navbar'
import React from 'react'
import HomePage from './_page'

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Navbar />
        <HomePage />
    </div>
  )
}

export default Home