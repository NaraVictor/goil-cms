import PageTitle from "../components/page-title";
import { getUser, refreshToken } from "../helpers/auth";
import { Divider, Tag, message } from "antd";
import { IconChevronRight } from "@tabler/icons-react";
import { Avatar, Group, LoadingOverlay, Text } from "@mantine/core";
import { putSwitchOutlet } from "../helpers/api";
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import _ from "lodash";

const SwitchOutlet = ( props ) => {
	const user = getUser()
	const nav = useNavigate()


	const { mutateAsync: switchUp, isLoading, isSuccess } = useMutation( ( data ) => putSwitchOutlet( data ), {
		onSuccess: ( data, variables, context ) => {
			if ( data.status === 200 ) {
				refreshToken().then( () => {
					nav( -1, { replace: true } )
				} )
			}

			throw data;
		},

		onError: ( error, variables, context ) => {
			const err = error.response.data.message;

			if ( _.isArray( err ) ) {
				err.map( err =>
					message.error( err.message )
				);
			}
			else {
				message.error( err );
			}
		},
		retry: true
	} );



	const handleSwitch = ( id ) => {
		if ( id === user.outlet_id ) {
			message.error( { content: 'Cannot switch to active outlet' } )
			return
		}

		switchUp( id )

	}


	return (
		<div className="mt-5">
			<PageTitle title="Switch Outlet" />
			<LoadingOverlay visible={ ( isLoading || isSuccess ) } />
			<div className="row">
				<div className="col-md-4 col-12 p-4 border bokx-bg-secondary rounded mx-auto">
					<h6>Switch Outlet</h6>
					<Divider className="mb-1" />
					<p>
						Below are outlets assigned to you. All unsaved work will be lost when you switch. Click to switch!
					</p>
					<Divider className="mt-1" />
					{
						user.outlets?.map( outlet => {
							return (
								<div className="card mb-2">
									<Group className="p-2 hover-hand" onClick={ () => handleSwitch( outlet.id ) }>
										<Avatar radius="xl">
											<span className="bi bi-shop"></span></Avatar>

										<div style={ { flex: 1 } }>
											<Text size="md" weight={ 500 }>
												{ outlet.outlet_name }
												{
													user.outlet_id === outlet.id && <Tag color="green" className="ms-3">Active Outlet</Tag>
												}
											</Text>
										</div>
										<IconChevronRight size="1rem" />
									</Group>
								</div>
							)
						} )
					}
					<Divider />
					<button className="button bokx-btn"
						onClick={ () => nav( -1, { replace: true } ) }
					>
						{/* <span className="bi bi-arrow-left me-2" /> */ }
						Exit
					</button>
				</div>
			</div>
		</div >
	);
};

export { SwitchOutlet }
