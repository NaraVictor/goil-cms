import PageTitle from "../components/page-title";
import { useNavigate } from "react-router-dom";
import adImage from '../static/img/access-denied.png'

const NotAuthorized = ( props ) => {
	const navigate = useNavigate();
	return (
		<div className="mx-auto mt-5 text-center w-50">
			<PageTitle title="Access Denied" />
			<div className="pb-3">
				<img src={ adImage } alt="access denied image" width="200" height="200" />
				<h1 className="p-2 mb-0 mt-3 text-white bg-danger">Access Denied</h1>
				<h5 className="text-white bg-black p-2">You cannot access this resource</h5>
				<button
					className="bokx-btn mt-2"
					onClick={ () => navigate( -1, { replace: true } ) }>
					OK!
				</button>
			</div>
		</div >
	);
};

export default NotAuthorized;
