// perfil.js – Backend-driven com histórico de pedidos

var usuarioLogado = null;
var perfilCompleto = null;

document.addEventListener('DOMContentLoaded', function() {
  verificarLogin();
  setupEventListeners();
});

function verificarLogin() {
  fetch('auth/me')
    .then(function(r) {
      if (r.status === 401) {
        alert('Você precisa estar logado para acessar esta página.');
        location.href = 'Login.jsp';
        return;
      }
      return r.json();
    })
    .then(function(user) {
      if (!user || !user.authenticated) {
        alert('Você precisa estar logado para acessar esta página.');
        location.href = 'Login.jsp';
        return;
      }
      usuarioLogado = user;
      carregarDadosUsuario();
    })
    .catch(function() {
      alert('Erro ao verificar autenticação.');
      location.href = 'Login.jsp';
    });
}

function carregarDadosUsuario() {
  perfilCompleto = {
    nome: usuarioLogado.nome || '',
    email: usuarioLogado.email || '',
    sobrenome: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    stats: {
      totalPedidos: 0,
      totalEconomia: 0,
      pontosFidelidade: 0
    }
  };

  atualizarAvatar();
  atualizarDadosPessoais();
  atualizarEstatisticas();
  carregarPedidos();
}

function atualizarAvatar() {
  var inicial = usuarioLogado.nome.charAt(0).toUpperCase();
  document.getElementById('avatar-inicial').textContent = inicial;
  document.getElementById('nome-usuario').textContent = usuarioLogado.nome;
  document.getElementById('email-usuario').textContent = usuarioLogado.email;
  
  var dataCadastro = new Date();
  var mes = dataCadastro.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  document.getElementById('data-cadastro').textContent = mes;
}

function atualizarDadosPessoais() {
  var nomeCompleto = perfilCompleto.nome.split(' ');
  document.getElementById('nome').value = nomeCompleto[0] || '';
  document.getElementById('sobrenome').value = nomeCompleto.slice(1).join(' ') || '';
  document.getElementById('email-perfil').value = perfilCompleto.email;
  document.getElementById('telefone').value = perfilCompleto.telefone || '';
  document.getElementById('cpf').value = perfilCompleto.cpf || '';
  document.getElementById('data-nascimento').value = perfilCompleto.dataNascimento || '';
}

function atualizarEstatisticas() {
  document.getElementById('total-pedidos').textContent = perfilCompleto.stats.totalPedidos;
  document.getElementById('total-economia').textContent = 'R$ ' + perfilCompleto.stats.totalEconomia.toFixed(2);
  document.getElementById('pontos-fidelidade').textContent = perfilCompleto.stats.pontosFidelidade;
}

function setupEventListeners() {
  var menuBtns = document.querySelectorAll('.menu-btn');
  for (var i = 0; i < menuBtns.length; i++) {
    menuBtns[i].addEventListener('click', function() {
      mudarAba(this.dataset.tab);
    });
  }

  var btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', logout);
  }

  var btnEditar = document.getElementById('btn-editar-dados');
  if (btnEditar) {
    btnEditar.addEventListener('click', habilitarEdicaoDados);
  }

  var btnCancelar = document.getElementById('btn-cancelar-dados');
  if (btnCancelar) {
    btnCancelar.addEventListener('click', cancelarEdicaoDados);
  }

  var formDados = document.getElementById('form-dados-pessoais');
  if (formDados) {
    formDados.addEventListener('submit', salvarDadosPessoais);
  }

  var closeBtns = document.querySelectorAll('.modal-close, .btn-cancelar');
  for (var j = 0; j < closeBtns.length; j++) {
    closeBtns[j].addEventListener('click', fecharModais);
  }
}

function mudarAba(tab) {
  var menuBtns = document.querySelectorAll('.menu-btn');
  for (var i = 0; i < menuBtns.length; i++) {
    menuBtns[i].classList.remove('active');
  }
  var activeBtn = document.querySelector('[data-tab="' + tab + '"]');
  if (activeBtn) activeBtn.classList.add('active');

  var tabContents = document.querySelectorAll('.tab-content');
  for (var j = 0; j < tabContents.length; j++) {
    tabContents[j].classList.remove('active');
  }
  var activeTab = document.getElementById('tab-' + tab);
  if (activeTab) activeTab.classList.add('active');
  
  if (tab === 'pedidos') {
    carregarPedidos();
  }
}

