<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Mercado Aurora - Meu Perfil</title>
  <link rel="stylesheet" href="Styles/perfil.css">
  <link rel="stylesheet" href="Styles/responsive-styles.css">
  <script src="Scripts/perfil.js" defer></script>
</head>
<body>

  <header>
      <a href="index.jsp">
        <a href="index.jsp">
      <img src="img/Logo.png" class="logo" alt="Logo">
    </a>
</a>
  <div>
    <h1>Mercado Aurora</h1>
    <p>Bons produtos com baixo custo!</p>
  </header>

  <nav>
    <ul>
      <li><a href="index.jsp">Home</a></li>
      <li><a href="produtos.jsp">Produtos</a></li>
      <li><a href="contatos.jsp">Contatos</a></li>
      <li><a href="quemsomos.jsp">Quem Somos</a></li>
      <li><a href="perfil.jsp" class="active">Meu Perfil</a></li>
      <li><a href="carrinho.jsp">🛒 Carrinho</a></li>
      <li><a href="admin.jsp" class="admin-link">Admin ⚙️</a></li>
      <li><a href="#" id="btn-logout">Sair</a></li>
    </ul>
  </nav>

  <main>
    <div class="perfil-container">
      <div class="perfil-sidebar">
        <div class="perfil-avatar">
          <div class="avatar-circle">
            <span id="avatar-inicial">U</span>
          </div>
          <h3 id="nome-usuario">Carregando...</h3>
          <p id="email-usuario">carregando@email.com</p>
          <p class="membro-desde">Membro desde <span id="data-cadastro">2025</span></p>
        </div>

        <div class="perfil-stats">
          <div class="stat-item">
            <span class="stat-number" id="total-pedidos">0</span>
            <span class="stat-label">Pedidos</span>
          </div>
          <div class="stat-item">
            <span class="stat-number" id="total-economia">R$ 0</span>
            <span class="stat-label">Economizado</span>
          </div>
          <div class="stat-item">
            <span class="stat-number" id="pontos-fidelidade">0</span>
            <span class="stat-label">Pontos</span>
          </div>
        </div>

        <div class="perfil-menu">
          <button class="menu-btn active" data-tab="dados">📋 Dados Pessoais</button>
          <button class="menu-btn" data-tab="endereco">📍 Endereços</button>
          <button class="menu-btn" data-tab="pedidos">📦 Meus Pedidos</button>
          <button class="menu-btn" data-tab="configuracoes">⚙️ Configurações</button>
        </div>
      </div>

      <div class="perfil-content">
        <!-- Aba Dados Pessoais -->
        <div id="tab-dados" class="tab-content active">
          <div class="content-header">
            <h2>📋 Dados Pessoais</h2>
            <button id="btn-editar-dados" class="btn-secundario">✏️ Editar</button>
          </div>

          <form id="form-dados-pessoais" class="perfil-form">
            <div class="form-row">
              <div class="form-group">
                <label for="nome">Nome</label>
                <input type="text" id="nome" disabled>
              </div>
              <div class="form-group">
                <label for="sobrenome">Sobrenome</label>
                <input type="text" id="sobrenome" disabled>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email-perfil">Email</label>
                <input type="email" id="email-perfil" disabled>
              </div>
              <div class="form-group">
                <label for="telefone">Telefone</label>
                <input type="tel" id="telefone" placeholder="(47) 99999-0000" disabled>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="cpf">CPF</label>
                <input type="text" id="cpf" placeholder="000.000.000-00" disabled>
              </div>
              <div class="form-group">
                <label for="data-nascimento">Data de Nascimento</label>
                <input type="date" id="data-nascimento" disabled>
              </div>
            </div>

            <div class="form-actions" id="acoes-dados" style="display: none;">
              <button type="button" id="btn-cancelar-dados" class="btn-cancelar">Cancelar</button>
              <button type="submit" class="btn-salvar">Salvar Alterações</button>
            </div>
          </form>
        </div>

        <!-- Aba Endereços -->
        <div id="tab-endereco" class="tab-content">
          <div class="content-header">
            <h2>📍 Meus Endereços</h2>
            <button id="btn-adicionar-endereco" class="btn-primario">+ Adicionar Endereço</button>
          </div>

          <div id="lista-enderecos" class="enderecos-lista">
            <div class="endereco-vazio">
              <div class="endereco-vazio-icon">📍</div>
              <h3>Nenhum endereço cadastrado</h3>
              <p>Adicione um endereço para facilitar suas compras</p>
            </div>
          </div>
        </div>

        <!-- Aba Pedidos -->
        <div id="tab-pedidos" class="tab-content">
          <div class="content-header">
            <h2>📦 Histórico de Pedidos</h2>
            <select id="filtro-pedidos" class="filtro-select">
              <option value="todos">Todos os pedidos</option>
              <option value="pendente">Pendentes</option>
              <option value="entregue">Entregues</option>
              <option value="cancelado">Cancelados</option>
            </select>
          </div>

          <div id="lista-pedidos" class="pedidos-lista">
            <div class="pedidos-vazio">
              <div class="pedidos-vazio-icon">📦</div>
              <h3>Nenhum pedido encontrado</h3>
              <p>Quando você fizer pedidos, eles aparecerão aqui</p>
              <a href="produtos.jsp" class="btn-primario">Fazer Primeiro Pedido</a>
            </div>
          </div>
        </div>

        <!-- Aba Configurações -->
        <div id="tab-configuracoes" class="tab-content">
          <div class="content-header">
            <h2>⚙️ Configurações da Conta</h2>
          </div>

          <div class="configuracoes-secoes">
            <div class="config-secao">
              <h3>🔒 Segurança</h3>
              <div class="config-item">
                <div class="config-info">
                  <strong>Alterar Senha</strong>
                  <p>última alteração há 30 dias</p>
                </div>
                <button id="btn-alterar-senha" class="btn-secundario">Alterar</button>
              </div>
            </div>

            <div class="config-secao">
              <h3>📧 Notificações</h3>
              <div class="config-item">
                <div class="config-info">
                  <strong>Email Marketing</strong>
                  <p>Receber ofertas e promoções por email</p>
                </div>
                <label class="switch">
                  <input type="checkbox" id="notif-marketing" checked>
                  <span class="slider"></span>
                </label>
              </div>
              <div class="config-item">
                <div class="config-info">
                  <strong>Notificações de Pedido</strong>
                  <p>Status de entrega e atualizações</p>
                </div>
                <label class="switch">
                  <input type="checkbox" id="notif-pedidos" checked>
                  <span class="slider"></span>
                </label>
              </div>
            </div>

            <div class="config-secao danger-zone">
              <h3>⚠️ Zona de Perigo</h3>
              <div class="config-item">
                <div class="config-info">
                  <strong>Excluir Conta</strong>
                  <p>Remover permanentemente sua conta e todos os dados</p>
                </div>
                <button id="btn-excluir-conta" class="btn-danger">Excluir Conta</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Adicionar Endereço -->
    <div id="modal-endereco" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>📍 Adicionar Novo Endereço</h3>
          <span class="modal-close">&times;</span>
        </div>
        <form id="form-endereco">
          <div class="form-group">
            <label for="nome-endereco">Nome do Endereço</label>
            <input type="text" id="nome-endereco" placeholder="Casa, Trabalho, etc." required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="cep-endereco">CEP</label>
              <input type="text" id="cep-endereco" placeholder="89000-000" required>
            </div>
            <div class="form-group">
              <label for="numero-endereco">Número</label>
              <input type="text" id="numero-endereco" placeholder="123" required>
            </div>
          </div>

          <div class="form-group">
            <label for="rua-endereco">Rua/Avenida</label>
            <input type="text" id="rua-endereco" placeholder="Rua das Flores" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="bairro-endereco">Bairro</label>
              <input type="text" id="bairro-endereco" placeholder="Centro" required>
            </div>
            <div class="form-group">
              <label for="cidade-endereco">Cidade</label>
              <input type="text" id="cidade-endereco" placeholder="Blumenau" required>
            </div>
          </div>

          <div class="form-group">
            <label for="complemento-endereco">Complemento</label>
            <input type="text" id="complemento-endereco" placeholder="Apartamento, bloco, etc.">
          </div>

          <div class="form-group">
            <label class="checkbox-endereco">
              <input type="checkbox" id="endereco-principal">
              Definir como endereço principal
            </label>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancelar">Cancelar</button>
            <button type="submit" class="btn-salvar">Salvar Endereço</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Alterar Senha -->
    <div id="modal-senha" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>🔒 Alterar Senha</h3>
          <span class="modal-close">&times;</span>
        </div>
        <form id="form-senha">
          <div class="form-group">
            <label for="senha-atual">Senha Atual</label>
            <input type="password" id="senha-atual" required>
          </div>
          
          <div class="form-group">
            <label for="nova-senha">Nova Senha</label>
            <input type="password" id="nova-senha" required>
            <small>Mínimo 6 caracteres</small>
          </div>

          <div class="form-group">
            <label for="confirmar-senha">Confirmar Nova Senha</label>
            <input type="password" id="confirmar-senha" required>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancelar">Cancelar</button>
            <button type="submit" class="btn-salvar">Alterar Senha</button>
          </div>
        </form>
      </div>
    </div>
  </main>

  <footer>
    <p><b>&copy; 2025 Mercado Aurora. Todos os direitos reservados.</b></p>
  </footer>

  <script src="Scripts/usuario.js"></script>
</body>
</html>