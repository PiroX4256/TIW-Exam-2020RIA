package it.polimi.tiw.controllers;

import it.polimi.tiw.dao.AlbumDAO;
import it.polimi.tiw.utils.Initializer;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

//TODO CONTROLLI LATO SERVER

@WebServlet("/CreateNewAlbum")
public class CreateNewAlbum extends HttpServlet {
    private static Connection connection;

    public void init() {
        connection = Initializer.connectionInit(getServletContext());
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession();
        String title = request.getParameter("title");
        AlbumDAO albumDAO = new AlbumDAO(connection);
        if(title.equals("")) {
            session.setAttribute("newAlbumErr", "Fields must not be empty!");
            response.sendRedirect(getServletContext().getContextPath() + "/GoToHomepage");
            return;
        }
        try {
            albumDAO.createNewAlbum(title);
        }
        catch (SQLException e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Unable to create a new album!");
            return;
        }
        session.removeAttribute("newAlbumErr");
        response.sendRedirect(getServletContext().getContextPath() + "/GoToHomePage");
    }
}
