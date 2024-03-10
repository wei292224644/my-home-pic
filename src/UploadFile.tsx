import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import axios from 'axios';
import { PhotoList } from './pages/phtoto-list';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const App: React.FC = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleUpload = () => {
        const formData = new FormData();
        fileList.forEach((file) => {

            console.log(file);
            formData.append('files[]', file as FileType);
            formData.append('lastModified', file.lastModified + "");
        });

        setUploading(true);
        // You can use any AJAX library you like
        axios.post('http://localhost:8080/photo/upload', formData, {
            onUploadProgress: progressEvent => {
                console.log(progressEvent.loaded / progressEvent.total! * 100 | 0)
            },
        }).then(({ data }) => {
            for (let i = 0; i < fileList.length; i++) {
                const { cacheFileId, cacheFilename } = data.data[i];
                const file = fileList[i];
                const type = file.type?.startsWith("image") ? "Image" : "Video";

                axios.post("http://localhost:8080/photo", {
                    cacheFileId, cacheFilename,
                    type: type,
                    filename: file.name,
                    date: file.lastModified
                })
            }
            // setFileList([]);
            message.success('upload successfully.');
        })
            .catch(() => {
                message.error('upload failed.');
            })
            .finally(() => {
                setUploading(false);
            });
    };

    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file, fl) => {
            setFileList([...fileList, ...fl]);

            return false;
        },
        multiple: true,
        fileList,
    };

    return (
        <>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
            <Button
                type="primary"
                onClick={handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}
            >
                {uploading ? 'Uploading' : 'Start Upload'}
            </Button>

            <PhotoList />
        </>
    );
};

export default App;