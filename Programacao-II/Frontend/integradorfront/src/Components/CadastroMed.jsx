import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";


function CadastroMed() {
    return (
        <div className="bg-indigo-100 h-screen w-screen flex flex-row justify-between">
            <h1>TESTE</h1>
            <div>
                <Link to={ `/` } className="flex items-center justify-center bg-slate-800 rounded-md text-lg gap-3 "> Voltar <IoMdArrowRoundBack></IoMdArrowRoundBack></Link>
            </div>
        </div>
    );
}

export default CadastroMed;