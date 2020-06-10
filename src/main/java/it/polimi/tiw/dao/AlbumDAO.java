package it.polimi.tiw.dao;

import it.polimi.tiw.beans.Album;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class AlbumDAO {
    private final Connection connection;

    public AlbumDAO(Connection connection) {
        this.connection = connection;
    }

    public List<Album> retrieveAlbumList(int userId) throws SQLException {
        List<Album> albumList = new ArrayList<>();
        String query1 = "SELECT albumOrder FROM users WHERE id = ?";
        String[] albumOrder = null;
        try(PreparedStatement preparedStatement = connection.prepareStatement(query1)) {
            preparedStatement.setInt(1, userId);
            try(ResultSet resultSet = preparedStatement.executeQuery()) {
                if(resultSet.next()) {
                    String res = resultSet.getString("albumOrder");
                    if(res!=null) {
                        albumOrder = res.split(",");
                    }
                }
            }
        }

        String query = "SELECT * FROM album ORDER BY creationDate DESC";
        String queryNotNull = "SELECT * FROM album WHERE id = ?";

        if(albumOrder!=null) {
            for(int i=0; i<albumOrder.length; i++) {
                try (PreparedStatement preparedStatement = connection.prepareStatement(queryNotNull)) {
                    preparedStatement.setInt(1, Integer.parseInt(albumOrder[i]));
                    try(ResultSet resultSet = preparedStatement.executeQuery()) {
                        if(resultSet.next()) {
                            String title = resultSet.getString("title");
                            Date date = new Date(resultSet.getDate("creationDate").getTime());
                            Album album = new Album(Integer.parseInt(albumOrder[i]), title, date);
                            albumList.add(album);
                        }
                    }
                }
            }
        }
        else {
            try (PreparedStatement preparedStatement = connection.prepareStatement(query)) {
                try (ResultSet resultSet = preparedStatement.executeQuery()) {
                    while (resultSet.next()) {
                        int albumId = resultSet.getInt("id");
                        String title = resultSet.getString("title");
                        Date date = new Date(resultSet.getDate("creationDate").getTime());
                        Album album = new Album(albumId, title, date);
                        albumList.add(album);
                    }
                }
            }
        }
        return albumList;
    }

    public void updateAlbumList(int userId, String albumOrder) throws SQLException {
        String query = "UPDATE users SET albumOrder = ? WHERE id = ?";
        try(PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, albumOrder);
            preparedStatement.setInt(2, userId);
            preparedStatement.executeUpdate();
        }
    }
}
