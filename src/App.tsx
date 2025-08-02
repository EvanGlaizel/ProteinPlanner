import {Routes, Route} from 'react-router-dom'

import Navigation from './routes/navigation'
import Login from './routes/login'

function App() {

  return (
    <Routes>
        <Route path="/" element={<Navigation/>}>
          <Route path="login" element={<Login/>}/>
        </Route>
    </Routes>
  )
}

export default App
