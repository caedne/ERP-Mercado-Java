// Carrinho.js - backend-driven (versão compatível com Eclipse / ES5)
// Substitui localStorage por chamadas a /api/carrinho e conclui pedido em /api/pedidos.

var itensCarrinho = [];
var cupomAplicado = null;

document.addEventListener('DOMContentLoaded', function() {
  carregarCarrinho().then(function() {
    setupEventListeners();
  });
});

function carregarCarrinho() {
  return fetch('api/carrinho', { headers: { 'Accept': 'application/json' } })
    .then(function(resp) {
      if (resp.status === 401) {
        var vazio = document.getElementById('carrinho-vazio');
        var lista = document.getElementById('itens-lista');
        if (vazio) vazio.style.display = 'block';
        if (lista) lista.style.display = 'none';
        return;
      }
      return resp.json();
    })
    .then(function(data) {
      if (!data) return;
      itensCarrinho = data;
      atualizarCarrinho();
    })
    .catch(function(e) {
      console.error('Erro ao carregar carrinho:', e);
    });
}

function setupEventListeners() {
  // Botões de quantidade - CORRIGIDO: usar event delegation no documento
  document.addEventListener('click', function(e) {
    var target = e.target;
    
    // Botão MENOS
    if (target.classList.contains('btn-menos')) {
      var produtoId = target.getAttribute('data-produto');
      console.log('Clicou em MENOS para produto:', produtoId);
      alterarQuantidade(produtoId, -1);
      return;
    }
    
    // Botão MAIS
    if (target.classList.contains('btn-mais')) {
      var produtoId = target.getAttribute('data-produto');
      console.log('Clicou em MAIS para produto:', produtoId);
      alterarQuantidade(produtoId, 1);
      return;
    }
    
    // Botão REMOVER
    if (target.classList.contains('btn-remover')) {
      var produtoId = target.getAttribute('data-produto');
      console.log('Clicou em REMOVER para produto:', produtoId);
      removerItem(produtoId);
      return;
    }
  });

  // Cupom
  var aplicarBtn = document.getElementById('aplicar-cupom');
  if (aplicarBtn) {
    aplicarBtn.addEventListener('click', aplicarCupom);
  }

  // Opções de entrega
  var radiosEntrega = document.querySelectorAll('input[name="entrega"]');
  for (var i = 0; i < radiosEntrega.length; i++) {
    radiosEntrega[i].addEventListener('change', function() {
      atualizarResumo();
      atualizarModalEntrega();
      
      // Mostrar/ocultar endereço de entrega
      var enderecoDiv = document.getElementById('endereco-entrega');
      if (enderecoDiv) {
        if (this.value === 'delivery') {
          enderecoDiv.style.display = 'block';
        } else {
          enderecoDiv.style.display = 'none';
        }
      }
    });
  }

  // Finalizar compra
  var finalizarBtn = document.getElementById('finalizar-compra');
  if (finalizarBtn) {
    finalizarBtn.addEventListener('click', abrirModal);
  }

  // Modal
  var closeBtn = document.querySelector('.close');
  if (closeBtn) {
    closeBtn.addEventListener('click', fecharModal);
  }

  var cancelarBtn = document.querySelector('.btn-cancelar');
  if (cancelarBtn) {
    cancelarBtn.addEventListener('click', fecharModal);
  }

  // Confirmar pedido
  var btnConfirmar = document.getElementById('btn-confirmar');
  if (btnConfirmar) {
    btnConfirmar.addEventListener('click', finalizarPedido);
  }

  // Pagamento
  var radiosPagamento = document.querySelectorAll('input[name="pagamento"]');
  for (var j = 0; j < radiosPagamento.length; j++) {
    radiosPagamento[j].addEventListener('change', function() {
      atualizarPagamento();
      atualizarModalPagamento();
    });
  }

  // Fechar modal clicando fora
  window.addEventListener('click', function(e) {
    var modal = document.getElementById('modal-checkout');
    if (modal && e.target === modal) fecharModal();
  });
}

function atualizarCarrinho() {
  var carrinhoVazio = document.getElementById('carrinho-vazio');
  var itensLista = document.getElementById('itens-lista');
  var btnFinalizar = document.getElementById('finalizar-compra');

  if (!itensCarrinho || itensCarrinho.length === 0) {
    if (carrinhoVazio) carrinhoVazio.style.display = 'block';
    if (itensLista) itensLista.style.display = 'none';
    if (btnFinalizar) btnFinalizar.disabled = true;
  } else {
    if (carrinhoVazio) carrinhoVazio.style.display = 'none';
    if (itensLista) itensLista.style.display = 'block';
    if (btnFinalizar) btnFinalizar.disabled = false;
    renderizarItens();
  }

  atualizarResumo();
}

