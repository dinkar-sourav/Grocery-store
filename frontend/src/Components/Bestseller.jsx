import React from 'react'
import Card from './Card';
import { useAppContext } from '../Context/AppContext';
const Bestseller = () => {
    const {products}= useAppContext();
  return (
    // heading
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Bestseller</p>
      
      <div onClick={()=>scrollTo(0,0)} className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
        {products.filter((product)=>product.inStock).slice(0,5).map((product, index)=>(<Card key={index} product={product}/>))}
      </div>
    </div>
  )
} 

export default Bestseller;
