import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from './Home';
import Register from './Register'
import Login from './Login'

function App() {

  return (
      <BrowserRouter>
          <Routes>
          <Route path="/" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/home" element={<Home/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
