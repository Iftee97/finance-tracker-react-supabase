import { useState, useEffect } from 'react'
import TransactionList from '../../components/TransactionList/TransactionList'
import TransactionForm from '../../components/TransactionForm/TransactionForm'
import styles from './Home.module.css'

export default function Home() {
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    // fetch transactions
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {error && (
          <p>
            {error}
          </p>
        )}
        {transactions && <TransactionList transactions={transactions} />}
      </div>

      <div className={styles.sidebar}>
        {/* prop: uid={user.uid} */}
        <TransactionForm />
      </div>
    </div>
  )
}
