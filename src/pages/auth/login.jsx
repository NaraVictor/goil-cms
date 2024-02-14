import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authenticate, setRole } from "../../helpers/auth";
// import logo from "../../static/img/logo.png";
import PageTitle from '../../components/page-title'
import { appLinks } from "../../helpers/config";
import { Divider, message } from "antd";
import Copyright from '../../components/copyright';
import { postLogin } from "../../helpers/api";
import { Alert, Paper } from "@mantine/core";
import { useMutation } from 'react-query'
import { IconX } from '@tabler/icons-react'

import logo from '../../static/img/logo.png'

const LoginPage = ( props ) => {
	const { register, handleSubmit } = useForm();
	const [ show, setShow ] = useState( false );
	const [ errMsg, setErrMsg ] = useState( "" );

	const navigate = useNavigate();


	const { mutateAsync, isLoading } = useMutation( ( data ) => postLogin( data ), {
		onSuccess: ( data, variables, context ) => {
			if ( data.status === 201 ) {
				authenticate(
					'randomeomsdnuasdsadoernc80123o1n₭zxc9j401-1249324mkmsd',
					{
						id: '4ee324b3-4dd5-44ba-82f6-5563ee5365cd',
						email: 'dan@email.com',
						role: 'superuser',
						staff_id: '63e1a2fa-ab8d-405a-a200-083ac6884dd4',
						staff_name: 'Daniel Adjei',
						shop_id: '331e0639-1102-4fa1-8876-b2f41281aad9',
						attendance_id: 'ab5f99ac-7f2c-4030-b38c-f407a98f66cd',
						shop_name: 'Goil Station',
						currency: 'GHS',
						country: 'Ghana',
						outlets: [ 'af402d38-e2c9-4f17-a0a4-d228ee3cddd2', '5aea418d-9a02-480d-8c9f-7e264e164d63' ],
						outlet_id: '5aea418d-9a02-480d-8c9f-7e264e164d63',

						register: {
							id: 'f7af76ff-bdd5-4080-8742-abb83f865b1d',
							register_name: 'Main',
							sequence_id: '2938bd35-102b-4521-9b44-f8f65c95b23f',
							sequence_name: 'Seq00001'
						}
					}
				);
				// authenticate(
				// 	data.data.token,
				// 	data.data.user
				// );
				navigate( appLinks.home, { replace: true } );
				return
			}

			throw data;
		},


		onError: ( error, variables, context ) => {
			const err = error.response.data.message;

			if ( _.isArray( err ) ) {
				err.map( err => message.error( err.message )
				);
				setErrMsg( 'login error' );
			}
			else {
				// message.error( err );
				setErrMsg( err );
			}

		},
	} );


	return (
		<div>
			<PageTitle title="Login" />
			<div className="row">
				<div className="mx-auto col-md-4 col-11">
					<div className="">
						<div className="text-center">
							<div className="mt-3">
								<img src={ logo } width={ 200 } alt="Goil App logo" />
							</div>
							<h5>Login</h5>
							{/* <p className="text-secondary">provide your credentials to proceed</p> */ }
						</div>
						{ errMsg && (
							<Alert
								icon={ <IconX /> }
								variant="filled" color="red" className="text-center mt-3">
								{ errMsg }
							</Alert>
						) }
						<form onSubmit={ handleSubmit( data => {

							// mutateAsync( { ...data, version: process.env.REACT_APP_VERSION } )
							authenticate(
								'randomeomsdnuasdsadoernc80123o1n₭zxc9j401-1249324mkmsd',
								{
									id: '4ee324b3-4dd5-44ba-82f6-5563ee5365cd',
									email: 'dan@email.com',
									role: 'superuser',
									staff_id: '63e1a2fa-ab8d-405a-a200-083ac6884dd4',
									staff_name: 'Daniel Adjei',
									shop_id: '331e0639-1102-4fa1-8876-b2f41281aad9',
									attendance_id: 'ab5f99ac-7f2c-4030-b38c-f407a98f66cd',
									shop_name: 'Goil Station',
									currency: 'GHS',
									country: 'Ghana',
									outlets: [ 'af402d38-e2c9-4f17-a0a4-d228ee3cddd2', '5aea418d-9a02-480d-8c9f-7e264e164d63' ],
									outlet_id: '5aea418d-9a02-480d-8c9f-7e264e164d63',

									register: {
										id: 'f7af76ff-bdd5-4080-8742-abb83f865b1d',
										register_name: 'Main',
										sequence_id: '2938bd35-102b-4521-9b44-f8f65c95b23f',
										sequence_name: 'Seq00001'
									}
								}
							);
							navigate( appLinks.home, { replace: true } );
						} )

						}>
							<Paper withBorder shadow="md" p={ 30 } radius="md" mt="xl">
								<div className="mx-auto row">
									<div className="field">
										<label className="mb-0 label" htmlFor="email">Email</label>
										<p className="mb-1 control has-icons-left">
											<input className="input"
												autoFocus
												autoComplete
												type="email"
												{ ...register( "email", { required: true } ) }
												id="email" placeholder="email" />
											<span className="icon is-small is-left">
												<i className="bi bi-person"></i>
											</span>
										</p>
									</div>
									<div className="field">
										<label className="mb-0 label" htmlFor="password">Password</label>
										<p className="control has-icons-left">
											<input className="input"
												id="password"
												autoComplete
												type={ `${ !show ? 'password' : 'text' }` }
												{ ...register( "password", { required: true } ) }
												placeholder="password" />
											<span className="icon is-small is-left " >
												<i className="bi bi-lock hover-hand" ></i>
											</span>
											<small className="text-secondary hover-hand" onClick={ () => setShow( !show ) }>
												{ `${ !show ? 'show ' : 'hide ' } password` }
											</small>
										</p>
									</div>

									<div >
										<button className={ `bokx-btn btn-prim w-100 ${ isLoading && ' button is-loading' }` } >Login</button>
									</div>
								</div >
							</Paper>
						</form >
						<div className="px-3 mt-3 row">
							<div className="d-flex justify-content-between">
								<Link to={ appLinks.resetpassword }>Reset Password</Link>
								<Link to={ appLinks.signup }> <strong>Signup</strong>	</Link>
							</div>
							<Divider />
							<p className="mb-1">Having challenges?
								<Link to="/"> Get help</Link>
							</p>
							<small>
								<Copyright />
							</small>
						</div>
					</div >
				</div >
			</div >
		</div >
	);
};




export { LoginPage };
