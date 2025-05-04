import React from 'react'
import { useAppContext } from '../Context/AppContext';
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import Card from '../Components/Card';

const CategoriesInside = () => {
    const {products} = useAppContext();
    const {category} = useParams();

    const categoryClicked = categories.find((item)=>item.path.toLowerCase()===category);

    const categoryProducts = products.filter((product)=>product.category.toLowerCase()===category);
  return (
    <div className='mt-16'>
      {categoryClicked && (
        <div className='flex flex-col items-end w-max'>
            <p className='text-2xl font-medium'>{categoryClicked.text.toUpperCase()}</p>
            <div className='w-16 h-0.5 bg-primary rounded-full'></div>
        </div>
      )}
      {
        categoryProducts.length>0 ? (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6'>
                {categoryProducts.map((product)=>(<Card key={product._id} product={product}/>))}
            </div>
        ) : (
            <div className='flex items-center justify-center h-[60vh]'>
                <p className='text-2xl font-medium text-primary'>No products found in this category</p>
            </div>
        )
      }
    </div>
  )
}

export default CategoriesInside;
