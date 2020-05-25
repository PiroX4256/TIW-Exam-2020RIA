(function () {
    document.getElementById("submit").addEventListener("click", () => {
        var request = {
            "parameters": []
        }
        var username = document.forms["signUp"]["username"].value;
        var password = document.forms["signUp"]["password"].value;
        var passwordConfirmation = document.forms["signUp"]["passwordConfirmation"].value;
        var email = document.forms["signUp"]["email"].value;
        var errorMsg = document.getElementById("errorMessage");
        request.parameters.push(username);
        request.parameters.push(password);
        request.parameters.push(email);
        if (username == "" || password == "" || passwordConfirmation=="" || email=="") {
            alert("Fields must not be empty.");
            return;
        }
        else if(password!=passwordConfirmation) {
            errorMsg.textContent = "Passwords don't match!";
            return;
        }
        else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(signUp.email.value))) {      //IETF RCF3696 EMAIL VALIDATION STANDARD
            errorMsg.textContent = "Invalid email format!";
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