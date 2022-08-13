
import React from 'react'
import { Role } from '../../index'
import NewsPublish from '../../../../components/NewsPublish'
import usePublish from '../../../../components/NewsPublish/usePublish'
import { Button } from 'antd';
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
export default function Published(props: IProps) {
    const { WillPublishData, handlerPublish } = usePublish(props, 2);
    return (
        <NewsPublish WillPublishData={WillPublishData}>
            {(id: number, item: IAuditData) => <Button type="primary" onClick={() => { handlerPublish(id, item) }}>下线</Button>}
        </NewsPublish>
    )
}
