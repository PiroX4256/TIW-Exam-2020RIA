function validateForm() {
    var user = document.forms["signUp"]["username"].value;
    var pwd = document.forms["signUp"]["password"].value;
    if (user == "" || pwd=="") {
        alert("Fields must not be empty.");
    }
} 