import { navLinks } from "../const/consts"

export default function Nav() {
  const links = navLinks;
  
  const url = window.location.pathname;
    

  return(
    <nav>
      <ul className="nav nav-tabs">
        {
          links.map((link, index) => {
            return(
              <li className="nav-item" key={index}>
                <a className={`nav-link ${url === link.link ? "active" : ""}`} href={link.link}>{link.name}</a>
              </li>
            )
          })
        }
        {/* <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a>
          <div className="dropdown-menu">
            <a className="dropdown-item" href="#tab2Id">Action</a>
            <a className="dropdown-item" href="#tab3Id">Another action</a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="#tab4Id">Action</a>
          </div>
        </li> */}
      </ul>
    </nav>
  )
};
