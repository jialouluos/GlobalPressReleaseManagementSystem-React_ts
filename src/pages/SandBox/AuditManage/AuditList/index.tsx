import React, { useEffect, useState, Fragment } from 'react'
import { Table, Tag } from 'antd'
import { Role } from '../../index'
import axios from '../../../../axiosModel'
import { Link, useNavigate } from 'react-router-dom'
import { message, Button, notification } from 'antd';
import type { NotificationPlacement } from 'antd/lib/notification';
interface IProps extends Role { }
interface IAuditData {
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
const AuditState = [{ state: "草稿箱", control: "审核" }, { state: "审核中", control: "撤销" }, { state: "已通过", control: "发布" }, { state: "未通过", control: "修改" }]
const StateStyle = ["", "gold", "#87d068", "red"]
const publicState = ["未发布", "待发布", "已发布"];
export default function AuditList(props: IProps) {
    const [Role] = props.content;
    const [AuditData, setAuditData] = useState<IAuditData[]>([]);
    const navigate = useNavigate()
    useEffect(() => {
        axios.get(`news?author=${Role.username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            if (res.status !== 200) message.error("获取数据失败！")
            setAuditData(res.data)
            console.log(res.data)
        })
    }, [Role.username])
    const columns = [
        {
            title: '标题新闻',
            dataIndex: 'title',
            render: (title: string, item: IAuditData) => {
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
            title: '审核状态',
            dataIndex: 'auditState',
            width: '12%',
            render: (auditState: number) => {
                return <Tag color={StateStyle[auditState]}>{AuditState[auditState].state}</Tag>;
            }
        },
        {
            title: '发布状态',
            dataIndex: 'publishState',
            width: '12%',
            render: (publishState: number) => {
                return <Tag color={StateStyle[publishState]}>{publicState[publishState]}</Tag>;
            }
        },
        {
            title: '操作',
            width: '30%',
            dataIndex: 'auditState',
            render: (auditState: number, item: IAuditData) => {
                return <Button type="primary" onClick={() => { handlerControls(auditState, item) }}>{AuditState[auditState].control}</Button>
            }
        },
    ];
    const handlerControls = (state: number, item: IAuditData) => {
        state === 1 && cancelApplication(state - 1, item);
        state === 2 && publicAudit(item);
        state === 3 && updateAudit(item);
    }
    const cancelApplication = (state: number, item: IAuditData) => {
        axios.patch(`news/${item.id}`, {
            auditState: state
        }).then(res => {
            setAuditData(AuditData.filter(child => {
                return child.id !== item.id;
            }))
        })
    }
    const publicAudit = (item: IAuditData) => {
        axios.patch(`news/${item.id}`, {
            publishState: 2
        }).then(res => {
            setAuditData(AuditData.filter(child => {
                return child.id !== item.id;
            }))
            navigate(`/sandbox/publish-manage/published`)
            openNotification("bottomRight")
        })
    }
    const updateAudit = (item: IAuditData) => {
        navigate(`/sandbox/news-manage/update/${item.id}`)
    }
    const openNotification = (placement: NotificationPlacement) => {
        notification.info({
            message: `通知`,
            description:
                `您可以到发布页中查看您的新闻`,
            placement,
        });
    };
    return (
        <Fragment><Table
            columns={columns}
            dataSource={AuditData}
            rowKey={'id'}
            pagination={{
                pageSize: 5
            }}
        />
        </Fragment >
    )
}
