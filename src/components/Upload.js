import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Progress } from 'antd';
import React, { useState } from 'react';
import { db, storage } from "../config/firebase"
import {
    ref,
    uploadBytesResumable,
    getDownloadURL
} from "firebase/storage";


const UploadComponent = (props) => {
    // State to store uploaded file
    const [file, setFile] = useState("");
    // progress
    const [percent, setPercent] = useState(0);
    const [isUploading, setIsuploading] = useState(false)
    const [filename, setFilename] = useState(false)
    const { Dragger } = Upload;


    // const props = {
    //     name: 'file',
    //     multiple: true,
    //     action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    //     onChange(info) {
    //         const { status } = info.file;

    //         if (status !== 'uploading') {
    //             console.log(info.file, info.fileList);
    //         }

    //         if (status === 'done') {
    //             message.success(`${info.file.name} file uploaded successfully.`);
    //         } else if (status === 'error') {
    //             message.error(`${info.file.name} file upload failed.`);
    //         }
    //     },

    //     onDrop(e) {
    //         console.log('Dropped files', e.dataTransfer.files);
    //     },
    // };

    const uploadFunc = ({ file, onSuccess }) => {
        if (!file) {
            message.error("Select audio file")
        }

        setFilename(file.name)
        const storageRef = ref(storage, `/files/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                setIsuploading(true)
                // update progress
                setPercent(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    // console.log(url);
                    props.setFileUrl(url)
                });
            }
        );
    }


    return (
        <Dragger customRequest={uploadFunc} showUploadList={false}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                band files
            </p>
            {isUploading && <p>{filename} </p>}
            {isUploading && <Progress percent={percent} size="small" />}

        </Dragger>
    )
}





export default UploadComponent;