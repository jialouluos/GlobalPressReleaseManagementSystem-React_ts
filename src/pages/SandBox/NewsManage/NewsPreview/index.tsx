import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions, message } from 'antd';
import { useMatch } from 'react-router-dom';
import moment from 'moment';
import axios from '../../../../axiosModel'
interface ICategories {
    id: number,
    title: string
    value: string
}
interface IContent {
    title: string,
    content: string
    region: string,
    author: string,
    roleId: number
    auditState: number
    publishState: number
    createTime: number
    star: number
    view: number
    id: number
    publishTime: number
    categoryId: string
    category: ICategories
}
const auditList = ["未审核", "审核中", "已通过", "未通过"];
const publishList = ["未发布", "待发布", "已上线", "已下线"];
export default function NewsPerview() {
    const match = useMatch('/sandbox/news-manage/preview/:id')
    const [NewsData, setNewsData] = useState<IContent>()
    useEffect(() => {
        axios.get(`news/${match?.params.id}?_expand=category&_expand=role`).then(res => {
            if (res.status !== 200) return message.error("获取文章失败！")
            setNewsData(res.data);
        })
    }, [match?.params.id])

    return (
        <div className="site-page-header-ghost-wrapper">
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={NewsData?.title}
                subTitle={NewsData?.category.title}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{NewsData?.author}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{moment(NewsData?.createTime).format("YYYY/MM/DD HH-mm:ss")}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{NewsData?.publishTime ? moment(NewsData?.publishTime).format("YYYY/MM/DD HH-mm:ss") : '-'}</Descriptions.Item>
                    <Descriptions.Item label="区域">{NewsData?.region === "" ? "全球" : NewsData?.region}</Descriptions.Item>
                    <Descriptions.Item label="审核状态"><span style={{ color: "red" }}>{auditList[NewsData?.auditState as number]}</span></Descriptions.Item>
                    <Descriptions.Item label="发布状态"><span style={{ color: "red" }}>{publishList[NewsData?.publishState as number]}</span></Descriptions.Item>
                    <Descriptions.Item label="访问数量">{NewsData?.view}</Descriptions.Item>
                    <Descriptions.Item label="点赞数量">{NewsData?.star}</Descriptions.Item>
                    <Descriptions.Item label="评论数量">0</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <div dangerouslySetInnerHTML={{ __html: NewsData?.content as string }}>

            </div>
        </div>
    )
}
