import {ApolloProvider} from '@apollo/react-hooks';
import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router} from "react-router-dom";

import App from "./components/App";
import GraphQLClient from "./utils/graphql";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.css";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
	<ApolloProvider client={GraphQLClient}>
		<Router>
			<App />
		</Router>
	</ApolloProvider>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
