"use client";
import { useState } from "react";
import Image from "next/image";
import CeopagLogo from "../public/ceopag-logo.webp"; // coloquei na pasta public/

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget as HTMLFormElement;
    setLoading(true);
    setMessage("");

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      setMessage("✅ Formulário enviado com sucesso!");
      form.reset();
    } else {
      setMessage("❌ Erro ao enviar formulário. Tente novamente.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-lg p-8 w-full max-w-2xl space-y-6 border border-gray-200"
      >
        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <Image src={CeopagLogo} alt="Ceopag Logo" width={180} height={50} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Cadastro de Vaga
        </h1>

        <div>
          <label className="block text-gray-800 font-medium">Departamento / Líder</label>
          <input
            name="departamento"
            type="text"
            required
            className="text-black w-full border border-gray-300 rounded-md p-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-medium">Cargo</label>
          <input
            name="cargo"
            type="text"
            required
            className="text-black w-full border border-gray-300 rounded-md p-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-medium">Perfil exigido</label>
          <textarea
            name="perfil"
            required
            className="text-black w-full border border-gray-300 rounded-md p-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-medium">Resumo das atividades</label>
          <textarea
            name="atividades"
            required
            className="text-black w-full border border-gray-300 rounded-md p-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-medium">Tipo de contratação</label>
          <select
            name="contratacao"
            required
            className="text-black w-full border border-gray-300 rounded-md p-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="CLT">CLT</option>
            <option value="PJ">PJ</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-800 font-medium">Quantidade de colaboradores</label>
          <input
            name="quantidade"
            type="number"
            min="1"
            required
            className="text-black w-full border border-gray-300 rounded-md p-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-medium">Data de admissão</label>
          <input
            name="admissao"
            type="date"
            required
            className="text-black w-full border border-gray-300 rounded-md p-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-medium">Observação (opcional)</label>
          <textarea
            name="observacao"
            className="text-black w-full border border-gray-300 rounded-md p-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 transition font-semibold"
        >
          {loading ? "Enviando..." : "Enviar formulário"}
        </button>

        {message && (
          <p className="text-center text-sm mt-4 text-gray-800 font-medium">{message}</p>
        )}
      </form>
    </div>
  );
}
