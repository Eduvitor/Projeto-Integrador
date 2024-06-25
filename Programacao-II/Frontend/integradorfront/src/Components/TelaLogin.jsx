import { Form } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";



const TelaLogin = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [ loginError, setLoginError ] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log(data);
        try {
            const response = await axios.post("http://localhost:3301/Login", {
                username: data.username,
                password: data.password,
            });
            console.log(response);
            if (response.status >= 200 && response.status < 300) {
				// Salva o token JWT na sessão
				localStorage.setItem("token", response.data.token);
                setLoginError("");
                navigate("/")
			} else {
				// falha
				console.error("Falha na autenticação");
                setLoginError("Nao foi possivel autenticar");
			}
        } catch (error) {
            setLoginError("Ocorreu uma falha no login!");
            console.log(error);
        }
    }
    return (
        <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-r from-cyan-500 to-blue-500">
            <div className="flex flex-col items-center justify-center bg-white h-3/6 w-2/6 bg-gradient-to-r from-blue-500 to-blue-300 rounded-3xl p-8">
                <h2 className="font-semibold text-2xl mb-6">FAÇA SEU LOGIN</h2>
                <Form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6">
                        <label className="font-semibold block mb-2">Digite seu CPF</label>
                        <input
                            className="bg-slate-200 rounded-xl h-10 w-full p-2"
                            type="text"
                            {... register('username', {required: true})}
                        />
                         { errors?.username?.type === 'required' && <p className="text-xl text-red-600 font-semibold">Seu cpf e necessario</p>}
                    </div>
                    <div className="mb-6">
                        <label className="font-semibold block mb-2">Digite sua senha</label>
                        <input
                            type="password"
                            className="bg-slate-200 rounded-xl h-10 w-full p-2"
                            {... register('password', {required: true})}
                        />
                         { errors?.password?.type === 'required' && <p className="text-xl text-red-600 font-semibold">A senha e obrigatoria</p>}
                    </div>
                    <div className="flex justify-center mb-4">
                        <button
                            
                            className="font-semibold rounded-xl flex justify-center items-center bg-blue-600 h-10 w-24 text-xl text-white transform transition-transform duration-300 hover:scale-110"
                            type="submit"
                        >Entrar</button>
                    </div>
                </Form>
                <div className="flex justify-center">
                    <button className="text-white underline transform transition-transform duration-300 hover:scale-110">Esqueci minha senha</button>
                </div>
            </div>
        </div>
    );
}

export default TelaLogin;