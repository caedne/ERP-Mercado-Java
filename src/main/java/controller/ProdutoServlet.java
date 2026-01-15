package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import dao.ProdutoDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.Produto;

@WebServlet("/api/produtos")
public class ProdutoServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private final ProdutoDAO dao = new ProdutoDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        
        System.out.println("===== GET /api/produtos =====");
        
        try {
            List<Produto> items = dao.list();
            System.out.println("Produtos encontrados: " + items.size());
            
            String accept = req.getHeader("Accept");
            
            if (accept != null && accept.contains("application/json")) {
                // Retornar JSON
                StringBuilder sb = new StringBuilder();
                sb.append("[");
                
                for (int i = 0; i < items.size(); i++) {
                    Produto p = items.get(i);
                    
                    if (i > 0) sb.append(",");
                    
                    sb.append("{")
                      .append("\"id\":\"").append(escapeJson(p.id)).append("\",")
                      .append("\"nome\":\"").append(escapeJson(p.nome)).append("\",")
                      .append("\"preco\":").append(p.preco).append(",")
                      .append("\"unidade\":\"").append(escapeJson(p.unidade)).append("\",")
                      .append("\"categoria\":\"").append(escapeJson(p.categoria)).append("\",")
                      .append("\"descricao\":\"").append(escapeJson(p.descricao)).append("\",")
                      .append("\"img\":\"").append(escapeJson(p.img)).append("\"")
                      .append("}");
                }
                
                sb.append("]");
                
                resp.setContentType("application/json;charset=UTF-8");
                resp.setStatus(HttpServletResponse.SC_OK);
                
                PrintWriter out = resp.getWriter();
                out.write(sb.toString());
                out.flush();
                
                System.out.println("JSON retornado com sucesso: " + items.size() + " produtos");
                
            } else {
                // Forward para JSP
                req.setAttribute("produtos", items);
                req.getRequestDispatcher("/produtos.jsp").forward(req, resp);
            }
            
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar produtos: " + e.getMessage());
            e.printStackTrace();
            
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.setContentType("application/json;charset=UTF-8");
            
            PrintWriter out = resp.getWriter();
            out.write("{\"error\":\"" + escapeJson(e.getMessage()) + "\"}");
            out.flush();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        
        System.out.println("===== POST /api/produtos =====");
        
        String action = param(req, "action");
        System.out.println("Action: " + action);
        
        try {
            if ("delete".equalsIgnoreCase(action)) {
                // EXCLUIR PRODUTO
                String id = param(req, "id", "adm-id", "produtoId");
                System.out.println("🗑️ Excluindo produto: " + id);
                
                if (id == null || id.isEmpty()) {
                    System.err.println("❌ ID do produto não fornecido");
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    resp.setContentType("application/json;charset=UTF-8");
                    resp.getWriter().write("{\"error\":\"ID do produto não fornecido\"}");
                    return;
                }
                
                dao.delete(id.trim());
                System.out.println("✅ Produto excluído com sucesso: " + id);
                
                // Retornar sucesso
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.setContentType("application/json;charset=UTF-8");
                resp.getWriter().write("{\"success\":true,\"message\":\"Produto excluído\"}");
                
            } else {
                // CRIAR/ATUALIZAR PRODUTO
                Produto p = new Produto();
                p.id        = param(req, "id", "adm-id", "produtoId");
                p.nome      = param(req, "nome", "adm-nome");
                String precoStr = param(req, "preco", "adm-preco");
                p.unidade   = param(req, "unidade", "adm-unidade");
                p.categoria = param(req, "categoria", "adm-categoria");
                p.descricao = param(req, "descricao", "adm-descricao");
                p.img       = param(req, "img", "adm-img");

                System.out.println("📦 Dados recebidos:");
                System.out.println("  - ID: " + p.id);
                System.out.println("  - Nome: " + p.nome);
                System.out.println("  - Preço (string original): [" + precoStr + "]");
                System.out.println("  - Unidade: " + p.unidade);
                System.out.println("  - Categoria: " + p.categoria);

                // Validar campos obrigatórios
                if (p.id == null || p.id.trim().isEmpty()) {
                    System.err.println("❌ ID é obrigatório");
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    resp.setContentType("application/json;charset=UTF-8");
                    resp.getWriter().write("{\"error\":\"ID é obrigatório\"}");
                    return;
                }
                
                if (p.nome == null || p.nome.trim().isEmpty()) {
                    System.err.println("❌ Nome é obrigatório");
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    resp.setContentType("application/json;charset=UTF-8");
                    resp.getWriter().write("{\"error\":\"Nome é obrigatório\"}");
                    return;
                }
                
                if (precoStr == null || precoStr.trim().isEmpty()) {
                    System.err.println("❌ Preço é obrigatório");
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    resp.setContentType("application/json;charset=UTF-8");
                    resp.getWriter().write("{\"error\":\"Preço é obrigatório\"}");
                    return;
                }

                // CORREÇÃO CRÍTICA: Converter preço corretamente
                double preco = 0.0;
                try {
                    // Passo 1: Remover espaços em branco
                    precoStr = precoStr.trim();
                    System.out.println("  - Preço após trim: [" + precoStr + "]");
                    
                    // Passo 2: Substituir vírgula por ponto (padrão brasileiro → SQL)
                    precoStr = precoStr.replace(",", ".");
                    System.out.println("  - Preço após replace vírgula: [" + precoStr + "]");
                    
                    // Passo 3: Remover pontos que NÃO são o separador decimal
                    // Exemplo: "1.234.567,89" → "1234567.89"
                    int lastDot = precoStr.lastIndexOf('.');
                    if (lastDot > 0) {
                        // Tem ponto decimal
                        String parteInteira = precoStr.substring(0, lastDot).replace(".", "");
                        String parteDecimal = precoStr.substring(lastDot);
                        precoStr = parteInteira + parteDecimal;
                    }
                    System.out.println("  - Preço após remover pontos de milhar: [" + precoStr + "]");
                    
                    // Passo 4: Converter para double
                    preco = Double.parseDouble(precoStr);
                    System.out.println("  💰 Preço FINAL convertido: " + preco);
                    
                } catch (NumberFormatException e) {
                    System.err.println("❌ ERRO ao converter preço: " + e.getMessage());
                    System.err.println("   String problemática: [" + precoStr + "]");
                    
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    resp.setContentType("application/json;charset=UTF-8");
                    resp.getWriter().write("{\"error\":\"Formato de preço inválido: " + escapeJson(precoStr) + "\"}");
                    return;
                }
                
                p.preco = preco;

                // Validar preço
                if (p.preco <= 0) {
                    System.err.println("❌ Preço deve ser maior que zero: " + p.preco);
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    resp.setContentType("application/json;charset=UTF-8");
                    resp.getWriter().write("{\"error\":\"Preço deve ser maior que zero\"}");
                    return;
                }
                
                // Validar tamanho da URL da imagem
                if (p.img != null && p.img.length() > 1000) {
                    System.err.println("❌ URL da imagem muito longa: " + p.img.length() + " caracteres");
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    resp.setContentType("application/json;charset=UTF-8");
                    resp.getWriter().write("{\"error\":\"URL da imagem muito longa (máximo 1000 caracteres). Use um encurtador de URL.\"}");
                    return;
                }

                // Salvar no banco
                System.out.println("💾 Salvando produto no banco...");
                System.out.println("   Preço a ser salvo: " + p.preco);
                dao.upsert(p);
                System.out.println("✅ Produto salvo com sucesso!");

                // Retornar sucesso
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.setContentType("application/json;charset=UTF-8");
                
                PrintWriter out = resp.getWriter();
                out.write("{\"success\":true,\"message\":\"Produto salvo com sucesso\",\"id\":\"" + escapeJson(p.id) + "\",\"preco\":" + p.preco + "}");
                out.flush();
            }
            
            System.out.println("==============================");
            
        } catch (Exception e) {
            System.err.println("❌ ERRO ao processar produto: " + e.getMessage());
            e.printStackTrace();
            System.err.println("==============================");
            
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.setContentType("application/json;charset=UTF-8");
            
            PrintWriter out = resp.getWriter();
            out.write("{\"error\":\"" + escapeJson(e.getMessage()) + "\"}");
            out.flush();
        }
    }

    /**
     * Busca parâmetro em múltiplos nomes possíveis
     */
    private static String param(HttpServletRequest req, String... names) {
        if (names == null) return null;
        
        for (String n : names) {
            String v = req.getParameter(n);
            if (v != null && !v.trim().isEmpty()) {
                return v.trim();
            }
        }
        
        return null;
    }

    /**
     * Escapa caracteres especiais para JSON
     */
    private static String escapeJson(String s) {
        if (s == null) return "";
        
        return s
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\b", "\\b")
            .replace("\f", "\\f")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t");
    }
}