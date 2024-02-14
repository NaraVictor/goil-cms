import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { putChangePassword } from "./../../helpers/api";
import PageTitle from "../../components/page-title";
import { appLinks } from "../../helpers/config";
import { Container, Paper } from "@mantine/core";
import { useMutation } from "react-query";
import _ from "lodash";
import { message } from "antd";
import { RequiredIndicator } from "../../components/shared";
import CopyRight from '../../components/copyright'
import logo from '../../static/img/logo.png';


const ChangePassword = ( props ) => {
	const { register, handleSubmit, reset } = useForm();
	const [ errMsg, setErrMsg ] = useState( '' )
	const [ seepwd, setSeePwd ] = useState( false )

	const params = useParams()
	const nav = useNavigate()

	const { mutateAsync, isLoading } = useMutation( ( data ) => putChangePassword( data ), {
		onSuccess: ( data, variables, context ) => {
			if ( data.status === 200 ) {
				message.success( 'done! redirecting...' )
				window.location.href = appLinks.login
				return;
			}

			throw data;
		},

		onError: ( error, variables, context ) => {
			const err = error.response.data.message || error.response.message;

			if ( _.isArray( err ) ) {
				err.map( err =>
					setErrMsg( err.message )
				);
			}
			else {
				setErrMsg( err );
			}

			//messages
			// if ( err.response?.status === 403 )
			// 	return setErrMsg( "Access denied. You are not authorized" );

			// if ( err.response?.status === 404 )
			// 	return setErrMsg( "Account does not exist" );

			// if ( err.response?.status === 400 ) return setErrMsg( "Invalid password" );

			// if ( err.response?.status === 304 )
			// 	return setErrMsg( "Current and new passwords are the same" );

			// if ( err.response?.status === 500 ) return setErrMsg( "Server error" );
		},
		retry: true
	} );



	const onSubmit = ( data ) => {
		if ( data.password !== data.confirmPassword ) {
			setErrMsg( 'Passwords do not match' )
			return
		}

		setErrMsg( '' )
		mutateAsync( {
			...data,
			token: params.token
		} )
	};

	return (

		// <div>
		<Container size={ 460 } my={ 30 }>
			<PageTitle title="Change Password" />
			<div className="text-center">
				<div className="mb-3">
					<img src={ logo } alt="Goil logo" height={ 100 } width={ 200 } />
				</div>
				<h5>Change Password</h5>
			</div>
			{ errMsg && (
				<div className="p-1 mx-3 text-center rounded bg-danger text-light">
					{ errMsg }
				</div>
			) }
			<form onSubmit={ handleSubmit( onSubmit ) }>
				<Paper withBorder shadow="md" p={ 30 } radius="md" mt="xl">
					<div className="mx-auto mt-1 row">
						<div className="field">
							<label htmlFor="email">
								Email
								<RequiredIndicator />
							</label>
							<input
								autoFocus
								id="email"
								className="input"
								type="email"
								placeholder="account email"
								{ ...register( "email", { required: true } ) }
							/>

						</div>
						<div className="field">
							<label htmlFor="password">
								New Password
								<RequiredIndicator />
							</label>
							<input
								id="password"
								type={ `${ seepwd ? 'text' : 'password' }` }
								placeholder="New Password"
								className="input"
								{ ...register( "password", { required: true } ) }
							/>
						</div>
						<div className="field">
							<label htmlFor="confirmPassword">
								Confirm Password
								<RequiredIndicator />
							</label>
							<input
								id="confirmPassword"
								type={ `${ seepwd ? 'text' : 'password' }` }
								placeholder="Confirm Password"
								className="input"
								{ ...register( "confirmPassword", { required: true } ) }
							/>
							<a
								className=""
								onClick={ ( e ) => { e.preventDefault(); setSeePwd( !seepwd ) } }>
								{
									seepwd ? 'hide' : 'show'
								}
							</a>
						</div>
						<div >
							<button type="submit" className={ `bokx-btn btn-prim w-100 button ${ isLoading && ' is-loading' }` } >
								Change Password
							</button>
						</div>
					</div >
					<div className="mx-3 mt-2">
						<button
							className="button is-ghost mt-0 p-0"
							onClick={ ( e ) => {
								e.preventDefault();
								nav( appLinks.login )
							} }>
							<span className="bi bi-arrow-left me-2" />
							Login
						</button>
					</div>
				</Paper>
				<small className="ps-2">
					<CopyRight />
				</small>
			</form >
		</Container >

	);
};

export { ChangePassword };
