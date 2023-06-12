import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { supabase } from '../../config/supabaseClient'
import styles from './Signup.module.css'

export default function Signup() {
  const navigate = useNavigate()
  const { dispatch } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)

  useEffect(() => {
    return () => {
      setIsCancelled(true)
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setError(null)
      setIsPending(true)

      let { data, error } = await supabase.auth.signUp({ email, password })
      console.log({ data, error })
      if (data.user) {
        dispatch({ type: 'LOGIN', payload: data.user })
        navigate('/')
      }
      if (error) {
        setError(error.message)
      }

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } catch (error) {
      if (!isCancelled) {
        console.log(error.message)
        setError(error.message)
        setIsPending(false)
      }
    } finally {
      setIsPending(false)
      setEmail('')
      setPassword('')
    }
  }

  return (
    <form className={styles['signup-form']} onSubmit={handleSubmit}>
      <h2>signup</h2>
      <label>
        <span>email:</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        <span>password:</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button
        type='submit'
        className='btn'
        disabled={isPending}
      >
        {!isPending ? 'signup' : 'loading...'}
      </button>
      {error && (
        <p className='error'>
          <strong>Error: {' '}</strong>
          {error}
        </p>)}
    </form>
  )
}
