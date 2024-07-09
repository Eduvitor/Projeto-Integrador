import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import logo from "./LogoSistema-Photoroom.png";
import { useForm } from "react-hook-form";
import { FaPen } from "react-icons/fa"; //item para editar algo
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa"; //lixeira
import Modal from "./Modal";
import MedicamentoForm from "./MedicineForm";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

function ListagemMedicamentos() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const Medicamentos = async () => {
    const response = await axios.get("http://localhost:3301/Medicamentos", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return response.data;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedidmed, setSelectedidmed] = useState(null);

  const handleEdit = (idmedicine) => {
    console.log("ID do medicamento", idmedicine);
    setSelectedidmed(idmedicine);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedidmed(null);
  };

  const {
    data: medicine,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["MedicineReturn"],
    queryFn: Medicamentos,
  });

  const handleDelete = async (idmed) => {
    if (window.confirm("Tem certeza que deseja excluir este medicamento?")) {
      await deleteAnimal(idmed);
    }
  };

  const [hoveredID, setHoveredID] = useState(null);

  const deleteAnimal = async (idmedicine) => {
    console.log("id a ser excluido:", idmedicine)
    try {
      const response = await axios.delete(
        `http://localhost:3301/Delmedicine${idmedicine}`,
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        toast.success("Medicamento foi excluido com sucesso!");
        queryClient.invalidateQueries(["MedicineReturn"]);
      } else {
        toast.error("Erro ao excluir o medicamento");
      }
    } catch (error) {
      console.log(error);
      console.log()
      toast.error("Ocorreu um erro ai mano desculpa!");
    }
  };
  console.log(medicine);
  if (isLoading) return <div>Carregando dados!</div>;
  if (error) return <div>Ocorreu um erro na requisicao!</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 md:h-44 h-48 gap-4 justify-center items-center bg-blue-500 text-gray-50">
        <div>
          <img src={logo} alt="LOGO DO SISTEMA SGPR" className="h-20 md:h-40" />
        </div>
        <div className="flex  justify-start md:justify-center">
          <h2 className="font-semibold text-xs md:text-xl">
            LISTANDO OS MEDICAMENTOS CADASTRADOS
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
      <div className="p-6 bg-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {medicine?.map((item) => (
            <div
              key={item.idmed}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              onMouseEnter={() => setHoveredID(item.idmed)}
              onMouseLeave={() => setHoveredID(null)}
            >
              <div className="mb-2">
                <h2 className="text-black font-semibold text-lg">
                  Nome do medicamento:
                </h2>
                <p className="text-gray-700 text-base">{item.name_med}</p>
              </div>
              <div className="mb-2">
                <div className="mb-2">
                  <h2 className="text-black font-semibold text-lg">
                    Categoria do medicamento:
                  </h2>
                  <p className="text-gray-700 text-base">{item.typemed}</p>
                </div>
                <h2 className="text-black font-semibold text-lg">
                  Dose recomendado por KG:
                </h2>
                <p className="text-gray-700 text-base">{item.dose_kg}</p>
              </div>
              <div className="mb-2">
                <h2 className="text-black font-semibold text-lg">
                  Data de vencimento:
                </h2>
                <p className="text-gray-700 text-base">
                  {item.venc_day.split('T')[0]}
                </p>
              </div>
              <div className="mb-2">
                <h2 className="text-black font-semibold text-lg">
                  Dias de carência:
                </h2>
                <p className="text-gray-700 text-base">
                  {item.days_car || "Não possui"}
                </p>
              </div>
              <div className="mb-2">
                <h2 className="text-black font-semibold text-lg">
                  Tipo de carência:
                </h2>
                <p className="text-gray-700 text-base">{item.typecar || "Não tem"}</p>
              </div>
              <div className="mb-2">
                <h2 className="text-black font-semibold text-lg">
                  Possivel efeito colaterial:
                </h2>
                <p className="text-gray-700 text-base">{item.col_effect || "Não tem"}</p>
              </div>
              <div className="mb-2">
                <h2 className="text-black font-semibold text-lg">
                  Quantidade em estoque:
                </h2>
                <p className="text-gray-700 text-base">{item.qnt}</p>
              </div>
              {hoveredID == item.idmed && (
                <div className="bottom-2 right-2 flex space-x-2 justify-end">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEdit(item.idmed)}
                  >
                    <FaPen />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(item.idmed)}
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <MedicamentoForm medicamentoId={selectedidmed} onClose={handleCloseModal} />
        </Modal>
      </div>
    </div>
  );
}

export default ListagemMedicamentos;