function renderizarItens() {
  var itensLista = document.getElementById('itens-lista');
  if (!itensLista) return;
  itensLista.innerHTML = '';

  for (var i = 0; i < itensCarrinho.length; i++) {
    var item = itensCarrinho[i];
    var itemHTML =
      '<div class="item-carrinho">' +
        '<img src="' + (item.img || '') + '" alt="' + (item.nome || '') + '">' +
        '<div class="item-info">' +
          '<h4>' + item.nome + '</h4>' +
          '<p>R$ ' + Number(item.preco).toFixed(2) + '/' + item.unidade + '</p>' +
        '</div>' +
        '<div class="item-quantidade">' +
          '<button class="btn-menos" data-produto="' + item.id + '" type="button">-</button>' +
          '<span class="quantidade-display">' + Math.round(item.quantidade) + '</span>' +
          '<button class="btn-mais" data-produto="' + item.id + '" type="button">+</button>' +
        '</div>' +
        '<div class="item-preco">' +
          '<span class="preco-total">R$ ' + (Number(item.preco) * Number(item.quantidade)).toFixed(2) + '</span>' +
          '<button class="btn-remover" data-produto="' + item.id + '" type="button" title="Remover item">Remover</button>' +
        '</div>' +
      '</div>';
    itensLista.innerHTML += itemHTML;
  }
}

function alterarQuantidade(produtoId, delta) {
  console.log('=== alterarQuantidade ===');
  console.log('ProdutoId:', produtoId);
  console.log('Delta:', delta);
  
  try {
    // Se está diminuindo, verificar se deve remover
    if (delta < 0) {
      var item = null;
      for (var i = 0; i < itensCarrinho.length; i++) {
        if (itensCarrinho[i].id === produtoId) {
          item = itensCarrinho[i];
          break;
        }
      }
      
      console.log('Item encontrado:', item);
      
      if (!item) {
        console.error('Item não encontrado no carrinho');
        return;
      }
      
      if (item.quantidade <= 1) {
        console.log('Quantidade <= 1, vai remover o item');
        removerItem(produtoId);
        return;
      }
    }

    var form = new URLSearchParams();
    form.set('action', 'add');
    form.set('produtoId', produtoId);
    form.set('quantidade', String(delta > 0 ? 1 : -1));

    console.log('Enviando requisição para alterar quantidade');

    fetch('api/carrinho', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString()
    }).then(function(resp) {
      console.log('Resposta do servidor:', resp.status);
      if (resp.status === 204 || resp.ok) {
        console.log('Sucesso! Recarregando carrinho...');
        carregarCarrinho();
      } else {
        console.error('Erro ao alterar quantidade:', resp.status);
      }
    }).catch(function(e) {
      console.error('Erro na requisição:', e);
    });
  } catch (e) {
    console.error('Erro geral:', e);
  }
}

function removerItem(produtoId) {
  console.log('=== removerItem ===');
  console.log('ProdutoId:', produtoId);
  
  if (!confirm('Deseja remover este item do carrinho?')) {
    return;
  }
  
  try {
    var form = new URLSearchParams();
    form.set('action', 'remove');
    form.set('produtoId', produtoId);
    
    fetch('api/carrinho', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString()
    }).then(function(resp) {
      console.log('Resposta do servidor:', resp.status);
      if (resp.status === 204 || resp.ok) {
        console.log('Item removido com sucesso!');
        mostrarNotificacao('Item removido do carrinho', 'success');
        carregarCarrinho();
      } else {
        console.error('Erro ao remover item:', resp.status);
      }
    }).catch(function(e) {
      console.error('Erro na requisição:', e);
    });
  } catch (e) {
    console.error('Erro geral:', e);
  }
}

function aplicarCupom() {
  var cupomInput = document.getElementById('cupom-input');
  if (!cupomInput) return;
  
  var cupom = cupomInput.value.trim().toUpperCase();
  
  if (!cupom) {
    cupomAplicado = null;
    mostrarNotificacao('Cupom removido', 'info');
    atualizarResumo();
    return;
  }
  
  // Validar cupom
  var cuponsValidos = ['AURORA10', 'PRIMEIRA', 'BEMVINDO'];
  if (cuponsValidos.indexOf(cupom) === -1) {
    mostrarNotificacao('Cupom inválido!', 'error');
    cupomInput.value = '';
    return;
  }
  
  cupomAplicado = cupom;
  mostrarNotificacao('✅ Cupom "' + cupom + '" aplicado com sucesso!', 'success');
  atualizarResumo();
}

