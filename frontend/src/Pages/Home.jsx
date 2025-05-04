import React from 'react'
import Banner from '../Components/Banner'
import Categories from '../Components/Categories'
import Bestseller from '../Components/Bestseller';
import BottomBanner from '../Components/BottomBanner';
import Newsletter from '../Components/NewsLetter';
const Home = () => {
  return (
    <div className='mt-10'>
      <Banner/>
      <Categories/>
      <Bestseller/>
      <BottomBanner/>
      <Newsletter/>
    </div>
  )
}

export default Home
