package controller;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import util.DBUtil;

@WebServlet("/contato")
public class ContatoServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String nome = req.getParameter("nome");
        String email = req.getParameter("email");
        String telefone = req.getParameter("telefone");
        String mensagem = req.getParameter("mensagem");

        try (Connection c = DBUtil.getConnection();
             PreparedStatement ps = c.prepareStatement(
                     "INSERT INTO contatos (nome, email, telefone, mensagem) VALUES (?,?,?,?)")) {

            ps.setString(1, nome);
            ps.setString(2, email);
            ps.setString(3, telefone);
            ps.setString(4, mensagem);
            ps.executeUpdate();
        } catch (Exception e) {
            throw new ServletException(e);
        }

        resp.sendRedirect(req.getContextPath() + "/contatos.jsp?ok=1");
    }
}