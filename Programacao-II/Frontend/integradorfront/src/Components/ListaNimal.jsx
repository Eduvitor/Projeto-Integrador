import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import logo from "./LogoSistema-Photoroom.png";
import { useForm } from 'react-hook-form';
import { FaPen } from "react-icons/fa"; //item para editar algo
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa"; //lixeira
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import axios from "axios";



function ListAnimals() {
  
  console.log("COMECOU!!!");

  const animais = async () => {
    console.log("entreiaq");
    const response = await axios.get("http://localhost:3301/Animais");
    //console.log(response)
    return response.data;
  };

  const { data: animals, error, isLoading } = useQuery({
    queryKey: ["AnimaisReturn"],
    queryFn: animais
  });
  console.log(animals);
    if(isLoading) return <div>Carregando dados!</div>
    if(error) return <div>Ocorreu um erro na requisicao!</div>

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
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-200">
          {animals?.map(item => 
            <div key={item.aid} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-30">
              <h2 className="text-xl font-semibold mb-2">{item.araca}</h2>
              <p className="text-gray-700">{item.apeso}</p>
              <p className="text-gray-700">{item.acolor}</p>
              <p className="text-gray-700">{item.health_problem}</p>
              <p className="text-gray-700">{item.b_number}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
};


export default ListAnimals;
