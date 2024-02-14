import {
	createStyles,
	Paper,
	Title,
	Text,
	TextInput,
	Container,
	Group,
	Anchor,
	Center,
	Box,
	Alert,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/page-title";
import { RequiredIndicator } from "../../components/shared";
import { postResetPassword } from "../../helpers/api";
import { appLinks } from "../../helpers/config";
import logo from '../../static/img/logo.png';


const useStyles = createStyles( ( theme ) => ( {
	title: {
		fontSize: 26,
		fontWeight: 900,
		fontFamily: `Greycliff CF, ${ theme.fontFamily }`,
	},

	controls: {
		[ theme.fn.smallerThan( "xs" ) ]: {
			flexDirection: "column-reverse",
		},
	},

	control: {
		[ theme.fn.smallerThan( "xs" ) ]: {
			width: "100%",
			textAlign: "center",
		},
	},
} ) );

export function ResetPassword () {
	const { classes } = useStyles();
	const [ email, setEmail ] = useState( '' );
	const [ msg, setMsg ] = useState( '' );
	const [ busy, setBusy ] = useState( false );
	const nav = useNavigate();

	const handleSubmit = ( e ) => {
		e.preventDefault();

		if ( !email ) {
			message.info( "Please provide your email address" );
			return;
		}

		setBusy( true );

		postResetPassword( email )
			.then( ( res ) => {
				if ( res.status === 201 ) {
					// message.success( "Check your inbox!" );
					setMsg( `
					Great, we sent you an email at ${ email }. 
					Please check your inbox and click the confirmation link.` );
					setEmail( '' )
					return;
				} else
					throw res;
			} )
			.catch( ( ex ) => {
				message.error(
					ex.response.data.message || "Something went wrong. Contact Admin"
				);
			} )
			.finally( () => {
				setBusy( false );
			} );
	};

	return (
		<Container size={ 460 } my={ 30 }>
			<PageTitle title="Reset Password" />
			<Title className={ classes.title } align="center">
				Reset your password
			</Title>
			{
				msg ?
					<Alert
						icon={ <IconCheck /> }
						variant="filled" color="green" className="text-center mt-3">
						{ msg }
					</Alert> :
					<Text color="dimmed" size="sm" align="center">
						Enter your account email to receive reset instructions
					</Text>
			}
			<form onSubmit={ handleSubmit } method="POST">
				<Paper withBorder shadow="md" p={ 30 } radius="md" mt="xl">
					<label htmlFor="email">
						Your email
						<RequiredIndicator />
					</label>
					<input
						id="email"
						type="email"
						onChange={ ( e ) => setEmail( e.target.value ) }
						value={ email }
						className="input"
						placeholder="you@email.com"
						required
					/>
					<Group position="apart" mt="lg" className={ classes.controls }>
						<Anchor
							color="dimmed"
							size="sm"
							className={ classes.control }
							// href={ appLinks.login }
							onClick={ () => nav( appLinks.login ) }

						>
							<Center inline>
								<span className="bi bi-arrow-left" />
								<Box ml={ 5 }>Login</Box>
							</Center>
						</Anchor>
						<button
							type="submit"
							className={ `button  app-btn btn-prim ${ busy && "is-loading" } ${ classes.control
								}` }
						>
							Reset Password
						</button>
					</Group>
				</Paper>
			</form>
		</Container>
	);
}
