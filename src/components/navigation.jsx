import { Avatar, Tag, Tooltip, message } from "antd";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { appLinks } from "../helpers/config";
import { Menu } from '@mantine/core'
import { ROLES, getUser, logOut, refreshToken } from '../helpers/auth'
import { IconLock, IconPower, IconSwitchHorizontal, IconUser } from '@tabler/icons-react'
import { postAttendance, putAttendance, putLogout } from "../helpers/api";

import logo from '../static/img/logo4.png'
import { maskEmail } from "../helpers/utilities";

const ShortCuts = ( { className } ) => {
    return (
        <div className={ className }>
            <Tooltip title="Quick Sale">
                <span className="hover bi bi-basket h5" ></span>
            </Tooltip>
            <Tooltip title="Application Logs">
                <span className="mx-4 hover bi bi-clipboard-data h5"></span>
            </Tooltip>
            <Tooltip title="Notifications">
                <span className="mr-4 hover bi bi-bell h5"></span>
            </Tooltip>
        </div>
    )
}


const PrimaryNav = ( props ) => {
    const nav = useNavigate()
    const user = getUser()
    const handleMarkAttendance = () => {

        const a_id = getUser().attendance_id
        if ( a_id !== null )
            postAttendance().then( res => {
                console.log( res );
                if ( res.response.status === 201 ) {
                    message.success( 'you are clocked-in!' )
                    refreshToken()
                    return
                }

                message.error( 'error clocking you in!' )
            } )
        else
            putAttendance( a_id ).then( res => {
                if ( res.response.status === 200 ) {
                    message.success( 'you are clocked-out' )
                    refreshToken()
                    return
                }

                message.error( 'error clocking you out!' )

            } )

    }

    return (
        <nav className="shadow primary-nav">
            <Link to={ appLinks.home } className="logo">
                <img src={ logo } width={ 100 } alt="BokxPOS App logo" />
            </Link>
            <div className="nav-links text-md-start text-center">
                <NavLink
                    className={ ( props ) => {
                        return `${ props.isActive ? 'active-nav ' : '' }`;
                    } }
                    end
                    to={ appLinks.home }>
                    <span className="h5 bi bi-house"></span>
                    <span className="d-none d-md-inline-block">
                        Home
                    </span>
                </NavLink>
                <NavLink
                    className={ ( props ) => {
                        return `${ props.isActive ? 'active-nav ' : '' }`;
                    } }
                    end
                    to={ appLinks.sales.index }>
                    <span className="h5 bi bi-bag"></span>
                    <span className="d-none d-md-inline-block">
                        Sale
                    </span>
                </NavLink>
                <NavLink
                    className={ ( props ) => {
                        return `${ props.isActive ? 'active-nav ' : '' }`;
                    } }
                    end
                    to={ appLinks.catalog.index }>
                    <span className="h5 bi bi-stack"></span>
                    <span className="d-none d-md-inline-block">
                        Catalog
                    </span>
                </NavLink>
                <NavLink
                    className={ ( props ) => {
                        return `${ props.isActive ? 'active-nav ' : '' }`;
                    } }
                    end
                    to={ appLinks.reports.index }>
                    <span className="h5 bi bi-bar-chart"></span>
                    <span className="d-none d-md-inline-block">
                        Reporting
                    </span>
                </NavLink>
                <NavLink
                    className={ ( props ) => {
                        return `${ props.isActive ? 'active-nav ' : '' }`;
                    } }
                    end
                    to={ appLinks.setup.index } >
                    <span className="h5 bi bi-gear"></span>
                    <span className="d-none d-md-inline-block">
                        Setup
                    </span>
                </NavLink>
            </div>

            <div
                style={ { zIndex: 2500 } }
            >
                {/* <span className="d-none d-md-inline-block">
                    <ShortCuts />
                </span> */}

                <Menu>
                    <Menu.Target>
                        <div>
                            <strong className="me-2 d-none d-md-inline">{ user.staff_name }</strong>
                            <Avatar className="hover-hand">
                                <IconUser />
                            </Avatar>
                        </div>
                    </Menu.Target>

                    <Menu.Dropdown>
                        {/* <Menu.Label>User</Menu.Label> */ }
                        <div className="p-2">
                            <strong className="d-sm-none">{ user.staff_name }</strong>
                            <div className="text-muted">
                                <i className="d-block">{ maskEmail( user?.email ) }</i>
                                <Tag>{ ROLES.find( rl => rl.value === user?.role )?.label }</Tag>
                            </div>
                            <button className="mt-3 button"
                                onClick={ handleMarkAttendance }
                            >
                                <span className="bi bi-person-check me-2" />
                                {
                                    getUser().attendance_id ?
                                        'Clock-out' : 'Clock-in'
                                }
                            </button>
                        </div>
                        <Menu.Divider />
                        <Menu.Label pb={ 0 }>Outlet</Menu.Label>
                        <Menu.Item
                            disabled
                            py={ 4 }
                            mb={ 5 }
                        >
                            <strong className="d-block text-success">
                                { user.outlets.find( out => out.id === user.outlet_id ).outlet_name }
                            </strong>
                            <Tag>
                                <span className="bi bi-shop me-1"></span>
                                { user.shop_name }</Tag>
                        </Menu.Item>
                        <Menu.Item
                            py={ 6 }
                            onClick={ () => nav( appLinks.switchOutlet ) }
                            icon={ <IconSwitchHorizontal size={ 20 } /> }>
                            Switch Outlet
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Label>Security</Menu.Label>
                        {/* <Menu.Item
                            py={ 6 }
                            onClick={ () => onOpen( row.id ) }
                            icon={ <IconUser size={ 20 } /> }>
                            Account
                        </Menu.Item> */}

                        <Menu.Item
                            py={ 6 }
                            onClick={ () => {
                                logOut()
                                nav( appLinks.resetpassword )
                            } }
                            icon={ <IconLock size={ 20 } /> }>
                            Reset Password
                        </Menu.Item>
                        <Menu.Item
                            py={ 6 }
                            color="red"
                            onClick={ () => {
                                putLogout( user.id )
                                logOut()
                                window.location.href = appLinks.login
                            } }
                            icon={ <IconPower size={ 20 } /> }>
                            Log Out
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu >
            </div>
        </nav >
    );
}


const SecondaryNav = () => {
    return (
        <div className="secondary-nav d-block d-md-none bokx-bg">
            <div className="d-flex justify-content-between">
                <p>logo</p>
                <ShortCuts className="text-white" />
            </div>
        </div>
    );
}


export { PrimaryNav, SecondaryNav };