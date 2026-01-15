<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Admin - Produtos</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="Styles/admin.css" />
  <link rel="stylesheet" href="Styles/responsive-styles.css" />

</head>
<body>
  <header>
    <a href="index.jsp">
      <img src="img/Logo.png" class="logo" alt="Logo" />
    </a>
    <div>
      <h1 class="h1">Painel Administrativo</h1>
      <p>Gerencie o catálogo de produtos</p>
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


  <main id="admin-app" style="max-width: 1100px; margin: 20px auto;">
    <section>
      <h2>Criar / Editar Produto</h2>
      <form id="form-admin-produto" action="api/produtos" method="post" class="admin-form">
        <div class="grid">
          <label>
            ID (único)
            <input type="text" id="adm-id" placeholder="ex.: melancia" required />
          </label>
          <label>
            Nome
            <input type="text" id="adm-nome" placeholder="Nome do produto" required />
          </label>
          <label>
            Preço (use vírgula: 1,50)
            <input type="text" id="adm-preco" placeholder="0,00" required />
          </label>
          <label>
            Unidade
            <select id="adm-unidade" required>
              <option value="">Selecione...</option>
              <option value="kg">kg</option>
              <option value="unidade">unidade</option>
              <option value="litros">litros</option>
            </select>
          </label>
          <label>
            Categoria
            <select id="adm-categoria" required>
              <option value="">Selecione...</option>
              <option value="frutas">Frutas</option>
              <option value="legumes">Legumes</option>
              <option value="verduras">Verduras</option>
              <option value="outros">Outros</option>
            </select>
          </label>
          <label class="full">
            Descrição
            <textarea id="adm-descricao" rows="3" placeholder="Descrição do produto"></textarea>
          </label>
          <label class="full">
            URL da Imagem
            <input type="text" id="adm-img" placeholder="img/arquivo.jpg ou https://..." />
          </label>
        </div>

        <div class="acoes">
          <button type="submit" class="btn">Salvar</button>
          <button id="adm-cancelar" class="btn" type="button">Cancelar</button>
        </div>
      </form>
    </section>

    <hr />

    <section>
      <h2>Produtos Cadastrados</h2>
      
      <div class="filtros-admin" id="filtros-admin-categoria">
        <h3>🔍 Filtrar por Categoria:</h3>
        <div class="filtros-admin-btns">
          <button class="filtro-admin-btn active" data-categoria="todos">Todos</button>
          <button class="filtro-admin-btn" data-categoria="frutas">🍎 Frutas</button>
          <button class="filtro-admin-btn" data-categoria="legumes">🥕 Legumes</button>
          <button class="filtro-admin-btn" data-categoria="verduras">🥬 Verduras</button>
          <button class="filtro-admin-btn" data-categoria="outros">📦 Outros</button>
        </div>
      </div>
      
      <div class="tabela-wrap">
        <table id="tabela-produtos" class="tabela">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Unidade</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody><!-- render via JS --></tbody>
        </table>
      </div>
      <p style="margin-top:8px;"><small>Obs.: Itens padrão do sistema não podem ser excluídos.</small></p>
    </section>
  </main>

  <script src="Scripts/Script.js"></script>
  <script src="Scripts/produtos.js"></script>
  <script src="Scripts/usuario.js"></script>
</body>
</html>