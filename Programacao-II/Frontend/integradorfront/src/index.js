import React from 'react';
import './index.css';
import App from './App';
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Dashboard from './Components/Dashboard';
import ErrorPage from './Components/ErrorPage';
import CadastroMed from './Components/CadastroMed';
import CadastroAnimal from './Components/CadastroAnimal';
import CadastroEvents from './Components/CadastroEvents'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard></Dashboard>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/Cadastromedicamento",
    element: <CadastroMed></CadastroMed>
  },
  {
    path: "/Cadastroanimal",
    element: <CadastroAnimal></CadastroAnimal>
  },
  {
    path: "/Cadastroevento",
    element: <CadastroEvents></CadastroEvents>
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
