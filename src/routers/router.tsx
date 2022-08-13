import React, { Suspense } from 'react'
import { Navigate } from "react-router-dom";
import { Spin } from 'antd'
function lazyLoad(Comp: React.LazyExoticComponent<any>, content?: any): React.ReactNode {
    return (
        <Suspense
            fallback={
                <Spin
                    size='large'
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                />
            }
        >
            <Comp content={content} />
        </Suspense>
    )
}
interface ISandboxRouter {
    path: string,
    auth: boolean,
    match: boolean,
    preelement: React.ReactNode
}
const SandboxRouter = [
    {
        path: 'home',
        auth: true,
        match: false,
        preelement: React.lazy(() => import('../pages/SandBox/Home')) as unknown as React.ReactNode,
    },
    {
        path: 'user-manage/add',
        auth: true,
        match: false,
        preelement: React.lazy(() => import('../pages/SandBox/UserManages/UseAdd')) as unknown as React.ReactNode,
    },
    {
        path: 'user-manage/delete',
        auth: true,
        match: false,
        preelement: React.lazy(() => import('../pages/SandBox/UserManages/UserDelete')) as unknown as React.ReactNode,
    },
    {
        path: 'user-manage/update',
        auth: true,
        match: false,
        preelement: React.lazy(() => import('../pages/SandBox/UserManages/UserChange')) as unknown as React.ReactNode,
    },
    {
        path: 'user-manage/list',
        auth: true,
        match: false,
        preelement: React.lazy(() => import('../pages/SandBox/UserManages/UserList')) as unknown as React.ReactNode,
    },
    {
        path: 'right-manage/role/list',
        auth: true,
        match: false,
        preelement: React.lazy(() => import('../pages/SandBox/PowerManage/RoleList')) as unknown as React.ReactNode,
    },
    {
        path: 'right-manage/right/list',
        auth: true,
        match: false,
        preelement: React.lazy(() => import('../pages/SandBox/PowerManage/PowerList')) as unknown as React.ReactNode,
    },
    {
        path: 'news-manage/add',
        auth: true,
        match: false,
        preelement: React.lazy(() => import("../pages/SandBox/NewsManage/NewsAdd")) as unknown as React.ReactNode,
    },
    {
        path: 'news-manage/draft',
        auth: true,
        match: false,
        preelement: React.lazy(() => import("../pages/SandBox/NewsManage/NewsDraft")) as unknown as React.ReactNode,
    },
    {
        path: 'news-manage/category',
        auth: true,
        match: false,
        preelement: React.lazy(() => import("../pages/SandBox/NewsManage/NewsCateGory")) as unknown as React.ReactNode,
    },
    {
        path: 'news-manage/preview/:id',
        auth: true,
        match: false,
        preelement: React.lazy(() => import("../pages/SandBox/NewsManage/NewsPreview")) as unknown as React.ReactNode,
    },
    {
        path: 'news-manage/update/:id',
        auth: true,
        match: false,
        preelement: React.lazy(() => import("../pages/SandBox/NewsManage/NewsUpdate")) as unknown as React.ReactNode,
    },
    {
        path: 'audit-manage/list',
        auth: true,
        match: false,
        preelement: React.lazy(() => import("../pages/SandBox/AuditManage/AuditList")) as unknown as React.ReactNode,
    },
    {
        path: 'audit-manage/audit',
        auth: true,
        match: false,
        preelement: React.lazy(() => import("../pages/SandBox/AuditManage/Audit")) as unknown as React.ReactNode,
    },
    {
        path: 'publish-manage/unpublished',
        auth: true,
        match: false,
        preelement: React.lazy(() => import("../pages/SandBox/PublishManage/UnPublished")) as unknown as React.ReactNode,
    },
    {
        path: 'publish-manage/published',
        auth: true,
        match: false,
        preelement: React.lazy(() => import("../pages/SandBox/PublishManage/Published")) as unknown as React.ReactNode,
    },
    {
        path: 'publish-manage/sunset',
        auth: true,
        match: false,
        preelement: React.lazy(() => import("../pages/SandBox/PublishManage/Sunset")) as unknown as React.ReactNode,
    },
    {
        path: '',
        auth: false,
        match: false,
        element: <Navigate to="home" replace={true} />
    },
    {
        path: '*',
        auth: false,
        match: false,
        element: lazyLoad(React.lazy(() => import('../pages/SandBox/NoPermission'))),
    }
]
const LoginRouter = [
    {
        path: "/login",
        auth: true,
        element: lazyLoad(React.lazy(() => import('../pages/Login')))
    },
    {
        path: "/sandbox",
        auth: true,
        element: lazyLoad(React.lazy(() => import('../pages/SandBox'))),
    },
    {
        path: '/',
        auth: false,
        element: <Navigate to="/login" replace={true} />
    },
    {
        path: '*',
        auth: false,
        element: lazyLoad(React.lazy(() => import('../pages/SandBox/NoPermission'))),
    }
]
export { LoginRouter, SandboxRouter, lazyLoad };