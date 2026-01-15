# Sistema de Gestão de Mercado (ERP)

Projeto completo de desenvolvimento web desenvolvido como conclusão do curso **Jovem Programador**.
O sistema simula um ambiente real de gestão comercial, permitindo controle de estoque, vendas e gerenciamento de usuários.

## 💻 Sobre o Projeto
Desenvolvido em **Java Web**, o projeto segue a arquitetura **MVC (Model-View-Controller)**, separando claramente as regras de negócio, a interface do usuário e a persistência de dados. O objetivo foi criar uma aplicação escalável, segura e organizada.

## 🚀 Funcionalidades Principais
- **Controle de Acesso:** Sistema de Login e Registro com criptografia e validação de sessão (AuthServlet).
- **Gestão de Produtos (CRUD):**
  - Cadastro de novos produtos com imagem e descrição.
  - Listagem e busca de itens no estoque.
  - Edição e remoção de produtos (Restrito a administradores).
- **Carrinho de Compras:** Funcionalidade lógica para adicionar itens, calcular totais e finalizar pedidos.
- **Banco de Dados:** Persistência completa dos dados utilizando MySQL e JDBC.

## 🛠 Tecnologias Utilizadas
- **Back-end:** Java (JDK 17), Servlets, JSP (JavaServer Pages).
- **Banco de Dados:** MySQL.
- **Padrão de Projeto:** MVC e DAO (Data Access Object).
- **Front-end:** HTML5, CSS3, JavaScript e Bootstrap (Responsividade).
- **IDE:** Eclipse Enterprise Edition.

## 📂 Estrutura do Projeto
A organização dos pacotes reflete as boas práticas de mercado:
- `br.com.aurora.model` ➡️ Classes POJO (Produto, Usuario, Carrinho).
- `br.com.aurora.dao` ➡️ Camada de acesso a dados (SQL e Conexão).
- `br.com.aurora.controller` ➡️ Servlets que controlam o fluxo de dados.
- `br.com.aurora.util` ➡️ Utilitários de conexão (DBUtil).
