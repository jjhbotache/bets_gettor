import React, { useState } from "react";
import { SidebarStyledContainer, StyledItem } from "./SidebarStyledComponents";

const Sidebar = ({ li , value, onChange }) => {
  const [window, setWindow] = useState(true);

  function toggleWindow (){
    setWindow(!window)
  };

  return (
    <SidebarStyledContainer $window={window}>
      <div className="burger" onClick={toggleWindow}> <i className="fi fi-br-menu-dots-vertical m-2"></i> </div>

      <ul className="items-container">
        {li.map((item,i) => (
          <StyledItem onClick={()=>onChange(i)} $border={li.indexOf(item) == value} key={item.label}>
            <div> {item.icon} </div>
            {!window && <h6 >{item.label}</h6>}
          </StyledItem>
        ))}
      </ul>
    </SidebarStyledContainer>
  );
};

export default Sidebar;
