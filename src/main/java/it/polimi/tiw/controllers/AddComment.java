package it.polimi.tiw.controllers;

import it.polimi.tiw.dao.CommentDAO;
import it.polimi.tiw.utils.Initializer;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/AddComment")
public class AddComment extends HttpServlet {
    private static Connection connection;

    public void init() {
        connection = Initializer.connectionInit(getServletContext());
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String nickname = request.getParameter("nickname");
        String comment = request.getParameter("comment");
        if(nickname.equals("") || comment.equals("")) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing parameters!");
            return;
        }
        int image = Integer.parseInt(request.getParameter("image"));
        CommentDAO commentDAO = new CommentDAO(connection, image);
        try {
            commentDAO.addComment(nickname, comment);
        }
        catch (SQLException e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Unable to add your comment.");
            return;
        }
        response.sendRedirect(getServletContext().getContextPath() + "/ShowImageDetails?image=" + image);
    }
}
