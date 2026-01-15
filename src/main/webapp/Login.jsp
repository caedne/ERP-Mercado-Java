<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
  <link rel="stylesheet" href="Styles/Login_Style.css">
</head>
<body>
  <div class="container">
    <div class="left">
      <img src="img/Logo.png" class="logo" alt="Logo">
    </div>
    <div class="right">
      <form action="${pageContext.request.contextPath}/auth/login" method="post">
        <h2>Login</h2>

        <% if (request.getParameter("erro") != null) { %>
          <p style="color:red;text-align:center;">
            <%= request.getParameter("erro").equals("1") ? "Email ou senha incorretos." : "Erro no servidor." %>
          </p>
        <% } %>

        <% if (request.getParameter("ok") != null) { %>
          <p style="color:green;text-align:center;">Conta criada com sucesso! Faça login abaixo.</p>
        <% } %>

        <input type="email" name="email" id="loginEmail" placeholder="Email" required>
<div class="password-container">
  <input type="password" name="senha" id="loginSenha" placeholder="Senha" required>
  <button type="button" id="toggleLoginSenha"
    onclick="togglePassword('loginSenha', 'toggleLoginSenha')">🙈</button>
</div>

        <button type="submit" class="btn">Entrar</button>
      </form>
      <br>
      <div class="register-link">
        <a href="Registro.jsp">Ainda não tem conta? Criar conta</a>
      </div>
    </div>
  </div>
  <script src="Scripts/Script.js"></script>
  <script src="Scripts/usuario.js"></script>
</body>
</html>
