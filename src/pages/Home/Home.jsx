import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { supabase } from '../../config/supabaseClient'
import TransactionList from '../../components/TransactionList/TransactionList'
import TransactionForm from '../../components/TransactionForm/TransactionForm'
import styles from './Home.module.css'

export default function Home() {
  const { user } = useContext(AuthContext)

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getTransactions()
  }, [])

  async function getTransactions() {
    try {
      setLoading(true)
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
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  // subscribe to INSERT real-time changes in the transactions table
  supabase.channel('custom-insert-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'transactions' },
      (payload) => {
        console.log('INSERT Change payload: >>>>>>>>>>>>', payload)
        setTransactions((prev) => [payload.new, ...prev])
      }
    )
    .subscribe()

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {loading ? (
          <p>loading...</p>
        ) : (
          transactions?.length > 0 ? (
            <TransactionList
              transactions={transactions}
              setTransactions={setTransactions}
            />
          ) : (
            <p>no transactions yet</p>
          )
        )}
      </div>
      <div className={styles.sidebar}>
        <TransactionForm userId={user.id} />
      </div>
    </div >
  )
}
