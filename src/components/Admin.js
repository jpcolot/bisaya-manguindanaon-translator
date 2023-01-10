import { Space,  Modal, Button, Form, Input, Upload,  message, Table } from 'antd';
import React, { useState, useEffect } from 'react';
import "./Admin.css"
import { HiPlus } from "react-icons/hi";
import UploadComponent from "./Upload"
import { db } from "../config/firebase"
import { useStateValue } from '../context/StateProvider';
import { HiPlay } from "react-icons/hi";
import ReactAudioPlayer from 'react-audio-player';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, Switch, Popconfirm, Tabs   } from 'antd';
import {getFirestore, doc, deleteDoc} from "firebase/firestore";
import {
    Container,
  } from 'reactstrap';




function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}


const items = new Array(3).fill(null).map((_, i) => {
    const id = String(i + 1);
    return {
      label: `Tab Title ${id}`,
      key: id,
      children: (
        <>
          <p>Content of Tab Pane {id}</p>
          <p>Content of Tab Pane {id}</p>
          <p>Content of Tab Pane {id}</p>
        </>
      ),
    };
  });



const Admin = () => {
    const [state, dispatch] = useStateValue()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
    const [fileUrl, setFileUrl] = useState(null)
    const [words, setWords] = useState(null)
    const [mappedwords, setmappedWords] = useState(null)
    const [suggestedWords, setSuggestedWords] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [ deleteSuccess, setDeleteSuccess ] = useState(false)
    const [ mode, setMode ] = useState("words")
    const [ idtobedelted, setidtobedeleted] = useState(null)
    const [theme, setTheme] = useState('dark');
    const [current, setCurrent] = useState('1');


    const changeTheme = (value) => {
      setTheme(value ? 'dark' : 'light');
    };


    const onClick = (e) => {
      console.log('click ', e);
      setCurrent(e.key);
    };



    // useEffect fetch all data
    useEffect(() => {
        const getAllData = async () => {
            const events = await db.collection('WORD')
            events.get().then((querySnapshot) => {
                const tempDoc = []
                querySnapshot.forEach((doc) => {

                    tempDoc.push({
                        id: doc.id, ...doc.data()
                    })
                })
                setWords(tempDoc)

            })
        }
        getAllData()
    }, [state, dispatch, deleteSuccess])


       // useEffect fetch all suggested words
       useEffect(() => {
        const getAllData = async () => {
            const events = await db.collection('SUGGESTION')
            events.get().then((querySnapshot) => {
                const tempDoc = []
                querySnapshot.forEach((doc) => {

                    tempDoc.push({
                        id: doc.id, ...doc.data()
                    })
                })
                setSuggestedWords(tempDoc)

            })
        }
        getAllData()
    }, [state, dispatch, deleteSuccess])

    


    useEffect(() => {
        if (!words) return;

        const mappedData = async () => {
            const temp = []
            words.forEach((word) => {
                temp.push({
                    id: word.id,
                    bisaya: word.bisayan,
                    maguindanao: word.maguindanao,
                    audio: word.audio
                })
            })
            setmappedWords(temp)
            setIsLoading(false)
        }
        mappedData()
    }, [words, deleteSuccess])







    const refreshPage = ()=>{
        window.location.reload();
     }

    const showModal = () => {
        setIsModalOpen(true);
        setMode("words")
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };




    const deleteFunc = async (rec) => {
        console.log(rec)
        var jobskill_query = db.collection('WORD').where('id','==',rec.id);
  
        const res = await db.collection('WORD').doc(rec.id).delete();
        refreshPage()
    } 


    const deleteFuncSuggested = async (rec) => {
        const res = await db.collection('SUGGESTION').doc(rec.id).delete();
        refreshPage()
    } 

    const deleteFuncSuggestedSecond = async (id) => {
        const res = await db.collection('SUGGESTION').doc(id).delete();
        refreshPage()
    } 


    const addSuggestedWord = (record) => {
        setidtobedeleted(record.id)
        setIsSuggestionModalOpen(true);
        console.log(record)
    }


    const columnSuggested = [
        {
            title: "Suggested Word/Phrase",
            dataIndex: 'suggestedWord',
            key:"suggestedWord"
        },
        {
            title: '',
            key: 'delete',
            render: (_, record) => (
                <Space size="middle">
                         <Button onClick={() => addSuggestedWord(record)} type="primary" >  Add Translation  </Button>
                   <Popconfirm title="Are you sure？" okText="Yes" cancelText="No"  onConfirm={() => deleteFuncSuggested(record)}>
                         <a href="#"><Button  type="primary" danger >  Delete  </Button></a>
                    </Popconfirm>
                </Space>
            ),
        },

    ]

    const columns = [
        {
            title: 'Bisayan Word/Phrase',
            dataIndex: 'bisaya',
            key: 'bisaya',
            render: (text) => <a>{text}</a>,
            showOnResponse: true,
            showOnDesktop: true
        },
        {
            title: 'Maguindanao Word/Phrase',
            dataIndex: 'maguindanao',
            key: 'maguindanao',
            showOnResponse: true,
            showOnDesktop: true
        },
        {
            title: 'Audio Pronunciation Guide',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <ReactAudioPlayer
                        src={record.audio}
                        autoPlay={false}
                        controls
                    />
                    {/* <Button className='btn_play' onClick={showAudioPlayer}> <HiPlay /> Play Audio </Button> */}
                </Space>
            ),
            showOnResponse: true,
            showOnDesktop: true
        },
        {
            title: '',
            key: 'delete',
            render: (_, record) => (
                <Space size="middle">
                   <Popconfirm title="Are you sure？" okText="Yes" cancelText="No"  onConfirm={() => deleteFunc(record)}>
                         <a href="#"><Button  type="primary" danger >  Delete  </Button></a>
                    </Popconfirm>
                    
                </Space>
            ),
            showOnDesktop: true
            
        },
    ];



    const onFinish = (values) => {
        if (fileUrl === null) {
            message.error("Please wait for the audio to finish uploading!")
        } else {
            try {
                const data = {
                    bisayan: values.bisaya,
                    maguindanao: values.maguindanao,
                    audio: fileUrl
                }
                // SAVE DATA to DATABASE
                db.collection('WORD').doc().set(data).then(() => {
                    message.success("New word/phrase added!")
                    handleCancel()
                    refreshPage()
                })
            } catch (e) {
                console.log(e)
            }
        }
    };
    console.log(idtobedelted)

    const onFinishSuggestedWord = (values) => {
        console.log(values)
        if (fileUrl === null) {
            message.error("Please wait for the audio to finish uploading!")
        } else {
            try {
                const data = {
                    bisayan: values.bisaya,
                    maguindanao: values.maguindanao,
                    audio: fileUrl
                }
                // SAVE DATA to DATABASE
                db.collection('WORD').doc().set(data).then(() => {
                    message.success("New word/phrase added!")
                    deleteFuncSuggestedSecond(idtobedelted)
                    handleCancel()
                    refreshPage()
                })
            } catch (e) {
                console.log(e)
            }
            setidtobedeleted(null)
        }
    };





    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    const showSuggestedWords = () => {
        setMode("suggestedWords")
    }

    console.log(mappedwords)

    return (
        <>  
          <Container
                className="bg-light border"
                fluid="sm"
            >
            <Modal title="Add new word/phrase" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >


                 

                    <Form.Item
                        label="Bisaya"
                        name="bisaya"
                        rules={[
                            {
                                required: true,
                                message: 'Please input bisayan word/phrase!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Maguindanaon"
                        name="maguindanao"
                        rules={[
                            {
                                required: true,
                                message: 'Please input maguindanao word!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Audio Guide"
                    >
                        <UploadComponent setFileUrl={setFileUrl} />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>



            {/* suggestion modal */}
            <Modal title="Add new word/phrase" visible={isSuggestionModalOpen} onOk={handleOk} onCancel={() => setIsSuggestionModalOpen(false)} footer={null}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinishSuggestedWord}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >

                    <Form.Item
                        label="Bisaya"
                        name="bisaya"
                        rules={[
                            {
                                required: true,
                                message: 'Please input bisaya word/phrase!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Maguindanaon"
                        name="maguindanao"
                        rules={[
                            {
                                required: true,
                                message: 'Please input maguindanaon word/phrase!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Audio Pronunciation Guide"
                    >
                        <UploadComponent setFileUrl={setFileUrl} />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <div className='Admin'>
                <h2 style={{fontSize: 15, color:"white", marginTop: "5rem"}}> Dashboard </h2>
                {/* <div className="card-container">
                    <Tabs type="card" items={items} />
                </div> */}

                <Container
                className="bg-light border"
                fluid="sm"
                    >
                <Button className='btn-add' onClick={() => setMode("words")}>   Words/Phrases  </Button>
                <Button className='btn-add' onClick={showModal}>   Add new word/phrase  <HiPlus /> </Button>
                <Button className='btn-add' onClick={showSuggestedWords}>   Suggested Words/Phrases  </Button>
                 </Container>

               
                { mode === "words" ? <> {!isLoading && <Table columns={columns} dataSource={mappedwords} mobileBreakPoint={375}  scroll={{ x: "60vw", y: 580 }}  />} </>  : 
                                     <> {!isLoading &&  <Table columns={columnSuggested} dataSource={suggestedWords} mobileBreakPoint={375}  scroll={{ x: "60vw", y: 580 }}  /> } </>
                 }

            {/* <Table responsive>
  <thead >
    <tr>
      <th>
        #
      </th>
      <th className='table_header'>
        Maguindanao Word/ Phrase
      </th>
      <th className='table_header'>
        Bisayan Word/ Phrase
      </th>
      <th className='table_header'>
        Audio
      </th>
      <th className='table_header'>
        Action
      </th>
    </tr>
  </thead>
  <tbody>
    {mappedwords?.map((word, index) => (
         <tr>
         <th scope="row">
           {index + 1}
         </th>
         <td className='table_bootstrap'>
           {word.maguindanao}
         </td>
         <td className='table_bootstrap'>
           {word.bisaya}
         </td>
         <td>
         <ReactAudioPlayer
                        src={word.audio}
                        autoPlay={false}
                        controls
                        width="100px"
                        className='music_player'
                    /> 
         </td>
         <td>
         <Space size="middle">
                   <Popconfirm title="Are you sure？" okText="Yes" cancelText="No"  onConfirm={() => deleteFunc(word)}>
                         <a href="#"><Button  type="primary" danger className='delete_button' >  Delete  </Button></a>
                    </Popconfirm>
                    
                </Space>
         </td>
       </tr>
      ))}
  </tbody>
            </Table> */}

            </div>
          
            </Container>
        </>

    )
};

export default Admin;