(function () {
    var submit = document.getElementById("submit");
    submit.addEventListener("click", () => {
        var user = document.forms["signUp"]["username"].value;
        var pwd = document.forms["signUp"]["password"].value;
        var errorMsg = document.getElementById("errorMessage");
        if (user == "" || pwd == "") {
            alert("Fields must not be empty.");
        }

        $.ajax({
            type: "POST",
            url: "SignUp",
            data: {"username": user, "password": pwd},
            statusCode: {
                200: function() {
                    location.replace("index.html");
                },
                400: function () {
                    errorMsg.textContent = "Error: an user with that nickname already exists!";
                },
                500: function () {
                    errorMsg.textContent = "Error during credentials retrieving, please try again later!";
                }
            }
        }).done(function (response) {
            var message = response.responseText;
            switch (response.status) {
                case 200:
                    alert("You successfully registered, now you can login!");
                    location.replace("index.html");
                    break;
                case 400:
                    errorMsg.textContent = message;
                    break;
                case 500:
                    errorMsg.textContent = message;
            }
        });
    })
})();