package it.polimi.tiw.beans;

import java.util.Date;

public class Album {

    private final int albumId;
    private final String title;
    private final Date creationDate;

    public Album(int albumId, String title, Date creationDate) {
        this.albumId = albumId;
        this.title = title;
        this.creationDate = creationDate;
    }

    public int getAlbumId() {
        return albumId;
    }

    public String getTitle() {
        return title;
    }

    public Date getCreationDate() {
        return creationDate;
    }
}
