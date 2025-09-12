import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import DisplayCard from '../components/DisplayCard'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsLetterBox from '../components/NewsLetterBox'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <DisplayCard />
      <BestSeller />
      <OurPolicy />
      <NewsLetterBox />
      
    </div>
  )
}

export default Home