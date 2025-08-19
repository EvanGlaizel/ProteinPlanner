import {Routes, Route} from 'react-router-dom'

import Navigation from './routes/navigation'
import Login from './routes/login'
import Dashboard from './routes/dashboard'

function App() {

  return (
    <Routes>
        <Route path="/" element={<Navigation/>}>
          <Route path="login" element={<Login/>}/>
          <Route path="dashboard" element={<Dashboard/>}/>
        </Route>
    </Routes>
  )
}

export default App
