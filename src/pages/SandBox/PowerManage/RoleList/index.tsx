import React, { useState, useEffect, Fragment, Key } from 'react'
import { message, Table, Button, Modal, Tree } from 'antd';
import { DeleteTwoTone, ProfileTwoTone, ExclamationCircleOutlined } from "@ant-design/icons"
import axios from '../../../../axiosModel';
const { confirm } = Modal
interface IRightData {
    id: number;
    title: string;
    key: string;
    children: IRightData[];
    grade: number;
    rightId: number;
    pagepermisson: number;
}
interface IRoleData {
    id: number;
    roleType: string;
    roleName: string;
    rights: string[];
}
export default function RoleList() {
    const [RoleData, setRoleData] = useState<IRoleData[]>([])
    const [ModelVisible, setModelVisible] = useState<boolean>(false)
    const [RightData, setRightData] = useState<IRightData[]>([])
    const [currentRights, setcurrentRights] = useState<string[] | { checked: string[], halfChecked: string[] }>([])
    const [currentId, setCurrentId] = useState(0)
    const deleteHandle = (item: IRoleData) => {
        confirm({
            title: '角色删除',
            icon: <ExclamationCircleOutlined />,
            content: '确定删除该角色吗？',
            onOk() {
                setRoleData(RoleData.filter(children => {
                    return children.id !== item.id;
                }))
                // axios.delete(`roles/${item.id}`).then(res => {
                //     if (res.status !== 200) return message.error("删除失败！")
                //     message.success("删除成功！")
                // })
            }
        });
    }
    const HandleRight = () => {
        setRoleData(RoleData.map(child => {
            if (child.id === currentId) {
                child.rights = [...currentRights as string[]]
                return child;
            } else {
                return child;
            }
        }))
        axios.patch(`roles/${currentId}`, {
            rights: currentRights
        })
        setModelVisible(false);
    }
    const onCheck = (checkedKeys: Key[] | {
        checked: Key[];
        halfChecked: Key[];
    }, info: any) => {
        setcurrentRights((checkedKeys as { checked: string[], halfChecked: string[] }).checked)

    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id: string) => {
                return <b>{id}</b>
            },
            width: '12%',
        },
        {
            title: '权限名称',
            dataIndex: 'roleName',
            width: '12%',
        },
        {
            title: '操作',
            width: '30%',
            render: (item: IRoleData) => {
                return <div>
                    <Button shape="circle" icon={<DeleteTwoTone />} onClick={() => deleteHandle(item)}></Button>
                    <Button shape="circle" icon={<ProfileTwoTone />} onClick={() => { setModelVisible(true); setcurrentRights(item.rights); setCurrentId(item.id) }}></Button>
                </div >
            }
        },
    ];
    useEffect(() => {
        axios.get("roles").then(res => {
            if (res.status !== 200) return message.error("获取权限数据失败！")
            setRoleData(res.data)
            // let powerlist: Idata[] = res.data;
        })

        axios.get("rights?_embed=children").then(res => {
            if (res.status !== 200) return message.error("获取权限数据失败！")
            setRightData(res.data)

        })
    }, [])
    return (
        <Fragment><Table
            columns={columns}
            dataSource={RoleData}
            rowKey={'id'}
            pagination={{
                pageSize: 5
            }}
        />
            <Modal title="Basic Modal" visible={ModelVisible} onCancel={() => setModelVisible(false)} onOk={() => HandleRight()}>
                <Tree
                    checkable
                    // onSelect={onSelect}
                    onCheck={onCheck}
                    checkedKeys={currentRights}
                    treeData={RightData}
                    checkStrictly={true}
                />
            </Modal>
        </Fragment >


    )
}
