import { useState } from 'react'
import { supabase } from '../../config/supabaseClient'
import styles from '../../pages/Home/Home.module.css'

export default function TransactionList({ transactions, setTransactions }) {
  const [error, setError] = useState(null)

  async function handleDelete(id) {
    console.log('delete transaction with id', id)
    try {
      const { data, error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id) // only delete the transaction with the given id
      if (error) {
        throw error
      }
    } catch (error) {
      console.log(error)
      setError(error.message)
    }
  }

  // subscribe to DELETE real-time changes in the transactions table
  supabase.channel('custom-delete-channel')
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'transactions' },
      (payload) => {
        console.log('DELETE Change payload: >>>>>>>>>>>>>', payload)
        setTransactions((prev) => prev.filter((t) => t.id !== payload.old.id))
      }
    )
    .subscribe()

  return (
    <ul className={styles.transactions}>
      {transactions.map((transaction) => (
        <li key={transaction.id}>
          <p className={styles.name}>
            {transaction.name}
          </p>
          <p className={styles.amount}>
            ${transaction.amount}
          </p>
          <button onClick={() => handleDelete(transaction.id)}>
            <span className='material-symbols-outlined'>
              delete
            </span>
          </button>
          {error && (
            <p className='error'>
              {error}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
