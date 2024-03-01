import * as XLSX from "xlsx";
import { notification } from "antd";
import { differenceInDays, isPast } from "date-fns";
import { parkingEncryptionKey } from "./config";
import _ from "lodash";
import { productLevelSchema, productSchema, productSuppliersSchema, productVariantSchema } from './schemas'
import { ROLES, getRole, resouces } from "./auth";
const CryptoJS = require( "crypto-js" );
import { rbac } from './roles'
import validator from "validator";
import currencies from '../currencies.json'
import countries from '../countries.json'


export const cedisLocale = Intl.NumberFormat( "en-GH" );


/**
 * Converts all the first alphabetic characters in a string to uppercase.
 * @param {string} word word or sentence you wanna manipulate
 * @returns {string} word
 */
export const toTitleCase = ( word ) => {
	let firstChar = word?.slice( 0, 1 ),
		remainder = word?.slice( 1 );
	return `${ firstChar.toUpperCase() }${ remainder.toLowerCase() }`;
};


/**
 * calculates price change % without the percentage sign
 * @param {number} oldPrice the old or previous price which has been changed
 * @param {number} newPrice the new price 
 * @returns {number}
 */
export const priceChangePercentage = ( oldPrice, newPrice ) => {
	if ( oldPrice === null || undefined ) return;
	if ( newPrice === null || undefined ) return;

	const change = oldPrice - newPrice;
	if ( change <= 0 ) return 0;

	const percentage = change / oldPrice;
	return ( percentage * 100 ).toFixed( 0 );
};


/**
 * generates a random number between a specified start and end parameters
 * @param {number} min minimum or starting number
 * @param {number} max maximum or closing/end number
 * @returns {number} random number
 */
export function getRandomNumberBetween ( min, max ) {
	return Math.floor( Math.random() * ( max - min + 1 ) + min );
}

/**
 * encrypts a string using the provided key
 * @param {string} string the string to encrypt
 * @param {string} key the encryption key to use
 * @returns {string} the encrypted string
 */
export const encryptString = ( string, key ) => {
	return CryptoJS.AES.encrypt( string, key ).toString();
};


/**
 * decrypts an encrypted string using the provided key
 * @param {string} string the encrypted string to decrypt
 * @param {string} key the decryption key
 * @returns {string} the decrypted string
 */
export const decryptString = ( string, key ) => {
	const decrypted = CryptoJS.AES.decrypt( string, key );
	return decrypted.toString( CryptoJS.enc.Utf8 );
};


/**
 * converts the given string into a valid url
 * @param {string} text the string to convert into a url
 * @returns {string} the url
 */
export const toUrl = ( text ) => {
	if ( text === undefined || text.length === 0 || text === "" ) return;
	return text.trim().toLowerCase().replace( " ", "-" );
};


/**
 * returns the number of days to (or past) the expiry date
 * @param {Date} expiryDate the expiry date 
 * @returns {number} days remaining
 */
export const daysToExpiry = ( expiryDate ) => {
	try {
		if ( _.isEmpty( expiryDate ) ) {
			return;
		}
		return differenceInDays( new Date( expiryDate ), new Date() );
	} catch ( ex ) {
		// openNotification( "days to expire", ex, "error" );
		return;
	}
};


/**
 * exports a given table's data to spreadsheet document
 * @param {string} tableId DOM id of the table element
 * @param {string} fileName the spreadsheet filename when generate
 * @param {string} sheetName the sheet name for the document
 * @returns any
 */
export const exportToExcel = (
	tableId,
	fileName = "BokxPOS WORKBOOK",
	sheetName = "sheet1"
) => {
	try {
		var elt = document.getElementById( tableId );
		var wb = XLSX.utils.table_to_book( elt, { sheet: sheetName } );
		return XLSX.writeFile( wb, `${ fileName }.xlsx` );
	} catch ( ex ) {
		alert( 'error exporting...' )
		// openNotification(
		// 	"Export Error",
		// 	"there was an error exporting to excel",
		// 	"error"
		// );
	}
};


/**
 * checks if the app is running as an electron package
 * @returns {Boolean}
 */
export const isElectron = () => {
	const userAgent = navigator.userAgent.toLowerCase();
	return userAgent.indexOf( " electron/" ) !== -1;
};


/**
 * returns a url formatted string from an array of strings
 * @param {string[]} paths list of strings to convert into a url
 * @return {string}
 */
export const generateRoute = ( paths ) => {
	let path = "";

	if ( _.isEmpty( paths ) )
		return ""

	paths.map( ( p ) => {
		path += "/" + p.trim().replace( "/", "" );
	} );

	return path;
};



/**
 * validate product details, detect errors and return results
 * @param {object} product product details
 * @param {Array} stocks list of product stock levels
 * @param {Array} variants list of product variants
 * @param {Array} suppliers list of product suppliers
 * @return {object} an error flag bool & messsage else the cleaned data
 */
