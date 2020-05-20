package it.polimi.tiw.dao;

import it.polimi.tiw.beans.Comment;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CommentDAO {
    private final Connection connection;
    private final int imageId;

    public CommentDAO(Connection connection, int imageId) {
        this.connection = connection;
        this.imageId = imageId;
    }

    public void addComment(String nickname, String comment) throws SQLException {
        String query = "INSERT INTO comment (nickname, image, comment) VALUES (?, ?, ?)";
        try(PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, nickname);
            preparedStatement.setInt(2, imageId);
            preparedStatement.setString(3, comment);
            preparedStatement.executeUpdate();
        }
    }

    public List<Comment> retrieveComments() throws SQLException {
        List<Comment> comments = new ArrayList<>();
        String query = "SELECT * FROM comment WHERE image = ?";
        try(PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setInt(1, imageId);
            try(ResultSet resultSet = preparedStatement.executeQuery()) {
                while (resultSet.next()) {
                    int commentId = resultSet.getInt("id");
                    String nickname = resultSet.getString("nickname");
                    String commentText= resultSet.getString("comment");
                    Comment comment = new Comment(commentId, commentText, nickname);
                    comments.add(comment);
                }
            }
        }
        return comments;
    }
}
