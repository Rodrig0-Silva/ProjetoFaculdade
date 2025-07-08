import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./Home.css";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const response = await axios.get("http://localhost:3001/produtos");
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    carregarProdutos();
  }, []);

  const produtosFiltrados = produtos.filter((produto) => {
    const termo = busca.trim().toLowerCase();
    const nome = produto.nome?.toLowerCase() || "";
    const tipo = produto.tipo?.toLowerCase() || "";
    const sku = produto.sku || "";

    return (
      nome.includes(termo) ||
      tipo.includes(termo) ||
      sku.includes(termo)
    );
  });

  const listaExibida = busca
    ? produtosFiltrados // mostra tudo que casa com a busca, inclusive os esgotados
    : produtos.filter((p) => p.quantidade > 0); // sem busca, esconde os com 0

  return (
    <div className="home-container">
      <h2>Produtos em Estoque</h2>

      <input
        type="text"
        placeholder="Buscar por nome, tipo ou código..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="campo-busca"
      />

      <div className="lista-produtos">
        {listaExibida.length === 0 ? (
          <p style={{ marginTop: 20 }}>Nenhum produto encontrado 😕</p>
        ) : (
          listaExibida.map((produto) => (
            <div
              key={produto._id || produto.id}
              className={`card-produto ${produto.quantidade === 0 ? "esgotado" : ""}`}
            >
              <img src={produto.imagem} alt={produto.nome} />
              <h3>{produto.nome}</h3>
              <p>Cód. de Barras: {produto.sku}</p>
              <p>Tipo: {produto.tipo}</p>
              <p>Preço: R$ {Number(produto.preco).toFixed(2)}</p>
              {produto.quantidade === 0 ? (
                <p style={{ color: "red", fontWeight: "bold" }}>Produto esgotado</p>
              ) : (
                <p>Quantidade: {produto.quantidade}</p>
              )}
            </div>
          ))
        )}
        
      </div>
    </div>
  );
}