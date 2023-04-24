import Navigation from './components/navigation/nav';
import LandingPage from './components/landingPage/landingPage';
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddFile from './components/addFile/addFile';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path='/' index element={<LandingPage />} />
          <Route path='/file/add' element={<AddFile />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
