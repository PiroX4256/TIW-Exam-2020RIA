package it.polimi.tiw.controllers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import it.polimi.tiw.beans.Comment;
import it.polimi.tiw.beans.Image;
import it.polimi.tiw.dao.CommentDAO;
import it.polimi.tiw.dao.ImageDAO;
import it.polimi.tiw.utils.Initializer;

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

    @Override
    public void init() {
        connection = Initializer.connectionInit(getServletContext());
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        int image = Integer.parseInt(request.getParameter("image"));
        boolean comment = Boolean.parseBoolean(request.getParameter("comments"));
        List<Comment> comments = new ArrayList<>();
        Image imageDetails;
        ImageDAO imageDAO = new ImageDAO(connection, image);
        CommentDAO commentDAO = new CommentDAO(connection, image);
        try {
            imageDetails = imageDAO.getImageById();
            comments = commentDAO.retrieveComments();
        }
        catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("Unable to get the desired image.");
            return;
        }
        Gson gson = new GsonBuilder().setDateFormat("yyyy MM dd").create();
        String jsonAnswer;
        if(comment) {
            jsonAnswer = gson.toJson(comments);
        }
        else {
            jsonAnswer = gson.toJson(imageDetails);
        }
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonAnswer);
    }
}
