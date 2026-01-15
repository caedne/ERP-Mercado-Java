// usuario.js — Backend-driven (compatível com Eclipse / ES5)

document.addEventListener('DOMContentLoaded', function() {
  // Form de contato
  var form = document.getElementById('form-contato');
  if (form) {
    form.addEventListener('submit', function() {
      // O envio normal do formulário já vai para /api/contatos (action configurada no JSP)
    });
  }

  // Exibir usuário logado no nav
  mostrarUsuarioLogado();
  
  // Exibir link admin dinamicamente
  exibirLinkAdmin();
});

// Exibir usuário logado no nav
function mostrarUsuarioLogado() {
  fetch('auth/me')
    .then(function(r) {
      if (!r.ok) throw new Error('Não autenticado');
      return r.json();
    })
    .then(function(user) {
      var container = document.getElementById('usuario-logado');
      if (container && user && user.nome) {
        container.innerHTML = '👤 Olá, <strong>' + user.nome + '</strong>!';
      }
    })
    .catch(function() {
      // Usuário não logado, não faz nada
    });
}

// Exibir link Admin apenas para admins
function exibirLinkAdmin() {
  fetch('auth/me')
    .then(function(r) {
      return r.json();
    })
    .then(function(me) {
      var adminLink = document.querySelector('.admin-link');
      if (adminLink) {
        adminLink.style.display = (me && me.isAdmin) ? 'inline-block' : 'none';
      }
    })
    .catch(function() {
      var adminLink = document.querySelector('.admin-link');
      if (adminLink) adminLink.style.display = 'none';
    });
}

// Logout
function logout() {
  if (confirm('Tem certeza que deseja sair?')) {
    location.href = 'auth/logout';
  }
}