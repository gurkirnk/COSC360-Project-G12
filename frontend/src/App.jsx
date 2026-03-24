import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import LoginPage from './pages/LoginPage'
import RegistrationPage from './pages/RegistrationPage'
import CreateListingPage from './pages/CreateListingPage'
import LogoutPage from './pages/LogoutPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="browse" element={<BrowsePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegistrationPage />} />
        <Route path="logout" element={<LogoutPage />} />
        <Route path="list" element={<CreateListingPage/>} />
        <Route path="account" element={<h1>Account not implemented</h1>} />
      </Route>
    </Routes>
  )
}

export default App
