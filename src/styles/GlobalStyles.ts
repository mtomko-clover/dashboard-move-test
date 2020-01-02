import { createGlobalStyle } from "styled-components"

import { fontDeclarations } from './fonts'

export const GlobalStyles = createGlobalStyle`
  ${fontDeclarations}

  html * {
    font-family: Circular Std;
    font-size: 16px;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    word-spacing: -5px;
    letter-spacing: 0;
  }

  html, body {
    height: 100vh;
  }

  html {
    overflow: hidden;
    background: #F0F2F5;
    box-sizing: border-box;
  }

  body {
    overflow: auto;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  // hides amcharts logo from charts
  g[aria-labelledby$="-title"] {
    visibility: hidden;
  }
`