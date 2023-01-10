import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Space, Select, } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './AddSchool.css'
import { db } from '../config/firebase'
import { useGeolocated } from "react-geolocated";
import { useStateValue } from '../context/StateProvider';

const { Option } = Select;

function AddSchool() {
    const [state, dispatch] = useStateValue()
    const [acoords, setCoords] = useState({})
    const [aisGeolocationAvailable, setisGeolocationAvailable] = useState()
    const [aisGeolocationEnabled, setisGeolocationEnabled] = useState()

    console.log(state.user)

    const onFinish = (values) => {

        const data = {
            latitude: values.latitude,
            longitude: values.longitude,
            school_address: values.school_address,
            school_id: values.school_id,
            school_name: values.school_name,
            school_principal: values.school_principal,
            strands: values.strands
        }
        db.collection('SCHOOLS').doc(state.user.uid).set(data)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

    console.log(coords)


    useEffect(() => {
        try {
            // console.log(coords)
            setCoords({ latitude: coords.latitude, longitude: coords.longitude })
        } catch (e) {
            console.log(e)
        }
    }, [])

    console.log(acoords)







    return (
        <div className='AddSchool'>
            <h1>Add New School</h1>
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
                    label="School ID"
                    name="school_id"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your school ID!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="School Name"
                    name="school_name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your school name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>



                <Form.Item
                    label="School Address"
                    name="school_address"
                    rules={[
                        {
                            required: true,
                            message: 'Please input address!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>



                <Form.Item
                    label="School Principal"
                    name="school_principal"
                    rules={[
                        {
                            required: true,
                            message: 'Please input principal name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>


                <Form.Item
                    label="Strands"
                >

                    <Form.List name="strands">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space
                                        key={key}
                                        style={{
                                            display: 'flex',
                                            marginBottom: 8,
                                        }}
                                        align="baseline"
                                    >
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'strand']}

                                        >
                                            <Select placeholder="Select Strands" style={{ width: '400px' }}>
                                                <Option value="ABM">Accountancy, Business and Management (ABM) Strand </Option>
                                                <Option value="STEM"> Science, Technology, Engineering, and Mathematics (STEM) Strand</Option>
                                                <Option value="HUMSS"> Humanities and Social Science (HUMSS) Strand</Option>
                                                <Option value="GAS"> General Academic Strand (GAS) </Option>
                                                <Option value="AFA">  Agri-Fishery Arts</Option>
                                                <Option value="HE"> Home Economics (HE)</Option>
                                                <Option value="ICT"> Information and Communication Technology (ICT) </Option>
                                                <Option value="IA">  Industrial Arts </Option>
                                                <Option value="ADT">  Arts and Design Track </Option>
                                                <Option value="ST">  Sports Track </Option>
                                            </Select>
                                        </Form.Item>

                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Add field
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                </Form.Item>








                <Form.Item
                    // label={<><button onClick={getMyLocation}> Get my location </button></>}
                    label="Current Coordinates"

                >

                    <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        {!isGeolocationAvailable ? (
                            <div>Your browser does not support Geolocation</div>
                        ) : !isGeolocationEnabled ? (
                            <div>Geolocation is not enabled</div>
                        ) : coords ? (
                            <>
                                <Form.Item
                                    name="latitude"
                                >
                                    <Input placeholder="Latitude" value={coords.latitude} />
                                </Form.Item>
                                <Form.Item
                                    name="longitude"


                                >
                                    <Input placeholder="Latitude" value={coords.longitude} />
                                </Form.Item>
                            </>
                        ) : (
                            <Form.Item>Getting the location data&hellip;  </Form.Item>
                        )}

                    </Space>
                </Form.Item>

                {/* <Form.Item
                    label="School Longitude"
                    name="longitude"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="School Latitude"
                    name="latitude"
                >
                    <Input />
                </Form.Item> */}



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

        </div>
    )
}

export default AddSchool