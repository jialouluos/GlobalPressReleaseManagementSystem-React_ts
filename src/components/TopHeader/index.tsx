import React from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { MenuClickEventHandler, MenuInfo } from 'rc-menu/lib/interface'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import style from './index.module.scss'
const { Header } = Layout;
interface Iprops {
  roleName: string;
  isCollapsed?: boolean
  changeCollapsed?: (value: boolean) => { type: string, value: boolean };
}

function TopHeader(props: Iprops) {
  /**组件加载区 */
  const navigate = useNavigate();
  // const [collapsed, setCollapsed] = useState(false)
  const changeRouter: MenuClickEventHandler = (info: MenuInfo) => {
    navigate(info.key)
  }
  const items: ItemType[] = [
    {
      key: 'id',
      icon: < UserOutlined />,
      label: props.roleName,
    },
    {
      key: '/login',
      icon: < UserOutlined />,
      label: '退出登录',
      danger: true,
      onClick: changeRouter
    },
  ]
  const menu = (
    <Menu items={items} />
  );
  return (
    <Header className="site-layout-background" style={{ padding: '0 32px ' }}>
      {
        props.isCollapsed ? <MenuUnfoldOutlined onClick={() => { (props.changeCollapsed as (value: boolean) => { type: string, value: boolean })(!props.isCollapsed) }} /> : <MenuFoldOutlined onClick={() => { (props.changeCollapsed as (value: boolean) => { type: string, value: boolean })(!props.isCollapsed) }} />
      }
      <div style={{ float: 'right' }}>
        <span style={{ margin: '0px 10px' }}>欢迎回来</span>
        <Dropdown overlay={menu}>
          <Avatar size={32} icon={<UserOutlined />} className={style.header_img} />
        </Dropdown>
      </div>
    </Header>
  )
}
const mapStateToProps = ({ updateCollapsedReducer: { isCollapsed } }: { updateCollapsedReducer: { isCollapsed: boolean } }) => {
  return {
    isCollapsed
  }
}
const mapDispatchToProps = {
  changeCollapsed(value: boolean) {
    return {
      type: "collapsed",
      value: value
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TopHeader);
