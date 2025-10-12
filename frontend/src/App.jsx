
import './css/App.css'
import Favorites from './pages/Favorites'
// component is any fx in js that returns jsx code.starts with capital letter
// while returning it needs to have just one parent element so we use fragment
import Home from './pages/Home'
import {Routes,Route} from "react-router-dom"
import NavBar from "./components/NavBar"
function App() {
  return (
    <div>
     <NavBar/>
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/favorites" element={<Favorites/>}/>
      </Routes>
    </main>
    </div>
  )
}
// props means property we can add it to customize same like passing parameters

export default App
