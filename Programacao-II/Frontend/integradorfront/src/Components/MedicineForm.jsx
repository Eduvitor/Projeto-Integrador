import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import React from "react";
import { useEffect } from "react";

const MedicamentoForm = ({ medicamentoId, onClose }) => {

    console.log("Esse é o ID do medicamento a ser editado:", medicamentoId);
    const token = localStorage.getItem("token");
  
    const fetchMedicamento = async (medicamentoId) => {
      const response = await axios.get(
        `http://localhost:3301/Medandcats${medicamentoId}`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );
      return response.data;
    };
  
    const { data: medicamentoData } = useQuery({
      queryKey: ["MedicamentoData", medicamentoId],
      queryFn: () => fetchMedicamento(medicamentoId),
      enabled: !!medicamentoId,
    });
  
    console.log("Data coletada do id", medicamentoData);
  
    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm();
  
    const onSubmit = async (data, mid) => {
      console.log("DADOS COLETADOS:", data);
      try {
        const response = await axios.put(
          `http://localhost:3301/Attmedicine${medicamentoId}`,
          {
            ...data,
          }, {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        );
  
        if (response.status === 200) {
          toast.success("Medicamento atualizado com sucesso!");
          onClose();
        } else {
          toast.error("Ocorreu um erro ao tentar atualizar o medicamento!");
        }
      } catch (error) {
        console.error(
          "Erro ao atualizar medicamento",
          error.response?.data || error.message
        );
        toast.error("Erro ao atualizar medicamento");
      }
    };
  

    useEffect(() => {
        console.log("data", medicamentoData);
        if (medicamentoData) {
            const medicamento = medicamentoData[0]
            setValue("name_med", medicamento.name_med);
          setValue("dose_kg", medicamento.dose_kg);
          setValue("venc_day", medicamento.venc_day.split('T')[0]);
          setValue("days_car", medicamento.days_car);
          setValue("typecar", medicamento.typecar);
          setValue("col_effect", medicamento.col_effect);
          setValue("qnt", medicamento.qnt);
          setValue("category", medicamento.typemed);
        }
      }, [medicamentoData, setValue]);
    
      return (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Editar Medicamento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="name_med"
              >
                Nome do Medicamento
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name_med"
                type="text"
                {...register("name_med", { required: true })}
              />
              {errors?.name_med?.type === "required" && (
                <p className="text-xs text-red-600">Por Favor preencha este campo</p>
              )}
            </div>
    
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="dose_kg"
              >
                Dose Recomendado por KG
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="dose_kg"
                type="text"
                {...register("dose_kg", { required: true })}
              />
              {errors?.dose_kg?.type === "required" && (
                <p className="text-xs text-red-600">Por Favor preencha este campo</p>
              )}
            </div>
    
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="venc_day"
              >
                Data de Vencimento
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="venc_day"
                type="date"
                {...register("venc_day", { required: true })}
              />
              {errors?.venc_day?.type === "required" && (
                <p className="text-xs text-red-600">Por Favor preencha este campo</p>
              )}
            </div>
    
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="days_car"
              >
                Dias de Carência
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="days_car"
                type="text"
                {...register("days_car")}
              />
            </div>
    
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="typecar"
              >
                Tipo de Carência
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="typecar"
                type="text"
                {...register("typecar")}
              />
            </div>
    
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="col_effect"
              >
                Possível Efeito Colateral
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="col_effect"
                type="text"
                {...register("col_effect")}
              />
            </div>
    
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="qnt"
              >
                Quantidade em Estoque
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="qnt"
                type="text"
                {...register("qnt", { required: true })}
              />
              {errors?.qnt?.type === "required" && (
                <p className="text-xs text-red-600">Por Favor preencha este campo</p>
              )}
            </div>
    
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="category"
              >
                Categoria
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="category"
                type="text"
                disabled
                {...register("category")}
              />
            </div>
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
  
  export default MedicamentoForm;