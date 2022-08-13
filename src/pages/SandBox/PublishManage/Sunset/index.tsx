
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
export default function Sunset(props: IProps) {
    const { WillPublishData, handlerSunset, handlerUnPublish } = usePublish(props, 3);
    return (
        <NewsPublish WillPublishData={WillPublishData}>
            {(id: number, item: IAuditData) => <div>
                <Button danger onClick={() => { handlerSunset(id, item) }}>删除</Button>
                <Button type="primary" onClick={() => { handlerUnPublish(id, item) }} style={{ marginLeft: "5px" }}>重新上线</Button>
            </div>}
        </NewsPublish>
    )
}