function atualizarResumo() {
  var subtotal = 0;
  for (var i = 0; i < itensCarrinho.length; i++) {
    var it = itensCarrinho[i];
    subtotal += Number(it.preco) * Number(it.quantidade);
  }

  var entregaRadio = document.querySelector('input[name="entrega"]:checked');
  var taxaEntrega = (entregaRadio && entregaRadio.value === 'delivery') ? 5.00 : 0.00;

  var desconto = 0;
  if (cupomAplicado) {
    if (cupomAplicado === 'AURORA10') desconto = subtotal * 0.10;
    else if (cupomAplicado === 'PRIMEIRA') desconto = 5.00;
    else if (cupomAplicado === 'BEMVINDO') desconto = subtotal * 0.05;
  }

  var total = Math.max(0, subtotal + taxaEntrega - desconto);

  var subtotalEl = document.getElementById('subtotal');
  var taxaEntregaEl = document.getElementById('taxa-entrega');
  var descontoEl = document.getElementById('desconto');
  var linhaDescontoEl = document.getElementById('linha-desconto');
  var totalEl = document.getElementById('total');
  var totalModalEl = document.getElementById('total-modal');

  if (subtotalEl) subtotalEl.textContent = 'R$ ' + subtotal.toFixed(2);
  if (taxaEntregaEl) taxaEntregaEl.textContent = 'R$ ' + taxaEntrega.toFixed(2);
  
  if (desconto > 0) {
    if (descontoEl) descontoEl.textContent = '-R$ ' + desconto.toFixed(2);
    if (linhaDescontoEl) linhaDescontoEl.style.display = 'flex';
  } else {
    if (linhaDescontoEl) linhaDescontoEl.style.display = 'none';
  }
  
  if (totalEl) totalEl.innerHTML = '<strong>R$ ' + total.toFixed(2) + '</strong>';
  if (totalModalEl) totalModalEl.textContent = 'R$ ' + total.toFixed(2);
}

function abrirModal() {
  var modal = document.getElementById('modal-checkout');
  if (modal) {
    modal.style.display = 'block';
    atualizarResumo();
    atualizarModalEntrega();
    atualizarModalPagamento();
  }
}

function fecharModal() {
  var modal = document.getElementById('modal-checkout');
  if (modal) modal.style.display = 'none';
  
  // Resetar botão
  var btnConfirmar = document.getElementById('btn-confirmar');
  if (btnConfirmar) {
    btnConfirmar.textContent = '🎉 Confirmar Pedido';
    btnConfirmar.disabled = false;
  }
}

function atualizarModalEntrega() {
  var entregaRadio = document.querySelector('input[name="entrega"]:checked');
  var entregaModalEl = document.getElementById('entrega-modal');
  
  if (entregaModalEl && entregaRadio) {
    if (entregaRadio.value === 'delivery') {
      entregaModalEl.textContent = 'Entrega em casa - R$ 5,00';
    } else {
      entregaModalEl.textContent = 'Retirar na loja - Grátis';
    }
  }
}

function atualizarModalPagamento() {
  var pagamentoRadio = document.querySelector('input[name="pagamento"]:checked');
  var pagamentoModalEl = document.getElementById('pagamento-modal');
  
  if (pagamentoModalEl && pagamentoRadio) {
    var formas = {
      'dinheiro': '💵 Dinheiro',
      'cartao': '💳 Cartão (na entrega)',
      'pix': '📱 PIX'
    };
    pagamentoModalEl.textContent = formas[pagamentoRadio.value] || 'Dinheiro';
  }
}

function atualizarPagamento() {
  var pagamentoRadio = document.querySelector('input[name="pagamento"]:checked');
  var trocoSection = document.getElementById('troco-section');
  
  if (trocoSection && pagamentoRadio) {
    if (pagamentoRadio.value === 'dinheiro') {
      trocoSection.style.display = 'block';
    } else {
      trocoSection.style.display = 'none';
    }
  }
  
  atualizarModalPagamento();
}

