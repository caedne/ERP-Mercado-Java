/**
 * produtos.js - versão backend-driven unificada e completa
 * - Admin: criar, editar e excluir produtos via /api/produtos com filtros por categoria
 * - Loja: filtros por categoria, ordenação por nome/preço e integração com carrinho (/api/carrinho)
 * - CORREÇÃO: preço aceita vírgula como separador decimal
 * - Logs detalhados para debug
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 produtos.js carregado!');
  initAdmin();
  initLoja();
});

// ======================= ADMIN =========================

function initAdmin() {
  var form = document.getElementById('form-admin-produto');
  var tabela = document.getElementById('tabela-produtos');
  
  console.log('📋 initAdmin executado');
  console.log('Form encontrado:', !!form);
  console.log('Tabela encontrada:', !!tabela);
  
  if (!form && !tabela) {
    console.log('⚠️ Página não é admin, pulando inicialização');
    return;
  }

  if (form) {
    console.log('✅ Configurando evento de submit do formulário');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('📤 Formulário submetido!');

      var id = document.getElementById('adm-id').value.trim();
      var nome = document.getElementById('adm-nome').value.trim();
      var preco = document.getElementById('adm-preco').value.trim();
      var unidade = document.getElementById('adm-unidade').value.trim();
      var categoria = document.getElementById('adm-categoria').value.trim();
      var descricao = document.getElementById('adm-descricao').value.trim();
      var img = document.getElementById('adm-img').value.trim();

      console.log('📦 Dados coletados:', {
        id: id,
        nome: nome,
        preco: preco,
        unidade: unidade,
        categoria: categoria,
        descricao: descricao,
        img: img
      });

      if (!id || !nome || !preco || !unidade || !categoria) {
        alert('⛔ Preencha todos os campos obrigatórios!');
        console.error('Validação falhou - campos vazios');
        return;
      }

      // CORREÇÃO: Normalizar o preço - substituir vírgula por ponto
      preco = preco.replace(',', '.');
      console.log('💰 Preço normalizado:', preco);

      var data = new URLSearchParams();
      data.append('id', id);
      data.append('nome', nome);
      data.append('preco', preco);
      data.append('unidade', unidade);
      data.append('categoria', categoria);
      data.append('descricao', descricao);
      data.append('img', img);

      console.log('📤 Enviando requisição para /api/produtos...');
      console.log('Dados:', data.toString());

      fetch('api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString()
      })
      .then(function(resp) {
        console.log('📥 Resposta recebida:', resp.status, resp.statusText);
        
        if (resp.ok) {
          alert('✅ Produto salvo com sucesso!');
          console.log('✅ Produto salvo! Recarregando tabela...');
          
          if (typeof carregarProdutosAdmin === 'function') {
            carregarProdutosAdmin();
          }
          form.reset();
          document.getElementById('adm-id').focus();
          
        } else {
          return resp.text().then(function(text) {
            console.error('⛔ Erro do servidor:', text);
            alert('⛔ Erro ao salvar produto (código ' + resp.status + '): ' + text);
          });
        }
      })
      .catch(function(err) {
        console.error('⛔ Erro na requisição:', err);
        alert('⛔ Erro ao salvar produto: ' + err.message);
      });
    });

    var cancelar = document.getElementById('adm-cancelar');
    if (cancelar) {
      cancelar.addEventListener('click', function() {
        console.log('🔄 Formulário resetado');
        form.reset();
        document.getElementById('adm-id').focus();
      });
    }
  }

  if (tabela) {
    console.log('📊 Carregando produtos para a tabela...');
    carregarProdutosAdmin();

    var tbody = tabela.querySelector('tbody');
    if (tbody) {
      tbody.addEventListener('click', function(e) {
        var target = e.target || e.srcElement;

        if (target.classList.contains('btn-editar')) {
          console.log('✏️ Botão editar clicado');
          var tr = target.closest('tr');
          if (!tr || !form) return;
          
          var dadosProduto = {
            id: tr.getAttribute('data-id'),
            nome: tr.getAttribute('data-nome'),
            preco: tr.getAttribute('data-preco'),
            unidade: tr.getAttribute('data-unidade'),
            categoria: tr.getAttribute('data-categoria'),
            descricao: tr.getAttribute('data-descricao'),
            img: tr.getAttribute('data-img')
          };
          
          console.log('📝 Editando produto:', dadosProduto);
          
          document.getElementById('adm-id').value = dadosProduto.id || '';
          document.getElementById('adm-nome').value = dadosProduto.nome || '';
          // CORREÇÃO: Exibir preço com vírgula ao editar
          var precoValue = dadosProduto.preco || '';
          document.getElementById('adm-preco').value = precoValue.replace('.', ',');
          document.getElementById('adm-unidade').value = dadosProduto.unidade || '';
          document.getElementById('adm-categoria').value = dadosProduto.categoria || '';
          document.getElementById('adm-descricao').value = dadosProduto.descricao || '';
          document.getElementById('adm-img').value = dadosProduto.img || '';
          document.getElementById('adm-nome').focus();
        }

        if (target.classList.contains('btn-excluir')) {
          var id = target.getAttribute('data-id');
          console.log('🗑️ Tentando excluir produto:', id);
          
          if (!id) {
            console.error('ID do produto não encontrado');
            return;
          }
          
          if (!confirm('❓ Tem certeza que deseja excluir o produto "' + id + '"?')) {
            console.log('⛔ Exclusão cancelada pelo usuário');
            return;
          }

          var dataDel = new URLSearchParams();
          dataDel.append('action', 'delete');
          dataDel.append('id', id);

          console.log('📤 Enviando requisição de exclusão...');

          fetch('api/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: dataDel.toString()
          })
          .then(function(resp) {
            console.log('📥 Resposta de exclusão:', resp.status);
            
            if (resp.ok) {
              alert('✅ Produto excluído com sucesso!');
              carregarProdutosAdmin();
            } else {
              return resp.text().then(function(text) {
                console.error('⛔ Erro ao excluir:', text);
                alert('⛔ Erro ao excluir produto (código ' + resp.status + '): ' + text);
              });
            }
          })
          .catch(function(err) {
            console.error('⛔ Erro na requisição de exclusão:', err);
            alert('⛔ Erro ao excluir produto: ' + err.message);
          });
        }
      });
    }
  }

  // Configurar filtros de categoria no admin
  setupFiltrosAdmin();
}

// Função para configurar filtros de categoria no admin
function setupFiltrosAdmin() {
  var filtrosContainer = document.getElementById('filtros-admin-categoria');
  if (!filtrosContainer) {
    console.log('⚠️ Container de filtros admin não encontrado');
    return;
  }

  console.log('🔍 Configurando filtros de categoria no admin');

  var botoesFiltro = filtrosContainer.querySelectorAll('.filtro-admin-btn');
  for (var i = 0; i < botoesFiltro.length; i++) {
    botoesFiltro[i].addEventListener('click', function() {
      // Remover active de todos
      for (var j = 0; j < botoesFiltro.length; j++) {
        botoesFiltro[j].classList.remove('active');
      }
      // Adicionar active no clicado
      this.classList.add('active');
      
      // Filtrar tabela
      var categoria = this.getAttribute('data-categoria');
      console.log('🔍 Filtrando por categoria:', categoria);
      filtrarTabelaPorCategoria(categoria);
    });
  }
}

function filtrarTabelaPorCategoria(categoria) {
  var tabela = document.getElementById('tabela-produtos');
  if (!tabela) return;
  
  var tbody = tabela.querySelector('tbody');
  if (!tbody) return;
  
  var linhas = tbody.querySelectorAll('tr');
  
  for (var i = 0; i < linhas.length; i++) {
    var linha = linhas[i];
    var catLinha = linha.getAttribute('data-categoria') || '';
    
    if (categoria === 'todos' || catLinha.toLowerCase() === categoria.toLowerCase()) {
      linha.style.display = '';
    } else {
      linha.style.display = 'none';
    }
  }
}

function carregarProdutosAdmin() {
  console.log('🔄 carregarProdutosAdmin() chamada');
  
  var tabela = document.getElementById('tabela-produtos');
  if (!tabela) {
    console.warn('⚠️ Tabela não encontrada');
    return;
  }
  
  var tbody = tabela.querySelector('tbody');
  if (!tbody) {
    console.warn('⚠️ tbody não encontrado');
    return;
  }

  console.log('📤 Buscando produtos da API...');

  fetch('api/produtos', { headers: { 'Accept': 'application/json' } })
    .then(function(resp) {
      console.log('📥 Resposta recebida:', resp.status);
      
      if (!resp.ok) {
        throw new Error('Erro HTTP: ' + resp.status);
      }
      
      return resp.json();
    })
    .then(function(lista) {
      console.log('📦 Produtos recebidos:', lista.length, 'itens');
      console.log('Produtos:', lista);
      
      tbody.innerHTML = '';
      
      if (!lista || !lista.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhum produto cadastrado</td></tr>';
        return;
      }

      lista.forEach(function(p) {
        var tr = document.createElement('tr');
        tr.setAttribute('data-id', p.id);
        tr.setAttribute('data-nome', p.nome || '');
        tr.setAttribute('data-preco', p.preco);
        tr.setAttribute('data-unidade', p.unidade || '');
        tr.setAttribute('data-categoria', p.categoria || '');
        tr.setAttribute('data-descricao', p.descricao || '');
        tr.setAttribute('data-img', p.img || '');

        tr.innerHTML =
          '<td>' + (p.id || '') + '</td>' +
          '<td>' + (p.nome || '') + '</td>' +
          '<td>R$ ' + Number(p.preco).toFixed(2).replace('.', ',') + '</td>' +
          '<td>' + (p.unidade || '') + '</td>' +
          '<td>' + (p.categoria || '') + '</td>' +
          '<td>' +
            '<button type="button" class="btn-editar" data-id="' + p.id + '">✏️ Editar</button> ' +
            '<button type="button" class="btn-excluir" data-id="' + p.id + '">🗑️ Excluir</button>' +
          '</td>';

        tbody.appendChild(tr);
      });
      
      console.log('✅ Tabela atualizada com sucesso!');

      // Aplicar filtro atual após recarregar
      var btnAtivo = document.querySelector('.filtro-admin-btn.active');
      if (btnAtivo) {
        var categoria = btnAtivo.getAttribute('data-categoria');
        filtrarTabelaPorCategoria(categoria);
      }
    })
    .catch(function(e) {
      console.error('⛔ Erro ao carregar produtos:', e);
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Erro ao carregar produtos: ' + e.message + '</td></tr>';
    });
}

// ======================= LOJA / LISTAGEM =========================

function initLoja() {
  var container = document.getElementById('produtos-container');
  if (!container) return;

  console.log('🏪 Inicializando loja');
  carregarProdutosLoja();
}

function carregarProdutosLoja() {
  var container = document.getElementById('produtos-container');
  if (!container) return;

  container.innerHTML = '<p style="text-align:center; padding: 40px;">⏳ Carregando produtos...</p>';

  fetch('api/produtos', { headers: { 'Accept': 'application/json' } })
    .then(function(resp) { return resp.json(); })
    .then(function(lista) {
      container.innerHTML = '';
      
      if (!lista || !lista.length) {
        container.innerHTML = '<p style="text-align:center; padding: 40px;">📦 Nenhum produto disponível no momento.</p>';
        return;
      }

      lista.forEach(function(p) {
        var produtoHTML = 
          '<div class="produto" data-categoria="' + (p.categoria || '') + '" data-id="' + p.id + '">' +
            '<div class="produto-imagem">' +
              '<img src="' + (p.img || 'img/placeholder.jpg') + '" alt="' + (p.nome || '') + '">' +
            '</div>' +
            '<div class="produto-info">' +
              '<h3>' + (p.nome || '') + '</h3>' +
              '<p class="produto-descricao">' + (p.descricao || '') + '</p>' +
              '<div class="produto-preco">' +
                '<span class="preco-atual">R$ ' + Number(p.preco).toFixed(2).replace('.', ',') + '</span>' +
                '<span class="unidade">/' + (p.unidade || '') + '</span>' +
              '</div>' +
              '<div class="produto-quantidade">' +
                '<button class="btn-menos" data-produto="' + p.id + '">-</button>' +
                '<input type="number" id="qtd-' + p.id + '" min="0" step="1" value="0" class="input-quantidade" readonly>' +
                '<button class="btn-mais" data-produto="' + p.id + '">+</button>' +
                '<span class="kg-label">' + (p.unidade || '') + '</span>' +
              '</div>' +
              '<button class="btn-adicionar" data-produto="' + p.id + '">🛒 Adicionar ao Carrinho</button>' +
            '</div>' +
          '</div>';
        
        container.innerHTML += produtoHTML;
      });

      setupFiltrosEEventos();
      
    }).catch(function(e) {
      console.error('⛔ Erro ao carregar produtos:', e);
      container.innerHTML = '<p style="text-align:center; padding: 40px; color: red;">⛔ Erro ao carregar produtos: ' + e.message + '</p>';
    });
}

function setupFiltrosEEventos() {
  var container = document.getElementById('produtos-container');
  if (!container) return;

  var produtos = Array.prototype.slice.call(container.querySelectorAll('.produto'));

  var botoesFiltro = document.querySelectorAll('.filtro-btn');
  for (var i = 0; i < botoesFiltro.length; i++) {
    botoesFiltro[i].addEventListener('click', function() {
      for (var j = 0; j < botoesFiltro.length; j++) {
        botoesFiltro[j].classList.remove('active');
      }
      this.classList.add('active');

      var categoria = this.getAttribute('data-categoria');
      var selectOrd = document.getElementById('ordenar');
      var criterio = selectOrd ? selectOrd.value : 'nome';
      aplicarFiltroOrdenacao(container, produtos, categoria, criterio);
    });
  }

  var selectOrdenar = document.getElementById('ordenar');
  if (selectOrdenar) {
    selectOrdenar.addEventListener('change', function() {
      var btnAtivo = document.querySelector('.filtro-btn.active');
      var categoria = btnAtivo ? btnAtivo.getAttribute('data-categoria') : 'todos';
      aplicarFiltroOrdenacao(container, produtos, categoria, this.value);
    });
  }

  var btnAtivoInicial = document.querySelector('.filtro-btn.active');
  var catInicial = btnAtivoInicial ? btnAtivoInicial.getAttribute('data-categoria') : 'todos';
  var critInicial = selectOrdenar ? selectOrdenar.value : 'nome';
  aplicarFiltroOrdenacao(container, produtos, catInicial, critInicial);

  container.addEventListener('click', function(e) {
    var target = e.target || e.srcElement;

    if (target.classList.contains('btn-mais') || target.classList.contains('btn-menos')) {
      var produtoId = target.getAttribute('data-produto');
      var input = encontrarInput(target, produtoId);
      if (!input) return;

      var atual = parseFloat(input.value || '0');
      if (target.classList.contains('btn-mais')) {
        atual += 1;
      } else if (target.classList.contains('btn-menos') && atual > 0) {
        atual -= 1;
      }
      input.value = atual;
    }

    if (target.classList.contains('btn-adicionar')) {
      var produtoId2 = target.getAttribute('data-produto');
      var input2 = encontrarInput(target, produtoId2);
      var quantidade = input2 ? parseFloat(input2.value || '0') : 1;
      if (!quantidade || quantidade <= 0) {
        quantidade = 1;
      }
      adicionarAoCarrinho(produtoId2, quantidade);
      if (input2) {
        input2.value = 0;
      }
    }
  });

  atualizarContadorCarrinho();
}

function aplicarFiltroOrdenacao(container, produtos, categoria, criterio) {
  var lista = produtos.slice ? produtos.slice(0) : Array.prototype.slice.call(produtos);

  if (categoria && categoria !== 'todos') {
    var catLower = String(categoria).toLowerCase();
    lista = lista.filter(function(card) {
      var c = (card.getAttribute('data-categoria') || '').toLowerCase();
      return c === catLower;
    });
  }

  lista.sort(function(a, b) {
    var nomeA, nomeB, precoA, precoB;
    if (criterio === 'nome') {
      nomeA = (a.querySelector('h3') || {}).textContent || '';
      nomeB = (b.querySelector('h3') || {}).textContent || '';
      return nomeA.toLowerCase().localeCompare(nomeB.toLowerCase());
    } else {
      var spanA = a.querySelector('.preco-atual');
      var spanB = b.querySelector('.preco-atual');
      precoA = parsePreco(spanA ? spanA.textContent : '');
      precoB = parsePreco(spanB ? spanB.textContent : '');
      if (criterio === 'preco-menor') return precoA - precoB;
      if (criterio === 'preco-maior') return precoB - precoA;
      return 0;
    }
  });

  container.innerHTML = '';
  for (var i = 0; i < lista.length; i++) {
    container.appendChild(lista[i]);
  }
}

function parsePreco(texto) {
  if (!texto) return 0;
  var limpo = texto.replace(/[^0-9,\.]/g, '');
  limpo = limpo.replace(/\./g, '').replace(/,/g, '.');
  var v = parseFloat(limpo);
  return isNaN(v) ? 0 : v;
}

function encontrarInput(botao, produtoId) {
  var card = botao.closest ? botao.closest('.produto') : null;
  if (card) {
    var inputCard = card.querySelector('.input-quantidade');
    if (inputCard) return inputCard;
  }

  var inputPorId = document.getElementById('qtd-' + produtoId);
  if (inputPorId) return inputPorId;

  var quantidadeDiv = botao.closest ? botao.closest('.produto-quantidade') : null;
  if (quantidadeDiv) {
    var inp = quantidadeDiv.querySelector('.input-quantidade');
    if (inp) return inp;
  }

  var inputs = document.querySelectorAll('.input-quantidade');
  for (var i = 0; i < inputs.length; i++) {
    var id = inputs[i].id || '';
    if (id.indexOf(produtoId) !== -1) {
      return inputs[i];
    }
  }
  return null;
}

// ======================= CARRINHO (integração) =========================

function adicionarAoCarrinho(produtoId, quantidade) {
  var data = new URLSearchParams();
  data.append('action', 'add');
  data.append('produtoId', produtoId);
  data.append('quantidade', String(quantidade));

  fetch('api/carrinho', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data.toString()
  }).then(function(resp) {
    if (resp.status === 401) {
      alert('🔒 Você precisa estar logado para adicionar itens ao carrinho.');
      window.location.href = 'Login.jsp';
      return;
    }
    if (resp.ok || resp.status === 204) {
      alert('✅ Item adicionado ao carrinho!');
      atualizarContadorCarrinho();
    } else {
      alert('⛔ Erro ao adicionar ao carrinho (código ' + resp.status + ').');
    }
  }).catch(function(err) {
    console.error(err);
    alert('⛔ Erro ao adicionar ao carrinho: ' + err.message);
  });
}

function atualizarContadorCarrinho() {
  fetch('api/carrinho', { headers: { 'Accept': 'application/json' } })
    .then(function(resp) { return resp.json(); })
    .then(function(lista) {
      if (!lista || !lista.length) {
        var badge = document.getElementById('carrinho-contador');
        if (badge) {
          badge.textContent = '0';
          badge.style.display = 'none';
        }
        var carrinhoFlutuante = document.getElementById('carrinho-flutuante');
        if (carrinhoFlutuante) {
          carrinhoFlutuante.style.display = 'none';
        }
        return;
      }

      var total = 0;
      for (var i = 0; i < lista.length; i++) {
        var item = lista[i];
        var qtd = parseFloat(item.quantidade || 0);
        if (!isNaN(qtd)) total += qtd;
      }

      var badge2 = document.getElementById('carrinho-contador');
      if (badge2) {
        badge2.textContent = String(total);
        badge2.style.display = total > 0 ? 'inline-block' : 'none';
      }

      var carrinhoFlutuante2 = document.getElementById('carrinho-flutuante');
      if (carrinhoFlutuante2) {
        carrinhoFlutuante2.style.display = total > 0 ? 'block' : 'none';
      }
    }).catch(function(e) {
      console.error('Erro ao atualizar contador:', e);
    });
}