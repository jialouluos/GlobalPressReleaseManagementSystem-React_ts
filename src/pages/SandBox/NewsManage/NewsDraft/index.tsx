import React, { useEffect, useState, Fragment } from 'react'
import { message, Table, Button, Modal } from 'antd';
import { DeleteTwoTone, ProfileTwoTone, UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import axios from 'axios'
import { Role } from '../../index'
import { Link, useNavigate } from 'react-router-dom';
interface IProps extends Role { }
const { confirm } = Modal;
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

export default function NewsDraft(props: IProps) {
    const [Role] = props.content;
    const navigate = useNavigate();
    const [NewsSourceData, setNewsSourceData] = useState<IContent[]>([])
    const [ModalVisiable, setModalVisiable] = useState(false)
    useEffect(() => {
        axios.get(`news?author=${Role.username}&auditState=0&_expand=category`).then(res => {
            if (res.status !== 200) message.error("获取新闻数据失败！")
            setNewsSourceData(res.data)
        })
    }, [Role.username])
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
            title: '新闻标题',
            dataIndex: 'title',
            width: '12%',
            render: (title: string, item: IContent) => {
                return <Link style={{ color: "rgb(24, 144, 255)", margin: "0px" }} to={`/sandbox/news-manage/preview/${item.id}`}>{title}</Link >
            }
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
            render: (category: ICategories) => {
                return category.title
            }
        },
        {
            title: '操作',
            width: '30%',
            render: (item: IContent) => {
                return <div>
                    <Button shape="circle" icon={<DeleteTwoTone />} onClick={() => { HandleDelete(item) }}></Button>
                    <Button shape="circle" icon={<ProfileTwoTone />} onClick={() => { navigate(`/sandbox/news-manage/update/${item.id}`) }}></Button>
                    <Button shape="circle" icon={<UploadOutlined />} onClick={() => { HandlerCheck(item.id) }}></Button>
                </div >
            }
        },
    ];
    const HandlerCheck = (id: number) => {
        axios.patch(`news/${id}`, {
            auditState: 1
        }).then(res => {
            console.log(NewsSourceData);
            setNewsSourceData([...NewsSourceData.filter(item => {
                return item.id !== id;
            })])
        })
    }
    const HandleDelete = (item: IContent) => {
        confirm({
            title: '角色删除',
            icon: <ExclamationCircleOutlined />,
            content: '确定删除该角色吗？',
            onOk() {
                setNewsSourceData(NewsSourceData.filter(children => {
                    return children.id !== item.id;
                }))
                // axios.delete(`news/${item.id}`).then(res => {
                //     if (res.status !== 200) return message.error("删除失败！")
                //     message.success("删除成功！")
                // })
            }
        });
    }
    return (
        <Fragment><Table
            columns={columns}
            dataSource={NewsSourceData}
            rowKey={'id'}
            pagination={{
                pageSize: 5
            }}
        />
            <Modal title="Basic Modal" visible={ModalVisiable} onCancel={() => setModalVisiable(false)} >
            </Modal>
        </Fragment >
    )
}