export const validateItem = ( product, stocks, variants, suppliers ) => {
	try {

		let isError = false
		let message = ''
		let schemaOptions = {
			abortEarly: true,
			stripUnknown: true,
		}

		// validate product
		const cleanedProduct = productSchema.validateSync( product, schemaOptions )
		const cleanedStocks = productLevelSchema.validateSync( stocks, schemaOptions )
		const cleanedVariants = productVariantSchema.validateSync( variants, schemaOptions )
		const cleanedSuppliers = productSuppliersSchema.validateSync( suppliers, schemaOptions )


		// validate stock
		if ( cleanedProduct.expiry_date && isPast( new Date( cleanedProduct.expiry_date ) ) )
			return {
				isError: true,
				message: 'expiry date cannot be in the past'
			}

		if ( !cleanedProduct.is_a_service && ( cleanedStocks.length === 0 ) )
			return {
				isError: true,
				message: 'No stock (quantities) found'
			}

		if ( cleanedSuppliers.length === 0 )
			return {
				isError: true,
				message: 'Supplier(s) not found!'
			}

		if ( cleanedProduct.product_type === 'variant' && variants.length === 0 )
			return {
				isError: true,
				message: 'Variant(s) not found!'
			}

		return {
			isError: false,
			data: {
				product: cleanedProduct,
				stocks: cleanedStocks,
				suppliers: cleanedSuppliers,
				variants: cleanedVariants
			}
		}

	} catch ( err ) {
		return {
			message: err.errors[ 0 ],
			isError: true
		}
	}
};



/**
 * Returns a numeric value denoting the password strength
 * @param {string} password the password string
 * @returns {number}
 */
export const passwordStrength = ( password ) => {
	return validator.isStrongPassword( password, {
		minLength: 6,
		minLowercase: 1,
		minSymbols: 1,
		minUppercase: 1,
		pointsForContainingLower: 5,
		pointsForContainingSymbol: 10,
		pointsForContainingUpper: 5,
		pointsForContainingNumber: 5,
		pointsPerUnique: 5,
		// pointsPerRepeat: 0,
		returnScore: true
	} );
};


/**
 * check if a user has the appropriate permission to perform an action on a given resource
 * @param {string} resouce application resource to check permission against
 * @param {string} action a specified action that a given user can perform e.g. edit
 * @returns {Boolean}
 */
export const hasPermission = ( resouce, action ) => {
	try {
		if ( rbac[ ROLES[ getRole() ] ][ resouces[ resouce ] ][ action ] )
			return true;
		else
			return false;
	} catch ( error ) {
		return false;
	}
}


/**
 * censors (masks) an email an address
 * @param {string} email email address to mask
 * @returns {Array}
 */
export const maskEmail = ( email ) => {
	if ( validator.isEmail( email ) ) {
		const esplit = email.trim().toLowerCase().split( "@" )
		const mask = esplit[ 0 ].length > 3 ?
			`${ esplit[ 0 ].substring( 0, 2 ) }****${ esplit[ 0 ].substring( esplit[ 0 ].length - 1 ) }` :
			`${ esplit[ 0 ].substring( 0, 2 ) }****`

		return `${ mask }@${ esplit[ 1 ] }`
	}

	return null
}


/**
 * returns all parked (draft) sales for the given outlet
 * @param {string} outlet_id id of the current active user outlet
 * @returns {Array}
 */
export const getOutletParkedSales = ( outlet_id ) => {
	let drafts = localStorage.getItem( '_bokx_parkedsales' )
	if ( _.isEmpty( drafts ) )
		return null

	// const decryptedDrafts = decryptString( drafts, parkingEncryptionKey )
	drafts = JSON.parse( drafts )
	return drafts.filter( ds => ds.outlet_id === outlet_id )
}


/**
 * park or put a sale transaction into draft mode for later retrieval
 * @param {Object} sale the sale object to park or put in draft mode
 * @param {string} outlet_id the associate outlet id for the provided draft sale
 */
export const setOutletParkedSales = ( sale, outlet_id ) => {
	let drafts = getOutletParkedSales( outlet_id )

	if ( drafts?.length > 0 )
		drafts = [ ...drafts, sale ]
	else
		drafts = [ sale ]

	// const encryptedDrafts = encryptString( JSON.stringify( drafts ), parkingEncryptionKey )
	localStorage.setItem( '_bokx_parkedsales', JSON.stringify( drafts ) )
}



/**
 * removes the identified parked / draft sale transaction from the list of parked sales
 * @param {string} parking_id the id for a particular parked sale transaction
 * @param {string} outlet_id the associated outlet with the parked sale
 * @returns { Boolean | undefined}
 */
export const removeParkedSale = ( parking_id, outlet_id ) => {
	let drafts = localStorage.getItem( '_bokx_parkedsales' )

	if ( _.isEmpty( drafts ) )
		return false

	// const decryptedDrafts = decryptString( drafts, parkingEncryptionKey )
	drafts = JSON.parse( drafts )

	const others = drafts?.filter( df => df.outlet_id !== outlet_id )
	const updatedOutlets = drafts
		?.filter( df => df.outlet_id === outlet_id )
		?.filter( outP => outP.parking_id !== parking_id )

	// const strDrafts = encryptString( JSON.stringify( [ ...others, ...updatedOutlets ] ), parkingEncryptionKey )
	const strDrafts = JSON.stringify( [ ...others, ...updatedOutlets ] )
	localStorage.setItem( '_bokx_parkedsales', strDrafts )
}



/**
 * returns details of a currency based on the provided code
 * @param {string} code currency code to search for
 */
export const findCurrency = ( code ) => {
	return currencies.find( cur => cur.code == code )
}


/**
 * returns details of a country based on the provided code
 * @param {string} code country code to search for
 */
export const findCountry = ( code ) => {
	return countries.find( coun => coun.code === code )
}
