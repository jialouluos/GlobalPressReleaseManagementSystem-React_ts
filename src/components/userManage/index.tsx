import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd';
import { FormInstance } from 'antd/lib/form/hooks/useForm';
interface IRegionData {
    id: number;
    title: string;
    value: string;
}
interface IRolesData {
    id: number,
    roleName: string,
    roleType: number,
    rights: string[]
}
interface Iprops {
    RegionData: IRegionData[],
    RolesData: IRolesData[],
    isUpdateDisable?: boolean,
    Role: {
        region: string;
        roleId: number;
        role: {
            rights: string[];
            roleName: string;
            id: number;
        };
    }
}
const UserManage = forwardRef((props: Iprops, ref: React.Ref<FormInstance>) => {
    const { RegionData, RolesData, Role } = props;
    const [Disable, setDisable] = useState(false)
    useEffect(() => {
        setDisable(!!props.isUpdateDisable)
    }, [props.isUpdateDisable])
    return (
        <Form
            name="adduser"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 26 }}
            autoComplete="off"
            layout='vertical'
            ref={ref}
        >
            <Form.Item
                label="用户名"
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
            <Form.Item name="region" label="区域" rules={[{
                required: !Disable, message: '请选择一个区域！'
            }]} >
                <Select disabled={Disable}>
                    {RegionData.map((child) => {
                        return <Select.Option value={child.value} key={child.id} disabled={Role.region !== "" && Role.region !== child.title}>{child.title}</Select.Option>
                    })}
                </Select>
            </Form.Item>
            <Form.Item name="roleId" label="角色" rules={[{ required: true, message: '请选择一个角色！' }]}>
                <Select onChange={(e) => {
                    e === 1 && setDisable(true); e === 1 && (ref as React.RefObject<FormInstance<any>>)!.current!.setFieldsValue(
                        { region: "" }
                    ); e !== 1 && setDisable(false);
                }}>
                    {RolesData.map((child) => {
                        return <Select.Option value={child.id} key={child.id} disabled={Role.roleId > child.roleType}>{child.roleName}</Select.Option>
                    })}
                </Select>
            </Form.Item>
        </Form>
    )
})
export default UserManage;