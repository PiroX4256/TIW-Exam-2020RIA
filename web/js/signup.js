(function () {
    document.getElementById("submit").addEventListener("click", () => {
        var request = {
            "parameters": []
        }
        var username = document.forms["signUp"]["username"].value;
        var password = document.forms["signUp"]["password"].value;
        var errorMsg = document.getElementById("errorMessage");
        request.parameters.push(username);
        request.parameters.push(password);
        if (username == "" || password == "") {
            alert("Fields must not be empty.");
            return;
        }
        var jsonReq = JSON.stringify(request);
        function success() {
            alert("Registration process has been completed. You can now login!");
            location.replace("index.html");
        }
        $.ajax({
            type: "POST",
            dataType: "application/json",
            url: "SignUp",
            data: jsonReq,
            success: success(),
            error: function(err) {
                switch (err.status) {
                    case 400:
                    errorMsg.textContent = "Error: an user with that nickname already exists!";
                    break;
                    case 500:
                    errorMsg.textContent = "Error during credentials retrieving, please try again later!";
                    }
                }
        });
    })
})();