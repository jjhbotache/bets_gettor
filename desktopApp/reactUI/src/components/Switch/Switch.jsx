import { SwitchContainer } from "./SwitchStyledComponents";

export default function Switch({id, checked, onChange}) {
  
  return(
    <SwitchContainer>
      <input type="checkbox" id={id} className="switch" checked={checked} onChange={onChange} />
      <label htmlFor={id} className="label"> <span className="slider"></span> </label>
    </SwitchContainer>
  )
};
