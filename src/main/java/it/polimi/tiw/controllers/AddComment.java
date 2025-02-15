package it.polimi.tiw.controllers;

import it.polimi.tiw.beans.User;
import it.polimi.tiw.dao.CommentDAO;
import it.polimi.tiw.utils.Initializer;

import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/AddComment")
@MultipartConfig
public class AddComment extends HttpServlet {
    private static Connection connection;

    @Override
    public void init() {
        connection = Initializer.connectionInit(getServletContext());
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        User user = (User)request.getSession().getAttribute("user");
        String nickname = user.getUsername();
        String comment = request.getParameter("comment");
        String s = request.getParameter("image");
        if(nickname.equals("") || comment.equals("")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Missing parameters!");
            return;
        }
        int image = Integer.parseInt(s);
        CommentDAO commentDAO = new CommentDAO(connection, image);
        try {
            commentDAO.addComment(nickname, comment);
        }
        catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("Unable to add your comment.\"");
            return;
        }
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
