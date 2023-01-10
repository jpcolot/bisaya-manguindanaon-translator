import React, { useState } from 'react'
import './Main.css'
import {
    UserOutlined,
    FundOutlined,
    BankOutlined,
    UnlockOutlined,
    CaretDownOutlined,
    PlusOutlined,
    SettingOutlined,
    ExportOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import { Modal, Input, message, Avatar } from 'antd'
import { db, auth } from '../config/firebase'
import { useStateValue } from '../context/StateProvider'
import { Link } from "react-router-dom";
import Navigation from './Navigation';




function Main() {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [state, dispatch] = useStateValue();
    const [isExpanded, setIsExpanded] = useState(false)
    const [showAddNewSchool, setShowAddNewSchool] = useState(false)


    const emailHandler = (e) => {
        e.preventDefault();
        setEmail(e.target.value);
    };

    const passwordHandler = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
    };


    const showModal = () => {
        setOpen(true);
    };


    const resetInputs = () => {
        setEmail('')
        setPassword('')
    }

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
        resetInputs()
    };


    const logIn = (e) => {
        e.preventDefault()
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    message.success("You are now logged in!")
                })
                .catch((error) => {
                    message.error("Incorrect Username/Password!")
                });
        }, 2000);
        resetInputs()
    }


    const logOut = () => {
        auth.signOut().then(() => {
            message.success("You are now log out!")
        })
        triggerDrowndown()
    }

    const triggerDrowndown = () => {
        setIsExpanded(!isExpanded)
    }






    return (
        <div className='Main'>
            <Navigation showModal={showModal} />
            {/* <nav className='main-nav'>
                <ul>
                    <li>
                        <Link to="/" style={{ color: "floralwhite" }} className="nav-appname">  Bisaya to Maguindanaon Language Translator</Link>
                    </li>
                </ul>
                <ul>
                    {state.user !== null ? <li onClick={triggerDrowndown} className='li-login'>
                    <div className='nav-link'>  <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf', marginLeft: "-90px" }}>A</Avatar> <p>{state.user.email}</p> <CaretDownOutlined /> </div>
                       
                    </li> : <li onClick={showModal}>
                        <div className='nav-link'> <UserOutlined /> <p>Login</p> </div>
                    </li>}
                </ul>
            </nav> */}
            
            {/* <div className={isExpanded ? "dropdown-menu-container expanded" : "dropdown-menu-container"}>
                <nav className='dropdown-menu'>
                    <ul>
                        <li> <AppstoreOutlined className='menu-icon' /> <Link to="/manage">Manage Data</Link>  </li>
                   
                        <li onClick={logOut} ><ExportOutlined className='menu-icon signout' />  Sign out</li>
                    </ul>
                </nav>
            </div> */}

            <Modal
                title="Bisaya to Maguindanaon Language Translator"
                visible={open}
                onOk={logIn}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText="Login"
            >
                <h1 style={{ fontWeight: '300' }}> Admin Login </h1>
                <Input size="large" placeholder="Email" prefix={<UserOutlined />} value={email} onChange={(e) => emailHandler(e)} />
                <br /> <br />
                <Input.Password size="large" placeholder="Password" prefix={<UnlockOutlined />} value={password} onChange={(e) => passwordHandler(e)} />
            </Modal>
            <Modal visible={showAddNewSchool} onCancel={() => setShowAddNewSchool(!showAddNewSchool)} footer={null} title="Continue adding school?">
                <div className='add-new-school-container'>
                    <Link to='/add_school'>
                        <button className='btnAddSchool' onClick={() => setShowAddNewSchool(!showAddNewSchool)}>
                            <BankOutlined />
                            Add New Schools
                        </button>
                    </Link>

                </div>
            </Modal>
        </div>
    )
}

export default Main