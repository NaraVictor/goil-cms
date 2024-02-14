import { useAtom } from 'jotai';
import { shopPlanAtom } from '../../../helpers/state/signup';
import { Chip } from "@mui/material";

// icons
import freeIcon from '../../../static/img/plane-ticket.png';
import basicIcon from '../../../static/img/plane-paper.png';
import standardIcon from '../../../static/img/plane1.png';
import proIcon from '../../../static/img/plane-space.png';
import { Divider } from 'antd';
import { cedisLocale, toTitleCase } from '../../../helpers/utilities';


const PlanSetup = () => {
    const [ plan, setPlan ] = useAtom( shopPlanAtom )

    return (
        <div className="px-md-3" >
            <div className="row">
                <div className="col-md-7 col-12">
                    <div className="row">
                        {/* <h5>{ !plan.plan ? 'Choose a ' : 'Your ' } plan</h5> */ }
                        <div className="mb-2">
                            <h6 className='mb-0'>Billing Plans</h6>
                            <small className='text-muted'>{ !plan?.plan ? 'Choose a ' : 'Your ' } billing plan. You can change this later in app settings</small>
                        </div>
                        <div
                            onClick={ () => setPlan( { field: 'plan', value: 'free' } ) }
                            className={ `${ plan?.plan === 'free' && ' text-white bokx-bg' }  py-2  
                                col-md-6 col-12 d-flex justify-content-center align-items-center hover-hand bokx-card
                        bokx-border ` }
                        >
                            <img
                                className='me-3'
                                width={ 45 }
                                src={ freeIcon }
                                alt="free icon" />
                            Free Trial
                        </div>
                        <div
                            onClick={ () => setPlan( { field: 'plan', value: 'basic' } ) }
                            className={ `${ plan?.plan === 'basic' && ' text-white bokx-bg' }  py-2  
                                col-md-6 col-12 d-flex justify-content-center align-items-center hover-hand bokx-card
                        bokx-border ` }
                        >
                            <img
                                className='me-3'
                                width={ 45 }
                                src={ basicIcon }
                                alt="free icon" />
                            Basic
                        </div>
                        <div
                            onClick={ () => setPlan( { field: 'plan', value: 'standard' } ) }
                            className={ `${ plan?.plan === 'standard' && ' text-white bokx-bg' }  py-2  
                                col-md-6 col-12 d-flex justify-content-center align-items-center hover-hand bokx-card
                        bokx-border ` }
                        >
                            <img
                                className='me-3'
                                width={ 45 }
                                src={ standardIcon }
                                alt="free icon" />
                            Standard
                        </div>
                        <div
                            onClick={ () => setPlan( { field: 'plan', value: 'professional' } ) }
                            className={ `${ plan?.plan === 'professional' && ' text-white bokx-bg' }  py-2  
                                col-md-6 col-12 d-flex justify-content-center align-items-center hover-hand bokx-card
                        bokx-border ` }
                        >
                            <img
                                className='me-3'
                                width={ 45 }
                                src={ proIcon }
                                alt="free icon" />
                            Professional
                        </div>
                    </div>
                    {
                        plan?.plan !== 'free' &&
                        plan.plan !== null &&
                        <div className='row'>
                            <div className="mt-4">
                                {/* <strong>Billing Interval</strong> */ }
                                <h6 className='mb-0'>Billing Interval</h6>
                                <small className='text-muted'>{ !plan?.interval ? 'Choose a ' : 'Your ' } billing interval.
                                    {/* You can change this later in app settings */ }
                                </small>
                            </div>
                            <div
                                onClick={ () => setPlan( { field: 'interval', value: 'monthly' } ) }
                                className={ `${ plan.interval === 'monthly' && ' text-white bokx-bg' }  py-2 
                                col-md-6 col-12 d-flex justify-content-center align-items-center hover-hand bokx-card
                        bokx-border ` }
                            >
                                Monthly
                            </div>
                            <div
                                onClick={ () => setPlan( { field: 'interval', value: 'annually' } ) }
                                className={ `${ plan?.interval === 'annually' && ' text-white bokx-bg' }  py-2  
                                col-md-6 col-12 d-flex justify-content-center align-items-center hover-hand bokx-card
                        bokx-border ` }
                            >
                                Annually
                            </div>
                        </div >
                    }
                </div>
                <div className="col-md-4 offset-md-1 col-12 mt-5 mt-md-0">
                    <h6 className='mb-0'>Summary</h6>
                    <small className='text-muted'>Estimated total cost (excluding tax)</small>
                    {
                        plan?.plan ?
                            <>
                                <Divider className='my-2' />
                                <div className="row">
                                    <div className="col-8">
                                        <strong>{ toTitleCase( plan?.plan ) } Plan</strong>
                                    </div>
                                    <div className="col-4">
                                        { cedisLocale.format( plan.price || 0 ) }
                                    </div>
                                    {
                                        plan.plan === 'free' &&
                                        <small className='text-muted mt-2'>Try BokxPOS for 14-days, no payments required.</small>
                                    }
                                </div>
                                {/* {
                                    plan.interval === 'annually' &&
                                    <div className="row">
                                        <div className="col-8">
                                            Coupon
                                        </div>
                                        <div className="col-4">
                                            { plan.discount || 0 }
                                        </div>
                                    </div>
                                } */}
                                <Divider className='my-3' />
                                <div className="row">
                                    <div className="col-8">
                                        <strong>TOTAL (USD)</strong>
                                    </div>
                                    <div className="col-4">
                                        <strong>{ cedisLocale.format( ( plan.price || 0 ) - ( plan.discount || 0 ) ) }</strong>
                                    </div>
                                </div>
                                {/* <Divider /> */ }

                                {/* <div className='mt-4'>
                                    <input
                                        disabled={ plan.interval !== 'annually' }
                                        type="text" className='input is-small' placeholder='coupon code here' name="coupon_code" id="couponCode" />
                                    <button
                                        disabled={ plan.interval !== 'annually' }
                                        className='button is-small is-default mt-2' type='submit'>apply coupon</button>
                                </div> */}
                            </> :
                            <Chip className='mt-4' color='default' label="Choose a plan to proceed" />
                    }
                </div>
            </div>

        </div>
    );
}

export default PlanSetup;