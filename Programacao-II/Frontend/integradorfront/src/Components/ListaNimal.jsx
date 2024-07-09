import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import logo from "./LogoSistema-Photoroom.png";
import { useForm } from "react-hook-form";
import { FaPen } from "react-icons/fa"; //item para editar algo
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa"; //lixeira
import Modal from "./Modal";
import AnimalForm from "./AnimalForm";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

function ListAnimals() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  const animais = async () => {
    console.log("entreiaq");
    const response = await axios.get("http://localhost:3301/Animais", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    console.log("REsposta:", response)
    return response.data;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState(null);

  const handleEdit = (animalId) => {
    setSelectedAnimalId(animalId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnimalId(null);
  };

  const {
    data: animals,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["AnimaisReturn"],
    queryFn: animais,
  });

  const handleDelete = async (animalId) => {
    if (window.confirm("Tem certeza que deseja excluir este animal?")) {
      await deleteAnimal(animalId);
    }
  };

  const [hoveredID, setHoveredID] = useState(null);

  const deleteAnimal = async (animalId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3301/Delanimal${animalId}`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        toast.success("Animal excluido com sucesso!");
        queryClient.invalidateQueries(["AnimaisReturn"]);
      } else {
        toast.error("Erro ao excluir o animal");
      }
    } catch (error) {
      console.log(error);
      toast.error("Ocorreu um erro ai mano desculpa!");
    }
  };

  console.log(animals);
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
            LISTANDO OS ANIMAIS CADASTRADOS
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
          {animals?.map((item) => (
            <div
              key={item.aid}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              onMouseEnter={() => setHoveredID(item.aid)}
              onMouseLeave={() => setHoveredID(null)}
            >
              <div className="mb-2">
                <h2 className="text-black font-semibold text-lg">
                  Peso do animal:
                </h2>
                <p className="text-gray-700 text-base">{item.apeso} KG</p>
              </div>
              <div className="mb-2">
                <h2 className="text-black font-semibold text-lg">
                  Coloração do animal:
                </h2>
                <p className="text-gray-700 text-base">{item.acolor}</p>
              </div>
              <div className="mb-2">
                <h2 className="text-black font-semibold text-lg">
                  Problema de saúde:
                </h2>
                <p className="text-gray-700 text-base">
                  {item.health_problem || "Não possui"}
                </p>
              </div>
              <div className="mb-2">
                <h2 className="text-black font-semibold text-lg">Brinco:</h2>
                <p className="text-gray-700 text-base">
                  {item.b_number || "Não possui"}
                </p>
              </div>
              <div className="mb-2">
                <h2 className="text-black font-semibold text-lg">
                  Estado de produção:
                </h2>
                <p className="text-gray-700 text-base">{item.prodstate}</p>
              </div>
              <div className="mb-2">
                <h2 className="text-black font-semibold text-lg">
                  Apelido do animal:
                </h2>
                <p className="text-gray-700 text-base">{item.apelido}</p>
              </div>
              {hoveredID == item.aid && (
                <div className="bottom-2 right-2 flex space-x-2 justify-end">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEdit(item.aid)}
                  >
                    <FaPen />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(item.aid)}
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <AnimalForm animalId={selectedAnimalId} onClose={handleCloseModal} />
        </Modal>
      </div>
    </div>
  );
}

export default ListAnimals;
