import {Routes, Route} from 'react-router-dom'

import Navigation from './routes/navigation'

function App() {

  return (
    <Routes>
        <Route path="/" element={<Navigation/>}></Route>
    </Routes>
  )
}

export default App
