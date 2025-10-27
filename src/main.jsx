import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { DashBoardContextProvider } from './DashBoardContext/DashBoardContext'
import withSecureApi from './DashBoardContext/withSecureApi.jsx'
// import withProtection from './Pages/withProtection.jsx';
// import withSecureApi from './DashBoardContext/withSecureApi.jsx'
// import { MultiTabStateProvider } from './DashBoardContext/MultiTabStateContext .jsx'
import { QueryClient, QueryClientProvider} from "@tanstack/react-query";
  // import { ThemeProvider } from './Pages/withTheme.jsx'
  const queryClient=new QueryClient({})
  // const ProtectedApp = withProtection(App);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <MultiTabStateProvider> */}
    <DashBoardContextProvider>
      {/* <ThemeProvider> */}
      
      <App/>
    {/* </ThemeProvider> */}
    </DashBoardContextProvider>
    {/* </MultiTabStateProvider> */}
    </QueryClientProvider>
  </StrictMode>,
)
