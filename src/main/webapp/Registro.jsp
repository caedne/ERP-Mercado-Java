<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Registro</title>
<link rel="stylesheet" href="Styles/Registro_Style.css">
</head>
<body>
	<div class="container">
		<div class="left">
			<img src="img/Logo.png" alt="Logo" class="logo">
		</div>
		<div class="right">
			<p class="login-link">
				Já tenho uma conta <a href="Login.jsp">Entrar</a>
			</p>
			<form id="formRegistro"
				action="${pageContext.request.contextPath}/auth/registro"
				method="post">
				<h2>Registrar</h2>

				<input type="text" name="nome" id="nome" placeholder="Nome" required>
				<input type="email" name="email" id="email" placeholder="Email"
					required>

				<div class="password-container">
					<input type="password" name="senha" id="senha"
						placeholder="Digite sua senha..." required>
					<button type="button" id="toggleSenha"
						onclick="togglePassword('senha', 'toggleSenha')">👀</button>
				</div>

				<label class="checkbox"> <input type="checkbox" id="terms"
					required> Concordo com os <a href="termos.jsp"
					target="_blank">Termos e Condições</a>
				</label>

				<button type="submit" class="btn">Criar conta</button>

				<div class="divider">Ou registre com</div>
				<div class="social">
					<button type="button" class="google">
						<img
							src="https://imagepng.org/wp-content/uploads/2019/08/google-icon-1.png"
							alt="Google"> Google
					</button>
					<button type="button" class="apple">
						<img src="https://www.freeiconspng.com/uploads/apple-icon-4.png"
							alt="Apple"> Apple
					</button>
				</div>
			</form>

		</div>
	</div>
	<script src="Scripts/Script.js"></script>


  <script src="Scripts/usuario.js"></script>
</body>
</html>