import React, { useEffect, useState, } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { MenuClickEventHandler, MenuInfo } from 'rc-menu/lib/interface'
import { UserOutlined } from "@ant-design/icons"
import { connect } from 'react-redux'
import style from './index.module.scss'
import axios from '../../axiosModel';
const { Sider } = Layout;
interface Imenu {
    key: string;
    title: string;
    children?: Imenu[]
    id: number
    grade: number
    rightId?: number
    pagepermisson: number
}
interface Iprops {
    rights: string[]
    isCollapsed?: boolean
}
function SideMenu(props: Iprops) {
    /**组件加载区 */
    const navigate = useNavigate();
    const { pathname } = useLocation()
    /**状态声明区 */
    const [Items, setItems] = useState<ItemType[]>([])
    const changeRouter: MenuClickEventHandler = (info: MenuInfo) => {
        navigate(info.key)
    }
    const routerSelectedKeys = pathname.split('/').reduce((total, currentvalue, currentindex) => {
        if (currentindex > 1)
            return total + '/' + currentvalue
        else
            return total += ''
    })
    const getMenu = () => {
        const { rights } = props;
        axios.get("rights").then(res => {
            let mainMenu: Imenu[] = res.data;
            axios.get('children').then(res2 => {
                const data2: Imenu[] = res2.data;
                mainMenu = mainMenu.map(child => {
                    child.children = [];
                    data2.forEach(child2 => {
                        if (child.id === child2.rightId) {
                            child.children = child.children ? [...child.children, child2] : [child2];
                        }
                    })
                    return child;
                })
                setItems(
                    mainMenu.filter(child => {
                        return rights.includes(child.key)
                    }).map(child => {
                        return {
                            key: child.key.slice(1),
                            icon: < UserOutlined />,
                            label: child.title,
                            pagepermisson: child.pagepermisson,
                            children: child.children?.length !== 0 ? child?.children?.map(c => {
                                return {
                                    key: c.key.slice(1),
                                    icon: < UserOutlined />,
                                    label: c.title,
                                    onClick: changeRouter,
                                    pagepermisson: c.pagepermisson
                                }

                            }).filter(c => {
                                return rights.includes('/' + c.key) && (!!c.pagepermisson)
                            }) as ItemType[] : undefined,
                            onClick: child.key === "/home" ? changeRouter : undefined
                        }
                    }).filter(c => {
                        return rights.includes('/' + c.key) && (!!c.pagepermisson)
                    }) as ItemType[])

            })

        })
    }
    /**Hook周期 */
    useEffect(() => {
        getMenu();
    }, [props.rights, pathname])// eslint-disable-line react-hooks/exhaustive-deps
    /**组件渲染区 */
    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div className={style.logo} >浩文信息管理系统</div>
            <Menu theme="dark"
                mode="inline"
                selectedKeys={[routerSelectedKeys.slice(1)]}
                defaultOpenKeys={[pathname.split('/')[2]]}
                items={Items}
            />
        </Sider >
    )
}
const mapStateToProps = ({ updateCollapsedReducer: { isCollapsed } }: { updateCollapsedReducer: { isCollapsed: boolean } }) => {
    return {
        isCollapsed
    }
}
export default connect(mapStateToProps)(SideMenu);