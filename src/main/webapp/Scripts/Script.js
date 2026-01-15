// Script.js — autenticação backend (versão compatível com Eclipse / ES5)
// Substitui localStorage por Servlets e mantém mesma funcionalidade

// Registro - Não precisa de JS, o form já submete via POST para /auth/registro
var formRegistro = document.getElementById('formRegistro');
if (formRegistro) {
  formRegistro.addEventListener('submit', function() {
    // O envio normal do formulário já redireciona para /auth/registro (action no JSP)
  });
}

// Login - Não precisa de JS, o form já submete via POST para /auth/login
var formLogin = document.getElementById('formLogin');
if (formLogin) {
  formLogin.addEventListener('submit', function() {
    // O envio normal do formulário já redireciona para /auth/login (action no JSP)
  });
}

// Exibir link admin dinamicamente
document.addEventListener('DOMContentLoaded', function() {
  fetch('auth/me')
    .then(function(r) {
      return r.json();
    })
    .then(function(me) {
      var link = document.querySelector('.admin-link');
      if (link) {
        link.style.display = (me && me.isAdmin) ? 'inline-block' : 'none';
      }
    })
    .catch(function() {
      console.error('Erro ao verificar autenticação');
    });
});

// Logout
function logout() {
  location.href = 'auth/logout';
}

// Função para toggle de senha (para Registro.jsp e Login.jsp)
function togglePassword(inputId, buttonId) {
  var input = document.getElementById(inputId);
  var button = document.getElementById(buttonId);
  if (!input || !button) return;
  
  if (input.type === 'password') {
    input.type = 'text';
    button.textContent = '🙈';
  } else {
    input.type = 'password';
    button.textContent = '👀';
  }
}