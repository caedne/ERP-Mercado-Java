package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import util.DBUtil;

public class CarrinhoDAO {

    public List<Map<String,Object>> listItems(int userId) throws Exception {
        String sql = "SELECT c.produto_id AS id, p.nome, p.preco, p.unidade, p.img AS img, c.quantidade "
                   + "FROM carrinho c JOIN produtos p ON p.id = c.produto_id WHERE c.user_id=?";
        
        List<Map<String,Object>> out = new ArrayList<>();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        
        try {
            conn = DBUtil.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setInt(1, userId);
            rs = ps.executeQuery();
            
            while (rs.next()) {
                Map<String,Object> row = new HashMap<>();
                row.put("id", rs.getString("id"));
                row.put("nome", rs.getString("nome"));
                row.put("preco", rs.getDouble("preco"));
                row.put("unidade", rs.getString("unidade"));
                row.put("img", rs.getString("img"));
                row.put("quantidade", rs.getDouble("quantidade"));
                out.add(row);
            }
            
            System.out.println("Carrinho listado: " + out.size() + " itens para userId=" + userId);
            return out;
            
        } catch (SQLException e) {
            System.err.println("Erro ao listar carrinho: " + e.getMessage());
            throw e;
        } finally {
            if (rs != null) try { rs.close(); } catch (SQLException e) {}
            if (ps != null) try { ps.close(); } catch (SQLException e) {}
            if (conn != null) try { conn.close(); } catch (SQLException e) {}
        }
    }

    public void addItem(int userId, String produtoId, double qtd) throws Exception {
        System.out.println("=== CarrinhoDAO.addItem ===");
        System.out.println("UserId: " + userId);
        System.out.println("ProdutoId: " + produtoId);
        System.out.println("Quantidade: " + qtd);
        
        // Primeiro verifica se o produto existe
        if (!produtoExiste(produtoId)) {
            throw new Exception("Produto não encontrado: " + produtoId);
        }
        
        String sql = "INSERT INTO carrinho(user_id, produto_id, quantidade) VALUES (?,?,?) "
                   + "ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade)";
        
        Connection conn = null;
        PreparedStatement ps = null;
        
        try {
            conn = DBUtil.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setInt(1, userId);
            ps.setString(2, produtoId);
            ps.setDouble(3, qtd);
            
            int rows = ps.executeUpdate();
            System.out.println("Linhas afetadas: " + rows);
            System.out.println("Item adicionado com sucesso!");
            
        } catch (SQLException e) {
            System.err.println("Erro SQL ao adicionar item: " + e.getMessage());
            e.printStackTrace();
            throw e;
        } finally {
            if (ps != null) try { ps.close(); } catch (SQLException e) {}
            if (conn != null) try { conn.close(); } catch (SQLException e) {}
        }
    }

    public void removeItem(int userId, String produtoId) throws Exception {
        Connection conn = null;
        PreparedStatement ps = null;
        
        try {
            conn = DBUtil.getConnection();
            ps = conn.prepareStatement("DELETE FROM carrinho WHERE user_id=? AND produto_id=?");
            ps.setInt(1, userId);
            ps.setString(2, produtoId);
            
            int rows = ps.executeUpdate();
            System.out.println("Item removido. Linhas afetadas: " + rows);
            
        } catch (SQLException e) {
            System.err.println("Erro ao remover item: " + e.getMessage());
            throw e;
        } finally {
            if (ps != null) try { ps.close(); } catch (SQLException e) {}
            if (conn != null) try { conn.close(); } catch (SQLException e) {}
        }
    }

    public void clear(int userId) throws Exception {
        Connection conn = null;
        PreparedStatement ps = null;
        
        try {
            conn = DBUtil.getConnection();
            ps = conn.prepareStatement("DELETE FROM carrinho WHERE user_id=?");
            ps.setInt(1, userId);
            
            int rows = ps.executeUpdate();
            System.out.println("Carrinho limpo. Linhas afetadas: " + rows);
            
        } catch (SQLException e) {
            System.err.println("Erro ao limpar carrinho: " + e.getMessage());
            throw e;
        } finally {
            if (ps != null) try { ps.close(); } catch (SQLException e) {}
            if (conn != null) try { conn.close(); } catch (SQLException e) {}
        }
    }
    
    /**
     * Verifica se o produto existe na tabela produtos
     */
    private boolean produtoExiste(String produtoId) throws SQLException {
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        
        try {
            conn = DBUtil.getConnection();
            ps = conn.prepareStatement("SELECT 1 FROM produtos WHERE id = ?");
            ps.setString(1, produtoId);
            rs = ps.executeQuery();
            
            boolean existe = rs.next();
            System.out.println("Produto '" + produtoId + "' existe? " + existe);
            return existe;
            
        } finally {
            if (rs != null) try { rs.close(); } catch (SQLException e) {}
            if (ps != null) try { ps.close(); } catch (SQLException e) {}
            if (conn != null) try { conn.close(); } catch (SQLException e) {}
        }
    }
}