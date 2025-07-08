import React, { useState } from "react";
import axios from "axios";

export default function AddFornecedor({ onFornecedorAdicionado }) {
  const [form, setForm] = useState({
    empresa: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    contato: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = async (e) => {
    const { name, value } = e.target;
  setForm({ ...form, [name]: value });
  setErrors({ ...errors, [name]: "" });

  if (name === "cnpj" && value.replace(/\D/g, "").length === 14) {
    try {
      const { data } = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${value}`);
      if (data.status !== "ERROR") {
        setForm(prev => ({
          ...prev,
          empresa: data.nome || "",
          endereco: `${data.logradouro}, ${data.numero} ${data.bairro} - ${data.municipio}/${data.uf}`,
          telefone: data.telefone || "",
          email: data.email || ""
        }));
      } else {
        alert("CNPJ não encontrado na base da Receita.");
      }
    } catch {
      alert("Erro ao consultar CNPJ na Receita.");
    }
  }
};


  const validarCampos = () => {
    const newErrors = {};
    if (!form.empresa) newErrors.empresa = "Obrigatório";
    if (!form.cnpj) newErrors.cnpj = "Obrigatório";
    if (!form.endereco) newErrors.endereco = "Obrigatório";
    if (!form.telefone) newErrors.telefone = "Obrigatório";
    if (!form.email) newErrors.email = "Obrigatório";
    if (!form.contato) newErrors.contato = "Obrigatório";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validarCampos();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Verificar se o CNPJ já existe
      const { data: fornecedores } = await axios.get("http://localhost:3001/fornecedores");
      const cnpjExiste = fornecedores.some(f => f.cnpj === form.cnpj);
      if (cnpjExiste) {
        alert("Fornecedor com esse CNPJ já está cadastrado!");
        return;
      }

      await axios.post("http://localhost:3001/fornecedores", form);
      setForm({
        empresa: "",
        cnpj: "",
        endereco: "",
        telefone: "",
        email: "",
        contato: ""
      });
      if (onFornecedorAdicionado) onFornecedorAdicionado();
      alert("Fornecedor cadastrado com sucesso!");
    } catch (error) {
      alert("Erro ao cadastrar fornecedor.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <h2>Cadastro de Fornecedor</h2>
      <input name="empresa" placeholder="Nome da Empresa" value={form.empresa} onChange={handleChange} />
      {errors.empresa && <span style={{ color: "red" }}>{errors.empresa}</span>}

      <input name="cnpj" placeholder="CNPJ" value={form.cnpj} onChange={handleChange} />
      {errors.cnpj && <span style={{ color: "red" }}>{errors.cnpj}</span>}

      <input name="endereco" placeholder="Endereço" value={form.endereco} onChange={handleChange} />
      {errors.endereco && <span style={{ color: "red" }}>{errors.endereco}</span>}

      <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} />
      {errors.telefone && <span style={{ color: "red" }}>{errors.telefone}</span>}

      <input name="email" placeholder="E-mail" value={form.email} onChange={handleChange} />
      {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}

      <input name="contato" placeholder="Contato Principal" value={form.contato} onChange={handleChange} />
      {errors.contato && <span style={{ color: "red" }}>{errors.contato}</span>}

      <button type="submit">Cadastrar</button>
    </form>
  );
}