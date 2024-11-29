import './App.css'
import GenerateInvoice from './pages/GenerateInvoice'
import Home from './pages/Home'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import SavedInvoice from './pages/SavedInvoice'
import MonthlySales from './pages/MonthlySales'
import Header from './components/Header'
import UpdateInvoice from './pages/UpdateInvoice'
import FirmWiseSellingReport from './pages/FirmWiseSellingReport'
import { Toaster } from 'react-hot-toast'

function App() {

  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/generate-invoice' element={<GenerateInvoice/>}/>
      <Route path="/update-invoice/:id" element={<UpdateInvoice />} />
      <Route path='/saved-invoices' element={<SavedInvoice/>}/>
      <Route path='/monthly-sales' element={<MonthlySales/>}/>
      <Route path='/firm-report' element={<FirmWiseSellingReport/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
