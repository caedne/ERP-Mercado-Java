package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import dao.UsuarioDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.Usuario;

@WebServlet("/auth/*")
public class AuthServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private final UsuarioDAO dao = new UsuarioDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String path = request.getPathInfo();
        if (path == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        switch (path) {
            case "/logout":
                logout(request, response);
                break;
            case "/me":
                me(request, response);
                break;
            default:
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
                break;
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String path = request.getPathInfo();
        if (path == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        switch (path) {
            case "/registro":
                registrar(request, response);
                break;
            case "/login":
                login(request, response);
                break;
            default:
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
                break;
        }
    }

    // =============================
    //        MÉTODOS AUXILIARES
    // =============================

    private void registrar(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {
        try {
            String nome = request.getParameter("nome");
            String email = request.getParameter("email");
            String senha = request.getParameter("senha");

            if (nome == null || email == null || senha == null ||
                nome.isEmpty() || email.isEmpty() || senha.isEmpty()) {
                response.sendRedirect(request.getContextPath() + "/Registro.jsp?erro=1");
                return;
            }

            boolean isAdmin = email.toLowerCase().endsWith("@admin.com");
            String senhaHash = hash(senha);
            dao.insert(nome, email, senhaHash, isAdmin);

            response.sendRedirect(request.getContextPath() + "/Login.jsp?ok=1");

        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/Registro.jsp?erro=2");
        }
    }

    private void login(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {
        try {
            String email = request.getParameter("email");
            String senha = request.getParameter("senha");

            Usuario u = dao.findByEmail(email);
            if (u != null && u.senhaHash != null && u.senhaHash.equals(hash(senha))) {
                HttpSession session = request.getSession(true);
                session.setAttribute("user", u);
                // Redireciona de acordo com o perfil
                if (u.isAdmin) {
                    response.sendRedirect(request.getContextPath() + "/admin.jsp");
                } else {
                    response.sendRedirect(request.getContextPath() + "/index.jsp");
                }
            } else {
                response.sendRedirect(request.getContextPath() + "/Login.jsp?erro=1");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/Login.jsp?erro=2");
        }
    }

    private void logout(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        response.sendRedirect(request.getContextPath() + "/Login.jsp");
    }

    private void me(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        try {
            HttpSession session = request.getSession(false);
            Usuario u = (session != null) ? (Usuario) session.getAttribute("user") : null;

            PrintWriter out = response.getWriter();
            if (u == null) {
                out.write("{"loggedIn":false}");
            } else {
                StringBuilder sb = new StringBuilder();
                sb.append("{");
                sb.append(""loggedIn":true,");
                sb.append(""id":").append(u.id).append(",");
                sb.append(""nome":"").append(escapeJson(u.nome)).append("",");
                sb.append(""email":"").append(escapeJson(u.email)).append("",");
                sb.append(""isAdmin":").append(u.isAdmin ? "true" : "false");
                sb.append("}");
                out.write(sb.toString());
            }
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().write("{"loggedIn":false}");
        }
    }

    // =============================
    //          UTILITÁRIOS
    // =============================

    private static String hash(String senha) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hash = md.digest(senha.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : hash) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\", "\\").replace(""", "\"")
                .replace("", "\r").replace("
", "\n");
    }
}