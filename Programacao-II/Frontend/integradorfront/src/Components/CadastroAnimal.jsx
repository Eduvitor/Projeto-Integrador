import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import logo from "./LogoSistema-Photoroom.png";
import axios from "axios";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function CadastroAnimal() {
  const token = localStorage.getItem("token");

  const states = async () => {
    const response = await axios.get("http://localhost:3301/states", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    //console.log(response)
    return response.data;
  };

  const medicamentos = async () => {
    const response = await axios.get("http://localhost:3301/IdAndNameMEDS", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return response.data;
  }
  
  const {
    data: medicamentosUs,
  } = useQuery({
    queryKey: ["MedReturn"],
    queryFn: medicamentos,
  });

  const {
    data: estadosAn,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["StateReturn"],
    queryFn: states,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.post("http://localhost:3301/Addanimal", {
        ...data,
      },{
        headers: {
					Authorization: `bearer ${token}`,
				},
      });
      console.log("Resposta da API:", response);
      if (response.status == 200) {
        toast.success("Animal adicionado com sucesso!");
      } else {
        toast.error("Ocorreu um erro ao tentar adicinonar o animal!");
      }
      return response.data;
    } catch (error) {
      console.error("An error has ocurred, its not possible to add a new animal", error.response?.data || error.message);
      throw error;
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 md:h-44 h-48 gap-4 justify-center items-center bg-blue-500 text-gray-50">
        <div>
          <img src={logo} alt="LOGO DO SISTEMA SGPR" className="h-20 md:h-40" />
        </div>
        <div className="flex  justify-start md:justify-center">
          <h2 className="font-semibold text-xs md:text-xl">
            ADICIONAR UM NOVO ANIMAL
          </h2>
        </div>
        <div className="flex justify-start md:justify-end px-4">
          <Link
            to={`/`}
            className="flex items-center justify-center bg-slate-800 rounded-md text-lg gap-1 md:w-20 md:h-10 w-10 h-5 px-1 "
          >
            <span className="hidden md:inline">Voltar</span>
            <IoMdArrowRoundBack />
          </Link>
        </div>
      </div>
      <div className="flex justify-center items-center min-h-screen bg-gray-200">
        <form className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Insira os dados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="nome1"
              >
                Nome do animal
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-xl"
                id="nome1"
                type="text"
                placeholder="Ex: Anabolic"
                {...register("animal")}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="nome2"
              >
                Raca do animal
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-xl ${
                  errors.animalrace ? "border-red-500" : ""
                } }`}
                id="nome2"
                type="text"
                placeholder="Ex: Angus"
                {...register("animalrace", { required: true })}
              />
              {errors?.animalrace?.type === "required" && (
                <p className="text-xs text-red-600">
                  Por Favor preencha este campo
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="nome3"
              >
                Coloracao do animal
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-xl ${
                  errors.animal_color ? "border-red-500" : ""
                } }`}
                id="nome3"
                type="text"
                placeholder="Ex: Preto c/ manchas"
                {...register("animal_color", { required: true })}
              />
              {errors?.animal_color?.type === "required" && (
                <p className="text-xs text-red-600">
                  Por Favor preencha este campo
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="nome1"
              >
                Peso do animal
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-xl ${
                  errors?.pesoanimal ? "border-red-500" : ""
                } }`}
                id="nome1"
                type="text"
                placeholder="Ex: 460.00"
                {...register("pesoanimal", { required: true })}
              />
              {errors?.pesoanimal?.type === "required" && (
                <p className="text-xs text-red-600">
                  Por Favor preencha este campo
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="nome1"
              >
                Problema de saude
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-xl"
                id="nome1"
                type="text"
                placeholder="Ex: frieiras"
                {...register("animalhproblem")}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="nome4"
              >
                Numero do brinco (se possuir)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-xl"
                id="nome4"
                type="text"
                placeholder="Ex: 643902"
                {...register("animal_brinco")}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="nome1"
            >
              Estado de produção
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-xl"
              id="nome1"
              type="text"
              placeholder="Ex: Em engorda"
              {...register("prodstate")}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="opcoes"
            >
              Selecione um estado para o animal
            </label>
            <select
              {...register("idState", { required: true })}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-xl ${
                errors.idState ? "border-red-500" : ""
              } }`}
              id="opcoes"
            >
              {estadosAn?.map((item) => (
                <option key={item.idsaude} value={item.idsaude}>
                  {item.estado}
                </option>
              ))}
            </select>
            {errors?.idState?.type === "required" && (
              <p className="text-xs text-red-600">
                Por Favor preencha este campo
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="nome1"
            >
              Dosagem utilizada
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-xl"
              id="nome1"
              type="text"
              placeholder="Ex: 10ml"
              {...register("dosused")}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="opcoes"
            >
              Medicamento utilizado
            </label>
            <select
              {...register("catmed")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-xl"
              id="opcoes"
            >
              {medicamentosUs?.map((item) => (
                <option key={item.idmed} value={item.idmed}>{item.name_med}</option>
              ))} 
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="data"
            >
              Data da medicação
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-xl"
              id="data"
              type="date"
              placeholder="Selecione a data"
              {...register("datamed")}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => handleSubmit(onSubmit)()}
            >
              Enviar
            </button>
            <Link
              to={'/'}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
export default CadastroAnimal;
