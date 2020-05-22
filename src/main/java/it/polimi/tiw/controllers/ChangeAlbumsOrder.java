package it.polimi.tiw.controllers;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import it.polimi.tiw.beans.User;
import it.polimi.tiw.dao.AlbumDAO;
import it.polimi.tiw.utils.Initializer;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

@WebServlet("/ChangeAlbumsOrder")
public class ChangeAlbumsOrder extends HttpServlet {
    private static Connection connection;

    public void init() {
        connection = Initializer.connectionInit(getServletContext());
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JSONObject jsonObject;
        StringBuffer jb = new StringBuffer();
        String line = null;
        String queryContent = "";
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null)
                jb.append(line);
        } catch (Exception e) { e.printStackTrace(); }

        try {
            jsonObject =  new JSONObject(jb.toString());
            JSONArray jsonRequest = (JSONArray)jsonObject.get("albumsOrder");
            for(int i=0; i<jsonRequest.length(); i++) {
                if(i==0) {
                    queryContent = jsonRequest.get(i).toString();
                }
                else {
                    queryContent = queryContent + "," + jsonRequest.get(i).toString();
                }
            }
        } catch (JSONException e) {
            throw new IOException("Error parsing JSON request string");
        }
        User user = (User)request.getSession().getAttribute("user");
        AlbumDAO albumDAO = new AlbumDAO(connection);
        try {
            albumDAO.updateAlbumList(user.getId(), queryContent);
        } catch (SQLException sqlException) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {}
}
