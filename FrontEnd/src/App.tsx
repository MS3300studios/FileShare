import Navigation from './components/navigation/nav';
import LandingPage from './components/landingPage/landingPage';
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddFile from './components/addFile/addFile';
import { Login } from './components/login/login';

function App() {
  const isLoggedIn = false;

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
            </Routes>
            </>
          ) : <Login />
        }
      </div>
    </BrowserRouter>
  )
}

export default App
