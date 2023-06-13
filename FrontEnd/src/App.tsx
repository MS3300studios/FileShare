import * as React from "react";
import Navigation from './components/navigation/nav';
import LandingPage from './components/landingPage/landingPage';
import './App.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import AddFile from './components/addFile/addFile';
import { Login } from './components/login/login';
import { MessageBar, MessageBarType, Spinner, SpinnerSize, initializeIcons } from '@fluentui/react';
initializeIcons();
import { getToken } from './utils/getToken';
import Contacts from "./components/contacts/contacts";
import EditProfile from "./components/profile/editUserProfile";
import Shared from "./components/shared/shared";
import Chat, { ISocketMessage } from "./components/chat/chat";
import Conversations from "./components/conversations/conversations";
import io from 'socket.io-client';
import { getUser } from "./utils/getUser";

const socket = io("https://filesharebackend-ljml.onrender.com")

interface IConversationInfo{
  show: boolean;
  messageData: ISocketMessage;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loadingIsLoggedIn, setLoadingIsLoggedIn] = React.useState(true);
  const [loadingConversations, setLoadingConversations] = React.useState(true);
  const [conversations, setConversations] = React.useState([]);
  const [messageBar, setMessageBar] = React.useState({show: false, type: MessageBarType.error, text: "an error occurred, please reload the page and try again"});
  const [converationInfo, setConversationInfo] = React.useState<IConversationInfo>({show: false, messageData: null as any })

  React.useEffect(() => {
    setLoadingIsLoggedIn(true);
    const token = getToken();
    if(token === "no token"){
      setLoadingIsLoggedIn(false);
      setIsLoggedIn(false)
      return;
    }
    fetch(`https://limba.wzks.uj.edu.pl/20_strusinski/aplikacja/api/users/verifyToken/${token}`).then(resp => {
      if(resp.status === 200) {
        setLoadingIsLoggedIn(false);
        setIsLoggedIn(true)
      }
      else if(resp.status === 401){
        setLoadingIsLoggedIn(false);
        setIsLoggedIn(false)
        setMessageBar({show: true, type: MessageBarType.error, text: "an error occurred, please reload the page and try again"})
        alert("an error occurred, please reload the page and try again")
      }
    }).catch(err => setMessageBar({show: true, type: MessageBarType.error, text: "an error occurred, please reload the page and try again"}))

    fetch(`https://limba.wzks.uj.edu.pl/20_strusinski/aplikacja/api/conversations`, { headers: { Authorization: getToken() } }).then(resp => {
      return resp.json()
    }).then(data => {
      setConversations(data)
      setLoadingConversations(false)
    }).catch(err => {
      setMessageBar({show: true, type: MessageBarType.error, text: "an error occurred, please reload the page and try again"})
      alert("an error occurred, please reload the page and try again")
      console.log(err)
    })
  }, [])

  React.useEffect(() => {
    if(!loadingConversations){
      const userData = getUser();
      if(userData){
        socket.emit("userChannel", { userId: userData._id })
      }
      conversations.forEach(conv => {
        socket.emit('join', { conversationId: (conv as any)._id });
      })

      socket.on("newConversation", (data: { message: ISocketMessage, newConvId: string }) => {
        if(!window.location.href.includes("chat")){
          setConversationInfo({show: true, messageData: data.message})
          setTimeout(() => {
            setConversationInfo({show: false, messageData: data.message})
          }, 5300);
        }
        socket.emit('join', { conversationId: data.newConvId });
      })

      socket.on("receiveMessage", (message: ISocketMessage) => {
        if(!window.location.href.includes("chat")){
          setConversationInfo({show: true, messageData: message})
          setTimeout(() => {
            setConversationInfo({show: false, messageData: message})
          }, 5300);
        }

        // setConversationInfo({show: true, messageData: message})
        // setTimeout(() => {
        //   setConversationInfo({show: false, messageData: message})
        // }, 5100);
      })
    }

    return () => {
      socket.off("newConversation");
      socket.off("receiveMessage");
    };
  }, [loadingConversations])

  // const loadConversations = () => {
  //   console.log('loading conversation new')

  //   setLoadingConversations(true);
  //   fetch(`https://limba.wzks.uj.edu.pl/20_strusinski/aplikacja/api/conversations`, { headers: { Authorization: getToken() } }).then(resp => {
  //     return resp.json()
  //   }).then(data => {
  //     setConversations(data)
  //     setLoadingConversations(false)
  //   }).catch(err => {
  
  //     setMessageBar({show: true, type: MessageBarType.error, text: "an error occurred, please reload the page and try again"})
  //     alert("an error occurred, please reload the page and try again")
  //     console.log(err)
  //   })
  // }

  return (
    <BrowserRouter basename="/20_strusinski/aplikacja">
    {
      loadingIsLoggedIn ? <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh"}}>
      <Spinner size={SpinnerSize.large} /> </div> : (
        <div className="App">
          { messageBar.show &&
              <>
                  <div style={{marginTop: "10px"}}></div>
                  <MessageBar messageBarType={messageBar.type}>
                      {messageBar.text}
                  </MessageBar> 
              </>
          }
          { converationInfo.show &&
              <div className="slideIn">
                <b>User <span style={{textDecoration: "underline"}}>{converationInfo.messageData.message.authorNickname}</span> has written to you</b>
                <p>{converationInfo.messageData.message.text} </p>
              </div>
          }
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
                {/* <Route path='/chat/:contactId' element={<Chat socket={socket} onChatUnload={loadConversations} />} /> */}
                <Route path='/chat/:contactId' element={<Chat socket={socket} />} />
              </Routes>
              </>
            ) : <Login />
          }
        </div>
      )
    }
    </BrowserRouter>
  )
}

export default App