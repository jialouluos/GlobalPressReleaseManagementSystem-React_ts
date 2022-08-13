import React, { useState, useEffect } from 'react'
import { message, Table, Button, Tag, Modal, Popover, Switch } from 'antd';
import { DeleteTwoTone, EditTwoTone, ExclamationCircleOutlined } from "@ant-design/icons"
import axios from '../../../../axiosModel';
import style from "./index.module.scss"
import { Role } from '../../index'
interface IProps extends Role { }
const Color = ["warning", "error", 'success']

const { confirm } = Modal;
interface Idata {
    id: number;
    title: string;
    key: string;
    children: Idata[] | "";
    grade: number;
    rightId: number;
    pagepermisson: number;
}


export default function PowerList(props: IProps) {
    const [Data, setData] = useState<Idata[]>([])
    // const [Role, setRole] = useRole();
    const [Role, setRole] = props.content;
    const deleteHandle = (item: Idata) => {
        confirm({
            title: '权限删除',
            icon: <ExclamationCircleOutlined />,
            content: '确定删除该权限吗？',
            onOk() {
                if (item.grade !== 1) {
                    setData(Data.map(child => {
                        if (child.id === item.rightId) {
                            child.children = (child.children as Idata[]).filter(c => {
                                return c.id !== item.id;
                            })
                        }
                        return child
                    }))
                    Role.role.rights = Role.role.rights.filter((e: any) => {
                        return !e.includes(item.key)
                    })
                    const User: { id: number, role: { id: number, rights: string[], roleName: string; } } = JSON.parse((window.sessionStorage.getItem("menu") as string))
                    User.role = Role.role;
                    window.sessionStorage.setItem('menu', JSON.stringify(User))
                    setRole({ ...Role })
                    axios.patch(`roles/${Role.role.id}`, {
                        rights: Role.role.rights
                    })
                    axios.delete(`children/${item.id}`).then(res => {
                        if (res.status !== 200) return message.error("删除失败！")
                        message.success("删除成功！")
                    })
                } else {
                    setData(Data.filter(child => {
                        return child.id !== item.id;
                    })
                    )
                    Role.role.rights = Role.role.rights.filter((e: any) => {
                        return !e.includes(item.key)
                    })
                    const User: { id: number, role: { id: number, rights: string[], roleName: string; } } = JSON.parse((window.sessionStorage.getItem("menu") as string))
                    User.role = Role.role;
                    window.sessionStorage.setItem('menu', JSON.stringify(User))
                    setRole({ ...Role })
                    axios.patch(`roles/${Role.role.id}`, {
                        rights: Role.role.rights
                    })
                    axios.delete(`rights/${item.id}`).then(res => {
                        if (res.status !== 200) return message.error("删除失败！")
                        message.success("删除成功！")
                    })
                }
            },
        });
    }
    const ChangeHandle = (item: Idata) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
        setData([...Data]);

        item.grade === 1 && axios.patch(`rights/${item.id}`, {
            pagepermisson: item.pagepermisson
        })
        item.grade === 2 && axios.patch(`children/${item.id}`, {
            pagepermisson: item.pagepermisson
        })
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
            dataIndex: 'title',
            width: '12%',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            width: '30%',
            render: (key: string) => {
                return <Tag color={Color[Math.floor(Math.random() * 3)]}>{key}</Tag>
            }
        },
        {
            title: '操作',
            width: '30%',
            render: (item: Idata) => {
                return <div className={style['ant-popover-title']}>
                    <Button shape="circle" icon={<DeleteTwoTone />} onClick={() => deleteHandle(item)}></Button>
                    <Popover content={<div style={{ textAlign: "center" }} >
                        <Switch checked={!!item.pagepermisson} onChange={() => ChangeHandle(item)} ></Switch>
                    </div>} title="权限开关" trigger={item.pagepermisson === undefined ? '' : 'click'} style={{ textAlign: "center" }}><Button shape="circle" icon={<EditTwoTone />} disabled={item.pagepermisson === undefined}></Button></Popover>
                </div>
            }
        },
    ];

    useEffect(() => {
        axios.get("rights?_embed=children").then(res => {
            if (res.status !== 200) return message.error("获取权限数据失败！")
            let powerlist: Idata[] = res.data;
            setData(powerlist.map(child => {
                if (child.children.length === 0) {
                    child.children = '';
                }
                return child
            }))
        })
    }, [])

    return (
        <Table
            columns={columns}
            dataSource={Data}
            pagination={{
                pageSize: 5
            }}
        />

    )
}
