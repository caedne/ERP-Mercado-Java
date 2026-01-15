package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;

import util.DBUtil;

public class PedidoDAO {
    
    /**
     * Cria um pedido a partir do carrinho do usuário
     */
    public int criarPedidoFromCart(int userId) throws Exception {
        try (Connection c = DBUtil.getConnection()) {
            c.setAutoCommit(false);
            try {
                // Calcular total
                double total = 0.0;
                try (PreparedStatement ps = c.prepareStatement(
                    "SELECT c.quantidade * p.preco AS subtotal FROM carrinho c JOIN produtos p ON p.id=c.produto_id WHERE c.user_id=?")) {
                    ps.setInt(1, userId);
                    ResultSet rs = ps.executeQuery();
                    while (rs.next()) total += rs.getDouble("subtotal");
                }

                // Criar pedido (usando created_at que já tem DEFAULT CURRENT_TIMESTAMP)
                int pedidoId;
                try (PreparedStatement ps = c.prepareStatement(
                    "INSERT INTO pedidos(user_id, total) VALUES(?, ?)", Statement.RETURN_GENERATED_KEYS)) {
                    ps.setInt(1, userId);
                    ps.setDouble(2, total);
                    ps.executeUpdate();
                    ResultSet keys = ps.getGeneratedKeys();
                    keys.next();
                    pedidoId = keys.getInt(1);
                }

                // Inserir itens do pedido
                try (PreparedStatement ps = c.prepareStatement(
                    "INSERT INTO pedido_itens(pedido_id,produto_id,quantidade,preco_unit) " +
                    "SELECT ?, c.produto_id, c.quantidade, p.preco FROM carrinho c JOIN produtos p ON p.id=c.produto_id WHERE c.user_id=?")) {
                    ps.setInt(1, pedidoId);
                    ps.setInt(2, userId);
                    ps.executeUpdate();
                }

                // Limpar carrinho
                try (PreparedStatement ps = c.prepareStatement("DELETE FROM carrinho WHERE user_id=?")) {
                    ps.setInt(1, userId);
                    ps.executeUpdate();
                }

                c.commit();
                return pedidoId;
            } catch (Exception e) {
                c.rollback();
                throw e;
            } finally {
                c.setAutoCommit(true);
            }
        }
    }
    
    /**
     * Lista todos os pedidos de um usuário
     */
    public String listarPedidosUsuario(int userId) throws Exception {
        StringBuilder json = new StringBuilder("[");
        
        // CORRIGIDO: usando created_at ao invés de data_pedido
        String sql = "SELECT p.id, p.total, p.created_at, " +
                     "(SELECT COUNT(*) FROM pedido_itens WHERE pedido_id = p.id) as total_itens " +
                     "FROM pedidos p WHERE p.user_id = ? ORDER BY p.created_at DESC";
        
        try (Connection c = DBUtil.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            
            boolean primeiro = true;
            while (rs.next()) {
                if (!primeiro) json.append(",");
                primeiro = false;
                
                int id = rs.getInt("id");
                double total = rs.getDouble("total");
                Timestamp createdAt = rs.getTimestamp("created_at");
                int totalItens = rs.getInt("total_itens");
                
                json.append("{")
                    .append("\"id\":").append(id).append(",")
                    .append("\"total\":").append(total).append(",")
                    .append("\"data_pedido\":\"").append(createdAt.toString()).append("\",")
                    .append("\"total_itens\":").append(totalItens)
                    .append("}");
            }
        }
        
        json.append("]");
        return json.toString();
    }
    
