import React from 'react'
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosModel';
import style from './index.module.scss'
export default function Login() {
    const usenavigate = useNavigate();
    const onFinish = (values: any) => {
        const { username, password } = values;
        axios.get(`users?username=${username}&password=${password}&roleState=true&_expand=role`).then(res => {
            if (res.status !== 200) {
                message.error("验证失败!")
                return;
            }
            const { data } = res;
            if (data.length === 0) {
                message.error("账号或密码错误!")
                return;
            } else {
                window.sessionStorage.setItem("menu", JSON.stringify(data[0]));
                usenavigate('/sandbox')
                message.success(`欢迎您！${data[0].username}(${data[0].role.roleName})`)
            }


        })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            name="login"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 12 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className={style.login_form}
        >
            <div className={style.title}>
                浩文信息管理系统
            </div>
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: '检查你的用户名,并且保证在2到16个字符之间', max: 16, min: 2, type: 'string' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: '检查你的密码,并且保证在2到16个字符之间', max: 16, min: 2, type: 'string' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    登录
                </Button>
            </Form.Item>
        </Form>
    )
}
