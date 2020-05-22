package it.polimi.tiw.beans;

public class Comment {
    private final int commentId;
    private final String userComment;
    private final String nickname;


    public Comment(int commentId, String userComment, String nickname) {
        this.commentId = commentId;
        this.userComment = userComment;
        this.nickname = nickname;
    }

    public int getCommentId() {
        return commentId;
    }

    public String getUserComment() {
        return userComment;
    }

    public String getNickname() {
        return nickname;
    }
}
