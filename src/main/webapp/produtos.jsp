<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List, dao.ProdutoDAO, model.Produto" %>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Mercado Aurora - Produtos</title>
  <link rel="stylesheet" href="Styles/produtos.css">
   <link rel="stylesheet" href="Styles/responsive-styles.css">
  <script src="Scripts/produtos.js" defer></script>
</head>
<body>

 <header>
      <a href="index.jsp">
      <img src="img/Logo.png" class="logo" alt="Logo">
    </a>
  <div>
    <h1 class="h1">Mercado Aurora</h1>
    <p>Bons produtos com baixo custo!</p>
    </div>
  </header>

  <nav>
    <ul>
      <li><a href="index.jsp">Home</a></li>
      <li><a href="produtos.jsp">Produtos</a></li>
      <li><a href="contatos.jsp">Contatos</a></li>
      <li><a href="quemsomos.jsp">Quem Somos</a></li>      
      <li><a href="Login.jsp">Login</a></li>
      <li><a href="carrinho.jsp" class="active">🛒 Carrinho</a>
        <li><a href="admin.jsp" class="admin-link">Admin ⚙️</a></li>
<li><a href="perfil.jsp" class="active">
  <span id="usuario-logado"></span>
</a></li>
    </ul>
  </nav>


  <main>
    <h2>Confira nossas ofertas fresquinhas:</h2>
    
    <div class="filtros-container">
      <div class="filtros">
        <button class="filtro-btn active" data-categoria="todos">Todos</button>
        <button class="filtro-btn" data-categoria="frutas">Frutas</button>
        <button class="filtro-btn" data-categoria="legumes">Legumes</button>
        <button class="filtro-btn" data-categoria="verduras">Verduras</button>
        <button class="filtro-btn" data-categoria="outros">Outros</button>
      </div>
      
      <div class="ordenacao">
        <label for="ordenar">Ordenar por:</label>
        <select id="ordenar">
          <option value="nome">Nome</option>
          <option value="preco-menor">Menor Preço</option>
          <option value="preco-maior">Maior Preço</option>
        </select>
      </div>
    </div>

    <div class="produtos-container" id="produtos-container">
  <%
    ProdutoDAO pdao = new ProdutoDAO();
    java.util.List<Produto> lista = null;
    try {
      lista = pdao.list();
    } catch (Exception e) {
      e.printStackTrace();
    }
    if (lista != null) {
      for (Produto p : lista) {
  %>
  <div class="produto" data-categoria="<%= p.categoria %>" data-id="<%= p.id %>">
    <div class="produto-imagem">
      <img src="<%= p.img %>" alt="<%= p.nome %>">
    </div>
    <div class="produto-info">
      <h3><%= p.nome %></h3>
      <p class="produto-descricao"><%= p.descricao %></p>
      <div class="produto-preco">
        <span class="preco-atual">
          R$ <%= String.format(java.util.Locale.forLanguageTag("pt-BR"), "%.2f", p.preco) %>
        </span>
        <span class="unidade">/<%= p.unidade %></span>
      </div>
      <div class="produto-quantidade">
        <button class="btn-menos" data-produto="<%= p.id %>">-</button>
        <input type="number" id="qtd-<%= p.id %>" min="0" step="1" value="0" class="input-quantidade" readonly>
        <button class="btn-mais" data-produto="<%= p.id %>">+</button>
        <span class="kg-label"><%= p.unidade %></span>
      </div>
      <button class="btn-adicionar" data-produto="<%= p.id %>">
        🛒 Adicionar ao Carrinho
      </button>
    </div>
  </div>
  <%
      }
    }
  %>
</div>
  </main>

  <footer>
    <p><b>&copy; 2025 Mercado Aurora. Todos os direitos reservados.</b></p>
  </footer>

  <script src="js/produtos.js"></script>
   <script src="Scripts/usuario.js"></script>
  
  <!-- Notificão Toast -->
  <div id="toast" class="toast"></div>

</body>
</html>