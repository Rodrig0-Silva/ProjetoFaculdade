import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { FaHome, FaPlus, FaArrowCircleDown, FaPrint } from "react-icons/fa";
import Home from "./pages/Home";
import AdicionarProduto from "./pages/AdicionarProduto";
import SaidaProdutos from "./pages/SaidaProdutos";
import ImpressaoSaida from "./pages/ImpressaoSaida";
import AddFornecedor from "./pages/Fornecedor/AddFornecedor";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./components/MenuButtons.css";

export default function App() {
  return (
    <BrowserRouter>
      {/* Toast de notificações */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      {/* Navegação principal */}
      <nav className="menu-nav">
        <Link to="/" className="menu-link">
          <FaHome /> Início
        </Link>
        <Link to="/adicionar" className="menu-link add">
          <FaPlus /> Adicionar Produto
        </Link>
        <Link to="/saida" className="menu-link saida">
          <FaArrowCircleDown /> Saída de Produtos
        </Link>
        <Link to="/impressao" className="menu-link impressao">
          <FaPrint /> Impressão de Saída
        </Link>
        <Link to="/fornecedor" className="menu-link fornecedor">
          <FaPlus /> Adicionar Fornecedor
        </Link>
      </nav>

      {/* Rotas das páginas */}
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adicionar" element={<AdicionarProduto />} />
          <Route path="/saida" element={<SaidaProdutos />} />
          <Route path="/impressao" element={<ImpressaoSaida />} />
          <Route path="/fornecedor" element={<AddFornecedor />} />
      </Routes>

    </BrowserRouter>
  );
}