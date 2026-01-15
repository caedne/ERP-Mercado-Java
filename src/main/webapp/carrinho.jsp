<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Mercado Aurora - Carrinho de Compras</title>
  <link rel="stylesheet" href="Styles/carrinho.css">
  <script src="Scripts/Carrinho.js" defer></script>
   <link rel="stylesheet" href="Styles/responsive-styles.css">
</head>
<body>

<%
  if (session.getAttribute("user") == null) {
      response.sendRedirect("Login.jsp");
      return;
  }
%>

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
    <h2>🛒 Seu Carrinho de Compras</h2>
    
    <div class="carrinho-container">
      <div class="itens-carrinho">
        <div id="carrinho-vazio" class="carrinho-vazio">
          <div class="carrinho-vazio-icon">🛒</div>
          <h3>Seu carrinho está vazio</h3>
          <p>Que tal adicionar alguns produtos fresquinhos?</p>
          <a href="produtos.jsp" class="btn-continuar-comprando">Continuar Comprando</a>
        </div>

        <div id="itens-lista" class="itens-lista" style="display: none;">
        </div>
      </div>

      <div class="resumo-pedido">
        <div class="resumo-card">
          <h3>📝 Resumo do Pedido</h3>
          
          <div class="resumo-linha">
            <span>Subtotal:</span>
            <span id="subtotal">R$ 0,00</span>
          </div>
          
          <div class="resumo-linha">
            <span>Taxa de entrega:</span>
            <span id="taxa-entrega">R$ 5,00</span>
          </div>
          
          <div class="resumo-linha desconto" id="linha-desconto" style="display: none;">
            <span>Desconto:</span>
            <span id="desconto">-R$ 0,00</span>
          </div>
          
          <hr>
          
          <div class="resumo-linha total">
            <span><strong>Total:</strong></span>
            <span id="total"><strong>R$ 0,00</strong></span>
          </div>

          <div class="cupom-desconto">
            <input type="text" id="cupom-input" placeholder="Código do cupom">
            <button id="aplicar-cupom" class="btn-cupom">Aplicar</button>
          </div>

          <div class="opcoes-entrega">
            <h4>🚚 Opções de Entrega:</h4>
            <div class="entrega-opcao">
              <input type="radio" id="retirada" name="entrega" value="retirada" checked>
              <label for="retirada">
                <strong>Retirar na loja</strong><br>
                <small>Rua das Hortaliças, 123 - Grátis</small>
              </label>
            </div>
            <div class="entrega-opcao">
              <input type="radio" id="delivery" name="entrega" value="delivery">
              <label for="delivery">
                <strong>Entrega em casa</strong><br>
                <small>Até 2km - R$ 5,00</small>
              </label>
            </div>
          </div>

          <button id="finalizar-compra" class="btn-finalizar" disabled>
            🛍️ Finalizar Compra
          </button>
        </div>
      </div>
    </div>

    <div id="modal-checkout" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>🛍️ Finalizar Compra</h2>
          <span class="close">&times;</span>
        </div>
        
        <div class="modal-body">
          <form id="form-checkout">
            <div class="form-section">
              <h3>📍 Dados de Entrega</h3>
              
              <div class="form-group">
                <label for="nome-completo">Nome Completo *</label>
                <input type="text" id="nome-completo" required>
              </div>
              
              <div class="form-group">
                <label for="telefone">Telefone/WhatsApp *</label>
                <input type="tel" id="telefone" placeholder="(47) 99999-0000" required>
              </div>
              
              <div id="endereco-entrega" style="display: none;">
                <div class="form-group">
                  <label for="cep">CEP *</label>
                  <input type="text" id="cep" placeholder="89000-000">
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="endereco">Endereço *</label>
                    <input type="text" id="endereco" required>
                  </div>
                  <div class="form-group">
                    <label for="numero">Número *</label>
                    <input type="text" id="numero" required>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="complemento">Complemento</label>
                  <input type="text" id="complemento" placeholder="Apto, bloco, etc.">
                </div>
                
                <div class="form-group">
                  <label for="bairro">Bairro *</label>
                  <input type="text" id="bairro" required>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>💳 Forma de Pagamento</h3>
              
              <div class="pagamento-opcoes">
                <div class="pagamento-opcao">
                  <input type="radio" id="dinheiro" name="pagamento" value="dinheiro" checked>
                  <label for="dinheiro">💵 Dinheiro</label>
                </div>
                <div class="pagamento-opcao">
                  <input type="radio" id="cartao" name="pagamento" value="cartao">
                  <label for="cartao">💳 Cartão (na entrega)</label>
                </div>
                <div class="pagamento-opcao">
                  <input type="radio" id="pix" name="pagamento" value="pix">
                  <label for="pix">📱 PIX</label>
                </div>
              </div>
              
              <div id="troco-section" class="form-group">
                <label for="troco">Troco para quanto?</label>
                <input type="number" id="troco" placeholder="50.00" step="0.01" min="0">
              </div>
            </div>

            <div class="form-section">
              <div class="form-group">
                <label for="observacoes">Observações</label>
                <textarea id="observacoes" placeholder="Alguma observação especial para seu pedido?"></textarea>
              </div>
            </div>

            <div class="checkout-resumo">
              <div class="resumo-final">
                <div class="resumo-linha">
                  <span>Total do pedido:</span>
                  <span id="total-modal">R$ 0,00</span>
                </div>
                <div class="resumo-linha">
                  <span>Forma de entrega:</span>
                  <span id="entrega-modal">Retirar na loja</span>
                </div>
                <div class="resumo-linha">
                  <span>Pagamento:</span>
                  <span id="pagamento-modal">Dinheiro</span>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-cancelar">Cancelar</button>
             <button type="button" class="btn-confirmar" id="btn-confirmar">🎉 Confirmar Pedido</button>
            </div>
          </form>
        </div>
      </div>
    </div>


  </main>

  <footer>
    <p><b>&copy; 2025 Mercado Aurora. liberdade a Todos os direitos reservados.</b></p>
  </footer>

   <script src="Scripts/usuario.js"></script>



</body>
</html>