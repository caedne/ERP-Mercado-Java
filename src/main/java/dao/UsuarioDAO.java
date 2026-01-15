package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import model.Usuario;
import util.DBUtil;

public class UsuarioDAO {

    public void insert(String nome, String email, String senhaHash, boolean isAdmin) throws Exception {
        String sql = "INSERT INTO usuarios (nome, email, senha_hash, is_admin) VALUES (?, ?, ?, ?)";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, nome);
            ps.setString(2, email);
            ps.setString(3, senhaHash);
            ps.setBoolean(4, isAdmin);
            ps.executeUpdate();
        }
    }

    public Usuario findByEmail(String email) throws Exception {
        String sql = "SELECT id, nome, email, senha_hash, is_admin FROM usuarios WHERE email = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Usuario u = new Usuario();
                    u.id = rs.getInt("id");
                    u.nome = rs.getString("nome");
                    u.email = rs.getString("email");
                    u.senhaHash = rs.getString("senha_hash");
                    u.isAdmin = rs.getBoolean("is_admin");
                    return u;
                }
            }
        }
        return null;
    }

    public Usuario findById(int id) throws Exception {
        String sql = "SELECT id, nome, email, senha_hash, is_admin FROM usuarios WHERE id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Usuario u = new Usuario();
                    u.id = rs.getInt("id");
                    u.nome = rs.getString("nome");
                    u.email = rs.getString("email");
                    u.senhaHash = rs.getString("senha_hash");
                    u.isAdmin = rs.getBoolean("is_admin");
                    return u;
                }
            }
        }
        return null;
    }
}