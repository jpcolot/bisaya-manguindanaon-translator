import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Container 
} from 'reactstrap';
import { useStateValue } from '../context/StateProvider'
import {  Avatar, message } from 'antd'
import {
  UserOutlined,
  CaretDownOutlined,
  ExportOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import { db, auth } from '../config/firebase'
import './Main.css'

function Navigation(args) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, dispatch] = useStateValue();

  const toggle = () => setIsOpen(!isOpen);

  const logOut = () => {
    auth.signOut().then(() => {
        message.success("You are now log out!")
    })
    // triggerDrowndown()
}

console.log(args.showModal)

  return (
    <div>
      <Navbar {...args}>
        <div style={{display:"flex", justifyContent:"space-between", width:"100vw", paddingRight:"3rem"}}>
        <NavbarBrand href="/" className='appname'>Bisaya to Maguindanaon Language Translator</NavbarBrand>

        <NavbarToggler onClick={toggle} style={{marginLeft:"-150px"}} />
        </div>

        <Collapse isOpen={isOpen} navbar>

          <Nav className="me-auto" navbar style={{backgroundColor:"rgba(255,255,255,10)", padding:"10px"}}>

          
          {state.user !== null ? 
            <>
              <NavItem>
                <li style={{display:"flex"}}>
                  <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf'}}>A</Avatar> <p style={{marginLeft:"20px", cursor:"pointer"}}>{state.user.email}</p>  
                </li>
              </NavItem>
              <NavItem>
                <li> <AppstoreOutlined className='menu-icon' /> <Link to="/manage">Manage Data</Link>  </li>
              </NavItem>
              <NavItem>
              <li onClick={logOut} style={{cursor:"pointer"}}>
                <ExportOutlined className='menu-icon signout' />  Sign out</li>
              </NavItem>
            </>
              :
               <NavItem onClick={args.showModal} >
                <li style={{display:"flex"}}>
                 <UserOutlined /> <p style={{marginLeft:"20px", cursor:"pointer"}}>Login</p> 
               </li>
               </NavItem>
         }

           



            

            

           
          

          </Nav>

        

        </Collapse>
      </Navbar>
    </div>
  );
}

export default Navigation;