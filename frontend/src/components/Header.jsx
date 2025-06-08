import { DollarSign } from 'lucide-react'

const Header = () => {
  return (
    <header className='bg-blue-600 text-white shadow-lg'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <DollarSign className='h-8 w-8' />
            <h1 className='text-2xl font-bold'>Expense Manager</h1>
          </div>
          <div className='text-sm'>Track your expenses efficiently</div>
        </div>
      </div>
    </header>
  )
}

export default Header
