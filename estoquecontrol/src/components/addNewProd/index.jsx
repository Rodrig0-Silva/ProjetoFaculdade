import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function AddNewProd({ onProdutoAdicionado }) {
  const [form, setForm] = useState({
    nome: "",
    sku: "",
    descricao: "",
    quantidade: 0,
    preco: "",
    imagem: "",
    tipo: ""
  });

  const [exibirScanner, setExibirScanner] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sku = form.sku.trim().toUpperCase();
    if (!sku) return toast.warn("Informe um código de barras válido.");

    try {
      const { data: produtos } = await axios.get("http://localhost:3001/produtos");
      const existente = produtos.find(p => p.sku === sku);

      if (existente) {
        const novaQuantidade = Number(existente.quantidade) + Number(form.quantidade);
        await axios.put(`http://localhost:3001/produtos/${existente._id || existente.id}`, {
          ...existente,
          quantidade: novaQuantidade
        });
        toast.info(`Quantidade atualizada: ${novaQuantidade}`);
      } else {
        await axios.post("http://localhost:3001/produtos", { ...form, sku });
        toast.success("Produto adicionado!");
      }

      setForm({
        nome: "",
        sku: "",
        descricao: "",
        quantidade: 0,
        preco: "",
        imagem: "",
        tipo: ""
      });

      if (onProdutoAdicionado) onProdutoAdicionado();
      setExibirScanner(false);
    } catch (error) {
      toast.error("Erro ao adicionar produto.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <h2>Cadastro de Produto</h2>

      <button type="button" onClick={() => setExibirScanner(!exibirScanner)}>
        {exibirScanner ? "Fechar Scanner" : "Abrir Leitor de Código de Barras"}
      </button>

      {exibirScanner && (
        <div style={{ margin: "10px 0" }}>
          <Scanner
            onResult={(text) => {
              if (text) {
                setForm((prev) => ({ ...prev, sku: text }));
                toast.info("Código detectado!");
                setExibirScanner(false);
              }
            }}
            onError={(err) => console.warn("Scanner error", err)}
            constraints={{ facingMode: "environment" }}
          />
        </div>
      )}

      <input name="nome" placeholder="Produto" value={form.nome} onChange={handleChange} required />
      <input name="sku" placeholder="Cód. de Barras" value={form.sku} onChange={handleChange} required />
      <input name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} />
      <input name="quantidade" type="number" placeholder="Quantidade" value={form.quantidade} onChange={handleChange} required />
      <input name="preco" type="number" placeholder="Preço" value={form.preco} onChange={handleChange} />
      <input name="tipo" placeholder="Tipo" value={form.tipo} onChange={handleChange} />
      <input name="imagem" placeholder="URL da Imagem" value={form.imagem} onChange={handleChange} />
      <button type="submit">Adicionar Produto</button>
    </form>
  );
}