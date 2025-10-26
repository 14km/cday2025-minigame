import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    spacing: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      xxl: string
    }
    breakpoints: {
      mobile: string
      tablet: string
      desktop: string
      wide: string
    }
  }
}
