import { Link, useRouteError } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import dinoconfuso from "./12297518-dinossauro-confuso-dos-desenhos-animados-vetor-Photoroom.png"


export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="flex items-center justify-center bg-slate-900 h-screen text-3xl text-white flex-col ">
      <img src={dinoconfuso} alt="Apenas um dinossauro confuso pq vc entrou em algo que não era pra entrar" className="h-56 w-40"></img>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to={ `/` } className="flex items-center justify-center bg-slate-800 rounded-md text-lg gap-3"> Voltar <IoMdArrowRoundBack></IoMdArrowRoundBack></Link>
    </div>
  );
}