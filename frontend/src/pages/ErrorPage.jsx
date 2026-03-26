import { Link } from 'react-router-dom'

function ErrorPage( { details } ) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>An error occurred.</h1>
      <p>{details}</p>
      <p>
        <Link to="/">Return to Home</Link>
      </p>
    </div>
  )
}

export default ErrorPage