function habilitarEdicaoDados() {
  var inputs = document.querySelectorAll('#form-dados-pessoais input');
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].id !== 'email-perfil') {
      inputs[i].disabled = false;
    }
  }
  document.getElementById('btn-editar-dados').style.display = 'none';
  document.getElementById('acoes-dados').style.display = 'flex';
}

function cancelarEdicaoDados() {
  var inputs = document.querySelectorAll('#form-dados-pessoais input');
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].disabled = true;
  }
  document.getElementById('btn-editar-dados').style.display = 'block';
  document.getElementById('acoes-dados').style.display = 'none';
  atualizarDadosPessoais();
}

function salvarDadosPessoais(e) {
  e.preventDefault();
  
  var nome = document.getElementById('nome').value.trim();
  var sobrenome = document.getElementById('sobrenome').value.trim();
  
  perfilCompleto.nome = (nome + ' ' + sobrenome).trim();
  perfilCompleto.sobrenome = sobrenome;
  perfilCompleto.telefone = document.getElementById('telefone').value.trim();
  perfilCompleto.cpf = document.getElementById('cpf').value.trim();
  perfilCompleto.dataNascimento = document.getElementById('data-nascimento').value;
  
  document.getElementById('nome-usuario').textContent = perfilCompleto.nome;
  
  cancelarEdicaoDados();
  mostrarNotificacao('Dados atualizados com sucesso!', 'success');
}

// NOVO: Carregar pedidos do histórico
function carregarPedidos() {
  var listaPedidos = document.getElementById('lista-pedidos');
  if (!listaPedidos) return;
  
  listaPedidos.innerHTML = '<p style="text-align:center;padding:20px;">Carregando pedidos...</p>';
  
  fetch('api/pedidos/historico')
    .then(function(resp) {
      if (resp.status === 401) {
        throw new Error('Não autorizado');
      }
      return resp.json();
    })
    .then(function(pedidos) {
      if (!pedidos || pedidos.length === 0) {
        listaPedidos.innerHTML = 
          '<div class="pedidos-vazio">' +
            '<div class="pedidos-vazio-icon">📦</div>' +
            '<h3>Nenhum pedido encontrado</h3>' +
            '<p>Quando você fizer pedidos, eles aparecerão aqui</p>' +
            '<a href="produtos.jsp" class="btn-primario">Fazer Primeiro Pedido</a>' +
          '</div>';
        return;
      }
      
      perfilCompleto.stats.totalPedidos = pedidos.length;
      atualizarEstatisticas();
      
      var html = '';
      for (var i = 0; i < pedidos.length; i++) {
        var pedido = pedidos[i];
        var data = new Date(pedido.data_pedido);
        var dataFormatada = data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
        
        html += 
          '<div class="pedido-card" data-pedido-id="' + pedido.id + '">' +
            '<div class="pedido-header">' +
              '<div>' +
                '<h3>📦 Pedido #' + pedido.id + '</h3>' +
                '<p class="pedido-data">' + dataFormatada + '</p>' +
              '</div>' +
              '<div class="pedido-total">R$ ' + Number(pedido.total).toFixed(2).replace('.', ',') + '</div>' +
            '</div>' +
            '<div class="pedido-resumo">' +
              '<p><strong>Itens:</strong> ' + (pedido.total_itens || 0) + '</p>' +
            '</div>' +
            '<div class="pedido-acoes">' +
              '<button class="btn-ver-nota" onclick="verNotaFiscal(' + pedido.id + ')">👁️ Ver Nota Fiscal</button>' +
              '<button class="btn-excluir-pedido" onclick="excluirPedido(' + pedido.id + ')">🗑️ Excluir</button>' +
            '</div>' +
          '</div>';
      }
      
      listaPedidos.innerHTML = html;
    })
    .catch(function(e) {
      console.error('Erro ao carregar pedidos:', e);
      listaPedidos.innerHTML = 
        '<div class="pedidos-vazio">' +
          '<div class="pedidos-vazio-icon">⚠️</div>' +
          '<h3>Erro ao carregar pedidos</h3>' +
          '<p>Tente novamente mais tarde</p>' +
        '</div>';
    });
}

// NOVO: Ver nota fiscal de um pedido
window.verNotaFiscal = function(pedidoId) {
  fetch('api/pedidos/' + pedidoId)
    .then(function(resp) {
      if (!resp.ok) throw new Error('Erro ao buscar pedido');
      return resp.json();
    })
    .then(function(pedido) {
      mostrarModalNotaFiscal(pedido);
    })
    .catch(function(e) {
      console.error('Erro ao buscar nota fiscal:', e);
      alert('Erro ao carregar nota fiscal. Tente novamente.');
    });
};

