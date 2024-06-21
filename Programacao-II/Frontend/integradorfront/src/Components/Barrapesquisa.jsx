import { FaSearch } from "react-icons/fa";

function Barrapesquisa(params) {
    return (
        <div className="md:w-100 h-10 sm:w-30 bg-slate-300 flex flex-row rounded-full font-semibold items-center justify-between p-3">
            <input type="text" placeholder="Pesquise" className="bg-slate-300 rounded-full lg:w-80 lg:h-10 sm:w-40 sm:h-5"></input>
            <FaSearch className="lg:w-5 sm:w-3"></FaSearch>
        </div>
    );
}
export default Barrapesquisa;