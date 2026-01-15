package controller;

import java.io.IOException;
import java.io.PrintWriter;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.Usuario;

@WebServlet("/auth/me")
public class AuthMeServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        HttpSession session = req.getSession(false);
        resp.setContentType("application/json;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        
        if (session == null || session.getAttribute("user") == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.write("{\"authenticated\":false}");
            return;
        }
        
        Usuario user = (Usuario) session.getAttribute("user");
        
        // Retorna JSON com dados do usuário
        String json = String.format(
            "{\"authenticated\":true,\"nome\":\"%s\",\"email\":\"%s\",\"isAdmin\":%b}",
            user.getNome(),
            user.getEmail(),
            user.isAdmin()
        );
        
        out.write(json);
    }
}