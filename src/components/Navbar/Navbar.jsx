import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { supabase } from '../../config/supabaseClient'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, dispatch } = useContext(AuthContext)

  const [isPending, setIsPending] = useState(false)

  async function handleLogout() {
    setIsPending(true)
    await supabase.auth.signOut()
    dispatch({ type: 'LOGOUT' })
    setIsPending(false)
  }

  return (
    <nav className={styles.navbar}>
      <ul>
        <li className={styles.title}>
          <Link to='/'>
            finance tracker
          </Link>
        </li>
        {user ? (
          <>
            <li>
              Hello, {user.email.split('@')[0]}
            </li>
            <li>
              <button className='btn' onClick={handleLogout}>
                {isPending ? "logging out..." : "logout"}
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to='/login'>
                login
              </Link>
            </li>
            <li>
              <Link to='/signup'>
                signup
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}
