<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <meta name="viewpoint">
  <title>Mercado Aurora - Home</title>
  <link rel="stylesheet" href="Styles/index.css">
  <link rel="stylesheet" href="Styles/responsive-styles.css">
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
    <h2 style="text-align:center">Bem-vindo a nossa loja</h2>
    <p style="text-align:center;">Bem-vindo ao Mercado Aurora, o seu espaço de compras com propósito em Blumenau. Somos um mercado de bairro com
      alma de cooperativa, dedicado a oferecer produtos frescos, locais e sustentáveis, tudo isso com aquele atendimento
      que faz você se sentir em casa.</p>



    <br>
    <div class="imagem">
      <img src="img/1128.jpg" alt="Imagem do mercado"
        style="display: block; margin: auto; max-width: 100%; height: auto;">
    </div><br>

    <h2>Ofertas do Dia:</h2>
    <p>Confira nossas ofertas fresquinhas:</p>

<div class="produtos-container">
  <div class="produto">
    <a href="produtos.jsp#tomate">
      <img src="img/2149125235.jpg" alt="Tomate" style="width: 150px; height: 150px; object-fit: cover;">
    </a>
    <p>Tomate - R$ 3,99/kg</p>
  </div>

  <div class="produto">
    <a href="produtos.jsp#Laranja">
      <img src="img/2147830511.jpg" alt="Laranja" style="width: 150px; height: 150px; object-fit: cover;">
    </a>
    <p>Laranja - R$ 2,49/kg</p>
  </div>

  <div class="produto">
    <a href="produtos.jsp#Batata">
      <img src="img/15862.jpg" alt="Batata" style="width: 150px; height: 150px; object-fit: cover;">
    </a>
    <p>Batata - R$ 3,49/kg</p>
  </div>

  <div class="produto">
    <a href="produtos.jsp#Cenoura">
      <img src="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop" style="width: 150px; height: 150px; object-fit: cover;">
    </a>
    <p>Cenoura - R$ 2,99/kg</p>
  </div>

  <div class="produto">
    <a href="produtos.jsp#Banana">
      <img src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop" alt="Cenoura" alt="Banana" style="width: 150px; height: 150px; object-fit: cover;">
    </a>
    <p>Banana - R$ 4,50/kg</p>
  </div>

  <div class="produto">
    <a href="produtos.jsp#maca">
      <img src="img/maca.jpg" alt="maca" style="width: 150px; height: 150px; object-fit: cover;">
    </a>
    <p>Maçã - R$ 5,00/kg</p>
  </div>
</div>


  </main>

  <footer>
    <p><b>&copy; 2025 Mercado Aurora. Todos os direitos reservados.</b></p>
  </footer>

  <script src="Scripts/usuario.js"></script>

</body>

</html>