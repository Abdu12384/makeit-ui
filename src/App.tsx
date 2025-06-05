import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import { ClientRoutes } from './routes/client/ClientRoute'
import {Toaster} from 'react-hot-toast'
import { VendorRoute } from './routes/vendor/VendorRoute'
import { AdminRoutes } from './routes/admin/AdminRoute'
import NotFound404 from './components/common/404Page/PageNotFound'
// import SocketManager from './utils/socket/socket'

function App() {


  return (
    <BrowserRouter>
       <Toaster
        position='top-right' reverseOrder={false} toastOptions={{duration:4000, style:{  background: '#333',color: '#fff',borderRadius: '8px'}}}/>
        {/* <SocketManager/> */}
         <Routes>
              <Route path='/*' element={<ClientRoutes/>}/>
              <Route path='/vendor/*' element={<VendorRoute/>}/>
              <Route path='/admin/*' element={<AdminRoutes/>}/>
              <Route path='*' element={<NotFound404/>}/>
         </Routes>

    </BrowserRouter>
     
  )
}

export default App
