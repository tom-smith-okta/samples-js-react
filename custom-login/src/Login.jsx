/*
 * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React, { useEffect } from 'react';
import * as OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';

import config from './config';

const Login = () => {
	useEffect(() => {
		const { pkce, issuer, clientId, redirectUri, scopes } = config.oidc;
		const widget = new OktaSignIn({
			/**
			 * Note: when using the Sign-In Widget for an OIDC flow, it still
			 * needs to be configured with the base URL for your Okta Org. Here
			 * we derive it from the given issuer for convenience.
			 */
			baseUrl: issuer.split('/oauth2')[0],
			clientId,
			redirectUri,
			authScheme: "OAUTH2",

			logo: '/react.svg',
			features: {
					multiOptionalFactorEnroll: true,
					smsRecovery: true,
					callRecovery: true,
					deviceFingerprinting: true,
					idpDiscovery: true
			},
			idpDiscovery: {
				requestContext: "/home/bookmark/0oa593bek5gJAsnhO4x6/2557"
			},
			i18n: {
				en: {
					'primaryauth.title': 'Sign in to React & Company',
				},
			},
			authParams: {
				authorizeUrl: issuer + '/v1/authorize',
				pkce,
				issuer,
				display: 'page',
				responseMode: 'form_post',
				responseType: 'code',
				scopes
			},
		});

		widget.authClient.session.get()
		.then(function (res) {
			// Session exists, show logged in state.
			if (res.status === 'ACTIVE') {
				// showApp()
				console.log("Session Active");
				console.log(res);

				localStorage.setItem("given_name", res.login)

				// setMenu("authenticated")

				var getNewTokenUrl = issuer + '/v1/authorize'

				getNewTokenUrl += "?client_id=" + clientId

				getNewTokenUrl += "&redirect_uri=" + redirectUri

				getNewTokenUrl += "&state=somestate"

				getNewTokenUrl += "&scope=" + scopes

				getNewTokenUrl += "&responseMode=fragment"

				getNewTokenUrl += "&response_type=token id_token"

				getNewTokenUrl += "&nonce=somenonce"

				getNewTokenUrl += "&prompt=none"

				console.log("the getNewTokenUrl is: " + getNewTokenUrl)

				const queryString = window.location.search;

				const urlParams = new URLSearchParams(queryString);

				if (urlParams.has('error')) {}

				else if (window.location.hash) {} // we have tokens

				else {
					window.location.href=getNewTokenUrl
				}
			}
			// No session, or error retrieving the session. Render the Sign-In Widget.
			else if (res.status === 'INACTIVE') {
				console.log("Session Not Active");
				widget.renderEl({ el: '#sign-in-widget' },
					function(res) {
						if (res.status === 'SUCCESS') {
							console.log("data: %s", JSON.stringify(res));
						}
						else if (res.status === 'IDP_DISCOVERY') {
							console.log(res);
							res.idpDiscovery.redirectToIdp();
							return;
						}
					}
				);
			}
		})
		.catch(function(err) {
			console.log("FAIL");
			console.log(err);
		});

		// widget.renderEl(
		// 	{ el: '#sign-in-widget' },
		// 	() => {
		// 		*
		// 		* In this flow, the success handler will not be called beacuse we redirect
		// 		* to the Okta org for the authentication workflow.
		// 	},
		// 	(err) => {
		// 		throw err;
		// 	},
		// );
	}, []);

	return (
		<div>
			<div id="sign-in-widget" />
		</div>
	);
};
export default Login;
