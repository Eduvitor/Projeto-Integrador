import { Link, useRouteError } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="flex items-center justify-center bg-slate-900 h-screen text-3xl text-white flex-col ">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to={ `/` } className="flex items-center justify-center bg-slate-800 rounded-md text-lg gap-3"> Voltar <IoMdArrowRoundBack></IoMdArrowRoundBack></Link>
    </div>
  );
}