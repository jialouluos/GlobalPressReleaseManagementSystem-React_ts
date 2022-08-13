import React, { useState, useEffect, useRef } from 'react'
import { Steps, PageHeader, Button, Form, Input, Select, message, notification } from 'antd';
import style from "./index.module.scss"
import { useNavigate } from 'react-router-dom'
import { FormInstance } from 'antd/lib/form/hooks/useForm';
import axios from 'axios';
import NewEditor from '../../../../components/NewEditor'
import type { NotificationPlacement } from 'antd/lib/notification';
import { Role } from '../../index'
interface IProps extends Role { }
const { Step } = Steps;
const { Option } = Select
interface ICategories {
  id: number,
  title: string
  value: string
}
interface IContent {
  title: string,
  categoryId: number,
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
}

export default function NewsAdd(props: IProps) {
  const [CurrentIndex, setCurrentIndex] = useState(0)
  const [Categories, setCategories] = useState<ICategories[]>([])
  const [Role] = props.content;
  const navigate = useNavigate();

  const [NewsFromData, setNewsFromData] = useState<IContent>({
    title: "",
    categoryId: 0,
    content: "",
    region: "",
    author: "",
    roleId: 0,
    auditState: 0,
    publishState: 0,
    createTime: 0,
    star: 0,
    view: 0,
    id: 0,
  })
  const NewFromRef = useRef<FormInstance>(null)
  const ValidFrom = () => {

    CurrentIndex === 0 && NewFromRef!.current!.validateFields().then(res => {
      setCurrentIndex(CurrentIndex + 1);
      setNewsFromData({
        ...NewsFromData,
        ...res
      })
    })
    if (CurrentIndex === 1) {
      if (NewsFromData.content === "" || NewsFromData.content.trim() === `<p></p>`) message.error("文本信息不能为空")
      else {
        setCurrentIndex(CurrentIndex + 1);
      }
    }
  }
  const openNotification = (placement: NotificationPlacement, state: number) => {
    notification.info({
      message: `通知`,
      description:
        `您可以到${state ? "审核列表" : "草稿箱"}中查看您的新闻`,
      placement,
    });
  };
  const handlerSave = (state: number) => {
    axios.post("/news", {
      ...NewsFromData,
      "region": Role.region,
      "author": Role.username,
      "roleId": Role.roleId,
      "auditState": state,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
    }).then(res => {
      navigate(state ? '/sandbox/audit-manage/list' : '/sandbox/news-manage/draft');
      openNotification("bottomRight", state)
    })
  }
  useEffect(() => {
    axios.get("categories").then(res => {
      if (res.status !== 200) return message.error("获取新闻分类数据失败！")
      setCategories(res.data)
    })
  }, [])

  return (
    <div>
      <PageHeader className="site-page-header"
        title="攥写新闻" />
      <Steps current={CurrentIndex}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>
      <div style={{ marginTop: "50px" }} className={CurrentIndex !== 0 ? style.hidden : ""}>
        <Form
          name="newsfrom"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          ref={NewFromRef}
        >
          <Form.Item
            label="新闻标题"
            name="title"
            rules={[{ required: true, message: 'Please input your news title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="categoryId" label="新闻分类" rules={[{ required: true, message: 'Please input your news classify!' }]}>
            <Select
              placeholder="请选择新闻的分类"
              allowClear
            >
              {Categories.map(item => {
                return <Option value={item.id} key={item.id}>{item.title}</Option>
              })}
            </Select>
          </Form.Item>
        </Form>

      </div>
      <div style={{ marginTop: "50px" }} className={CurrentIndex !== 1 ? style.hidden : ""}>
        <NewEditor content={[NewsFromData, setNewsFromData]}></NewEditor>
      </div>
      <div style={{ marginTop: "50px" }} className={CurrentIndex !== 2 ? style.hidden : ""}>
        {CurrentIndex === 2 && <Button type="primary" onClick={() => { handlerSave(0); }}>保存到草稿箱</Button>}
        {CurrentIndex === 2 && <Button style={{ float: "right" }} danger onClick={() => { handlerSave(1); }}>提交审核</Button>}
      </div>
      {CurrentIndex < 2 && <Button onClick={() => { ValidFrom() }} style={{ float: "right", marginTop: "10px" }} type="primary">下一步</Button>}
      {CurrentIndex > 0 && <Button onClick={() => { setCurrentIndex(CurrentIndex - 1) }} style={{ float: "left", marginTop: "10px" }}>上一步</Button>}

    </div>
  )
}
