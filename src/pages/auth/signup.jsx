import React, { useEffect, useState } from "react";
import PageTitle from '../../components/page-title'
import { Stepper, Button, Group, Alert, Loader } from '@mantine/core'

import BusinessStep from '../../components/pages/auth/business';
// import CategoryStep from '../../components/pages/auth/category';
import UserSetup from "../../components/pages/auth/user";
import PlanSetup from "../../components/pages/auth/plan";
import _ from 'lodash';
import { PaystackButton } from "react-paystack"
import PayStackPayment from '../../components/paystack'

// 
import { appLinks } from "../../helpers/config";
import { postSignup, postVerifyPayment } from "../../helpers/api";
import { Link, useSearchParams } from 'react-router-dom'
import { useAtom } from "jotai";
import { getSignUpAtom, resetSignUpAtom, shopAtom, shopPlanAtom } from "../../helpers/state/signup";
import { categorySchema, shopSchema, userSchema } from "../../helpers/schemas";
import { useMutation } from 'react-query'
import { message } from 'antd'
import { authenticate } from "../../helpers/auth";
import axios from "axios";
import logo from '../../static/img/logo.png';
// import shopSetupGIF from '../../static/gif/shop.gif';

//
const SignUpPage = () => {
	const [ signup ] = useAtom( getSignUpAtom );
	const [ , setShop ] = useAtom( shopAtom )
	const [ , setPlan ] = useAtom( shopPlanAtom )

	const [ meta, setMeta ] = useState( {} )
	const [ , resetSignup ] = useAtom( resetSignUpAtom );
	const [ errMsg, setErr ] = useState( '' )
	const [ isValidated, setIsValidated ] = useState( false )
	const [ params ] = useSearchParams()


	// custom states
	const [ active, setActive ] = useState( 0 );
	const nextStep = () => setActive( ( current ) => ( current < 3 ? current + 1 : current ) );
	const prevStep = () => setActive( ( current ) => ( current > 0 ? current - 1 : current ) );
	const { shop, user, category, plan } = signup
	const payStackReference = new Date().getTime().toString()


	const { mutateAsync, isLoading } = useMutation( ( data ) => postSignup( data ), {
		onSuccess: ( data, variables, context ) => {
			if ( data.status === 201 ) {
				authenticate( data.data.token, data.data.user );
				resetSignup()
				window.location.href = appLinks.home
				return
			}

			throw data;
		},

		onError: ( error, variables, context ) => {
			const err = error.response?.data?.message || error.message;

			if ( _.isArray( err ) ) {
				err.map( err => {
					message.error( err.message )
					setErr( err.message )
				}
				);
			}
			else {
				message.error( err );
				setErr( err )
			}
			setActive( 1 )
		},
		retry: true
	} );


	const validateSignup = async () => {

		// if ( _.isEmpty( plan.plan ) ) {
		// 	setErr( 'Choose a billing plan' )
		// 	setActive( 0 )
		// 	return
		// }


		// if ( plan.plan !== 'free' && _.isEmpty( plan.interval ) ) {
		// 	setErr( 'Please choose a billing interval' )
		// 	setActive( 0 )
		// 	return
		// }

		// shop validation
		shopSchema.validate( shop ).then( () => {

			// category validation
			categorySchema.validate( category ).then( () => {

				// user validation
				userSchema.validate( user ).catch( ( reason ) => {
					setErr( reason.message )
					setActive( 1 )
					return
				} )

			} ).catch( ( reason ) => {
				setErr( reason.message )
				setActive( 1 )
				return
			} )

		} ).catch( ( reason ) => {
			setErr( reason.message )
			setActive( 0 )
			return
		} )

		setErr( "" )
		setActive( 2 )
		return true
	}



	const handleSignup = () => {
		mutateAsync( {
			plan,
			shop, category, user,
			version: process.env.REACT_APP_VERSION,
			...meta
		} )
	}



	// const componentProps = {
	// 	reference: payStackReference,
	// 	email: user.email,
	// 	amount: ( plan.price * ( plan.interval === 'monthly' ? 1 : 12 ) * 100 ), //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
	// 	publicKey: 'pk_test_be6a844598f9c94d35afd0c1335e134a99c72c15', //'pk_live_6569afe780ecb2bb9cedd3d1eb670bd8c2baf3e1',  //process.env.REACT_APP_PAYSTACK_KEY,
	// 	metadata: {
	// 		name: user.first_name + ' ' + user.last_name,
	// 		phone: shop.primary_contact,
	// 	},
	// 	currency: 'GHS',
	// 	text: "Pay Now",
	// 	// onSuccess: () => {
	// 	// 	postVerifyPayment( payStackReference ).then( ( res ) => {
	// 	// 		if ( res.response.status === 200 )
	// 	// 			handleSignup()
	// 	// 	} )
	// 	// },
	// 	// onClose: () => { }
	// }

	useEffect( () => {

		axios.get( 'https://ipapi.co/json/' ).then( res => {
			const data = res.data
			setMeta( {
				city: data?.city,
				ip_address: data?.ip,
				country_code: data?.country_code,
				currency: data?.currency
			} )

			setShop( { field: 'base_currency', value: data?.currency } )
		} ).catch( ex => console.log( 'error fetching client currency info' ) )

		try {
			const plan = params.get( 'plan' )
			const interval = params.get( 'interval' )

			if ( plan && interval ) {
				setPlan( { field: 'plan', value: plan } )
				setPlan( { field: 'interval', value: interval } )
			}

		} catch ( ex ) { null }

	}, [] )


	return (

		<div>
			<PageTitle title="Signup" />
			<div className="row pb-3 px-3 px-md-0">
				<div className="mx-auto col-md-6 col-11">
					<div className="">
						<div className="text-center">
							<div className="mt-3">
								<img src={ logo } height={ 100 } width={ 200 } alt="app logo" />
							</div>
							<h5>Signup</h5>
							<div className="mb-4">
								Already registered? <Link to={ appLinks.login }> <strong>Login</strong> </Link>
							</div>
						</div>
						{
							errMsg &&
							<Alert variant="filled" color="red" className="mb-2">
								{ errMsg }
							</Alert>
						}
						{/* <Stepper color="teal" active={ active }
							breakpoint="sm" allowNextStepsSelect={ false }>
							<Stepper.Step
								icon={ <span className="bi bi-shop" /> }
								label="Shop" description="setup your shop">
								<div className="my-3">
									<BusinessStep />
								</div>
							</Stepper.Step>
							<Stepper.Step
								icon={ <span className="bi bi-person" /> }
								label="User" description="admin signup">
								<div className="my-3">
									<UserSetup />
								</div>
							</Stepper.Step>
							<Stepper.Completed>
								<div className="text-center p-5">
									<img src={ shopSetupGIF } width={ 140 } alt="setting up shop gif" />
									<p><Loader size="sm" className="me-2" />Building your shop. Please wait...</p>
								</div>
							</Stepper.Completed>
						</Stepper> */}
						{
							active < 2 &&
							<Group position="center" mt="xl" className="mb-3">
								{ active !== 0 && <Button color="teal" variant="default" onClick={ prevStep }>Back</Button> }
								{
									active === 1 ?
										// (
										// 	plan.price > 0 ?
										// 		<PayStackPayment
										// 			onSuccess={ () => {
										// 				postVerifyPayment( payStackReference ).then( ( res ) => {
										// 					console.log( res );
										// 					if ( res.response.status === 200 )
										// 						handleSignup()
										// 				} )
										// 			} }
										// 			onClose={ () => {
										// 				setActive( 2 );
										// 				setErr( "Payment cancelled!" )
										// 			} }
										// 			config={ componentProps }
										// 			onBefore={ validateSignup }
										// 		/>
										// 		:
										// 		<Button color="teal" onClick={ () => {
										// 			validateSignup().then( () => {
										// 				handleSignup()
										// 			} )
										// 		} }>
										// 			Signup
										// 		</Button>
										// )

										<Button color="teal" onClick={ e => {
											validateSignup().then( () => {
												handleSignup()
											} )
										} }>
											Signup
										</Button>
										:
										<Button color="teal" onClick={ nextStep }>
											Next Step
										</Button>
								}
							</Group>
						}
					</div>
				</div>
			</div>
		</div >


	);
};

export default SignUpPage;
