package controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import dao.CarrinhoDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.Usuario;

@WebServlet("/api/carrinho")
public class CarrinhoServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    // IMPORTANTE: Inicializar o DAO no init() ou criar nova instância
    private CarrinhoDAO dao;
    
    @Override
    public void init() throws ServletException {
        super.init();
        dao = new CarrinhoDAO();
    }

    private Usuario requireUser(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession s = req.getSession(false);
        if (s == null || s.getAttribute("user") == null) {
            resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Usuário não autenticado");
            return null;
        }
        return (Usuario) s.getAttribute("user");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            Usuario u = requireUser(req, resp);
            if (u == null) return;
            
            List<Map<String,Object>> items = dao.listItems(u.id);
            
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < items.size(); i++) {
                Map<String,Object> r = items.get(i);
                sb.append(String.format(
                    "{\"id\":\"%s\",\"nome\":\"%s\",\"preco\":%s,\"unidade\":\"%s\",\"img\":\"%s\",\"quantidade\":%s}",
                    esc((String)r.get("id")), 
                    esc((String)r.get("nome")), 
                    r.get("preco"), 
                    esc((String)r.get("unidade")), 
                    esc((String)r.get("img")), 
                    r.get("quantidade")
                ));
                if (i < items.size() - 1) sb.append(",");
            }
            sb.append("]");
            
            resp.setContentType("application/json;charset=UTF-8");
            resp.getWriter().write(sb.toString());
            
        } catch (Exception e) {
            e.printStackTrace(); // LOG para debug
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                "Erro ao buscar carrinho: " + e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            Usuario u = requireUser(req, resp);
            if (u == null) return;

            String action = req.getParameter("action");
            String produtoId = req.getParameter("produtoId");

            if (action == null || action.trim().isEmpty()) {
                resp.sendError(400, "Parâmetro 'action' obrigatório");
                return;
            }

            if (produtoId == null || produtoId.trim().isEmpty()) {
                resp.sendError(400, "Parâmetro 'produtoId' obrigatório");
                return;
            }

            System.out.println("===== CARRINHO DEBUG =====");
            System.out.println("Action: " + action);
            System.out.println("ProdutoId: " + produtoId);
            System.out.println("UserId: " + u.id);

            switch (action.toLowerCase()) {

                case "add":
                case "subtract":
                    String qtdParam = req.getParameter("quantidade");

                    if (qtdParam == null || qtdParam.trim().isEmpty()) {
                        resp.sendError(400, "Parâmetro 'quantidade' obrigatório");
                        return;
                    }

                    double qtd = Double.parseDouble(qtdParam);

                    // Aqui está a correção: ACEITA QUANTIDADE NEGATIVA
                    if (qtd == 0) {
                        resp.sendError(400, "Quantidade não pode ser zero");
                        return;
                    }

                    System.out.println("Quantidade recebida: " + qtd);
                    dao.addItem(u.id, produtoId, qtd); // +1 ou -1
                    break;

                case "remove":
                    dao.removeItem(u.id, produtoId);
                    break;

                case "clear":
                    dao.clear(u.id);
                    break;

                default:
                    resp.sendError(400, "Action inválida: " + action);
                    return;
            }

            resp.setStatus(HttpServletResponse.SC_NO_CONTENT);

        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(500, "Erro ao processar carrinho: " + e.getMessage());
        }
    }


    private static String esc(String s) { 
        return s == null ? "" : s.replace("\\","\\\\").replace("\"","\\\""); 
    }
}