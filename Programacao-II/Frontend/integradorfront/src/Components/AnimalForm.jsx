import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import React from "react";

const AnimalForm = ({ animalId, onClose }) => {
  console.log("Esse é o ID do animal a ser editado:", animalId);
  const token = localStorage.getItem("token");

  const fetchAnimal = async () => {
    const response = await axios.get(
      `http://localhost:3301/animalId${animalId}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  const fetchStates = async () => {
    const response = await axios.get("http://localhost:3301/states", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return response.data;
  };

  const fetchMedicamentos = async () => {
    const response = await axios.get("http://localhost:3301/IdAndNa", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return response.data;
  };

  const fetchMedused = async () => {
    const response = await axios.get(`http://localhost:3301/MedUsed`, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return response.data;
  }
  /*
  const { data: medUsed } = useQuery({
    queryKey: ["UsedReturn"],
    queryFn: fetchMedused,
  });
  */

  const { data: estadosAn } = useQuery({
    queryKey: ["StateReturn"],
    queryFn: fetchStates,
  });

  const { data: medicamentosUs } = useQuery({
    queryKey: ["MedReturn"],
    queryFn: fetchMedicamentos,
  });

  const { data: animalData } = useQuery({
    queryKey: ["AnimalData", animalId],
    queryFn: () => fetchAnimal(animalId),
    enabled: !!animalId,
  });

  console.log(animalData);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, aid) => {
    console.log("DADOS COLETADOS:", data);
    try {
      const response = await axios.put(
        `http://localhost:3301/Attanimal${aid}`,
        {
          ...data,
        }, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Animal atualizado com sucesso!");
        onClose();
      } else {
        toast.error("Ocorreu um erro ao tentar atualizar o animal!");
      }
    } catch (error) {
      console.error(
        "Erro ao atualizarr animal",
        error.response?.data || error.message
      );
      toast.error("Erro ao atualizar animal");
    }
  };

  React.useEffect(() => {
    if (animalData) {
      setValue("animal", animalData.apelido);
      setValue("animalrace", animalData.araca);
      setValue("animal_color", animalData.acolor);
      setValue("pesoanimal", animalData.apeso);
      setValue("animalhproblem", animalData.healt_problem);
      setValue("animal_brinco", animalData.b_number);
      setValue("prodstate", animalData.prodstate);
      setValue("idState", animalData.idstate);
      setValue("dosused", animalData.dosagem);
      setValue("catmed", animalData.idmed);
      setValue("datamed", animalData.datamed.split('T')[0]);
    }
  }, [animalData, setValue]);

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, animalId))}
      className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Insira os dados
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Campos do formulário */}
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
        {/* Outros campos do formulário */}
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
            placeholder="Ex: 853135"
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
          placeholder="Ex: Em emgorda"
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
          <p className="text-xs text-red-600">Por Favor preencha este campo</p>
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
            <option key={item.idmed} value={item.idmed}>
              {item.name_med}
            </option>
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
          type="submit"
        >
          Enviar
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default AnimalForm;
