import React, { useState, useEffect } from 'react'
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import axios from '../../axiosModel'
import { useNavigate, useRoutes } from 'react-router-dom'
import { Layout, Spin } from 'antd'
import { SandboxRouter } from '../../routers/router'
import { connect } from 'react-redux';
import "./index.scss"
import { lazyLoad } from '../../routers/router'
const { Content } = Layout;
interface IRouterCheckList {
    grade: number
    id: number
    key: string
    pagepermisson?: number
    title: string
    routepermisson?: number
}
export interface Role {
    content:
    [{
        username: string;
        region: string;
        roleId: number;
        role: {
            rights: string[];
            roleName: string;
            id: number;
        }
    },
        React.Dispatch<React.SetStateAction<{
            username: string;
            region: string;
            roleId: number;
            role: {
                rights: string[];
                roleName: string;
                id: number;
            };
        }>>
    ]

}
interface Iprops {
    isLoad?: boolean
}
function SandBox(props: Iprops) {
    const navigate = useNavigate();
    !window.sessionStorage.getItem("menu") && navigate("/login")
    const [Role, setRole] = useState<{
        username: string
        region: string,
        roleId: number,
        role: {
            rights: string[]; roleName: string; id: number
        }
    }>({
        username: '',
        region: "",
        roleId: 0,
        role: {
            rights: [], roleName: "", id: 0
        }
    })
    const [RouterCheckList, setRouterCheckList] = useState<IRouterCheckList[]>([])
    useEffect(() => {
        const role: {
            username: string,
            region: string,
            roleId: number,
            role: {
                rights: string[]; roleName: string; id: number
            }
        } = JSON.parse((window.sessionStorage.getItem("menu") as string))
        setRole(role)
        Promise.all([
            axios.get("rights"),
            axios.get("children")
        ]).then(res => {
            setRouterCheckList([...res[0].data, ...res[1].data]);
        })
    }, [])

    const element = useRoutes(SandboxRouter.map(item => {
        if (item.auth && RouterCheckList.some(child => {
            return child.key === '/' + item.path && (child.pagepermisson || child.routepermisson);
        })) {
            item.match = true;
        } else {
            item.match = false;
        }
        return item;
    }).filter(item => {
        return !item.auth || item.match;
    }).map(item => {
        item.auth && (item.element = lazyLoad(item.preelement as unknown as React.LazyExoticComponent<any>, [Role, setRole]))
        return item;
    }))
    return (
        <Layout>
            <SideMenu rights={Role.role.rights}></SideMenu>
            <Layout className="site-layout">
                <TopHeader roleName={Role.role.roleName}></TopHeader>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}>
                    <Spin spinning={props.isLoad}>
                        {RouterCheckList.length > 0 ? element : null}
                    </Spin>
                </Content>
            </Layout>
        </Layout>
    )
}
const mapStateToProps = ({ updateLoadReducer: { isLoad } }: { updateLoadReducer: { isLoad: boolean } }) => {
    return {
        isLoad
    }
}
export default connect(mapStateToProps)(SandBox);