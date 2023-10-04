import React, { useState } from "react";
import styles from "./CustomNav.module.css"; // Importa los estilos CSS

const Sidebar = ({ li , value, onChange }) => {
  const [window, setWindow] = useState(true);

  let openClose = () => {
    if (window === false) {
      setWindow(true);
    } else {
      setWindow(false);
    }
  };



  return (
    <nav
      className={styles["navbar-menu"]} // Aplica estilos desde el objeto de estilos
      style={{ width: window === false ? "25vw" : 60 , height: "90vh"}}
    >
      <div className={styles.burger} onClick={() => openClose()}>
        <i className="fi fi-br-menu-dots-vertical m-2"></i>
      </div>

      <ul className={styles.navbar__list}>
        {li.map((item, i) => (
          <div className={styles.navbar__li_box + " d-flex align-items-center " + (li.indexOf(item) == value?" border-start ":"" ) } key={i} 
          onClick={()=>onChange(i)}>
            <div className="ps-1"> 
              {item[1] && item[1]}
            </div>
            <h6
              className={styles.navbar__li} // Aplica estilos desde el objeto de estilos
              style={{ display: window === false ? "inline-block" : "none" }}
            >
              {item[0]}
            </h6>
          </div>
        ))}

      </ul>
    </nav>
  );
};

export default Sidebar;