function finalizarPedido(e) {
  if (e && e.preventDefault) e.preventDefault();
  
  console.log('=== Finalizando Pedido ===');
  console.log('Itens no carrinho:', itensCarrinho); // DEBUG ADICIONADO
  
  // Validar campos obrigatórios
  var nomeCompleto = document.getElementById('nome-completo');
  var telefone = document.getElementById('telefone');
  
  if (!nomeCompleto || !nomeCompleto.value.trim()) {
    alert('Por favor, preencha seu nome completo.');
    return;
  }
  
  if (!telefone || !telefone.value.trim()) {
    alert('Por favor, preencha seu telefone.');
    return;
  }
  
  // Validar endereço se for delivery
  var entregaRadio = document.querySelector('input[name="entrega"]:checked');
  if (entregaRadio && entregaRadio.value === 'delivery') {
    var endereco = document.getElementById('endereco');
    var numero = document.getElementById('numero');
    var bairro = document.getElementById('bairro');
    
    if (!endereco || !endereco.value.trim()) {
      alert('Por favor, preencha o endereço de entrega.');
      return;
    }
    if (!numero || !numero.value.trim()) {
      alert('Por favor, preencha o número do endereço.');
      return;
    }
    if (!bairro || !bairro.value.trim()) {
      alert('Por favor, preencha o bairro.');
      return;
    }
  }
  
  var btnConfirmar = document.getElementById('btn-confirmar');
  if (btnConfirmar) {
    btnConfirmar.textContent = 'Processando...';
    btnConfirmar.disabled = true;
  }

  fetch('api/pedidos', { method: 'POST' })
    .then(function(resp) {
      console.log('Resposta do servidor:', resp.status);
      console.log('Response OK?', resp.ok); // DEBUG ADICIONADO
      
      if (resp.ok || resp.status === 200) {
        return resp.json().then(function(data) {
          console.log('Pedido criado:', data);
          console.log('PedidoId:', data.pedidoId); // DEBUG ADICIONADO
          console.log('Chamando mostrarNotaFiscal...'); // DEBUG ADICIONADO
          
          // CRIAR POP-UP DE NOTA FISCAL
          mostrarNotaFiscal(data.pedidoId);
          
          console.log('mostrarNotaFiscal() executada'); // DEBUG ADICIONADO
          
          // Limpar cupom
          cupomAplicado = null;
          var cupomInput = document.getElementById('cupom-input');
          if (cupomInput) cupomInput.value = '';
          
          // Recarregar carrinho
          carregarCarrinho();
          
          // Fechar modal de checkout
          fecharModal();
        });
      } else if (resp.status === 401) {
        alert('Faça login para concluir o pedido.');
        window.location.href = 'Login.jsp';
      } else {
        return resp.text().then(function(text) {
          console.error('Erro do servidor:', text);
          alert('Falha ao gerar pedido. Tente novamente.');
          if (btnConfirmar) {
            btnConfirmar.textContent = '🎉 Confirmar Pedido';
            btnConfirmar.disabled = false;
          }
        });
      }
    })
    .catch(function(e) {
      console.error('Erro ao finalizar pedido:', e);
      alert('Erro ao processar pedido. Verifique sua conexão e tente novamente.');
      if (btnConfirmar) {
        btnConfirmar.textContent = '🎉 Confirmar Pedido';
        btnConfirmar.disabled = false;
      }
    });
}

