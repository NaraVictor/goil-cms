import axios from "axios";
import { getToken } from "./auth";
import { appUrl } from "./config";

export const fetchQuery = async ( url = "", auth = true, config ) => {
	try {
		if ( auth ) axios.defaults.headers.common[ "authorization" ] = getToken();

		const res = await axios.get( `${ appUrl }/${ url }`, config );
		return res;
	} catch ( ex ) {
		return ex;
	}
};

export const postQuery = async ( url = "", data = {}, auth = true, config ) => {
	try {
		if ( auth ) axios.defaults.headers.common[ "authorization" ] = getToken();

		const res = await axios.post( `${ appUrl }/${ url }`, data, config );
		return res;
	} catch ( ex ) {
		return ex;
	}
};

export const updateQuery = async ( url = "", data = {}, auth = true, config ) => {
	try {
		if ( auth ) axios.defaults.headers.common[ "authorization" ] = getToken();

		const res = await axios.put( `${ appUrl }/${ url }`, data, config );
		return res;
	} catch ( ex ) {
		return ex;
	}
};

export const patchQuery = async ( url = "", data = {}, auth = true, config ) => {
	try {
		if ( auth ) axios.defaults.headers.common[ "authorization" ] = getToken();

		const res = await axios.patch( `${ appUrl }/${ url }`, data, config );
		return res;
	} catch ( ex ) {
		return ex;
	}
};

export const deleteQuery = async ( url = "", config, auth = true, ) => {
	try {
		if ( auth ) axios.defaults.headers.common[ "authorization" ] = getToken();

		const res = await axios.delete( `${ appUrl }/${ url }`, config );
		return res;
	} catch ( ex ) {
		return ex;
	}
};


// PRODUCTS
export const getProduct = async ( id ) => {
	const qry = await fetchQuery( `products/${ id }` );
	return qry.data.data;
};

export const getAllProducts = async ( isLight ) => {
	const qry = await fetchQuery( `products${ isLight ? '?light=true' : '' }` );
	return qry.data.data;
};

export const postNewProduct = async ( data ) => {
	return await postQuery( "products", data );
};

export const putProduct = async ( data ) => {
	return await updateQuery( `products`, data );
};

export const deleteProduct = async ( id ) => {
	return await deleteQuery( `products/${ id }` );
};



// CUSTOMERS
export const getCustomer = async ( id ) => {
	const qry = await fetchQuery( `customers/${ id }` );
	return qry.data.data;
};

export const getAllCustomers = async () => {
	const qry = await fetchQuery( `customers` );
	return qry.data.data;
};

export const postNewCustomer = async ( data ) => {
	return await postQuery( "customers", data );
};

export const putCustomer = async ( data ) => {
	return await updateQuery( `customers`, data );
};

export const deleteCustomer = async ( id ) => {
	return await deleteQuery( `customers/${ id }` );
};



// SALES
export const getSale = async ( id ) => {
	const qry = await fetchQuery( `sales/${ id }` );
	return qry.data.data;
};

export const getSaleReceipt = async ( receiptNo ) => {
	const qry = await fetchQuery( `sales/receipts/${ receiptNo }` );
	return qry.data.data;
};


export const getPayments = async ( saleId, sequenceId, filter ) => {
	const qry = await fetchQuery( `sales/payments?sale_id=${ saleId }&sequence_id=${ sequenceId }&filter=${ filter }` );
	return qry.data.data;
};

export const getAllSales = async ( isLight ) => {
	const qry = await fetchQuery( `sales${ isLight ? '?light=true' : '' }` );
	return qry.data.data;
};

export const getAllSaleReturns = async ( sale_id ) => {
	const qry = await fetchQuery( `sales/${ sale_id }/returns` );
	return qry.data.data;
};


export const postNewSale = async ( data ) => {
	return await postQuery( "sales", data );
};

export const putSale = async ( data ) => {
	return await updateQuery( `sales`, data );
};

export const putSalePayment = async ( sale_id, data ) => {
	return await updateQuery( `sales/${ sale_id }/payments`, data );
};

