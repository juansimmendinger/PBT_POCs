import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Scan from './Scan';
import { QueryClient, QueryClientProvider } from 'react-query'

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient()

root.render(
  <QueryClientProvider client={queryClient}>
    <ThirdwebProvider activeChain="goerli">
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={App}></Route>
          <Route path="/scan" Component={Scan}></Route>
        </Routes>
      </BrowserRouter>
    </ThirdwebProvider>
  </QueryClientProvider>

);
