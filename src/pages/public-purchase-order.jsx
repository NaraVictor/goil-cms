import logo from '../static/img/logo.png'
import Copyright from "../components/copyright";
import PageTitle from "../components/page-title";
import { useParams } from "react-router-dom";
import PublicPurchaseOrderReceipt from '../components/public-purchase-order-receipt'
import { Divider } from "antd";

const PublicPurchaseOrder = ( props ) => {
	const { orderNumber, orderHash } = useParams()

	return (
		<div>
			<PageTitle title="Purchase Order" />
			<div className="row">
				<div className="col-11 col-md-8 mx-auto">
					<p className="d-flex mt-3 mb-0">
						<img src={ logo } style={ { maxWidth: '50px', maxHeight: '50px' } } className='d-block' alt="BokxPOS App logo" />
						<div className="ms-2">
							<h5 className='mb-0'>Goil</h5>
							<Copyright />
						</div>
					</p>
					<Divider />
					<PublicPurchaseOrderReceipt orderNumber={ orderNumber } orderHash={ orderHash } />
				</div>
			</div>
		</div>
	);
};




export { PublicPurchaseOrder };
