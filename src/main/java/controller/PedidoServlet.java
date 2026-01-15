package controller;

import java.io.IOException;
import java.io.PrintWriter;

import dao.PedidoDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.Usuario;

@WebServlet("/api/pedidos/*")
public class PedidoServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private PedidoDAO dao;
    
    @Override
    public void init() throws ServletException {
        super.init();
        dao = new PedidoDAO();
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
        Usuario u = requireUser(req, resp);
        if (u == null) return;
        
        String pathInfo = req.getPathInfo();
        
        try {
            // GET /api/pedidos/historico - Listar todos os pedidos do usuário
            if ("/historico".equals(pathInfo)) {
                String json = dao.listarPedidosUsuario(u.id);
                resp.setContentType("application/json;charset=UTF-8");
                resp.getWriter().write(json);
                return;
            }
            
            // GET /api/pedidos/{id} - Buscar pedido específico
            if (pathInfo != null && pathInfo.length() > 1) {
                String idStr = pathInfo.substring(1);
                try {
                    int pedidoId = Integer.parseInt(idStr);
                    String json = dao.buscarPedidoCompleto(u.id, pedidoId);
                    
                    if (json == null) {
                        resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Pedido não encontrado");
                        return;
                    }
                    
                    resp.setContentType("application/json;charset=UTF-8");
                    resp.getWriter().write(json);
                    return;
                } catch (NumberFormatException e) {
                    resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID inválido");
                    return;
                }
            }
            
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            
        } catch (Exception e) {
            System.err.println("Erro no GET de pedidos: " + e.getMessage());
            e.printStackTrace();
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                "Erro ao buscar pedidos: " + e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            Usuario u = requireUser(req, resp);
            if (u == null) return;
            
            System.out.println("===== CRIANDO PEDIDO =====");
            System.out.println("UserId: " + u.id);
            
            int pedidoId = dao.criarPedidoFromCart(u.id);
            
            System.out.println("Pedido criado com sucesso! ID: " + pedidoId);
            System.out.println("==========================");
            
            resp.setContentType("application/json;charset=UTF-8");
            resp.getWriter().write("{\"ok\":true,\"pedidoId\":" + pedidoId + "}");
            
        } catch (Exception e) {
            System.err.println("Erro ao criar pedido: " + e.getMessage());
            e.printStackTrace();
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                "Erro ao criar pedido: " + e.getMessage());
        }
    }
    
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            Usuario u = requireUser(req, resp);
            if (u == null) return;
            
            String pathInfo = req.getPathInfo();
            if (pathInfo == null || pathInfo.length() <= 1) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID do pedido não fornecido");
                return;
            }
            
            String idStr = pathInfo.substring(1);
            int pedidoId = Integer.parseInt(idStr);
            
            boolean sucesso = dao.excluirPedido(u.id, pedidoId);
            
            if (sucesso) {
                resp.setStatus(HttpServletResponse.SC_OK);
                PrintWriter out = resp.getWriter();
                out.write("{\"ok\":true}");
            } else {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Pedido não encontrado");
            }
            
        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID inválido");
        } catch (Exception e) {
            System.err.println("Erro ao excluir pedido: " + e.getMessage());
            e.printStackTrace();
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                "Erro ao excluir pedido: " + e.getMessage());
        }
    }
}