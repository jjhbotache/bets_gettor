import { Link, useNavigate } from "react-router-dom";
import { navLinks } from "../../const/consts"
import { NavStyledContainer, StyledLink } from "./NavStyledComponents";


export default function Nav() {
  const links = navLinks;
  const url = window.location.pathname;
    
  const navigate = useNavigate();

  const handleLinkClick = (link) => {
    navigate(link);
  }

  return(
    <NavStyledContainer>
      <ul className="tabs-container">
        {
          links.map((link, index) => {
            return(
              <li className="tab" key={index} onClick={() => handleLinkClick(link.link)}>
                {/* <Link className={`nav-link ${url === link.link ? "active" : ""}`} to={link.link}>{link.name}</Link> */}
                <StyledLink to={link.link} $active={url === link.link}>{link.name}</StyledLink>
              </li>
            )
          })
        }
      </ul>
    </NavStyledContainer>
  )
};
