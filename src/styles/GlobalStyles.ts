import { createGlobalStyle } from "styled-components"

import { fontDeclarations } from './fonts'

export const GlobalStyles = createGlobalStyle`
	${fontDeclarations}

	html * {
		font-family: Circular Std;
		font-size: 16px;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
	}

	/* word/letter-spacing only applies to Chrome 29+ */
	@media screen and (-webkit-min-device-pixel-ratio:0) and (min-resolution:.001dpcm) {
		html * {
			word-spacing: -5px;
			letter-spacing: 0;
		}
	}

	html, body {
		height: 100vh;
	}
	
	html {
		overflow: hidden;
		background: #F0F2F5;
		box-sizing: border-box;
	}

	body::-webkit-scrollbar {
		width: 0 !important
	}

	body {
		overflow: auto;
		margin: 0;
		padding: 0;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* hides amcharts logo from charts */
	g[aria-labelledby$="-title"] {
		visibility: hidden;
	}

	.ant-dropdown-menu-item {
		font-family: Maison Mono !important;
		font-weight: 400;
		font-size: 12px;
	}
`