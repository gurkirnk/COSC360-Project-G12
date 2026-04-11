import { Link } from 'react-router-dom'

function NotAllowedPage( { details } ) {
  return (
    <div>
      <h1>You do not have the required permissions to view this page.</h1>
      <p>{details}</p>
      <p>
        <Link to="/">Return to Home</Link>
      </p>
    </div>
  )
}

export default NotAllowedPage
