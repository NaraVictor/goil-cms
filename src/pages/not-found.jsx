import PageTitle from "../components/page-title";
import lostImg from "../static/svg/icons/lost.svg"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFoundPage = ( props ) => {
	let navigate = useNavigate()

	return (
		<div className="mt-5 text-center">
			<PageTitle title="404 | Not Found" />
			<img src={ lostImg } width="200" height="200" className="mt-5" />
			<h5 className="mt-4 mb-0">404 | Not found</h5>
			<p>Resource not found</p>
			<button className="button bokx-btn"
				onClick={ () => navigate( -1 ) }>
				Go Back
			</button>
		</div>
	);
};

export default NotFoundPage;
