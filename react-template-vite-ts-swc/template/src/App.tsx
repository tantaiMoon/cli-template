import { useState } from 'react'
import logo from './assets/logo.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
          <img src={logo} className="logo react" alt="React logo" />
      </div>
    </>
  )
}

export default App
