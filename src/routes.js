import React from "react";
import { useRoutes } from "react-router-dom";
import { appLinks } from "./helpers/config";

//pages
import {
	CustomersPage,
	LoginPage,
	ChangePassword,
	SalesIndex,
	CatalogIndex,
	ReportsIndex,
	SetupIndex,
	HomeIndex,
	ProductsPage,
	ExpensesPage,
	SuppliersPage,
	CampaignPage,
	OrdersPage,
	StockControlPage,
	InventoryCountPage,
	SellPage,
	RegistersPage,
	SalesHistoryPage,
	StatusPage,
	CashManagementPage,
	SellSettingsPage,
	RestocksPage,
	SalesReportPage,
	CashflowReportPage,
	TaxesReportPage,
	PayrollReportPage,
	PaymentsReportPage,
	InventoryReportPage,
	GiftCardsReportPage,
	RestocksReportPage,
	RegistersReportPage,
	GeneralSetupPage,
	AppsSetupPage,
	BillingSetupPage,
	LoyaltySetupPage,
	OutletsSetupPage,
	PaymentsSetupPage,
	StoreSetupPage,
	TaxesSetupPage,
	UsersSetupPage,
	CategoriesPage,
	ResetPassword,
	StaffsSetupPage,
	ChargesPage,
	SwitchOutlet,
	AttendanceReportPage,
	ActivitiesReportPage,
	PublicPurchaseOrder
} from "./pages";

// components
import NotFoundPage from "./pages/not-found";
import AppLayout from "./components/layout";
import SignUpPage from "./pages/auth/signup";
import SplashScreen from "./pages/splash-screen";

const AppRoutes = () => {
	return useRoutes( [
		{
			path: appLinks.splash,
			element: <SplashScreen />,
		},
		{
			// Home
			path: appLinks.home,
			element: <AppLayout />,
			children: [ { index: true, element: <HomeIndex /> } ],
		},
		{
			// sales
			path: appLinks.sales.index,
			element: <AppLayout />,
			children: [
				{ index: true, element: <SalesIndex /> },
				{ path: appLinks.sales.sell, element: <SellPage /> },
				{ path: appLinks.sales.register, element: <RegistersPage /> },
				{ path: appLinks.sales.history, element: <SalesHistoryPage /> },
				{ path: appLinks.sales.status, element: <StatusPage /> },
				{ path: appLinks.sales.cashMagt, element: <CashManagementPage /> },
				{ path: appLinks.sales.settings, element: <SellSettingsPage /> },
			],
		},
		{
			// catalog
			path: appLinks.catalog.index,
			element: <AppLayout />,
			children: [
				{ index: true, element: <CatalogIndex /> },
				{ path: appLinks.catalog.inventory, element: <ProductsPage /> },
				{ path: appLinks.catalog.customers, element: <CustomersPage /> },
				{ path: appLinks.catalog.expenses, element: <ExpensesPage /> },
				{ path: appLinks.catalog.charges, element: <ChargesPage /> },
				{ path: appLinks.catalog.suppliers, element: <SuppliersPage /> },
				{ path: appLinks.catalog.campaign, element: <CampaignPage /> },
				{ path: appLinks.catalog.orders, element: <OrdersPage /> },
				{ path: appLinks.catalog.stockControl, element: <StockControlPage /> },
				{
					path: appLinks.catalog.inventoryCount,
					element: <InventoryCountPage />,
				},
				{
					path: appLinks.catalog.restocks,
					element: <RestocksPage />,
				},
				{
					path: appLinks.catalog.categories,
					element: <CategoriesPage />,
				},
			],
		},
		{
			// reports
			path: appLinks.reports.index,
			element: <AppLayout />,
			children: [
				{ index: true, element: <ReportsIndex /> },
				{ path: appLinks.reports.sale, element: <SalesReportPage /> },
				{ path: appLinks.reports.cashflow, element: <CashflowReportPage /> },
				{ path: appLinks.reports.giftCard, element: <GiftCardsReportPage /> },
				{ path: appLinks.reports.inventory, element: <InventoryReportPage /> },
				{ path: appLinks.reports.payment, element: <PaymentsReportPage /> },
				{ path: appLinks.reports.payroll, element: <PayrollReportPage /> },
				{ path: appLinks.reports.register, element: <RegistersReportPage /> },
				{ path: appLinks.reports.restocks, element: <RestocksReportPage /> },
				{ path: appLinks.reports.tax, element: <TaxesReportPage /> },
				{ path: appLinks.reports.attendance, element: <AttendanceReportPage /> },
				{ path: appLinks.reports.activity, element: <ActivitiesReportPage /> },
			],
		},
		{
			// setup
			path: appLinks.setup.index,
			element: <AppLayout />,
			children: [
				{ index: true, element: <SetupIndex /> },
				{ path: appLinks.setup.settings, element: <GeneralSetupPage /> },
				{ path: appLinks.setup.apps, element: <AppsSetupPage /> },
				// { path: appLinks.setup.billing, element: <BillingSetupPage /> },
				{ path: appLinks.setup.loyalty, element: <LoyaltySetupPage /> },
				{ path: appLinks.setup.outlet, element: <OutletsSetupPage /> },
				// { path: appLinks.setup.paymentTypes, element: <PaymentsSetupPage /> },
				{ path: appLinks.setup.station, element: <StoreSetupPage /> },
				{ path: appLinks.setup.taxes, element: <TaxesSetupPage /> },
				{ path: appLinks.setup.users, element: <UsersSetupPage /> },
				{ path: appLinks.setup.staffs, element: <StaffsSetupPage /> },
			],
		},

		//--------Misc-----------//
		{
			path: appLinks.login,
			index: true,
			element: <LoginPage />,
		},
		{
			path: appLinks.signup,
			element: <SignUpPage />,
		},
		{
			path: appLinks.changePassword( ":token" ),
			element: <ChangePassword />,
		},
		{
			path: appLinks.resetpassword,
			element: <ResetPassword />,
		},
		{
			path: appLinks.switchOutlet,
			element: <SwitchOutlet />,
		},
		{
			path: appLinks.customerPortal( ":orderNumber", ":orderHash" ),
			element: <PublicPurchaseOrder />,
		},
		{
			path: appLinks.catchAll,
			element: <NotFoundPage />,
		},
	] );
};

export default AppRoutes;
