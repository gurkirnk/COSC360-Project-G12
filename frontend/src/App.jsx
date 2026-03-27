import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import NotFoundPage from './pages/NotFoundPage'
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import LoginPage from './pages/LoginPage'
import RegistrationPage from './pages/RegistrationPage'
import CreateListingPage from './pages/CreateListingPage'
import LogoutPage from './pages/LogoutPage'
import ProfilePage from './pages/ProfilePage'
import ListEditPage from './pages/ListEditPage'

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
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage/>} />
        <Route path="listEdit" element={<ListEditPage/>} />
      </Route>
    </Routes>
  )
}

export default App