export const putSaleReturn = async ( sale_id, data ) => {
	return await updateQuery( `sales/${ sale_id }/returns`, data );
};

export const deleteSale = async ( id ) => {
	return await deleteQuery( `sales/${ id }` );
};

export const deleteSalePayment = async ( id ) => {
	return await deleteQuery( `sales/payments/${ id }` );
};


// CAMPAIGNS
export const getCampaign = async ( id ) => {
	const qry = await fetchQuery( `campaigns/${ id }` );
	return qry?.data?.data;
};

export const getAllCampaigns = async ( isLight ) => {
	const qry = await fetchQuery( `campaigns${ isLight ? '?light=true' : '' }` );
	return qry?.data?.data;
};

export const postNewCampaign = async ( data ) => {
	return await postQuery( "campaigns", data );
};

export const putCampaign = async ( data ) => {
	return await updateQuery( `campaigns`, data );
};

export const deleteCampaign = async ( id ) => {
	return await deleteQuery( `campaigns/${ id }` );
};



// REGISTERS
export const getRegister = async ( id ) => {
	const qry = await fetchQuery( `registers/${ id }` );
	return qry.data.data;
};

export const getRegisterSequence = async ( id ) => {
	const qry = await fetchQuery( `registers/sequences/${ id }` );
	return qry.data.data;
};

export const getAllRegisters = async () => {
	const qry = await fetchQuery( `registers` );
	return qry.data.data;
};

export const getAllShopRegisters = async ( shop_id ) => {
	const qry = await fetchQuery( `registers/shops/${ shop_id }` );
	return qry.data.data;
};

//  allowed filters are: opened, closed, sequences
// TODO: add a jsDoc?
export const getAllOutletRegisters = async ( outlet_id, filter ) => {
	const qry = await fetchQuery( `registers/outlets/${ outlet_id }?filter=${ filter }` );
	return qry.data.data;
};



// export const getAvailableOutletRegisters = async ( outlet_id ) => {
// 	const qry = await fetchQuery( `registers/outlets/${ outlet_id }/available` );
// 	return qry.data.data;
// };

export const getAllRegisterSequences = async ( register_id ) => {
	const qry = await fetchQuery( `registers/${ register_id }/sequences` );
	return qry.data.data;
};


export const getRegisterSequencePayments = async ( sequence_id ) => {
	const qry = await fetchQuery( `registers/sequences/${ sequence_id }/payments` );
	return qry.data.data;
};


export const postNewRegister = async ( data ) => {
	return await postQuery( "registers", data );
};

export const postNewRegisterSequence = async ( data ) => {
	return await postQuery( "registers/sequences", data );
};

export const putRegister = async ( data ) => {
	return await updateQuery( `registers`, data );
};

export const putCloseSequence = async ( data ) => {
	return await updateQuery( `registers/sequences`, data );
};

export const putJoinSequence = async ( id ) => {
	return await updateQuery( `registers/sequences/${ id }/join` );
};

export const deleteSequence = async ( id ) => {
	return await deleteQuery( `registers/sequences/${ id }` );
};

export const deleteRegister = async ( id ) => {
	return await deleteQuery( `registers/${ id }` );
};



// EXPENSES
export const getExpense = async ( id ) => {
	const qry = await fetchQuery( `expenses/${ id }` );
	return qry.data.data;
};

export const getAllExpenses = async ( isLight ) => {
	const qry = await fetchQuery( `expenses${ isLight ? '?light=true' : '' }` );
	return qry.data.data;
};

export const postNewExpense = async ( data ) => {
	return await postQuery( "expenses", data );
};

export const putExpense = async ( data ) => {
	return await updateQuery( `expenses`, data );
};

export const deleteExpense = async ( id ) => {
	return await deleteQuery( `expenses/${ id }` );
};


// CHARGES
export const getCharge = async ( id ) => {
	const qry = await fetchQuery( `charges/${ id }` );
	return qry.data.data;
};

export const getAllCharges = async () => {
	const qry = await fetchQuery( `charges` );
	return qry.data.data;
};

export const postNewCharge = async ( data ) => {
	return await postQuery( "charges", data );
};

