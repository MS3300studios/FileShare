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
import EditProfile from "./components/profile/editUserProfile";
import Shared from "./components/shared/shared";
import Chat from "./components/chat/chat";
import Conversations from "./components/conversations/conversations";
import io from 'socket.io-client';

const socket = io("http://localhost:3000");

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
              <Route path='/shared' element={<Shared />} />
              <Route path='/conversations' element={<Conversations />} />
              <Route path='/user/edit' element={<EditProfile />} />
              <Route path='/chat/:contactId' element={<Chat socket={socket} />} />
            </Routes>
            </>
          ) : <Login />
        }
      </div>
    </BrowserRouter>
  )
}

export default App