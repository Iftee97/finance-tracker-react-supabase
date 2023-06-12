import { useState } from 'react'
import { supabase } from '../../config/supabaseClient'

export default function TransactionForm({ userId }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          { name, amount, user_id: userId }
        ])
      if (error) {
        throw error
      }
    } catch (error) {
      console.log(error)
      setError(error.message)
    } finally {
      setLoading(false)
      setAmount(0)
      setName('')
    }
  }

  return (
    <>
      <h3>add a transaction</h3>
      <form onSubmit={handleSubmit}>
        <label>
          <span>transaction name:</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          <span>amount ($):</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <button className='btn' type='submit'>
          {loading ? 'loading...' : 'add transaction'}
        </button>
        {error && (
          <p className='error'>
            {error}
          </p>
        )}
      </form>
    </>
  )
}
