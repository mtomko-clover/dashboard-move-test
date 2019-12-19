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

  html, body {
    overflow: hidden;
    height: 100vh;
  }

  html {
    background: #F0F2F5;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`