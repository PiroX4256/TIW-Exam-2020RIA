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

    public List<Album> retrieveAlbumList() throws SQLException {
        List<Album> albumList = new ArrayList<>();
        String query = "SELECT * FROM album ORDER BY creationDate DESC";
        try(PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            try(ResultSet resultSet = preparedStatement.executeQuery()) {
                while (resultSet.next()) {
                    int albumId = resultSet.getInt("id");
                    String title = resultSet.getString("title");
                    Date date = new Date(resultSet.getDate("creationDate").getTime());
                    Album album = new Album(albumId, title, date);
                    albumList.add(album);
                }
            }
        }
        return albumList;
    }

    public void createNewAlbum(String title) throws SQLException {
        String query = "INSERT INTO album (title, creationDate) VALUES (?, ?)";
        try(PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, title);
            preparedStatement.setDate(2, new java.sql.Date(new Date().getTime()));
            preparedStatement.executeUpdate();
        }
    }
}
