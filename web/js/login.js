(function () {
    document.getElementById("loginButton").addEventListener('click', (e => {
        var form = e.target.closest("form");
        if (form.checkValidity()) {
            makeCall("POST", "CheckLogin", e.target.closest('form'),
                function (request) {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        var message = request.responseText;
                        switch (request.status) {
                            case 200:   //Everything is ok
                                sessionStorage.setItem('username', message);
                                location.replace("home.html");
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
})();