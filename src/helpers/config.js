export const constants = {
	siteTitle: "Goil",
};

export const dateFormat = "MM DD YYYY";
export const paymentMethods = [
	{ title: 'Bank' },
	{ title: 'Card' },
	{ title: 'Cash' },
	{ title: 'MoMo' },
	{ title: 'Cheque' },
	{ title: 'Other' }
]

// envs
export const tokenEncryptionKey = process.env.REACT_APP_TOKEN_KEY;
export const userEncryptionKey = process.env.REACT_APP_USER_KEY;
export const roleEncryptionKey = process.env.REACT_APP_ROLE_KEY;
export const registerEncryptionKey = process.env.REACT_APP_REGISTER_KEY;
export const parkingEncryptionKey = process.env.REACT_APP_PARKING_KEY;
export const appUrl = process.env.REACT_APP_URL

// screen widths
export const smallDevice = '600' //or 576 //extra small devices are below & small are above
export const mediumDevice = '768'
export const largeDevice = '992'
export const xlargeDevice = '1200'
export const xxlargeDevice = '1400'


export const plans = [
	{
		plan: 'free',
		monthly: 0,
		annually: 0
	},
	{
		plan: 'basic',
		monthly: 5,
		annually: 50
	},
	{
		plan: 'standard',
		monthly: 7,
		annually: 80
	},
	{
		plan: 'professional',
		monthly: 13,
		annually: 150
	}
]


// routing configs
export const appLinks = {
	splash: "/",

	// Home
	home: "/home",

	// Sale
	sales: {
		index: "/sale",
		sell: "sell",
		// register: "register",
		settings: "sale-settings",
		status: "sale-status",
		history: "sale-history",
		// cashMagt: "cash-management",
	},

	// catalog
	catalog: {
		index: "/catalog",
		inventory: "inventory",
		productType: "product-types",
		customers: "customers",
		customersGroups: "customer-groups",
		expenses: "expenses",
		suppliers: "suppliers",
		campaign: "campaigns",
		orders: "orders",
		stockControl: "stock-control",
		inventoryCount: "inventory-count",
		restocks: "restocks",
		categories: "categories",
		charges: "charges",
	},

	//reports
	reports: {
		index: "/reporting",
		sale: "sales",
		inventory: "inventory",
		payment: "payments",
		register: "registers",
		tax: "taxes",
		giftCard: "gift-cards",
		cashflow: "cashflow",
		payroll: "payroll",
		restocks: "restocks",
		attendance: 'attendance',
		activity: 'activity'
	},

	//setup
	setup: {
		index: "/setup",
		settings: "settings",
		billing: "billings",
		outlet: "outlets",
		paymentTypes: "payment-types",
		taxes: "taxes",
		users: "users",
		staffs: "staffs",
		loyalty: "loyalty",
		business: "business",
		apps: "apps",
		station: "station", //updated from branch
	},

	// logs: "/activity-logs",
	customerPortal: ( orderNumber, publicUrl ) => `/cp/${ orderNumber }/${ publicUrl }`, //cp stands for customer portal
	switchOutlet: "/switch-outlet",

	// auth
	login: "/login",
	signup: "/signup",
	changePassword: ( hash ) => `/change-password/${ hash }`,
	resetpassword: "/reset-password",

	// not found
	catchAll: "*",
};

export const businessTypes = [
	{
		id: "sporting",
		info: 'brief description here',
		name: "Sporting and Outdoor Gear",
	},
	{
		id: "fashion",
		info: 'brief description here',
		name: "Fashion & Boutique",
	},
	{
		id: "grocery",
		info: 'brief description here',
		name: "Grocery & Bakery",
	},
	{
		id: "furniture",
		info: 'brief description here',
		name: "Furniture and Home Decor",
	},
	{
		id: "stationary",
		info: 'brief description here',
		name: "Books and Stationary",
	},
	{
		id: "beverage",
		info: 'brief description here',
		name: "Food and Beverage",
	},
	{
		id: "construction",
		info: 'brief description here',
		name: "Building and Construction",
	},
	{
		id: "vehicles",
		info: 'brief description here',
		name: "Motorized Vehicles",
	},
	{
		id: "health",
		info: 'brief description here',
		name: "Health and Beauty",
	},
	{
		id: "electronics",
		info: 'brief description here',
		name: "Electronics",
	},

	{
		id: "services",
		info: 'brief description here',
		name: "Services",
	},
	{
		id: "other",
		info: 'brief description here',
		name: "Other Retail",
	},
];

