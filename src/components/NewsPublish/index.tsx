import React, { Fragment } from 'react'
import { Table } from 'antd'
import { Link } from "react-router-dom"
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
interface IProps {
    WillPublishData: IAuditData[]
    children: any
}
export default function NewsPublish(props: IProps) {
    const { WillPublishData, children } = props;
    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title: string, item: IAuditData) => {
                return <Link to={`/sandbox/news-manage/preview/${item.id}`}>{title}</Link>
            },
            width: '12%',
        },
        {
            title: '作者',
            dataIndex: 'author',
            render: (author: string) => {
                return <b>{author}</b>
            },
            width: '12%',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            width: '12%',
            render: (category: { title: string }) => {
                return category.title
            }
        },
        {
            title: '操作',
            width: '30%',
            render: (item: IAuditData) => {
                return children(item.id)
            }
        },
    ];
    return (
        <Fragment><Table
            columns={columns}
            dataSource={WillPublishData}
            rowKey={'id'}
            pagination={{
                pageSize: 5
            }}
        />
        </Fragment >
    )
}
