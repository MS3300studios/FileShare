import * as React from "react";
import Navigation from './components/navigation/nav';
import LandingPage from './components/landingPage/landingPage';
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddFile from './components/addFile/addFile';
import { Login } from './components/login/login';
import { initializeIcons } from '@fluentui/react';
initializeIcons();
import { getToken } from './utils/getToken';
import Contacts from "./components/contacts/contacts";
const token = getToken(); 

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    fetch(`http://localhost:3000/users/verifyToken/${token}`).then(resp => {
      if(resp.status === 200) 
        setIsLoggedIn(true)
    })
  }, [])

  return (
    <BrowserRouter>
      <div className="App">
        {
          isLoggedIn ? (
            <>
            <Navigation />
            <Routes>
              <Route path='/' index element={<LandingPage />} />
              <Route path='/file/add' element={<AddFile />} />
              <Route path='/contacts' element={<Contacts />} />
            </Routes>
            </>
          ) : <Login />
        }
      </div>
    </BrowserRouter>
  )
}

export default App