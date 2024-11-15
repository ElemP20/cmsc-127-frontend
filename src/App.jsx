import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './pages/Login/Login'
// import SignIn from './pages/SignIn/SignIn'
import Home from './pages/Home/Home'
import Checklist from './pages/Checklist/Checklist'
import Add from './pages/Add/Add'

const routes = (
  <Router>
    <Routes>
      {/* <Route path="/SignIn" exact element={<SignIn />} /> */}
      <Route path="/Login" exact element={<Login />} />
      <Route path="/Home" exact element={<Home />} />
      <Route path="/ViewChecklist" exact element={<Checklist/>} />
      <Route path="/Add" exact element={<Add />} />
    </Routes>
  </Router>
)


function App() {
  return <div>{routes}</div>
}

export default App