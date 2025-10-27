import { useContext, useState } from 'react'
import './App.css'
import Dashboard from './Pages/DashBoard'
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom'
import LoggIn from './Pages/LoggIn'
import SignUp from './Pages/SignUp'
import { DashBoardContext } from './DashBoardContext/DashBoardContext'
import Error from './Pages/Error'
import { KycDataProvider } from './Application/KYC/KycContext/KycContex'
import SearchBar from './Ratesupplier/SearchBar'
function App() {
 
const {user}=useContext(DashBoardContext)

  return (
    <>
      <BrowserRouter>
        <Routes>

          
          <Route path="/" element={user?<Dashboard />:<KycDataProvider><LoggIn /></KycDataProvider>} />
          <Route path="/signup" element={user?<Dashboard />:<SignUp />} />
          <Route path="*" element={<Error />} />
          <Route path='/Dashboard' element={user?<Dashboard />:<KycDataProvider><LoggIn /></KycDataProvider>} />
          <Route path="ratefixing" element={<SearchBar/>}/>

          
          </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
