import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from "react-router-dom";const SuccessPage = (props) => {
    const {status, title, subTitle, path} = props
    const navigate = useNavigate();

    return(
    <>
    <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={[
            <Button type="primary" key="console" onClick={()=>navigate(path)}>
                Go Console
            </Button>
        ]}
    />
    </>)
}



export default SuccessPage;