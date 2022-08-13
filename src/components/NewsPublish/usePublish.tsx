import axios from '../../axiosModel'
import { useEffect, useState } from 'react'
import { Role } from '../../pages/SandBox/index'
import { message } from 'antd';
interface Iprosp extends Role { }
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
export default function usePublish(props: Iprosp, state: number) {
    const [Role] = props.content;
    const [WillPublishData, setWillPublishData] = useState<IAuditData[]>([])
    useEffect(() => {
        axios.get(`news?author=${Role.username}&publishState=${state}&_expand=category`).then(res => {
            if (res.status !== 200) message.error("获取待发布数据失败！")
            setWillPublishData(res.data)
        })
    }, [Role.username, state])
    const handlerSunset = (id: number, item: IAuditData) => {/*将下线的文章删除 */
        axios.delete(`news/${id}`).then(res => {
            setWillPublishData(WillPublishData.filter(item => {
                return item.id !== id;
            }))
            message.success("删除成功")
        })
    }
    const handlerPublish = (id: number, item: IAuditData) => {/*将上线的文章下线 publishState=3*/
        axios.patch(`news/${id}`, {
            publishState: 3
        }).then(res => {
            setWillPublishData(WillPublishData.filter(item => {
                return item.id !== id;
            }))
            message.success("下线成功")
        })
    }
    const handlerUnPublish = (id: number, item: IAuditData) => {/*将待发布的文章进行上线 publishState=2 */
        axios.patch(`news/${id}`, {
            publishState: 2
        }).then(res => {
            setWillPublishData(WillPublishData.filter(item => {
                return item.id !== id;
            }))
            message.success("上线成功")
        })
    }


    return { WillPublishData, handlerUnPublish, handlerPublish, handlerSunset }

}