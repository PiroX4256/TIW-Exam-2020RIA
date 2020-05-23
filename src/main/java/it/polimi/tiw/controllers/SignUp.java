package it.polimi.tiw.controllers;

import it.polimi.tiw.dao.UserDAO;
import it.polimi.tiw.utils.Initializer;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;

@WebServlet("/SignUp")
@MultipartConfig
public class SignUp extends HttpServlet {
    public static final String UTF_8 = "UTF-8";
    private static Connection connection;

    @Override
    public void init() {
        connection = Initializer.connectionInit(getServletContext());
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JSONObject jsonObject;
        StringBuilder jb = new StringBuilder();
        String line;
        String username;
        String password;
        String email;
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null)
                jb.append(line);
        } catch (Exception e) { e.printStackTrace(); }

        try {
            jsonObject =  new JSONObject(jb.toString());
            JSONArray jsonRequest = (JSONArray)jsonObject.get("parameters");
            if(jsonRequest.length()==0) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.setContentType(UTF_8);
                response.getWriter().println("Error: missing parameters!");
                return;
            }
            username = jsonRequest.getString(0);
            password = jsonRequest.getString(1);
            email = jsonRequest.getString(2);


        } catch (JSONException e) {
            throw new IOException("Error parsing JSON request string");
        }
        if(username.equals("") || password.equals("") || email.equals("")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType(UTF_8);
            response.getWriter().println("Error: missing parameters!");
            return;
        }
        else if(!email.contains("@")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType(UTF_8);
            response.getWriter().println("Error: bad email format!");
            return;
        }
        UserDAO userDAO = new UserDAO(connection);
        try {
            userDAO.registerUser(username, password, email);
        }  catch (SQLIntegrityConstraintViolationException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType(UTF_8);
            response.getWriter().println("Error: an user with that nickname (or email) already exists!");
            return;
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType(UTF_8);
            response.getWriter().println("Error during credentials retrieving, please try again later!");
            return;
        }
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
