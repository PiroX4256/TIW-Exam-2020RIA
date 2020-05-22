package it.polimi.tiw.dao;

import it.polimi.tiw.beans.Image;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ImageDAO {
    private final Connection connection;
    private final Integer album;
    private final Integer imageId;

    public ImageDAO(Connection connection, int album) {
        this.connection = connection;
        this.album = album;
        this.imageId = album;
    }

    public void createNewImage(String title, String path, Date date, String description) throws SQLException {
        String query = "INSERT INTO image (title, filepath, date, description, album) VALUES (?, ?, ?, ?, ?)";
        try(PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, title);
            preparedStatement.setString(2, path);
            preparedStatement.setDate(3, date);
            preparedStatement.setString(4, description);
            preparedStatement.setInt(5, album);
            preparedStatement.executeUpdate();
        }
    }

    public List<Image> retrieveImages() throws SQLException {
        String query = "SELECT * FROM image WHERE album = ? ORDER BY date DESC";
        List<Image> images = new ArrayList<>();
        try(PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setInt(1, album);
            try(ResultSet resultSet = preparedStatement.executeQuery()) {
                while (resultSet.next()) {
                    int tempImageId = resultSet.getInt("imageid");
                    String title = resultSet.getString("title");
                    String description = resultSet.getString("description");
                    Date date = resultSet.getDate("date");
                    String path = resultSet.getString("filepath");
                    Image image = new Image(tempImageId, title, date, description, path);
                    images.add(image);
                }
            }
        }
        return images;
    }

    public Image getImageById() throws SQLException {
        String query = "SELECT * FROM image WHERE imageid = ?";
        Image image = null;
        try(PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setInt(1, imageId);
            try(ResultSet resultSet = preparedStatement.executeQuery()) {
                if(resultSet.next()) {
                    String title = resultSet.getString("title");
                    String description = resultSet.getString("description");
                    Date date = resultSet.getDate("date");
                    String filePath = resultSet.getString("filePath");
                    image = new Image(imageId, title, date, description, filePath);
                }
            }
        }
        return image;
    }

}
