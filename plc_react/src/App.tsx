import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Settings from './components/Settings';
import './App.css';
function App() {

  return (
    <Router>
        <div className='App'>
          
          <Header/>
          <Routes>
            <Route path="/" element={<Settings/>}/>
          </Routes>
        </div>
    </Router>
  );
}

export default App;