export const putCharge = async ( data ) => {
	return await updateQuery( `charges`, data );
};

export const deleteCharge = async ( id ) => {
	return await deleteQuery( `charges/${ id }` );
};



// SUPPLIERS
export const getSupplier = async ( id ) => {
	const qry = await fetchQuery( `suppliers/${ id }` );
	return qry.data.data;
};

export const getAllSuppliers = async () => {
	const qry = await fetchQuery( `suppliers` );
	return qry.data.data;
};

export const postNewSupplier = async ( data ) => {
	return await postQuery( "suppliers", data );
};

export const putSupplier = async ( data ) => {
	return await updateQuery( `suppliers`, data );
};

export const deleteSupplier = async ( id ) => {
	return await deleteQuery( `suppliers/${ id }` );
};


// RESTOCKS
export const getRestock = async ( id ) => {
	const qry = await fetchQuery( `purchase-order/${ id }` );
	return qry.data.data;
};

export const getRestockReceipt = async ( orderNumber ) => {
	const qry = await fetchQuery( `purchase-order/receipt/${ orderNumber }` );
	return qry.data.data;
};

export const getAllRestocks = async ( isLight ) => {
	const qry = await fetchQuery( `purchase-order${ isLight ? '?light=true' : '' }` );
	return qry.data.data;
};

export const postNewRestock = async ( data ) => {
	return await postQuery( "purchase-order", data );
};

export const putRestock = async ( data ) => {
	return await updateQuery( `purchase-order`, data );
};

export const putReceiveStock = async ( data ) => {
	return await updateQuery( `purchase-order/receive`, data );
};

export const deleteRestockLine = async ( restockId, lineId ) => {
	return await deleteQuery( `purchase-order/${ restockId }/line-items/${ lineId }` );
};

export const deleteRestock = async ( id ) => {
	return await deleteQuery( `purchase-order/${ id }` );
};



// CATEGORIES
export const getCategory = async ( id ) => {
	const qry = await fetchQuery( `categories/${ id }` );
	return qry.data.data;
};

export const getAllCategories = async ( type ) => {
	const qry = await fetchQuery( `categories?type=${ type }` );
	return qry.data.data;
};

export const postNewCategory = async ( data ) => {
	return await postQuery( "categories", data );
};

export const putCategory = async ( data ) => {
	return await updateQuery( `categories`, data );
};

export const deleteCategory = async ( id ) => {
	return await deleteQuery( `categories/${ id }` );
};



// STAFFS
export const getStaff = async ( id ) => {
	const qry = await fetchQuery( `staffs/${ id }` );
	return qry.data.data;
};

export const getAllStaffs = async () => {
	const qry = await fetchQuery( `staffs` );
	return qry.data.data;
};

export const postNewStaff = async ( data ) => {
	return await postQuery( "staffs", data );
};


export const putStaff = async ( data ) => {
	return await updateQuery( `staffs`, data );
};

export const deleteStaff = async ( id ) => {
	return await deleteQuery( `staffs/${ id }` );
};




// SETTINGS
export const getSettings = async () => {
	const qry = await fetchQuery( `settings` );
	return qry.data.data;
};

export const postNewSetting = async ( data ) => {
	return await postQuery( "settings", data );
};

export const putSettings = async ( data ) => {
	return await updateQuery( `settings`, data );
};




// SHOP / OUTLET
export const getShop = async ( id ) => {
	const qry = await fetchQuery( `shops/${ id }` );
	return qry.data.data;
};

export const getOutlet = async ( shop_id, outlet_id ) => {
	const qry = await fetchQuery( `shops/${ shop_id }/outlets/${ outlet_id }` );
	return qry.data.data;
};

export const getAllShops = async () => {
	const qry = await fetchQuery( `shops` );
	return qry.data.data;
};

export const getAllOutlets = async ( shop_id ) => {
	const qry = await fetchQuery( `shops/${ shop_id }/outlets` );
	return qry.data.data;
};

export const postNewOutlet = async ( shop_id, data ) => {
	return await postQuery( `shops/${ shop_id }/outlets`, data );
};

