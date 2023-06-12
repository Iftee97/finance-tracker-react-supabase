import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'

export default function App() {
  // const user = false
  const { authIsReady, user } = useContext(AuthContext)

  return (
    <div className="App">
      {authIsReady && (
        <>
          <Navbar />
          <Routes>
            <Route
              path='/'
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path='/login'
              element={user ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path='/signup'
              element={user ? <Navigate to="/" /> : <Signup />}
            />
          </Routes>
        </>
      )}
    </div>
  )
}