// FUNÇÃO PARA MOSTRAR NOTA FISCAL
function mostrarNotaFiscal(pedidoId) {
  console.log('=== ENTRANDO EM mostrarNotaFiscal ==='); // DEBUG ADICIONADO
  console.log('pedidoId recebido:', pedidoId); // DEBUG ADICIONADO
  console.log('itensCarrinho:', itensCarrinho); // DEBUG ADICIONADO
  console.log('itensCarrinho.length:', itensCarrinho.length); // DEBUG ADICIONADO
  
  // Calcular valores
  var subtotal = 0;
  for (var i = 0; i < itensCarrinho.length; i++) {
    var it = itensCarrinho[i];
    subtotal += Number(it.preco) * Number(it.quantidade);
  }
  
  var entregaRadio = document.querySelector('input[name="entrega"]:checked');
  var taxaEntrega = (entregaRadio && entregaRadio.value === 'delivery') ? 5.00 : 0.00;
  var tipoEntrega = (entregaRadio && entregaRadio.value === 'delivery') ? 'Entrega em casa' : 'Retirar na loja';
  
  var desconto = 0;
  if (cupomAplicado) {
    if (cupomAplicado === 'AURORA10') desconto = subtotal * 0.10;
    else if (cupomAplicado === 'PRIMEIRA') desconto = 5.00;
    else if (cupomAplicado === 'BEMVINDO') desconto = subtotal * 0.05;
  }
  
  var total = Math.max(0, subtotal + taxaEntrega - desconto);
  
  var pagamentoRadio = document.querySelector('input[name="pagamento"]:checked');
  var tipoPagamento = 'Dinheiro';
  if (pagamentoRadio) {
    if (pagamentoRadio.value === 'cartao') tipoPagamento = 'Cartão (na entrega)';
    else if (pagamentoRadio.value === 'pix') tipoPagamento = 'PIX';
  }
  
  // Criar HTML da nota fiscal
  var itensHtml = '';
  for (var j = 0; j < itensCarrinho.length; j++) {
    var item = itensCarrinho[j];
    itensHtml += 
      '<tr>' +
        '<td>' + item.nome + '</td>' +
        '<td>' + Math.round(item.quantidade) + ' ' + item.unidade + '</td>' +
        '<td>R$ ' + Number(item.preco).toFixed(2) + '</td>' +
        '<td>R$ ' + (Number(item.preco) * Number(item.quantidade)).toFixed(2) + '</td>' +
      '</tr>';
  }
  
  var notaHtml = 
    '<div class="nota-overlay" id="modal-nota-fiscal">' +
      '<div class="nota-fiscal">' +
        '<h2>✅ Pedido Confirmado!</h2>' +
        '<p style="font-size: 24px; font-weight: bold;">Pedido #' + pedidoId + '</p>' +
        '<p>Data: ' + new Date().toLocaleString('pt-BR') + '</p>' +
        '<hr>' +
        
        '<h3>📦 Itens do Pedido</h3>' +
        '<table class="tabela-nota">' +
          '<thead>' +
            '<tr>' +
              '<th>Produto</th>' +
              '<th>Qtd</th>' +
              '<th>Preço</th>' +
              '<th>Total</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' +
            itensHtml +
          '</tbody>' +
        '</table>' +
        
        '<hr>' +
        
        '<div style="text-align: left; margin: 20px 0;">' +
          '<p><strong>Subtotal:</strong> R$ ' + subtotal.toFixed(2) + '</p>' +
          '<p><strong>Taxa de Entrega:</strong> R$ ' + taxaEntrega.toFixed(2) + '</p>' +
          (desconto > 0 ? '<p style="color: #fcbf32;"><strong>Desconto:</strong> -R$ ' + desconto.toFixed(2) + '</p>' : '') +
          '<h3>Total: R$ ' + total.toFixed(2) + '</h3>' +
        '</div>' +
        
        '<hr>' +
        
        '<div style="text-align: left;">' +
          '<p><strong>🚚 Entrega:</strong> ' + tipoEntrega + '</p>' +
          '<p><strong>💳 Pagamento:</strong> ' + tipoPagamento + '</p>' +
        '</div>' +
        
        '<button id="btn-fechar-nota" onclick="fecharNotaFiscal()">OK, Entendi!</button>' +
      '</div>' +
    '</div>';
  
  console.log('HTML da nota criado, tamanho:', notaHtml.length); // DEBUG ADICIONADO
  console.log('Adicionando ao body...'); // DEBUG ADICIONADO
  
  // Adicionar ao body
  document.body.insertAdjacentHTML('beforeend', notaHtml);
  
  console.log('HTML adicionado ao body!'); // DEBUG ADICIONADO
  
  // Verificar se foi criado
  var modalCriado = document.getElementById('modal-nota-fiscal');
  console.log('Modal criado?', modalCriado); // DEBUG ADICIONADO
  console.log('Display do modal:', modalCriado ? modalCriado.style.display : 'não encontrado'); // DEBUG ADICIONADO
  
  console.log('Nota fiscal exibida com sucesso!');
}

// Função global para fechar nota fiscal
window.fecharNotaFiscal = function() {
  var modal = document.getElementById('modal-nota-fiscal');
  if (modal && modal.parentNode) {
    modal.parentNode.removeChild(modal);
  }
};

function mostrarNotificacao(msg, tipo) {
  var notif = document.createElement('div');
  notif.className = 'notificacao ' + tipo;
  notif.textContent = msg;
  notif.style.cssText = 
    'position: fixed; top: 20px; right: 20px; padding: 15px 25px; ' +
    'border-radius: 8px; color: white; font-weight: bold; z-index: 9999; ' +
    'box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease;';
  
  if (tipo === 'success') notif.style.background = '#4CAF50';
  else if (tipo === 'error') notif.style.background = '#f44336';
  else notif.style.background = '#2196F3';
  
  document.body.appendChild(notif);
  
  setTimeout(function() {
    notif.style.opacity = '0';
    notif.style.transform = 'translateX(100%)';
    notif.style.transition = 'all 0.3s ease';
    setTimeout(function() { 
      if (notif.parentNode) notif.parentNode.removeChild(notif); 
    }, 300);
  }, 3000);
}