export const putShop = async ( data ) => {
	return await updateQuery( `shops`, data );
};

export const putOutlet = async ( shop_id, data ) => {
	return await updateQuery( `shops/${ shop_id }/outlets`, data );
};

export const putMakeHQ = async ( id ) => {
	return await updateQuery( `shops/outlets/${ id }/make-hq` );
};

export const putCloseOutlet = async ( id ) => {
	return await updateQuery( `shops/outlets/${ id }/close-down` );
};

export const deleteShop = async ( id ) => {
	return await deleteQuery( `shops/${ id }` );
};

export const deleteOutlet = async ( id ) => {
	return await deleteQuery( `shops/outlets/${ id }` );
};





// REPORTING
export const getSalesReport = async ( id ) => {
	const qry = await fetchQuery( `reports/sales` );
	return qry.data.data;
};

export const getProductsReport = async () => {
	const qry = await fetchQuery( `reports/products` );
	return qry.data.data;
};

export const getExpensesReport = async () => {
	const qry = await fetchQuery( `reports/expenses` );
	return qry.data.data;
};

export const getPaymentsReport = async () => {
	const qry = await fetchQuery( `reports/payments` );
	return qry.data.data;
};

export const getRestocksReport = async () => {
	const qry = await fetchQuery( `reports/restocks` );
	return qry.data.data;
};



// AUTH / ACCOUNTS
export const getUser = async ( id ) => {
	const qry = await fetchQuery( `accounts/${ id }` );
	return qry.data.data;
};

export const getAllUsers = async ( shop_id ) => {
	const qry = await fetchQuery( `accounts/shop/${ shop_id }` );
	return qry.data.data;
};

export const getUserOutlets = async ( user_id ) => {
	const qry = await fetchQuery( `accounts/${ user_id }/outlets` );
	return qry.data.data;
};

export const getRefreshToken = async () => {
	const qry = await fetchQuery( `accounts/refresh-token` );
	return qry.data;
};

export const postAddUser = async ( user ) => {
	return await postQuery( "accounts/add-user", user );
};

export const postSignup = async ( data ) => {
	return await postQuery( "accounts/signup", data, false );
};

export const postLogin = async ( user ) => {
	return await postQuery( "accounts/login", user, false );
};


export const postResetPassword = async ( email ) => {
	return await postQuery( "accounts/reset-password", { email }, false );
};

export const postAttendance = async ( data ) => {
	return await postQuery( `accounts/attendance`, data );
};

export const putAttendance = async ( id ) => {
	return await updateQuery( `accounts/attendance/${ id }` );
};

export const putLogout = async ( user_id ) => {
	return await updateQuery( `accounts/${ user_id }/logout` );
};


export const putChangePassword = async ( user ) => {
	return await updateQuery( "accounts/change-password", user, false );
};

export const putToggleUserStatus = async ( id ) => {
	return await updateQuery( `accounts/${ id }/toggle-status` );
};

export const putSwitchOutlet = async ( id ) => {
	return await updateQuery( `accounts/switch-outlet/${ id }` );
};


export const deleteUser = async ( id ) => {
	return await deleteQuery( `accounts/${ id }` );
};

export const putUser = async ( data ) => {
	return await updateQuery( `accounts`, data );
};

// LOGS
export const getLogs = async ( user_id, shop_id ) => {
	const qry = await fetchQuery( `accounts/logs?user=${ user_id }&shop=${ shop_id }` );
	return qry.data.data;
};


// MISC 
export const getPublicPurchaseOrder = async ( orderNumber, orderHash ) => {
	const qry = await fetchQuery( `public/po/${ orderNumber }/${ orderHash }`, false );
	return qry.data.data;
};

//options {message, channel, recipient, source}
//channles -> sms, email, whatsapp
// source -> same as resources such as inventory, purchase order, staff etc
export const postSendMessage = async ( options ) => {
	return await postQuery( `services/messages`, options );
};


export const postVerifyPayment = async ( reference ) => {
	return await postQuery( `services/payments/verify/${ reference }` );
};