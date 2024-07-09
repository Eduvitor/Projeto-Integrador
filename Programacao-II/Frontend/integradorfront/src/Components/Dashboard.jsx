import { FaRegUserCircle } from "react-icons/fa"; //Botao do user
import { AiOutlineGlobal } from "react-icons/ai"; //Globo
import { FaEye } from "react-icons/fa"; //Icone para botao de listar algo
import { FaFileMedical } from "react-icons/fa"; //Icone para botao de add medicamento
import { IoMdAdd } from "react-icons/io"; //icone de mais para adicionar animal
import { FaCalendar } from "react-icons/fa"; //icone de calendario
import { FaCalendarTimes } from "react-icons/fa"; //icone para remover evento n vai ficar aqui ira para o read de eventos
import { FaBriefcaseMedical } from "react-icons/fa";
import { FaCalendarPlus } from "react-icons/fa";
import { FaSlidersH } from "react-icons/fa";
import Barrapesquisa from "./Barrapesquisa";
import React, { useState, useEffect, useRef } from "react";
import { GrConfigure } from "react-icons/gr"; //icone config
import { ImExit } from "react-icons/im"; //icone de sair
import { Outlet, Link } from "react-router-dom";
import { FiSun } from "react-icons/fi";
import logo from "./LogoSistema-Photoroom.png";
import ListAnimals from "./ListaNimal";
import Grafico1 from "./Grafico1";
import axios from "axios";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

function Dashboard() {
  const [width, setWidth] = useState(320); // Largura inicial
  const minWidth = 200;
  const maxWidth = 400;

  const handleMouseDown = (e) => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Função para redimensionar
  const handleMouseMove = (e) => {
    const newWidth = e.clientX;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setWidth(newWidth); // Ajusta a largura conforme o movimento do mouse
    }
  };

  // Função para terminar o redimensionamento
  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  //Controlar o menu do user

  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  const HandleCliclOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", HandleCliclOutside);
    } else {
      document.removeEventListener("mousedown", HandleCliclOutside);
    }

    return () => {
      document.removeEventListener("mousedown", HandleCliclOutside);
    };
  }, [open]);

  //Controle da exibição do menu lateral em telas pequenas

  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  //Troca o estado da sidebar

  const toggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  const logOut = () => {
    localStorage.removeItem("token");
  };

  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    const eventos = await axios.get("http://localhost:3301/Eventos", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return eventos.data;
  };

  const {
    data: eventos,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["eventsReturn"],
    queryFn: fetchEvents,
  });

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1">
        <button
          className="md:hidden p-4 text-white bg-blue-600 font-semibold text-lg"
          onClick={toggleSidebar}
        >
          MENU
        </button>
        <aside
          className={`fixed inset-y-0 left-0 z-50 transform md:transform-none md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-blue-600 text-gray-50 p-6 ${
            isSideBarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
          style={{ width: isSideBarOpen ? "65%" : width }}
        >
          <nav className="space-y-4 space-x-4">
            <div className="pb-8 flex items-center gap-6 font-semibold text-lg">
              <FaSlidersH></FaSlidersH>
              Selecionar Acao
            </div>
            <Link
              to={"ListagemAnimais"}
              className="flex items-center gap-6 font-semibold text-lg hover:bg-blue-400 rounded transform transition-transform duration-300 hover:scale-110"
            >
              <FaEye></FaEye>
              Listar Animais
            </Link>
            <Link
              to={"ListagemMedicamentos"}
              className="flex items-center gap-6 font-semibold text-lg hover:bg-blue-500 rounded transform transition-transform duration-300 hover:scale-110"
            >
              <FaFileMedical></FaFileMedical>
              Listar Medicamentos
            </Link>
            <a
              href=""
              className="flex items-center gap-6 font-semibold text-lg hover:bg-blue-500 rounded transform transition-transform duration-300 hover:scale-110"
            >
              <FaCalendar></FaCalendar>
              Listar Eventos
            </a>
            <Link
              to={"Cadastroanimal"}
              className="flex items-center gap-6 font-semibold text-lg hover:bg-blue-500 rounded transform transition-transform duration-300 hover:scale-110"
            >
              <IoMdAdd></IoMdAdd>
              Adicionar Animal
            </Link>
            <Link
              to={"Cadastromedicamento/"}
              className="flex items-center gap-6 font-semibold text-lg hover:bg-blue-500 rounded transform transition-transform duration-300 hover:scale-110"
            >
              <FaBriefcaseMedical />
              Adicionar Medicamento
            </Link>
            <Link
              to={"Cadastroevento/"}
              className="flex items-center gap-6 font-semibold text-lg hover:bg-blue-500 rounded transform transition-transform duration-300 hover:scale-110"
            >
              <FaCalendarPlus></FaCalendarPlus>
              Adicionar Evento
            </Link>
            <img src={logo} alt="LOGO DO SISTEMA SGPR"></img>
          </nav>
        </aside>
        {isSideBarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black opacity-50 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
        <div
          className="w-1 cursor-col-resize bg-gray-400"
          onMouseDown={handleMouseDown}
        ></div>
        <main className="bg-blue-100 w-screen grid grid-cols-1 md:grid-cols-3 gap-2, p-4 auto-rows-auto">
          <div className="md:col-span-1 flex flex-col space-y-4 order-3 md:order-2 max-w-full max-h-74 gap-2  bg-white">
            <h2 className="font-semibold text-2xl p-2">
              Dois eventos mais próximos
            </h2>
            {eventos?.map((item) => (
              <div
                key={item.event_id}
                className="border p-4 rounded-md shadow-md"
              >
                <label className="font-semibold p-4">
                  Nome do evento:
                </label>
                <p className="p-6">{item.ename}</p>
                <label className="font-semibold p-4">
                  Data do evento:
                </label>
                <p className="p-6">{new Date(item.edate).toLocaleDateString()}</p>
                <label className="font-semibold p-4">
                  Local do evento:
                </label>
                <p className="p-6">{item.elocal}</p>
              </div>
            ))}
          </div>
          <div className="md:col-span-1 flex flex-col space-y-4 order-2 md:order-2 w-80">
            <Grafico1 />
          </div>
          <div className="h-20 w-full flex flex-row items-center md:justify-end md:px-10 justify-center gap-5 order-1 md:order-3">
            <Barrapesquisa></Barrapesquisa>
            <button>
              {
                <AiOutlineGlobal className="h-20 w-10 md:h-28 md:w-18 rounded transform transition-transform duration-300 hover:scale-110"></AiOutlineGlobal>
              }
            </button>
            <div className="relative">
              <button onClick={() => setOpen(!open)}>
                {
                  <FaRegUserCircle className="h-20 w-10 md:h-28 md:w-18 rounded transform transition-transform duration-300 hover:scale-110"></FaRegUserCircle>
                }
              </button>
              {open && (
                <div
                  ref={menuRef}
                  className="bg-slate-300 absolute right-0 mt-2 py-2 px-4 rounded-xl shadow-lg w-48"
                >
                  <a
                    href=""
                    className="flex items-center gap-3 font-semibold text-lg transform transition-transform duration-300 hover:scale-105"
                  >
                    <GrConfigure></GrConfigure>
                    Configurações
                  </a>
                  <button className="flex items-center gap-3 font-semibold text-lg transform transition-transform duration-300 hover:scale-105">
                    <FiSun></FiSun>
                    Trocar tema
                  </button>
                  <Link
                    to={"/Login"}
                    className="flex items-center gap-3 font-semibold text-lg transform transition-transform duration-300 hover:scale-105"
                    onClick={() => logOut()}
                  >
                    <ImExit></ImExit>
                    Sair
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
