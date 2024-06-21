import { FaRegUserCircle } from "react-icons/fa"; //Botao do user
import { AiOutlineGlobal } from "react-icons/ai"; //Globo
import { FaPen } from "react-icons/fa"; //item para editar algo
import { FaEye } from "react-icons/fa"; //Icone para botao de listar algo
import { FaFileMedical } from "react-icons/fa"; //Icone para botao de add medicamento
import { IoMdAdd } from "react-icons/io"; //icone de mais para adicionar animal
import { FaCalendar } from "react-icons/fa"; //icone de calendario
import { FaCalendarTimes } from "react-icons/fa"; //icone para remover evento n vai ficar aqui ira para o read de eventos
import { FaTrash } from "react-icons/fa"; //lixeira
import { FaBriefcaseMedical } from "react-icons/fa";
import { FaCalendarPlus } from "react-icons/fa";
import { FaSlidersH } from "react-icons/fa";
import Barrapesquisa from "./Barrapesquisa";
import React, { useState, useEffect, useRef } from "react";
import { GrConfigure } from "react-icons/gr"; //icone config
import { ImExit } from "react-icons/im"; //icone de sair
import { Outlet, Link } from "react-router-dom";
import { FiSun } from "react-icons/fi";


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

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1">
        <aside
          className="w-80 h-screen bg-blue-600 text-gray-50 p-6"
          style={{ width: width }}
        >
          <nav className="space-y-5 space-x-4">
            <div className="pb-8 flex items-center gap-6 font-semibold text-lg">
              <FaSlidersH></FaSlidersH>
              Selecionar Acao
            </div>
            <a
              href=""
              className="flex items-center gap-6 font-semibold text-lg hover:bg-blue-400 rounded transform transition-transform duration-300 hover:scale-110"
            >
              <FaEye></FaEye>
              Listar Animais
            </a>
            <a
              href=""
              className="flex items-center gap-6 font-semibold text-lg hover:bg-blue-500 rounded transform transition-transform duration-300 hover:scale-110"
            >
              <FaFileMedical></FaFileMedical>
              Listar Medicamentos
            </a>
            <a
              href=""
              className="flex items-center gap-6 font-semibold text-lg hover:bg-blue-500 rounded transform transition-transform duration-300 hover:scale-110"
            >
              <FaCalendar></FaCalendar>
              Listar Eventos
            </a>
            <a
              href=""
              className="flex items-center gap-6 font-semibold text-lg hover:bg-blue-500 rounded transform transition-transform duration-300 hover:scale-110"
            >
              <IoMdAdd></IoMdAdd>
              Adicionar Animal
            </a>
            <Link to={'Cadastromedicamento/'}
              className="flex items-center gap-6 font-semibold text-lg hover:bg-blue-500 rounded transform transition-transform duration-300 hover:scale-110"
            >
              <FaBriefcaseMedical />
              Adicionar Medicamento
            </Link>
            <a
              href=""
              className="flex items-center gap-6 font-semibold text-lg hover:bg-blue-500 rounded transform transition-transform duration-300 hover:scale-110"
            >
              <FaCalendarPlus></FaCalendarPlus>
              Adicionar Evento
            </a>
          </nav>
        </aside>
        <div
          className="w-1 cursor-col-resize bg-gray-400"
          onMouseDown={handleMouseDown}
        ></div>
        <main className="bg-blue-100 w-screen flex flex-row justify-between ">
          <div className="h-20 w-full flex flex-row items-center justify-end md:px-10">
            <Barrapesquisa></Barrapesquisa>
            <button>
              {
                <AiOutlineGlobal className="h-10 md:w-20 sm:w-10 rounded transform transition-transform duration-300 hover:scale-110"></AiOutlineGlobal>
              }
            </button>
            <div className="relative">
              <button onClick={() => setOpen(!open)}>
                {
                  <FaRegUserCircle className="h-10 md:w-20 sm:10 rounded transform transition-transform duration-300 hover:scale-110"></FaRegUserCircle>
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
                  <button
                    className="flex items-center gap-3 font-semibold text-lg transform transition-transform duration-300 hover:scale-105"
                  >
                    <FiSun></FiSun>
                    Trocar tema
                  </button>
                  <a
                    href=""
                    className="flex items-center gap-3 font-semibold text-lg transform transition-transform duration-300 hover:scale-105"
                  >
                    <ImExit></ImExit>
                    Sair
                  </a>
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
