import * as yup from "yup";

export const emailSchema = yup.object( {
	email: yup.string().email().required(),
} );

export const loginSchema = yup.object( {
	email: yup.string().email().required(),
	password: yup.string().required(),
} );

export const shopSchema = yup.object( {
	shop_name: yup.string().trim().label( 'shop name' ).required( "shop name is required" ),
	// email: yup.string().lowercase().trim().email( 'shop email address must be valid' ).required( "shop email is required" ),
	primary_contact: yup.string().min( 10, 'phone number must be at least 10 numbers' ).trim().label( 'primary contact' ).required( "shop contact is required" ),
	base_currency: yup.string().label( 'base currency' ).required( "base currency is required" ),
	has_delivery: yup.boolean().label( 'has delivery' ).required( "delivery option is required" ),
} );

export const userSchema = yup.object( {
	first_name: yup.string().trim().label( 'first name' ).required( "first name is required" ),
	last_name: yup.string().trim().label( 'last name' ).required( "last name is required" ),
	// gender: yup.string().trim().oneOf( [ 'Male', 'Female' ] ).required( "gender is required" ),
	email: yup.string().lowercase().trim().email( 'user email address must be valid' ).required( "user email is required" ),
	password: yup.string().required( "password is required" ),
} );

export const planSchema = yup.object( {
	plan: yup.string().trim().required( "billing plan is required" ),
	interval: yup.string().trim().required( "billing interval is required" ),
	code: yup.string().trim().nullable(),
	price: yup.number(),
} );

export const categorySchema = yup.object( {
	title: yup.string().trim().required( "shop category is required" ),
} );

export const productSchema = yup.object( {
	id: yup.string().uuid().nullable( true ),
	product_code: yup.string().trim().label( 'product code' ),
	product_name: yup.string().trim().label( 'product name' ).required( "product name is required" ),
	supplier_price: yup.number().min( 0, 'required minimum is zero' ).label( 'supplier price' ).required( "supplier price is required" ),
	markup_price: yup.number().min( 0, 'required minimum is zero' ).label( 'markup price' ).required( "markup price is required" ),
	product_type: yup.string().trim().label( 'product type' ).required( "product inventory type (single or variant) is required" ),
	shop_category_id: yup.string().trim().label( 'product category' ).required( "product category is required" ),
	description: yup.string().trim(),
	expiry_date: yup.date().nullable( true ).min( new Date(), 'expiry date cannot be in the past' ).label( 'expiry date' ),
	sku_type: yup.string().trim().label( 'sku type' ),
	sku_value: yup.string().trim().label( 'sku value' ),
	is_a_service: yup.boolean().label( 'service' )
} );


export const productLevelSchema = yup.array( yup.object( {
	outlet_id: yup.string().trim().required( 'Outlet and quantities required' ).label( 'Outlet' ),
	units_in_stock: yup.number().min( 0 ).required( 'Initial quantity required' ).label( 'Units in Stock' ),
	reorder_quantity: yup.number().min( 0 ).required( 'reorder quantity required' ).label( 'Reorder Quantity' ),
	reorder_level: yup.number().min( 0 ).required( 'reorder level required' ).label( 'Reorder Level' ),
} ) );


export const productSuppliersSchema = yup.array( yup.object( {
	supplier_id: yup.string().trim().uuid().required( 'supplier is required' ).label( 'Supplier' ),
	supplier_price: yup.number().min( 0 ).required( 'supplier price is required' ).label( 'supplier price' ),
} ) );


export const productVariantSchema = yup.array( yup.object( {
	attribute: yup.string().trim().required( 'variant attribute is required' ).label( 'attribute' ),
	value: yup.string().trim().required( 'variant value is required' ).label( 'value' ),
} ) );
