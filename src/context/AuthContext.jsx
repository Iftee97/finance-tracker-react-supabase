import { createContext, useReducer, useEffect } from 'react'
import { supabase } from '../config/supabaseClient'

export const AuthContext = createContext()

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      }

    case 'LOGOUT':
      return {
        ...state,
        user: null
      }

    case 'SET_SESSION':
      return {
        ...state,
        session: action.payload
      }

    case 'AUTH_IS_READY':
      return {
        user: action.payload,
        authIsReady: true
      }

    default:
      return state
  }
}

export default function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
    session: null
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch({ type: 'SET_SESSION', payload: session })
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      dispatch({ type: 'SET_SESSION', payload: session })
      dispatch({ type: 'AUTH_IS_READY', payload: session?.user })
    })
  }, [])

  console.log('AuthContext state: >>>>>>>>', state)

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
