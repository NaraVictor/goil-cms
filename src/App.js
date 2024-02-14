import { BrowserRouter, HashRouter } from "react-router-dom";

// styles
import "bulma/css/bulma.css"; //styling removes basic styles for headers etc
import "./static/css/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// import "antd/";
import "antd/dist/antd.css";
import "@splidejs/splide/dist/css/splide.min.css";
import "@splidejs/splide/dist/css/themes/splide-skyblue.min.css";
import 'react-phone-number-input/style.css'

// import { isElectron } from "./helpers/utilities";
import AppRoutes from "./routes";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { putLogout } from "./helpers/api";

const queryClient = new QueryClient();


function App () {
	window.onclose = () => putLogout()

	return (
		<div className="App">
			<BrowserRouter>
				<QueryClientProvider client={ queryClient }>
					<AppRoutes />
					{/* <ReactQueryDevtools initialIsOpen={ false } /> */ }
				</QueryClientProvider>
			</BrowserRouter>
		</div >
	);
}

export default App;
