import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

export default function Breadcrumbs() {
  const { pathname } = useLocation();

// put the home at the start of the pathnames array so it is always present in the breadcrumbs
  const pathnames = ['home', ...pathname.split('/').filter(x => x)];

  return (
    <nav className="breadcrumbs">
      <ol className="breadcrumbs-list">
        {pathnames.map((name, index) => {
          // set the path of the first breadcrumb to '/' as that is always home given the upper thing
          // reconstruct the path for the other breadcrumbs by slicing the pathnames array up to the current index and joining it with '/'
          const routeTo = index === 0
            ? '/'
            : `/${pathnames.slice(1, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return (
            <li key={`${name}-${index}`} className="breadcrumbs-item">
              {isLast ? (
                <span className="crumb-label">{name}</span>
              ) : (
                <div>
                <Link className="crumb-label" to={routeTo}>{name}</Link>
                <span className="separator">
                  &gt;
                </span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};