import React, { useEffect, useState, Fragment } from 'react'
import { Table } from 'antd'
import { Role } from '../../index'
import axios from '../../../../axiosModel'
import { Link } from 'react-router-dom'
import { message, Button } from 'antd';
interface IProps extends Role { }
interface ICheckAuditData {
    auditState: number
    author: string
    category?: { id: number, title: string, value: string }
    categoryId?: number
    content: string
    createTime: number
    id: number
    publishState: number
    publishTime: number
    region: string
    roleId: number
    star: number
    title: string
    view: number
}
export default function Audit(props: IProps) {
    const [Role] = props.content;
    const [CheckAuditData, setCheckAuditData] = useState<ICheckAuditData[]>([]);
    useEffect(() => {
        axios.get(`news?roleId_gte=${Role.roleId}&auditState=1&_expand=category`).then(res => {
            if (res.status !== 200) message.error("获取数据失败！")
            if (Role.roleId === 1)
                setCheckAuditData(res.data)
            else {
                setCheckAuditData(res.data.filter((item: ICheckAuditData) => {
                    return item.region === Role.region;
                }))
            }
            console.log(res.data)
        })
    }, [Role.username, Role.roleId, Role.region])
    const columns = [
        {
            title: '标题新闻',
            dataIndex: 'title',
            render: (title: string, item: ICheckAuditData) => {
                return <Link to={`/sandbox/news-manage/preview/${item.id}`}>{title}</Link>
            },
            width: '12%',
        },
        {
            title: '作者',
            dataIndex: 'author',
            width: '12%',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            width: '12%',
            render: (category: { title: string }) => {
                return category.title;
            }
        },
        {
            title: '操作',
            width: '30%',
            render: (item: ICheckAuditData) => {
                return (
                    <div>
                        <Button type="primary" onClick={() => { handlerPass(item) }}>通过</Button>
                        <Button danger style={{ marginLeft: "5px" }} onClick={() => { handlerReject(item) }}>驳回</Button>
                    </div>
                )
            }
        },
    ];
    const handlerPass = (item: ICheckAuditData) => {
        axios.patch(`news/${item.id}`, {
            auditState: 2,
            publishState: 1
        }).then(res => {
            setCheckAuditData(CheckAuditData.filter(child => {
                return child.id !== item.id;
            }))
        })
    }
    const handlerReject = (item: ICheckAuditData) => {
        axios.patch(`news/${item.id}`, {
            auditState: 3,
            publishState: 0
        }).then(res => {
            setCheckAuditData(CheckAuditData.filter(child => {
                return child.id !== item.id;
            }))
        })
    }
    return (
        <Fragment><Table
            columns={columns}
            dataSource={CheckAuditData}
            rowKey={'id'}
            pagination={{
                pageSize: 5
            }}
        />
        </Fragment >
    )
}
