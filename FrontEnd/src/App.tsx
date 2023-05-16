import * as React from "react";
import Navigation from './components/navigation/nav';
import LandingPage from './components/landingPage/landingPage';
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddFile from './components/addFile/addFile';
import { Login } from './components/login/login';
import { Spinner, SpinnerSize, initializeIcons } from '@fluentui/react';
initializeIcons();
import { getToken } from './utils/getToken';
import Contacts from "./components/contacts/contacts";

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loadingIsLoggedIn, setLoadingIsLoggedIn] = React.useState(true);

  React.useEffect(() => {
    setLoadingIsLoggedIn(true);
    const token = getToken();
    if(token === "no token"){
      setLoadingIsLoggedIn(false);
      setIsLoggedIn(false)
      return;
    }
    fetch(`http://localhost:3000/users/verifyToken/${token}`).then(resp => {
      if(resp.status === 200) {
        setLoadingIsLoggedIn(false);
        setIsLoggedIn(true)
      }
      else if(resp.status === 401){
        setLoadingIsLoggedIn(false);
        setIsLoggedIn(false)
      }
    })
  }, [])

  if(loadingIsLoggedIn){
    return <Spinner size={SpinnerSize.large} />
  }

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