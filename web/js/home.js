(function () {
    var albumDetails, currentAlbum=0; currentPage = 0, albumList, pageOrchestrator = new PageOrchestrator();
    var imageDetailsLMAO, directionalButtons, addComment, imageList, currentImages = [];
    window.addEventListener('load', () => {
        pageOrchestrator.start();
        pageOrchestrator.refresh();
    }, false)

function PersonalMessage(username, messageBox) {
    this.username = username;
    this.show = function () {
        messageBox.textContent = this.username;
    }
}

function AlbumList(_alert, _albumList, _albumListBody, _albumListTitle) {
        this.alert = _alert;
        this.albumList = _albumList;
        this.albumListBody = _albumListBody;
        this.albumListTitle = _albumListTitle;

        this.reset = function () {
            this.albumList.style.visibility = "hidden";
            this.albumListTitle.style.visibility = "hidden";
            document.getElementById("albumListTitle").className = "hidden";
            document.getElementById("albumList").className = "hidden";
        }

        this.show = function(next) {
            var self = this;
            document.getElementById("albumListTitle").className = "";
            document.getElementById("albumList").className = "table";
            makeCall("GET", "GetAlbumList", null,
                function (req) {
                var message = req.responseText;
                if(req.readyState == 4) {
                    if(req.status==200) {
                        self.update(JSON.parse(req.responseText));
                        if(next) next();
                    }
                    else {
                        self.alert.textContent = message;
                    }
                }
            })
    }

    this.update = function (albumArray) {
        var length = albumArray.length, elem, i, row, destcell, nameCell, datecell, linkcell, anchor;
        document.getElementById("albumListTitle").className = "";
        document.getElementById("albumList").className = "table";
        if(length == 0) {
            this.alert.textContent = "No album to display!";
        }
        else {
            this.albumListBody.innerHTML = "";
            var self = this;
            var row = document.createElement("tr");
            row.className = "tableHeading";
            let id = document.createElement("th");
            id.textContent = "ID";
            row.appendChild(id);
            let albumName = document.createElement("th");
            albumName.textContent = "Album name";
            row.appendChild(albumName);
            let creationDate = document.createElement("th");
            creationDate.textContent = "Creation date";
            row.appendChild(creationDate);
            let moreDetails = document.createElement("th");
            moreDetails.textContent = "More details";
            row.appendChild(moreDetails);
            self.albumListBody.appendChild(row);
            albumArray.forEach(function (album) {
                row = document.createElement("tr");
                destcell = document.createElement("td");
                destcell.textContent = album.albumId;
                destcell.className = "grab";
                row.appendChild(destcell);
                nameCell = document.createElement("td");
                nameCell.textContent = album.title;
                nameCell.className = "grab";
                row.appendChild(nameCell);
                datecell = document.createElement("td");
                datecell.textContent = album.creationDate;
                datecell.className = "grab";
                row.appendChild(datecell);
                linkcell = document.createElement("td");
                anchor = document.createElement("a");
                linkcell.className = "grab";
                linkcell.appendChild(anchor);
                let linkText = document.createTextNode("Details");
                anchor.appendChild(linkText);
                anchor.setAttribute('albumid', album.albumId);
                anchor.addEventListener("click", (e) => {
                    currentAlbum = e.target.getAttribute("albumid");
                    albumDetails.show(currentAlbum, currentPage);
                }, false);
                anchor.href = "#";
                row.appendChild(linkcell);
                self.albumListBody.appendChild(row);
            });
            var row = document.createElement("tr");
            row.appendChild(document.createElement("th"));
            row.appendChild(document.createElement("th"));
            row.appendChild(document.createElement("th"));
            row.appendChild(document.createElement("th"));
            self.albumListBody.appendChild(row);
            this.albumListTitle.style.visibility = "visible";
            this.albumList.style.visibility = "visible";
        }
    }
}

function AlbumDetails(options) {
    this.alert = options['alert'];
    this.imageContainer = options['imageContainer'];
    this.albumImagesTitle = options['albumImagesTitle'];
    this.title = options['title'];
    this.date = options['date'];
    this.description = options['description'];
    this.path = options['path'];

    this.show = function (albumId, page) {
        var self = this;
        makeCall("GET", "GetAlbumDetails?album=" + albumId + "&page=" + page, null,
            function (req) {
                if(req.readyState==4) {
                    var message = req.responseText;
                    if(req.status==200) {
                        document.getElementById("imageContainer").className = "table thumbnail";
                        imageList = JSON.parse(req.responseText);
                        self.create();
                        directionalButtons.update();
                        self.imageContainer.style.visibility = "visible";
                        document.getElementById("albumImagesTitle").className = "";
                    }
                    else {
                        self.alert.textContent = message;
                    }
                }
            })
    }

    this.reset = function () {
        this.imageContainer.style.visibility = "hidden";
        this.albumImagesTitle.style.visibility = "hidden";
        document.getElementById("imageContainer").className = "hidden";
        document.getElementById("albumImagesTitle").className = "hidden";
    }

    this.update = function () {
        var self = this;
        self.imageContainer.removeChild(self.imageContainer.firstElementChild);
        var row = document.createElement("tr");
        for(i=currentPage*5; i<(currentPage*5+5); i++) {
            row.appendChild(document.createElement("td"));
            var destImage = document.createElement("img");
            destImage.addEventListener("click", () => {
                $('#modal').modal('show');
                imageDetailsLMAO.show(imageList[i].imageId);
                $("#modal").on('hide.bs.modal', function(){
                    imageDetailsLMAO.reset();
                    addComment.reset();
                });
            })
            destImage.src = imageList[i].path;
            row.appendChild(destImage);
            row.appendChild(document.createElement("td"));
            if((i+1)==imageList.length) break;
        }
        self.imageContainer.appendChild(row);
        self.imageContainer.classname = "table thumbnail";
        document.getElementById("albumImagesTitle").className = "";
    }

    this.create = function() {
        var row, self = this;
        row = document.createElement("tr");
        var i=0;
        for(let image of imageList) {
            currentImages.push(image);
        }
        for(let image of currentImages) {
            if(i==5) break;
            row.appendChild(document.createElement("td"));
            var destImage = document.createElement("img");
            destImage.src = image.path;
            destImage.addEventListener("click", () => {
                $('#modal').modal('show');
                imageDetailsLMAO.show(image.imageId);
                $("#modal").on('hide.bs.modal', function(){
                    imageDetailsLMAO.reset();
                    addComment.reset();
                });
            })
            row.appendChild(destImage);
            row.appendChild(document.createElement("td"));
            i++;
        }
        self.imageContainer.appendChild(row);
        this.albumImagesTitle.style.visibility = "visible";
        document.getElementById("imageContainer").className = "table thumbnail";
        document.getElementById("albumImagesTitle").className = "";
        albumList.reset();
    }
}

function DirectionalButtons(_next, _prev) {
    this.next = _next;
    this.prev = _prev;

    this.reset = function () {
        this.next.style.visibility = "hidden";
        this.prev.style.visibility = "hidden";
        document.getElementById("arrowsDiv").className = "hidden";
    }

    this.update = function() {
        if(imageList.length>5) {
            document.getElementById("arrowsDiv").className = "arrowsDiv";
            this.next.style.visibility = "visible";
            this.prev.style.visibility = "visible";
            this.next.addEventListener("click", () => {
                if((currentPage+1)*5>imageList.length) {
                    alert("There are no more images to display!");
                    return;
                }
                currentPage++;
                albumDetails.update();
            })
            this.prev.addEventListener("click", () => {
                if(currentPage==0) {
                    alert("Page number can't be <0!");
                    return;
                }
                currentPage--;
                albumDetails.update();
            })
        }
    }
}

function ImageDetails(_alert, _imageDetails) {
    this.alert = _alert;
    this.imageDetails = _imageDetails;
    var self = this;
    var imageId;

    this.reset = function () {
        if(self.imageDetails.firstElementChild!=null) {
            self.imageDetails.removeChild(self.imageDetails.firstElementChild);
        }
        this.imageDetails.style.visibility = "hidden";
    }

    this.show = function(image) {
        var self = this;
        imageId = image;
        makeCall("GET", "ShowImageDetails?image=" + imageId + "&comments=false", null,
            function (req) {
                var message = req.responseText;
                if(req.readyState == 4) {
                    if(req.status==200) {
                        self.update(JSON.parse(req.responseText));
                    }
                    else {
                        self.alert.textContent = message;
                    }
                }
            })
    }

    this.showComment = function (image) {
        var self = this;
        makeCall("GET", "ShowImageDetails?image=" + imageId + "&comments=true", null,
            function (req) {
                var message = req.responseText;
                if(req.readyState == 4) {
                    if(req.status==200) {
                        self.updateComments(JSON.parse(req.responseText));
                        addComment = new AddComment(imageId);
                    }
                    else {
                        self.alert.textContent = message;
                    }
                }
            })
    }

    this.updateComments = function (response) {
        var self = this;
        var children = document.getElementById("commentsBody").innerHTML = "";
        if(response.length!=0) {
            response.forEach(function (comment) {
                let row = document.createElement("tr");
                let author = document.createElement("td");
                author.textContent = comment.nickname;
                row.appendChild(author);
                let singleComment = document.createElement("td");
                singleComment.textContent = comment.comment;
                row.appendChild(singleComment);
                document.getElementById("commentsBody").appendChild(row);
            })
        }
        document.getElementById("commentsTable").style.visibility = "visible";
    }

    this.update = function (imageResponse) {
        var self = this;
        self.innerHTML = "";
        let div = document.createElement("div");
        let img = document.createElement("img");
        img.className = "detailsImg";
        img.src = imageResponse.path;
        div.appendChild(img);
        let title = document.createElement("h4");
        title.textContent = "Title: " + imageResponse.title;
        div.appendChild(title);
        let desc = document.createElement("h4");
        desc.textContent = "Description: " + imageResponse.description;
        div.appendChild(desc);
        let date = document.createElement("h4");
        date.textContent = "Date: " + imageResponse.date;
        div.appendChild(date);
        self.imageDetails.appendChild(div);
        self.imageDetails.style.visibility = "visible";
        this.showComment()
    }
}

function PageOrchestrator() {
    var alertContainer = document.getElementById("alert");
    this.start = function() {
        let personalUsername = new PersonalMessage(sessionStorage.getItem("username"), document.getElementById("id_username"));
        personalUsername.show();
    }
    albumList = new AlbumList(alertContainer, document.getElementById("albumList"),
        document.getElementById("albumListBody"), document.getElementById("albumListTitle"))
    albumDetails = new AlbumDetails({alert: alertContainer,
        imageContainer: document.getElementById("imageContainer"),
        albumImagesTitle: document.getElementById("albumImagesTitle")});
    directionalButtons = new DirectionalButtons(document.getElementById("next"), document.getElementById("prev"));
    imageDetailsLMAO = new ImageDetails(alertContainer, document.getElementById("imageDetailsLMAO"));
    this.refresh = function () {
        albumList.reset();
        albumDetails.reset();
        imageDetailsLMAO.reset();
        directionalButtons.reset();
        albumList.show();
    }
}

function AddComment (currentImageId) {
    this.currentImageId = currentImageId;
    this.reset = function () {
        document.getElementById("errorMessage").textContent = "";
    }
    document.getElementById("addCommentButton").addEventListener('click', (e => {
        var form = e.target.closest("form");
        if (form.checkValidity()) {
            if(document.forms["addComment"]["nickname"].value=="" || document.forms["addComment"]["comment"].value=="") {
                document.getElementById("errorMessage").textContent = "Field must not be empty!";
                return;
            }
            form = e.target.closest("form");
            form.querySelector("input[type = 'hidden']").value = this.currentImageId;
            makeCall("POST", "AddComment", form,
                function (request) {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        var message = request.responseText;
                        switch (request.status) {
                            case 200:   //Everything is ok
                                $("#modal").modal('hide');
                                break;
                            case 400:   //Returned bad request
                                document.getElementById("errorMessage").innerHTML = message;
                                break;
                            case 401:   //Not authorized
                                document.getElementById("errorMessage").innerHTML = message;
                                break;
                            case 500:
                                document.getElementById("errorMessage").innerHTML = message;
                                break;
                        }
                    }
                })

        } else form.reportValidity();
    }))
}
})();