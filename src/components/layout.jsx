import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../helpers/auth';
import { appLinks } from '../helpers/config';
import { PrimaryNav, SecondaryNav } from './navigation';
import { useOnlineEffect } from 'react-network-detect';
import { Alert, Snackbar } from '@mui/material';


const AppLayout = () => {
    const nav = useNavigate()
    const { isOnline } = useOnlineEffect()
    const [ open, setOpen ] = useState( false )


    useEffect( () => {
        // !isAuthenticated() && nav( appLinks.login, { replace: false } )

        if ( isOnline ) {
            setOpen( true )
            setTimeout( () => { setOpen( false ) }, 6000 )
        }
    }, [ isOnline ] )

    return (
        <>
            {
                // isAuthenticated() &&
                <div className='app-layout'>
                    {
                        isOnline &&
                        <Snackbar
                            anchorOrigin={ {
                                horizontal: 'right',
                                vertical: 'bottom'
                            } }
                            open={ open }
                            autoHideDuration={ 5000 } >
                            <Alert severity="success" sx={ { width: '100%' } }>
                                Connection OK!
                            </Alert>
                        </Snackbar>
                    }
                    <PrimaryNav />
                    <div className="layout-outlet">
                        <div className="row">
                            <div className="mx-auto col-md-10 col-12">
                                <div className="container">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                        {/* {
                            !isOnline &&
                            <div className="sticky-bottom bg-warning text-center"
                                style={ {
                                    position: 'fixed',
                                    display: 'block',
                                    width: '100vw',
                                    bottom: 0
                                } }
                            >
                                <span className="bi bi-cloud-slash me-2" />
                                No Internet connection
                            </div>
                        } */}

                    </div>
                </div>
            }
        </>
    )
};

export default AppLayout;