import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import posthog from 'posthog-js'

// Logging and Analytics like LogRocket (maybe also try this)
posthog.init( 'phc_8bPTAAcuqV2RHUsnO9PSrWEUfkphA2D1b1RXxZlHw6t', { api_host: 'https://app.posthog.com' } )
posthog.capture( 'bokxPOS start', { property: 'start here' } )

const root = ReactDOM.createRoot( document.getElementById( "root" ) );
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

