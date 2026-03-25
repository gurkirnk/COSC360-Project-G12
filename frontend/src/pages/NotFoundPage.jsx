import React from 'react'
import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for doesn't exist.</p>
      <p>
        <Link to="/">Return to Home</Link>
      </p>
    </div>
  )
}

export default NotFoundPage
