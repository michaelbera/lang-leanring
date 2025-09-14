import { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import VocabularyList from './components/VocabularyList'
import AddWordForm from './components/AddWordForm'
import VocabularyStats from './components/VocabularyStats'

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const location = useLocation()

  const handleWordAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleListRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navigation */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/add">Thêm từ mới</Link></li>
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost text-xl">📚 Học từ vựng</Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link 
                to="/" 
                className={location.pathname === '/' ? 'active' : ''}
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link 
                to="/add" 
                className={location.pathname === '/add' ? 'active' : ''}
              >
                Thêm từ mới
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v5m18 0v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5m18 0H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">Ứng dụng học từ vựng</h1>
                  <p className="text-lg text-base-content/70">Quản lý và học từ vựng một cách hiệu quả</p>
                </div>
                
                <VocabularyStats refreshTrigger={refreshTrigger} />
                
                <VocabularyList onRefresh={handleListRefresh} />
              </div>
            } 
          />
          <Route 
            path="/add" 
            element={
              <div className="max-w-2xl mx-auto">
                <AddWordForm onWordAdded={handleWordAdded} />
              </div>
            } 
          />
        </Routes>
      </div>
    </div>
  )
}

export default App
