import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Space, Table, Modal, Button, Form, Input, message, Select, Spin } from 'antd';
import "./Admin.css"
import UploadComponent from "./Upload"
import { db } from "../config/firebase"
import { useStateValue } from '../context/StateProvider';
import ReactAudioPlayer from 'react-audio-player';
import debounce from 'lodash/debounce';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import {
    Container
    
  } from 'reactstrap';
import "./View.css"

const { Search } = Input;








const View = () => {
    const [state, dispatch] = useStateValue()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileUrl, setFileUrl] = useState(null)
    const [words, setWords] = useState(null)
    const [mappedwords, setmappedWords] = useState(null)
    const [mappedwordsSearch, setmappedWordsSearch] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [ searchInput, setSearchInput ] = useState(null)
    const [ submitLoading, setSubmitLoading ] = useState(false)
    const [ selectedWord, setSelectedWord ] = useState(null)
    const [ showResult, setShowResult] = useState(false)



    // useEffect fetch all data
    useEffect(() => {
        const getAllWords = async () => {
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
        getAllWords()
    }, [state, dispatch])


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
    }, [words])



    // for search 
    useEffect(() => {
        if (!words) return;
        const mappedData = async () => {
            const temp = []
            words.forEach((word) => {
                temp.push({
                    id: word.id,
                    name: word.bisayan,
                    maguindanao: word.maguindanao,
                    bisayan: word.bisayan,
                    audio: word.audio
               
                })
            })
            setmappedWordsSearch(temp)
            setIsLoading(false)
        }
        mappedData()
    }, [words])


    console.log(words)

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    
    


    const columns = [
        {
            title: 'Bisaya Word/Phrase',
            dataIndex: 'bisaya',
            key: 'bisaya',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Maguindanaon Word/Phrase',
            dataIndex: 'maguindanao',
            key: 'maguindanao',
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
        },
    ];


    const columns2 = [
        {
            title: 'Bisaya Word/Phrase',
            dataIndex: 'bisayan',
            key: 'bisayan',
            render: (text) => <a>{text}</a>,
            
        },
        {
            title: 'Maguindanao Word/Phrase',
            dataIndex: 'maguindanao',
            key: 'maguindanao',
           
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

                // Add a new document in collection "cities" with ID 'LA'
                db.collection('WORD').doc().set(data).then(() => {
                    message.success("New word/phrase added!")
                    handleCancel()
                })

            } catch (e) {
                console.log(e)
            }
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };



  

    
      const handleOnSearch = (string, results) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.
        console.log(string, results)
        setSearchInput(string)
      }
    
      const handleOnHover = (result) => {
        // the item hovered
        console.log(result)
      }
    
      const handleOnSelect = (item) => {
       
        setSelectedWord({
            id: item.id,
            name: item.name,
            maguindanao: item.maguindanao,
            bisayan: item.bisayan,
            audio: item.audio
        })
        setShowResult(true)
      }
    
      const handleOnFocus = () => {
        
        setShowResult(false)
      }

      console.log(selectedWord)

    
      const formatResult = (item) => {
        return (
          <>
            {/* <span style={{ display: 'block', textAlign: 'left' }}>id: {item.id}</span> */}
            <span style={{ display: 'flex', justifyContent:"space-between", alignItems:"center",  textAlign: 'left' }}> {item.name} <ReactAudioPlayer
                        src={item.audio}
                        autoPlay={false}
                        controls
                    /></span>
          
          </>
        )
      }
    
   

      const suggestWord =() => {
        setSubmitLoading(true)

        setTimeout(() => {
            try {
                const data = {
                    suggestedWord: searchInput,
                    wordStatus: "pending"
                }

                // Add a new document in collection "cities" with ID 'LA'
                db.collection('SUGGESTION').doc().set(data).then(() => {
                    message.success("Word suggested successfully!")
                  
                })

            } catch (e) {
                console.log(e)
            }
            setSubmitLoading(false)
            // message.success("Word suggested successfully!")
        }, 2000)
      }

    

    return (
     
        <div className='View'>
            {/* <Modal title="Add new word" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
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
                        label="Bisayan Word"
                        name="bisaya"
                        rules={[
                            {
                                required: true,
                                message: 'Please input bisayan word!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Maguindanao Word"
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
                        label="Upload Audio"
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
            </Modal> */}
     

            <div className='Admin'>
             <div style={{ width: 350, marginTop: "100px", zIndex: -100 }}>
                    {!isLoading && <ReactSearchAutocomplete
                    items={mappedwordsSearch}
                    onSearch={handleOnSearch}
                    onHover={handleOnHover}
                    onSelect={handleOnSelect}
                    onFocus={handleOnFocus}
                    autoFocus
                    formatResult={formatResult}
                  
                    showNoResultsText={
                    <span  className="search" style={{width:"100px"}}>
                        { submitLoading === true ?  <> "No results"
                        <Button type="primary" size="small" loading onClick={suggestWord}>
                            Suggest this to add
                        </Button></>
                        :
                        <>
                        "No results"
                        <Button type="primary" size="small"  onClick={suggestWord}>
                            Suggest this to add
                        </Button>
                        </>
                        }
                    </span>}
                      />}
          
                </div>
          
                {/* {!isLoading && <Table columns={columns} dataSource={mappedwords} className="table" />} */}
                {/* {!isLoading && <Table columns={columns} dataSource={words} className="table" />} */}
                { showResult === true ? <Table 
                    columns={columns2} 
                    dataSource={[selectedWord]} 
                    className="table" 
                    scroll={{ x: "60vw", y: 580 }} 
                    /> : null
                }



       

            </div>
        </div>
       

    )
};

export default View;