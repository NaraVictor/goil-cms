import { Progress } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../components/page-title";
import { appLinks } from "../helpers/config";
import { IsSystemChecked, SystemIsChecked } from "../helpers/state";

import logo from '../static/img/logo.png'

const SplashScreen = ( props ) => {
    const navigate = useNavigate();

    useEffect( () => {
        if ( IsSystemChecked() )
            navigate( appLinks.login, { replace: true } );
    }, [] )

    const activities = [
        // 'initiating checks',
        'security checks',
        'checking server connection',
        'loading initial data',
        'applying permissions',
        'starting...'
    ]

    const [ percentage, setPercentage ] = useState( 0 )
    const [ step, setStep ] = useState( 0 )

    setTimeout( () => {
        setPercentage( percentage + 10 )

        if ( step < activities.length - 1 )
            setStep( step + 1 )

        if ( percentage === 100 ) {
            SystemIsChecked()
            navigate( appLinks.login, { replace: true } )
        }

    }, 300 );


    return (
        <div className="row vh-100 splash-screen">
            <PageTitle title="Starting" />
            <div className="mx-auto my-auto text-center col-md-3 col-6">
                <img src={ logo } alt="app logo" width={ 80 } />
                <div className="mt-5 progress-area">
                    {/* <p className="mt-1 mb-0">Please wait</p> */ }
                    <Progress percent={ percentage } type="circle" strokeColor="#047769" />
                    <p className="mt-3">{ activities[ step ] }</p>
                </div>
            </div>
        </div>
    );
}

export default SplashScreen;