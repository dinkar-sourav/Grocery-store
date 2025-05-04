import React from 'react'
import Navbar from './Components/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import {Toaster} from 'react-hot-toast';
import Footer from './Components/Footer';
import { useAppContext } from './Context/AppContext';
import Login from './Components/Login';
import AllProducts from './Pages/AllProducts'
import CategoriesInside from './Pages/CategoriesInside';
import ProductDetails from './Pages/ProductDetails';
import Cart from './Pages/Cart';
import AddAddress from './Pages/AddAddress';
import MyOrders from './Pages/MyOrders';
import SellerLogin from './Components/SellerLogin';
import SellerLayout from './Components/SellerLayout';
import AddProduct from './Components/Seller/AddProduct';
import ProductList from './Components/Seller/ProductList';
import Orders from './Components/Seller/Orders';
import Loading from './Components/Loading';
export default function App() {
  const isSellerPath= useLocation().pathname.includes("seller");
  const {userLogin, isSeller}= useAppContext();
  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {
        !isSellerPath && <Navbar/>
      }
      {userLogin ? <Login/>:null}

      <Toaster/>
      <div className ={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/products" element={<AllProducts/>}/>
          <Route path="/products/:category" element={<CategoriesInside/>}/>
          <Route path="/products/:category/:id" element={<ProductDetails/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/add-address" element={<AddAddress/>}/>
          <Route path="/my-orders" element={<MyOrders/>}/>
          <Route path="/loader" element = {<Loading/>}/>
          <Route path='/seller' element={isSeller ?  <SellerLayout/>: 
          <SellerLogin/>}>
              <Route index element={isSeller ? <AddProduct/> : null}/>
              <Route path='product-list' element={isSeller ? <ProductList/> : null} />
              <Route path='orders' element={isSeller ? <Orders/> : null}/>
          </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer/>}
    </div>
  )
}
