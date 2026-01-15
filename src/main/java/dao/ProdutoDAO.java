package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import model.Produto;
import util.DBUtil;

public class ProdutoDAO {
    
    /**
     * Lista todos os produtos
     */
    public List<Produto> list() throws Exception {
        System.out.println("🔍 ProdutoDAO.list() - Buscando produtos...");
        
        List<Produto> out = new ArrayList<>();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        
        try {
            conn = DBUtil.getConnection();
            String sql = "SELECT id, nome, preco, unidade, categoria, descricao, img FROM produtos ORDER BY nome";
            
            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();
            
            while (rs.next()) {
                Produto p = new Produto();
                p.id = rs.getString("id");
                p.nome = rs.getString("nome");
                p.preco = rs.getDouble("preco");
                p.unidade = rs.getString("unidade");
                p.categoria = rs.getString("categoria");
                p.descricao = rs.getString("descricao");
                p.img = rs.getString("img");
                out.add(p);
            }
            
            System.out.println("✅ Produtos encontrados: " + out.size());
            return out;
            
        } catch (SQLException e) {
            System.err.println("❌ Erro ao listar produtos: " + e.getMessage());
            throw e;
            
        } finally {
            if (rs != null) try { rs.close(); } catch (SQLException e) {}
            if (ps != null) try { ps.close(); } catch (SQLException e) {}
            if (conn != null) try { conn.close(); } catch (SQLException e) {}
        }
    }

    /**
     * Insere ou atualiza um produto
     */
    public void upsert(Produto p) throws Exception {
        System.out.println("💾 ProdutoDAO.upsert() - Salvando produto: " + p.id);
        
        String sql = "INSERT INTO produtos(id, nome, preco, unidade, categoria, descricao, img) " +
                     "VALUES(?, ?, ?, ?, ?, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE " +
                     "nome = VALUES(nome), " +
                     "preco = VALUES(preco), " +
                     "unidade = VALUES(unidade), " +
                     "categoria = VALUES(categoria), " +
                     "descricao = VALUES(descricao), " +
                     "img = VALUES(img)";
        
        Connection conn = null;
        PreparedStatement ps = null;
        
        try {
            conn = DBUtil.getConnection();
            ps = conn.prepareStatement(sql);
            
            ps.setString(1, p.id);
            ps.setString(2, p.nome);
            ps.setDouble(3, p.preco);
            ps.setString(4, p.unidade);
            ps.setString(5, p.categoria);
            ps.setString(6, p.descricao);
            ps.setString(7, p.img);
            
            System.out.println("Executando SQL:");
            System.out.println("  ID: " + p.id);
            System.out.println("  Nome: " + p.nome);
            System.out.println("  Preço: " + p.preco);
            System.out.println("  Unidade: " + p.unidade);
            System.out.println("  Categoria: " + p.categoria);
            
            int rowsAffected = ps.executeUpdate();
            
            System.out.println("✅ Produto salvo! Linhas afetadas: " + rowsAffected);
            
        } catch (SQLException e) {
            System.err.println("❌ Erro ao salvar produto: " + e.getMessage());
            e.printStackTrace();
            throw e;
            
        } finally {
            if (ps != null) try { ps.close(); } catch (SQLException e) {}
            if (conn != null) try { conn.close(); } catch (SQLException e) {}
        }
    }

    /**
     * Exclui um produto
     */
    public void delete(String id) throws Exception {
        System.out.println("🗑️ ProdutoDAO.delete() - Excluindo produto: " + id);
        
        Connection conn = null;
        PreparedStatement ps = null;
        
        try {
            conn = DBUtil.getConnection();
            ps = conn.prepareStatement("DELETE FROM produtos WHERE id = ?");
            ps.setString(1, id);
            
            int rowsAffected = ps.executeUpdate();
            
            System.out.println("✅ Produto excluído! Linhas afetadas: " + rowsAffected);
            
            if (rowsAffected == 0) {
                System.out.println("⚠️ Nenhum produto encontrado com ID: " + id);
            }
            
        } catch (SQLException e) {
            System.err.println("❌ Erro ao excluir produto: " + e.getMessage());
            throw e;
            
        } finally {
            if (ps != null) try { ps.close(); } catch (SQLException e) {}
            if (conn != null) try { conn.close(); } catch (SQLException e) {}
        }
    }
    
    /**
     * Busca um produto por ID
     */
    public Produto findById(String id) throws Exception {
        System.out.println("🔍 ProdutoDAO.findById() - Buscando produto: " + id);
        
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        
        try {
            conn = DBUtil.getConnection();
            ps = conn.prepareStatement("SELECT id, nome, preco, unidade, categoria, descricao, img FROM produtos WHERE id = ?");
            ps.setString(1, id);
            
            rs = ps.executeQuery();
            
            if (rs.next()) {
                Produto p = new Produto();
                p.id = rs.getString("id");
                p.nome = rs.getString("nome");
                p.preco = rs.getDouble("preco");
                p.unidade = rs.getString("unidade");
                p.categoria = rs.getString("categoria");
                p.descricao = rs.getString("descricao");
                p.img = rs.getString("img");
                
                System.out.println("✅ Produto encontrado: " + p.nome);
                return p;
            } else {
                System.out.println("⚠️ Produto não encontrado: " + id);
                return null;
            }
            
        } catch (SQLException e) {
            System.err.println("❌ Erro ao buscar produto: " + e.getMessage());
            throw e;
            
        } finally {
            if (rs != null) try { rs.close(); } catch (SQLException e) {}
            if (ps != null) try { ps.close(); } catch (SQLException e) {}
            if (conn != null) try { conn.close(); } catch (SQLException e) {}
        }
    }
}