// NOVO: Mostrar modal com nota fiscal
function mostrarModalNotaFiscal(pedido) {
  var data = new Date(pedido.data_pedido);
  var dataFormatada = data.toLocaleString('pt-BR');
  
  var itensHtml = '';
  var subtotal = 0;
  
  if (pedido.itens && pedido.itens.length > 0) {
    for (var i = 0; i < pedido.itens.length; i++) {
      var item = pedido.itens[i];
      var totalItem = item.quantidade * item.preco_unit;
      subtotal += totalItem;
      
      itensHtml += 
        '<tr>' +
          '<td>' + item.produto_nome + '</td>' +
          '<td>' + item.quantidade + ' ' + (item.unidade || 'un') + '</td>' +
          '<td>R$ ' + Number(item.preco_unit).toFixed(2).replace('.', ',') + '</td>' +
          '<td>R$ ' + totalItem.toFixed(2).replace('.', ',') + '</td>' +
        '</tr>';
    }
  }
  
  var modalHtml = 
    '<div class="modal-nota-overlay" id="modal-nota-fiscal-historico">' +
      '<div class="modal-nota-content">' +
        '<div class="modal-nota-header">' +
          '<h2>📄 Nota Fiscal - Pedido #' + pedido.id + '</h2>' +
          '<button class="modal-nota-close" onclick="fecharModalNota()">×</button>' +
        '</div>' +
        '<div class="modal-nota-body">' +
          '<p><strong>Data:</strong> ' + dataFormatada + '</p>' +
          '<hr>' +
          '<h3>📦 Itens do Pedido</h3>' +
          '<table class="tabela-nota-historico">' +
            '<thead>' +
              '<tr>' +
                '<th>Produto</th>' +
                '<th>Qtd</th>' +
                '<th>Preço Unit.</th>' +
                '<th>Total</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              itensHtml +
            '</tbody>' +
          '</table>' +
          '<hr>' +
          '<div class="nota-totais">' +
            '<p><strong>Subtotal:</strong> R$ ' + subtotal.toFixed(2).replace('.', ',') + '</p>' +
            '<h3>Total: R$ ' + Number(pedido.total).toFixed(2).replace('.', ',') + '</h3>' +
          '</div>' +
        '</div>' +
        '<div class="modal-nota-footer">' +
          '<button onclick="imprimirNota()">🖨️ Imprimir</button>' +
          '<button onclick="fecharModalNota()">Fechar</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// NOVO: Fechar modal de nota fiscal
window.fecharModalNota = function() {
  var modal = document.getElementById('modal-nota-fiscal-historico');
  if (modal && modal.parentNode) {
    modal.parentNode.removeChild(modal);
  }
};

// NOVO: Imprimir nota
window.imprimirNota = function() {
  window.print();
};

// NOVO: Excluir pedido
window.excluirPedido = function(pedidoId) {
  if (!confirm('Tem certeza que deseja excluir este pedido do histórico?')) {
    return;
  }
  
  fetch('api/pedidos/' + pedidoId, { method: 'DELETE' })
    .then(function(resp) {
      if (resp.ok) {
        mostrarNotificacao('Pedido excluído com sucesso!', 'success');
        carregarPedidos();
      } else {
        throw new Error('Erro ao excluir');
      }
    })
    .catch(function(e) {
      console.error('Erro ao excluir pedido:', e);
      mostrarNotificacao('Erro ao excluir pedido', 'error');
    });
};

function fecharModais() {
  var modals = document.querySelectorAll('.modal');
  for (var i = 0; i < modals.length; i++) {
    modals[i].style.display = 'none';
  }
}

function mostrarNotificacao(mensagem, tipo) {
  var notificacao = document.createElement('div');
  notificacao.className = 'notificacao ' + tipo;
  notificacao.textContent = mensagem;
  notificacao.style.cssText = 
    'position: fixed; top: 20px; right: 20px; padding: 15px 20px; ' +
    'border-radius: 8px; color: white; font-weight: bold; z-index: 9999; ' +
    'animation: slideIn 0.3s ease; ' +
    (tipo === 'success' ? 'background: #4CAF50;' : 'background: #f44336;');
  
  document.body.appendChild(notificacao);
  
  setTimeout(function() {
    notificacao.remove();
  }, 3000);
}

function logout() {
  if (confirm('Tem certeza que deseja sair?')) {
    location.href = 'auth/logout';
  }
}

window.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    fecharModais();
  }
});
