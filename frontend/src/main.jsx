import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		{/* can cause multiple socket connections cause of strict */}
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>
);
