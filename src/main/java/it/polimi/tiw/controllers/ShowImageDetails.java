package it.polimi.tiw.controllers;

import it.polimi.tiw.beans.Comment;
import it.polimi.tiw.beans.Image;
import it.polimi.tiw.dao.CommentDAO;
import it.polimi.tiw.dao.ImageDAO;
import it.polimi.tiw.utils.Initializer;
import it.polimi.tiw.utils.Pages;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/ShowImageDetails")
public class ShowImageDetails extends HttpServlet {
    private static Connection connection;
    private static TemplateEngine templateEngine;

    public void init() {
        connection = Initializer.connectionInit(getServletContext());
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        int image = Integer.parseInt(request.getParameter("image"));
        List<Comment> comments = new ArrayList<>();
        Image imageDetails;
        ImageDAO imageDAO = new ImageDAO(connection, image);
        CommentDAO commentDAO = new CommentDAO(connection, image);
        try {
            imageDetails = imageDAO.getImageById();
            comments = commentDAO.retrieveComments();
        }
        catch (SQLException e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Unable to get the desired image.");
            return;
        }
        WebContext webContext = new WebContext(request, response, getServletContext(), request.getLocale());
        webContext.setVariable("imageDetails", imageDetails);
        webContext.setVariable("comments", comments);
        String path = Pages.albumPage;
        templateEngine.process(path, webContext, response.getWriter());
    }
}
