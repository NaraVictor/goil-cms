import { decryptString, encryptString } from "./utilities";
import {
	roleEncryptionKey,
	tokenEncryptionKey,
	userEncryptionKey,
} from "./config";
import _ from "lodash";
import validator from 'validator'
import { getRefreshToken } from './api'

const authenticate = ( token, user ) => {
	if ( token ) {
		const eToken = encryptString( token, tokenEncryptionKey );
		sessionStorage.setItem( "glTkn", eToken );
	}

	if ( user ) {
		const decryptedUser = decryptString( user, userEncryptionKey );
		setRole( decryptedUser.role );
		sessionStorage.setItem( "glUsr", user );
	}
};

const getToken = () => {
	return decryptString( sessionStorage.getItem( "glTk" ), tokenEncryptionKey );
	// return sessionStorage.getItem( "glTk" );
};

const refreshToken = async () => {
	const { token, user } = await getRefreshToken()
	logOut()
	authenticate( token, user )
};

const getUser = () => {
	const user = sessionStorage.getItem( "glUsr" );
	if ( !user ) return;

	return JSON.parse( decryptString( user, userEncryptionKey ) );
};

// const updateUser = ( data ) => {
// 	const usr = getUser()

// 	const updatedUser = {
// 		...usr,
// 		..._.omit( data, [
// 			'id', 'email', 'role', 'staff_id',
// 			'shop_id', 'outlet_id', 'outlets' ] )
// 	}

// 	authenticate( null, encryptString( JSON.stringify( updatedUser ), userEncryptionKey ) )
// }

const logOut = () => {
	sessionStorage.removeItem( "glTk" );
	sessionStorage.removeItem( "glUsr" );
	removeRole();
};

const isAuthenticated = () => {
	const token = sessionStorage.getItem( "glTk" );
	return token ? true : false;
};

const setRole = ( role ) => {
	const r = encryptString( role, roleEncryptionKey );
	sessionStorage.setItem( "glRl", r );
};

const removeRole = () => {
	sessionStorage.removeItem( "glRl" );
};

const getRole = () => {
	const r = sessionStorage.getItem( "glRl" );
	return decryptString( r, roleEncryptionKey );
};

const isAdmin = ( userId ) => {
	return getUser().id === userId;
};

export const getRegister = () => {
	const usr = getUser()
	return usr.register
}

// export const removeRegister = () => {
// 	const usr = getUser()
// 	const updatedUser = {
// 		...usr,
// 		register: {}
// 	}

// 	authenticate( null, encryptString( JSON.stringify( updatedUser ), userEncryptionKey ) )
// }

// export const toggleRegisterState = ( registerData ) => {
// 	isRegisterOpen()
// 		? removeRegister()
// 		: setRegister( registerData );
// };

export const isRegisterOpen = () => {
	return validator.isUUID( ( getUser()?.register?.sequence_id || '' ), '4' );
};


// export const resetRegister = ( deletedId ) => {
// 	if ( deletedId === getRegister()?.registerId ) {
// 		sessionStorage.removeItem( "bkxRegister" );
// 	}
// };


// ROLES & PERMISSIONS
export const ROLES = [
	{
		value: "admin",
		label: 'Admin'
	},
	{
		value: "manager",
		label: 'Station Manager'
	},
	// {
	// 	value: "accounts",
	// 	label: 'Accounts'
	// },
	{
		value: "attendant",
		label: 'Pump Attendant'
	},

];


// export const ROLES = {
// 	accounts: 'accounts',
// 	attendant: 'attendant',
// 	manager: 'manager',
// 	shopOwner: 'shopowner',
// };


export const resouces = {
	catalog: 'catalog',
	charges: 'charges',
	customers: 'customers',
	expenses: 'expenses',
	outlets: 'outlets',
	products: 'products',
	restock: 'restock',
	reports: 'reports',
	sales: 'sales',
	setup: 'setup',
	shop: 'shop',
	suppliers: 'suppliers',
	users: 'users',
};

export const action = {
	canCreate: 'canCreate',
	canRead: 'canRead',
	canUpdate: 'canUpdate',
	canDelete: 'canDelete'
};


export {
	authenticate,
	isAuthenticated,
	getToken,
	refreshToken,
	logOut,
	setRole,
	getRole,
	removeRole,
	getUser,
	// updateUser,
	isAdmin,
};
