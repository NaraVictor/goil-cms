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
        !isAuthenticated() && nav( appLinks.login, { replace: false } )

        if ( isOnline ) {
            setOpen( true )
            setTimeout( () => { setOpen( false ) }, 6000 )
        }
    }, [ isOnline ] )

    return (
        <>
            {
                isAuthenticated() &&
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
                    {/* <div className="sticky-top bg-dark text-center text-white py-1">
                        The production version will be live on October 1st, 2023.
                        <a href='https://forms.gle/5BnZNBa6tzBo2wAu7' target='_blank' className='ms-2 text-warning'>Click here to join the waiting list </a> <span className="px-2">or</span>
                        <a href='https://forms.gle/hicA31MnzPBbZChd8' target='_blank' className='text-warning'>here to submit feedback </a>
                    </div> */}
                    {/* <SecondaryNav /> */ }
                    <PrimaryNav />
                    <div className="layout-outlet">
                        <div className="row">
                            <div className="mx-auto col-md-10 col-12">
                                <div className="container">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                        {
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
                        }

                    </div>
                </div>
            }
        </>
    )
};

export default AppLayout;