    /**
     * Busca um pedido completo com seus itens
     */
    public String buscarPedidoCompleto(int userId, int pedidoId) throws Exception {
        // CORRIGIDO: usando created_at ao invés de data_pedido
        String sql = "SELECT p.id, p.total, p.created_at FROM pedidos p WHERE p.id = ? AND p.user_id = ?";
        
        try (Connection c = DBUtil.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            
            ps.setInt(1, pedidoId);
            ps.setInt(2, userId);
            ResultSet rs = ps.executeQuery();
            
            if (!rs.next()) {
                return null; // Pedido não encontrado
            }
            
            int id = rs.getInt("id");
            double total = rs.getDouble("total");
            Timestamp createdAt = rs.getTimestamp("created_at");
            
            // Buscar itens do pedido
            StringBuilder itensJson = new StringBuilder("[");
            String sqlItens = "SELECT pi.produto_id, pi.quantidade, pi.preco_unit, " +
                             "p.nome as produto_nome, p.unidade " +
                             "FROM pedido_itens pi " +
                             "JOIN produtos p ON p.id = pi.produto_id " +
                             "WHERE pi.pedido_id = ?";
            
            try (PreparedStatement psItens = c.prepareStatement(sqlItens)) {
                psItens.setInt(1, pedidoId);
                ResultSet rsItens = psItens.executeQuery();
                
                boolean primeiro = true;
                while (rsItens.next()) {
                    if (!primeiro) itensJson.append(",");
                    primeiro = false;
                    
                    String produtoId = rsItens.getString("produto_id");
                    double quantidade = rsItens.getDouble("quantidade");
                    double precoUnit = rsItens.getDouble("preco_unit");
                    String produtoNome = escapeJson(rsItens.getString("produto_nome"));
                    String unidade = escapeJson(rsItens.getString("unidade"));
                    
                    itensJson.append("{")
                        .append("\"produto_id\":\"").append(escapeJson(produtoId)).append("\",")
                        .append("\"produto_nome\":\"").append(produtoNome).append("\",")
                        .append("\"quantidade\":").append(quantidade).append(",")
                        .append("\"preco_unit\":").append(precoUnit).append(",")
                        .append("\"unidade\":\"").append(unidade).append("\"")
                        .append("}");
                }
            }
            itensJson.append("]");
            
            // Montar JSON completo
            StringBuilder json = new StringBuilder();
            json.append("{")
                .append("\"id\":").append(id).append(",")
                .append("\"total\":").append(total).append(",")
                .append("\"data_pedido\":\"").append(createdAt.toString()).append("\",")
                .append("\"itens\":").append(itensJson.toString())
                .append("}");
            
            return json.toString();
        }
    }
    
    /**
     * Exclui um pedido e seus itens
     */
    public boolean excluirPedido(int userId, int pedidoId) throws Exception {
        try (Connection c = DBUtil.getConnection()) {
            c.setAutoCommit(false);
            try {
                // Verificar se o pedido pertence ao usuário
                String sqlVerifica = "SELECT id FROM pedidos WHERE id = ? AND user_id = ?";
                try (PreparedStatement ps = c.prepareStatement(sqlVerifica)) {
                    ps.setInt(1, pedidoId);
                    ps.setInt(2, userId);
                    ResultSet rs = ps.executeQuery();
                    
                    if (!rs.next()) {
                        c.rollback();
                        return false; // Pedido não encontrado ou não pertence ao usuário
                    }
                }
                
                // Excluir itens do pedido
                try (PreparedStatement ps = c.prepareStatement("DELETE FROM pedido_itens WHERE pedido_id = ?")) {
                    ps.setInt(1, pedidoId);
                    ps.executeUpdate();
                }
                
                // Excluir pedido
                try (PreparedStatement ps = c.prepareStatement("DELETE FROM pedidos WHERE id = ? AND user_id = ?")) {
                    ps.setInt(1, pedidoId);
                    ps.setInt(2, userId);
                    int linhas = ps.executeUpdate();
                    
                    if (linhas == 0) {
                        c.rollback();
                        return false;
                    }
                }
                
                c.commit();
                return true;
            } catch (Exception e) {
                c.rollback();
                throw e;
            } finally {
                c.setAutoCommit(true);
            }
        }
    }
    
    /**
     * Escapa caracteres especiais para JSON
     */
    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\r", "\\r")
                .replace("\n", "\\n")
                .replace("\t", "\\t");
    }
}