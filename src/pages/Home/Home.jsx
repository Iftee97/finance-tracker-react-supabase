import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { supabase } from '../../config/supabaseClient'
import TransactionList from '../../components/TransactionList/TransactionList'
import TransactionForm from '../../components/TransactionForm/TransactionForm'
import styles from './Home.module.css'

export default function Home() {
  const { user } = useContext(AuthContext)

  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    getTransactions()
  }, [])

  async function getTransactions() {
    let { data, error } = await supabase
      .from('transactions') // from the transactions table
      .select('*') // select all columns
      .eq('user_id', user.id) // only get transactions for the logged in user
      .order('created_at', { ascending: false }) // newest first

    if (data?.length > 0) {
      setTransactions(data)
    }
    if (error) {
      setError(error.message)
    }
  }

  // subscribe to real-time insert changes in the transactions table
  supabase.channel('custom-insert-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'transactions' },
      (payload) => {
        console.log('Change received! >>>>>>>>>>>>', payload)
        setTransactions((prev) => [...prev, payload.new])
      }
    )
    .subscribe()

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {transactions?.length ? (
          <TransactionList transactions={transactions} />
        ) : (
          <p>no transactions yet</p>
        )}
      </div>
      <div className={styles.sidebar}>
        <TransactionForm userId={user.id} />
      </div>
    </div >
  )
}
