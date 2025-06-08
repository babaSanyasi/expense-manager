import { useState } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import Analytics from './components/Analytics'

function App () {
  const [activeTab, setActiveTab] = useState('add')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleExpenseAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'add':
        return <ExpenseForm onExpenseAdded={handleExpenseAdded} />
      case 'list':
        return <ExpenseList key={refreshTrigger} />
      case 'analytics':
        return <Analytics key={refreshTrigger} />
      default:
        return <ExpenseForm onExpenseAdded={handleExpenseAdded} />
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className='container mx-auto px-4 py-8'>
        {renderActiveComponent()}
      </main>
    </div>
  )
}

export default App