export const subnavs = {
	sell: [
		{
			name: "sell",
			icon: "bi-basket",
			info: 'brief description here',
			url: appLinks.sales.sell,
		},
		// {
		// 	name: "register",
		// 	icon: "bi-subtract",
		// 	info: 'brief description here',
		// 	url: appLinks.sales.register,
		// },
		{
			name: "sales history",
			icon: "bi-clock-history",
			info: 'brief description here',
			url: appLinks.sales.history,
		},
		// {
		// 	name: "status",
		// 	icon: "bi-activity",
		// 	url: appLinks.sales.status,
		// info: 'brief description here',
		// },
		// {
		// 	name: "cash management",
		// 	icon: "bi-piggy-bank",
		// info: 'brief description here',
		// 	url: appLinks.sales.cashMagt,
		// },
		// {
		// 	name: "settings",
		// 	icon: "bi-sliders",
		// info: 'brief description here',
		// 	url: appLinks.sales.settings,
		// },
	],
	catalog: [
		{
			name: "sales history",
			icon: "bi-clock-history",
			info: 'brief description here',
			url: `${ appLinks.sales.index }/${ appLinks.sales.history }`,

		},
		{
			name: "inventory",
			icon: "bi-box",
			info: 'brief description here',
			url: appLinks.catalog.inventory,
		},
		{
			name: "campaigns",
			icon: "bi-gift",//"bi-megaphone",
			info: 'brief description here',
			url: appLinks.catalog.campaign,
		},
		// {
		// 	name: "products types",
		// 	icon: "bi-boxes",
		// info: 'brief description here',
		// 	url: appLinks.catalog.productType,
		// },

		{
			name: "customers",
			icon: "bi-people",
			info: 'brief description here',
			url: appLinks.catalog.customers,
		},
		{
			name: "claims",
			icon: "bi-card-checklist",
			info: 'brief description here',
			url: '#',//appLinks.catalog.customers,
		},
		{
			name: "reports",
			icon: "bi-bar-chart",
			info: 'brief description here',
			url: appLinks.reports.index,
		},
		// {
		// 	name: "expenses",
		// 	icon: "bi-wallet",
		// 	info: 'brief description here',
		// 	url: appLinks.catalog.expenses,
		// },
		// {
		// 	name: "suppliers",
		// 	icon: "bi-briefcase",
		// 	info: 'brief description here',
		// 	url: appLinks.catalog.suppliers,
		// },
		// {
		// 	name: "categories",
		// 	icon: "bi-boxes",
		// 	info: 'brief description here',
		// 	url: appLinks.catalog.categories,
		// },
		// {
		// 	name: "charges",
		// 	icon: "bi-wrench-adjustable-circle",
		// 	info: 'brief description here',
		// 	url: appLinks.catalog.charges,
		// },
		// {
		// 	name: "promotions",
		// 	icon: "bi-gift",
		// info: 'brief description here',
		// 	url: appLinks.catalog.promotions,
		// },
		// {
		// 	name: "orders",
		// 	icon: "bi-cart",
		// info: 'brief description here',
		// 	url: appLinks.catalog.orders,
		// },
		// {
		// 	name: "stock control",
		// 	icon: "bi-ui-checks",
		// info: 'brief description here',
		// 	url: appLinks.catalog.stockControl,
		// },
		// {
		// 	name: "inventory count",
		// 	icon: "bi-123",
		// info: 'brief description here',
		// 	url: appLinks.catalog.inventoryCount,
		// },
		// {
		// 	name: "restocks",
		// 	icon: "bi-recycle",
		// 	info: 'brief description here',
		// 	url: appLinks.catalog.restocks,
		// },
	],
	reporting: [
		{
			name: "sales",
			icon: "bi-bag",
			info: 'brief description here',
			url: appLinks.reports.sale,
		},
		{
			name: "campaigns",
			icon: "bi-megaphone",
			info: 'brief description here',
			url: appLinks.reports.inventory,
		},
		// {
		// 	name: "restocks",
		// 	icon: "bi-recycle",
		// 	info: 'brief description here',
		// 	url: appLinks.reports.restocks,
		// },
		// {
		// 	name: "payments",
		// 	icon: "bi-credit-card",
		// 	info: 'brief description here',
		// 	url: appLinks.reports.payment,
		// },
		// {
		// 	name: "registers",
		// 	icon: "bi-layers-half",
		// 	info: 'brief description here',
		// 	url: appLinks.reports.register,
		// },
		// {
		// 	name: "tax",
		// 	icon: "bi-tags",
		// info: 'brief description here',
		// 	url: appLinks.reports.tax,
		// },
		{
			name: "cashflow",
			icon: "bi-arrow-down-up",
			info: 'brief description here',
			url: appLinks.reports.cashflow,
		},
		// {
		// 	name: "attendance",
		// 	icon: "bi-bookmark-star",
		// 	info: 'brief description here',
		// 	url: appLinks.reports.attendance,
		// },
		{
			name: "logs",
			icon: "bi-body-text",
			info: 'brief description here',
			url: appLinks.reports.activity,
		},
		// {
		// 	name: "payroll",
		// 	icon: "bi-currency-exchange",
		// info: 'brief description here',
		// 	url: appLinks.reports.payroll,
		// },
		// {
		// 	name: "gift cards",
		// 	icon: "bi-suit-spade",
		// info: 'brief description here',
		// 	url: appLinks.reports.giftCard,
		// },
	],
	setup: [
		{
			name: "station",
			icon: "bi-shop",
			info: 'brief description here',
			url: appLinks.setup.station,
		},
		// {
		// 	name: "outlets",
		// 	icon: "bi-geo",
		// 	info: 'brief description here',
		// 	url: appLinks.setup.outlet,
		// },
		{
			name: "staffs",
			icon: "bi-people",
			info: 'brief description here',
			url: appLinks.setup.staffs,
		},
		{
			name: "users",
			icon: "bi-person-circle",
			info: 'brief description here',
			url: appLinks.setup.users,
		},
		{
			name: "settings",
			icon: "bi-sliders",
			info: 'brief description here',
			url: appLinks.setup.settings,
		},
		// {
		// 	name: "billings",
		// 	icon: "bi-receipt",
		// 	info: 'brief description here',
		// 	url: appLinks.setup.billing,
		// },
		// {
		// 	name: "payments",
		// 	icon: "bi-cash-stack",
		// info: 'brief description here',
		// 	url: appLinks.setup.paymentTypes,
		// },
		// {
		// 	name: "taxes",
		// 	icon: "bi-tags",
		// info: 'brief description here',
		// 	url: appLinks.setup.taxes,
		// },

		// {
		// 	name: "loyalty",
		// 	icon: "bi-bag-heart",
		// info: 'brief description here',
		// 	url: appLinks.setup.loyalty,
		// },
		// {
		// 	name: "apps",
		// 	icon: "bi-window-stack",
		// info: 'brief description here',
		// 	url: appLinks.setup.apps,
		// },
	],
};
