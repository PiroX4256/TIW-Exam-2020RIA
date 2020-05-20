(function () {
    var albumDetails, currentAlbum=0; currentPage = 0, albumList, pageOrchestrator = new PageOrchestrator();
    var directionalButtons, imageList, currentImages = [];
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
        }

        this.show = function(next) {
            var self = this;
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
        if(length == 0) {
            this.alert.textContent = "No album to display!";
        }
        else {
            this.albumListBody.innerHTML = "";
            var self = this;
            albumArray.forEach(function (album) {
                row = document.createElement("tr");
                destcell = document.createElement("td");
                destcell.textContent = album.albumId;
                row.appendChild(destcell);
                nameCell = document.createElement("td");
                nameCell.textContent = album.title;
                row.appendChild(nameCell);
                datecell = document.createElement("td");
                datecell.textContent = album.creationDate;
                row.appendChild(datecell);
                linkcell = document.createElement("td");
                anchor = document.createElement("a");
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
                        imageList = JSON.parse(req.responseText);
                        self.create();
                        directionalButtons.update();
                        self.imageContainer.style.visibility = "visible";
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
    }

    this.update = function () {
        var self = this;
        self.imageContainer.removeChild(self.imageContainer.firstElementChild);
        var row = document.createElement("tr");
        for(i=currentPage*5; i<(currentPage*5+5); i++) {
            if(i==imageList.length) break;
            row.appendChild(document.createElement("td"));
            var destImage = document.createElement("img");
            destImage.src = imageList[i].path;
            row.appendChild(destImage);
            row.appendChild(document.createElement("td"));
        }
        self.imageContainer.appendChild(row);
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
            row.appendChild(destImage);
            row.appendChild(document.createElement("td"));
            currentImages.push(image);
            i++;
        }
        self.imageContainer.appendChild(row);
        this.albumImagesTitle.style.visibility = "visible";
        albumList.reset();
    }
}

function DirectionalButtons(_next, _prev) {
    this.next = _next;
    this.prev = _prev;

    this.reset = function () {
        this.next.style.visibility = "hidden";
        this.prev.style.visibility = "hidden";
    }

    this.update = function() {
        if(imageList.length>5) {
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
    this.refresh = function () {
        albumList.reset();
        albumDetails.reset();
        directionalButtons.reset();
        albumList.show();
    }
}
})();