(function () {
    var currentAlbum = 0;
    currentPage = 0, albumList, pageOrchestrator = new PageOrchestrator();
    var imageList, currentImages = [];
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
        this.albumDetails = null;
        this.directionalButtons = new DirectionalButtons(document.getElementById("next"), document.getElementById("prev"));

        this.reset = function () {
            this.albumList.style.visibility = "hidden";
            this.albumListTitle.style.visibility = "hidden";
            document.getElementById("albumListTitle").className = "hidden";
            document.getElementById("albumList").className = "hidden";
        }

        this.show = function (next) {
            var self = this;
            document.getElementById("albumImagesTitle").style.visibility = "hidden";
            document.getElementById("goToHome").style.visibility = "hidden";
            document.getElementById("albumListTitle").className = "";
            document.getElementById("albumList").className = "table";
            makeCall("GET", "GetAlbumList", null,
                function (req) {
                    var message = req.responseText;
                    if (req.readyState == 4) {
                        if (req.status == 200) {
                            if (self.albumDetails != null) {
                                self.albumDetails.reset();
                            }
                            self.directionalButtons.reset();
                            self.update(JSON.parse(req.responseText));
                            if (next) next();
                        } else {
                            self.alert.textContent = message;
                        }
                    }
                })
        }

        this.update = function (albumArray) {
            var length = albumArray.length, elem, i, row, destcell, nameCell, datecell, linkcell, anchor;
            document.getElementById("albumListTitle").className = "";
            document.getElementById("albumList").className = "table";
            if (length == 0) {
                this.alert.textContent = "No album to display!";
            } else {
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
                        self.albumDetails = new AlbumDetails({
                            alert: this.alert,
                            imageContainer: document.getElementById("imageContainer"),
                            albumImagesTitle: document.getElementById("albumImagesTitle"),
                            backToHomePage: document.getElementById("goToHome")
                        });
                        self.albumDetails.show(currentAlbum, currentPage);
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
        this.goToHome = options['backToHomePage'];

        this.show = function (albumId, page) {
            var self = this;
            makeCall("GET", "GetAlbumDetails?album=" + albumId + "&page=" + page, null,
                function (req) {
                    if (req.readyState == 4) {
                        var message = req.responseText;
                        if (req.status == 200) {
                            document.getElementById("imageContainer").className = "table thumbnail";
                            imageList = JSON.parse(req.responseText);
                            self.create();
                            albumList.directionalButtons.update();
                            self.imageContainer.style.visibility = "visible";
                            document.getElementById("albumImagesTitle").className = "";
                        } else {
                            self.alert.textContent = message;
                        }
                    }
                })
        }

        this.reset = function () {
            this.imageContainer.style.visibility = "hidden";
            this.albumImagesTitle.style.visibility = "hidden";
            this.goToHome.style.visibility = "hidden";
            document.getElementById("imageContainer").className = "hidden";
            document.getElementById("albumImagesTitle").className = "hidden";
        }

        this.update = function () {
            var self = this;
            self.imageContainer.removeChild(self.imageContainer.firstElementChild);
            var row = document.createElement("tr");
            for (i = currentPage * 5; i < (currentPage * 5 + 5); i++) {
                row.appendChild(document.createElement("td"));
                var destImage = document.createElement("img");
                destImage.addEventListener("click", () => {
                    this.imageDetails = new ImageDetails(this.alert, document.getElementById("imageDetailsLMAO"), imageList[i].imageId);
                    $('#modal').modal('show');
                    this.imageDetails.show(imageList[i].imageId);
                    var self2 = this;
                    $("#modal").on('hide.bs.modal', function () {
                        if(self2.imageDetails!=null) self2.imageDetails.reset();
                        delete self2.imageDetails;
                    });
                })
                destImage.src = imageList[i].path;
                row.appendChild(destImage);
                row.appendChild(document.createElement("td"));
                if ((i + 1) == imageList.length) break;
            }
            self.imageContainer.appendChild(row);
            self.imageContainer.classname = "table thumbnail";
            document.getElementById("albumImagesTitle").className = "";
        }

        this.create = function () {
            var row, self = this;
            this.imageContainer.innerHTML = "";
            row = document.createElement("tr");
            var i = 0;
            currentImages = [];
            for (let image of imageList) {
                currentImages.push(image);
            }
            for (let image of currentImages) {
                if (i == 5) break;
                row.appendChild(document.createElement("td"));
                var destImage = document.createElement("img");
                destImage.src = image.path;
                destImage.addEventListener("click", () => {
                    this.imageDetails = new ImageDetails(this.alert, document.getElementById("imageDetailsLMAO"), image.imageId);
                    var self2 = this;
                    $('#modal').modal('show');
                    this.imageDetails.show(image.imageId);
                    $("#modal").on('hide.bs.modal', function () {
                        if(self2.imageDetails!=null) self2.imageDetails.reset();
                        delete self2.imageDetails;
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
            self.goToHome.addEventListener("click", function () {
                pageOrchestrator.refresh();
            })
            self.goToHome.style.visibility = "visible";
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

        this.update = function () {
            if (imageList.length > 5) {
                document.getElementById("arrowsDiv").className = "arrowsDiv";
                this.next.style.visibility = "visible";
                this.prev.style.visibility = "visible";
                this.next.addEventListener("click", () => {
                    if ((currentPage + 1) * 5 > imageList.length) {
                        alert("There are no more images to display!");
                        return;
                    }
                    currentPage++;
                    albumList.albumDetails.update();
                })
                this.prev.addEventListener("click", () => {
                    if (currentPage == 0) {
                        alert("Page number can't be <0!");
                        return;
                    }
                    currentPage--;
                    albumList.albumDetails.update();
                })
            }
        }
    }

    function ImageDetails(_alert, _imageDetails, _imageId) {
        this.alert = _alert;
        this.imageDetails = _imageDetails;
        var self = this;
        this.imageId = _imageId;
        this.addComment = new AddComment(this.imageId);

        this.reset = function () {
            if (this.addComment != null) {
                this.addComment.reset();
                delete this.addComment;
            }
            if (self.imageDetails.firstElementChild != null) {
                self.imageDetails.removeChild(self.imageDetails.firstElementChild);
            }
            this.imageDetails.style.visibility = "hidden";
            delete this;
        }

        this.show = function (image) {
            var self = this;
            this.imageId = image;
            makeCall("GET", "ShowImageDetails?image=" + this.imageId + "&comments=false", null,
                function (req) {
                    var message = req.responseText;
                    if (req.readyState == 4) {
                        if (req.status == 200) {
                            self.update(JSON.parse(req.responseText));
                        } else {
                            self.alert.textContent = message;
                        }
                    }
                })
        }

        this.showComment = function (image) {
            var self = this;
            makeCall("GET", "ShowImageDetails?image=" + this.imageId + "&comments=true", null,
                function (req) {
                    var message = req.responseText;
                    if (req.readyState == 4) {
                        if (req.status == 200) {
                            self.updateComments(JSON.parse(req.responseText));
                        } else {
                            self.alert.textContent = message;
                        }
                    }
                })
        }

        this.updateComments = function (response) {
            var self = this;
            var children = document.getElementById("commentsBody").innerHTML = "";
            if (response.length != 0) {
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
        this.start = function () {
            let personalUsername = new PersonalMessage(sessionStorage.getItem("username"), document.getElementById("id_username"));
            personalUsername.show();
        }
        albumList = new AlbumList(alertContainer, document.getElementById("albumList"),
            document.getElementById("albumListBody"), document.getElementById("albumListTitle"))
        this.refresh = function () {
            albumList.reset();
            document.getElementById("albumImagesTitle").className = "hidden";
            document.getElementById("imageContainer").className = "hidden";
            albumList.show();
        }
    }

    function handleComment(currentIMGid) {
        var nickname = document.forms["addComment"]["nickname"].value;
        var comment = document.forms["addComment"]["comment"].value;
        var imageId = document.forms["addComment"]["imageToComment"].value;
        if (nickname == "" || comment == "") {
            document.getElementById("errorMessage").textContent = "Field must not be empty!";
            return;
        }
        $.ajax({
            type:"POST",
            url:"AddComment",
            data:{"nickname":nickname, "comment":comment, "image":imageId},
            statusCode: {
                200: function() {
                    $("#modal").modal('hide');
                    var nickname = document.forms["addComment"]["nickname"].value = "";
                    var comment = document.forms["addComment"]["comment"].value = "";
                    var imageId = document.forms["addComment"]["imageToComment"].value = "";
                    delete this;
                },
                400: function() {
                    document.getElementById("errorMessage").innerHTML = "Missing parameters!";
                },
                401: function() {
                    document.getElementById("errorMessage").innerHTML = "Not authorized to view that page!";
                },
                500: function() {
                    document.getElementById("errorMessage").innerHTML = message;
                }
            }
        })
    }

    function AddComment(currentImageId) {
        this.currentImg = currentImageId;
        document.getElementById("imageToComment").textContent = this.currentImg;
        document.forms["addComment"]["imageToComment"].value = this.currentImg;
        this.reset = function () {
            document.getElementById("errorMessage").textContent = "";
            document.getElementById("addCommentButton").removeEventListener('click', handleComment);
            delete this;
        }
        document.getElementById("addCommentButton").addEventListener('click', handleComment);
    }
})();