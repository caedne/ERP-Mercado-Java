<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <title>Mercado Aurora - Contatos</title>
  <link rel="stylesheet" href="Styles/contatos.css">
  <link rel="stylesheet" href="Styles/responsive-styles.css">
</head>

<body>

  <header>
    <a href="index.jsp">
      <img src="img/Logo.png" class="logo" alt="Logo">
    </a>
    <div>
      <h1>Mercado Aurora</h1>
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
    <h2>Contatos</h2>
    <p>Endereço: Rua das Hortaliças, 123, Blumenau, SC</p>
    <p>Telefone: (47) 99999-0000</p>
    <p>E-mail: contato@mercadoaurora.com.br</p>
    <p>Instagram: <a href="#">@mercadoaurora</a></p>
    <p>Horário de funcionamento: Segunda a sábado, das 8h às 19h</p>
  </main>

  <main>
    <form id="form-contato" action="contato" method="POST">
      <div>
        <label for="nome">Nome:</label>
        <input type="text" id="nome" name="nome" required>
      </div>

      <div>
        <label for="email">E-mail:</label>
        <input type="email" id="email" name="email" required>
      </div>

      <div>
        <label for="telefone">Telefone:</label>
        <input type="tel" id="telefone" name="telefone">
      </div>

      <div>
        <label for="mensagem">Mensagem:</label>
        <textarea id="mensagem" name="mensagem" rows="6" required></textarea>
      </div>

      <div>
        <button type="submit">Enviar Mensagem</button>
      </div>
      <br>
      
      <footer>
        <p><b>&copy; 2025 Mercado Aurora. Todos os direitos reservados.</b></p>
      </footer>

    </form>

  </main>



  <!-- script externo -->
  <script src="Scripts/usuario.js"></script>

<!-- Toast de confirmação de envio -->
<div id="toast-contato" class="toast-contato<% if ("1".equals(request.getParameter("ok"))) { %> show<% } %>">
  <span>Mensagem enviada com sucesso! Em breve entraremos em contato.</span>
</div>

<script>
  (function() {
    var toast = document.getElementById('toast-contato');
    if (toast && toast.classList.contains('show')) {
      setTimeout(function() {
        toast.classList.remove('show');
      }, 4000);
    }
  })();
</script>

<style>
  .toast-contato {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #2e7d32;
    color: #fff;
    padding: 12px 18px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    font-size: 0.95rem;
    opacity: 0;
    pointer-events: none;
    transform: translateY(10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 9999;
  }
  .toast-contato.show {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }
</style>

</body>

</html>