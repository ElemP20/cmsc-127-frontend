import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ProgramProvider } from './models/ProgramModel';
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import Checklist from './pages/Checklist/Checklist'
import Add from './pages/Add/Add'
import Choose from './pages/Choose/Choose'
import SysAdmin from './pages/SysAdmin/SysAdmin'

const routes = (
  <Router>
    <Routes>
      <Route path="/Login" exact element={<Login />} />
      <Route path="/Home" exact element={<Home />} />
      <Route path="/ViewChecklist" exact element={<Checklist/>} />
      <Route path="/Add" exact element={<Add />} />
      <Route path="/SysAdmin" exact element={<SysAdmin />} />
      <Route path="/" exact element={<Choose />} />
    </Routes>
  </Router>
)


function App() {
  return <ProgramProvider><div>{routes}</div></ProgramProvider>
}

export default App