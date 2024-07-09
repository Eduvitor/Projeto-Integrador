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
import TelaLogin from './Components/TelaLogin';
import ListagemItens from './Components/ListagemMedicamentos';
import ListAnimals from './Components/ListaNimal';
import ProtectedRoute from './Components/PrivateRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute element={Dashboard}></ProtectedRoute>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/Cadastromedicamento",
    element: <ProtectedRoute element={CadastroMed}></ProtectedRoute>
  },
  {
    path: "/Cadastroanimal",
    element: <ProtectedRoute element={CadastroAnimal}></ProtectedRoute>
  },
  {
    path: "/Cadastroevento",
    element: <ProtectedRoute element={CadastroEvents}></ProtectedRoute>
  },
  {
    path: "/Login",
    element: <TelaLogin></TelaLogin>
  },
  {
    path: "/Teste",
    element: <ListagemItens></ListagemItens>
  },
  {
    path: "/ListagemAnimais",
    element: <ProtectedRoute element={ListAnimals}></ProtectedRoute>
  }
]);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
      <ToastContainer></ToastContainer>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
