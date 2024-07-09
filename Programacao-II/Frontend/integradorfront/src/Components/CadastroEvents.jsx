import { Link, useRouteError } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import logo from "./LogoSistema-Photoroom.png";
import { useForm } from "react-hook-form";
import axios from "axios";


function CadastroEvents(params) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 md:h-44 h-48 gap-4 justify-center items-center bg-blue-500 text-gray-50">
        <div>
          <img src={logo} alt="LOGO DO SISTEMA SGPR" className="h-20 md:h-40" />
        </div>
        <div className="flex  justify-start md:justify-center">
          <h2 className="font-semibold text-xs md:text-xl">
            ADICIONAR UM NOVO EVENTO
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
                Nome do evento
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-xl ${
                  errors.namevent ? "border-red-500" : ""
                } }`}
                id="nome1"
                type="text"
                placeholder="Ex: Coleta de exames"
                {...register("namevent", { required: true })}
              />
              {errors?.namevent?.type === "required" && (
              <p className="text-xs text-red-600">
                Por Favor preencha este campo
              </p>
            )}
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="nome2"
              >
                Local do evento 
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-s md:text-xl"
                id="nome2"
                type="text"
                placeholder="Ex: Propiedade 1"
                {...register("eventlocal")}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="nome2"
              >
                Hora de inicio 
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-xl ${
                  errors.hrinit ? "border-red-500" : ""
                } }`}
                id="hrinit"
                type="time"
                {...register("hrinit", { required: true })}
              />
              {errors?.hrinit?.type === "required" && (
              <p className="text-xs text-red-600">
                Por Favor preencha este campo
              </p>
            )}
            </div>


            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="nome2"
              >
                Hora do termino 
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-xl ${
                  errors.hrend ? "border-red-500" : ""
                } }`}
                id="hrter"
                type="time"
                {...register("hrend", { required: true })}
              />
              {errors?.hrend?.type === "required" && (
              <p className="text-xs text-red-600">
                Por Favor preencha este campo
              </p>
            )}
            </div>

          </div>

          <div className="">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="nome3"
              >
                Descrição do evento
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-xl"
                id="nome3"
                type="text"
                placeholder="Ex: Fazer algo amanha"
                {...register("desc")}
              />
            </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="data"
            >
              Data que irá ocorrer
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-xl ${
                errors.datevent ? "border-red-500" : ""
              } }`}
              id="data"
              type="date"
              placeholder="Selecione a data"
              {...register("datevent", { required: true })}
            />
            {errors?.datevent?.type === "required" && (
              <p className="text-xs text-red-600">
                Por Favor preencha este campo
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => handleSubmit(onSubmit)()}
            >
              Enviar
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroEvents;
