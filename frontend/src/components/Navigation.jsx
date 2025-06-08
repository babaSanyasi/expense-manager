const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'add', label: 'Add Expense' },
    { id: 'list', label: 'View Expenses' },
    { id: 'analytics', label: 'Analytics' }
  ]

  return (
    <nav className='bg-white shadow-md border-b'>
      <div className='container mx-auto px-4'>
        <div className='flex space-x-8'>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
