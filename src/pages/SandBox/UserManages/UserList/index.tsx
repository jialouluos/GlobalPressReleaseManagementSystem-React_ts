import React, { useState, useEffect, Fragment, useRef } from 'react'
import { message, Table, Button, Modal, Switch } from 'antd';
import { DeleteTwoTone, EditTwoTone, ExclamationCircleOutlined } from "@ant-design/icons"
import { FormInstance } from 'antd/lib/form/hooks/useForm';
import axios from '../../../../axiosModel';
import UserManage from '../../../../components/userManage'
import { Role } from '../../index'
interface IProps extends Role { }
const { confirm } = Modal
interface IUserData {
  username: string;
  roleState: boolean;
  roleId: number;
  region: string;
  default: boolean;
  password: number;
  id: number;
  role?: IRolesData
}
interface IRegionData {
  id: number;
  title: string;
  value: string;
}
interface IRolesData {
  id: number,
  roleName: string,
  roleType: number,
  rights: string[]
}


export default function UserList(props: IProps) {
  const [Role] = props.content;
  const [UserData, setUserData] = useState<IUserData[]>([])
  const [OpenAddUserDialog, setOpenAddUserDialog] = useState<boolean>(false)
  const [OpenupdateUserDialog, setOpenupdateUserDialog] = useState<boolean>(false)
  const [isUpdateDisable, setisUpdateDisable] = useState<boolean>(false)
  const [RegionData, setRegionData] = useState<IRegionData[]>([])
  const [CurrentUpdateUser, setCurrentUpdateUser] = useState<IUserData | null>(null)
  const [RolesData, setRolesData] = useState<IRolesData[]>([])
  // const [Role, setRole] = useState<{
  //   username: string
  //   region: string,
  //   roleId: number,
  //   role: {
  //     rights: string[]; roleName: string; id: number
  //   }
  // }>({
  //   username: '',
  //   region: "",
  //   roleId: 0,
  //   role: {
  //     rights: [], roleName: "", id: 0
  //   }
  // })
  const UserFormRef = useRef<FormInstance>(null)
  const columns = [
    {
      title: 'εΊε',
      dataIndex: 'region',
      filters: [...RegionData.map(item => {
        return {
          text: item.title,
          value: item.value
        }
      }), {
        text: "ε¨η",
        value: ""
      }],
      onFilter: (value: string | number | boolean, record: IUserData) => record.region === value,
      render: (region: string) => <b>{region || "ε¨η"}</b>,
      width: '12%',
    },
    {
      title: 'θ§θ²εη§°',
      dataIndex: 'role',
      width: '12%',
      render: (role: { roleName: string; }) => role.roleName
    },
    {
      title: 'η¨ζ·ε',
      dataIndex: 'username',
      width: '12%',
    },
    {
      title: 'η¨ζ·ηΆζ',
      width: '12%',
      render: (item: IUserData) => <Switch checked={item.roleState} defaultChecked={item.roleState} disabled={item.default} onClick={() => { handleState(item) }}></Switch>
    },
    {
      title: 'ζδ½',
      width: '30%',
      render: (item: IUserData) => {
        return <div>
          <Button shape="circle" icon={<DeleteTwoTone twoToneColor={"#ff0000"} />} disabled={item.default} onClick={() => deleteHandle(item)}></Button>
          <Button shape="circle" icon={<EditTwoTone />} style={{ marginLeft: "10px" }} disabled={item.default} onClick={() => { openUpdateDialog(item); }}></Button>
        </div >
      }
    },
  ];
  const deleteHandle = (item: IUserData) => {
    console.log(item);
    confirm({
      title: 'η¨ζ·ε ι€',
      icon: <ExclamationCircleOutlined />,
      content: 'η‘?ε?ε ι€θ―₯η¨ζ·εοΌ',
      onOk() {
        setUserData(UserData.filter(children => {
          return children.id !== item.id;
        }))
        axios.delete(`users/${item.id}`).then(res => {
          if (res.status !== 200) return message.error("ε ι€ε€±θ΄₯οΌ")
          message.success("ε ι€ζεοΌ")
        })
      }
    });
  }
  const handleState = (item: IUserData) => {
    item.roleState = !item.roleState;
    setUserData([...UserData])
    axios.patch(`users/${item.id}`, {
      roleState: item.roleState
    })
  }
  const handleAddUser = () => {
    UserFormRef!.current!.validateFields().then(res => {
      setOpenAddUserDialog(false);
      UserFormRef.current?.resetFields();
      axios.post("users", {
        ...res,
        roleState: true,
        default: false,
      }).then(res => {
        axios.get("users?_expand=role").then(res => {
          if (res.status !== 200) return message.error("θ·εζιζ°ζ?ε€±θ΄₯οΌ")
          setUserData(res.data)
        })
      })
    }).catch(err => {
      console.log(err);
    })

  }
  const openUpdateDialog = (item: IUserData) => {
    setOpenupdateUserDialog(true);
    setCurrentUpdateUser(item)
    setTimeout(() => {
      if (item.roleId === 1) setisUpdateDisable(true)
      else setisUpdateDisable(false)
      UserFormRef.current?.setFieldsValue(item);
    }, 0)
  }
  const handleUpdateUser = () => {
    UserFormRef!.current!.validateFields().then(res => {
      setOpenupdateUserDialog(false);
      setisUpdateDisable(!isUpdateDisable)
      UserFormRef.current?.resetFields();
      axios.patch(`users/${CurrentUpdateUser?.id}`, res).then(res => {
        message.success("ζ΄ζ°ζεοΌ")
        axios.get("users?_expand=role").then(res => {
          if (res.status !== 200) return message.error("θ·εζιζ°ζ?ε€±θ΄₯οΌ")
          setUserData(res.data)

        })
      })
    }).catch(err => {
      console.log(err);
    })
  }
  // useEffect(() => {
  //   const role: {
  //     username: string,
  //     region: string,
  //     roleId: number,
  //     role: {
  //       rights: string[]; roleName: string; id: number
  //     }
  //   } = JSON.parse((window.sessionStorage.getItem("menu") as string))
  //   setRole(role)
  // }, [])
  useEffect(() => {

    axios.get("users?_expand=role").then(res => {
      if (res.status !== 200) return message.error("θ·εζιζ°ζ?ε€±θ΄₯οΌ")
      const handlerData = res.data.filter((item: IUserData) => {
        if (Role.roleId === 1)
          return item;
        else {
          return item && item.roleId >= Role.roleId && item.region === Role.region;
        }
      })
      console.log(res.data);
      setUserData(handlerData)
    })
    axios.get("regions").then(res => {
      if (res.status !== 200) return message.error("θ·εεΊεζ°ζ?ε€±θ΄₯οΌ")
      setRegionData(res.data)
    })
    axios.get("roles").then(res => {
      if (res.status !== 200) return message.error("θ·εθ§θ²ζ°ζ?ε€±θ΄₯οΌ")
      setRolesData(res.data)
    })
  }, [Role])

  return (
    <Fragment>
      <Button type="primary" onClick={() => { setOpenAddUserDialog(true); }} style={{ marginBottom: "5px" }}>ζ·»ε η¨ζ·</Button>
      <Table
        columns={columns}
        dataSource={UserData}
        rowKey={'id'}
        pagination={{
          pageSize: 5
        }} />
      <Modal title="ζ·»ε η¨ζ·" visible={OpenAddUserDialog} onOk={handleAddUser} onCancel={() => { setOpenAddUserDialog(false); UserFormRef.current?.resetFields(); }} cancelText={'εζΆ'} okText={"η‘?ε?ζ·»ε "}>
        <UserManage RegionData={RegionData} RolesData={RolesData} ref={UserFormRef} Role={Role} />
      </Modal>
      <Modal title="ζ΄ζ°η¨ζ·" visible={OpenupdateUserDialog} onOk={handleUpdateUser} onCancel={() => {
        setOpenupdateUserDialog(false)
        UserFormRef.current?.resetFields()
        setisUpdateDisable(!isUpdateDisable)
      }} cancelText={'εζΆ'} okText={"η‘?ε?ζ΄ζ°"}>
        <UserManage RegionData={RegionData} RolesData={RolesData} ref={UserFormRef} isUpdateDisable={isUpdateDisable} Role={Role} />
      </Modal>
    </Fragment>


  )
}
