package it.polimi.tiw.controllers;

import it.polimi.tiw.dao.UserDAO;
import it.polimi.tiw.utils.Initializer;
import org.thymeleaf.context.WebContext;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;

@WebServlet("/SignUp")
@MultipartConfig
public class SignUp extends HttpServlet {
    private static Connection connection;

    public void init() {
        connection = Initializer.connectionInit(getServletContext());
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        if(username.equals("") || password.equals("")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("UTF-8");
            response.getWriter().println("Error: missing parameters!");
            return;
        }
        UserDAO userDAO = new UserDAO(connection);
        try {
            userDAO.registerUser(username, password);
        }  catch (SQLIntegrityConstraintViolationException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("UTF-8");
            response.getWriter().println("Error: an user with that nickname already exists!");
            return;
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("UTF-8");
            response.getWriter().println("Error during credentials retrieving, please try again later!");
            return;
        }
        response.setStatus(HttpServletResponse.SC_OK);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
