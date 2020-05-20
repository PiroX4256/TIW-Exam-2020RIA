package it.polimi.tiw.beans;

public class Comment {
    private final int commentId;
    private final String comment;
    private final String nickname;


    public Comment(int commentId, String comment, String nickname) {
        this.commentId = commentId;
        this.comment = comment;
        this.nickname = nickname;
    }

    public int getCommentId() {
        return commentId;
    }

    public String getComment() {
        return comment;
    }

    public String getNickname() {
        return nickname;
    }
}
