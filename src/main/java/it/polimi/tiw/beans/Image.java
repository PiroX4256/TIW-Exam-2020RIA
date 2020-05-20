package it.polimi.tiw.beans;

import java.sql.Date;

public class Image {
    private final int imageId;
    private final String title;
    private final Date date;
    private final String description;
    private final String path;

    public Image(int imageId, String title, Date date, String description, String path) {
        this.imageId = imageId;
        this.title = title;
        this.date = date;
        this.description = description;
        this.path = path;
    }

    public int getImageId() {
        return imageId;
    }

    public String getTitle() {
        return title;
    }

    public Date getDate() {
        return date;
    }

    public String getDescription() {
        return description;
    }

    public String getPath() {
        return path;
    }
}
