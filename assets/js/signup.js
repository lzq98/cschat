function checkEmail() {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var input = document.getElementById("signup-email").value;
    if (input.match(validRegex)) {
        $("#signup-email").removeClass("is-invalid");
        return true;
    } else {
        $("#signup-email").addClass("is-invalid");
        return false;
    }
}

function checkPassword() {
    if (document.getElementById("signup-password").value.length > 0) {
        $("#signup-password").removeClass("is-invalid");
        $("#signup-password-retype").prop("disabled", false);
        return true;
    } else {
        $("#signup-password").addClass("is-invalid");
        $("#signup-password-retype").val("");
        $("#signup-password-retype").prop("disabled", true);
        return false;
    }
}

function checkRetype() {
    if (document.getElementById("signup-password").value != document.getElementById("signup-password-retype").value) {
        $("#signup-password-retype").addClass("is-invalid");
        return false;
    } else {
        $("#signup-password-retype").removeClass("is-invalid");
        return true;
    }
}

function checkAll() {
    if (checkEmail() && checkPassword() && checkRetype()) {
        return true;
    } else {
        return false;
    }
}

function signup() {
    if (checkAll()) {
        var name = $("#signup-name").val();
        var email = $("#signup-email").val();
        var passwordPlain = $("#signup-password").val();
        var publickey = cryptico.publicKeyString(cryptico.generateRSAKey(passwordPlain, 1024));
        hash(passwordPlain).then((digestHex) =>
            $.post("/api/signup.php", { name:name, email: email, password: digestHex, publickey: publickey}, function (result) {
                r = JSON.parse(result);
                if (r["success"]) {
                    window.location.replace("/signin.html");
                } else {
                    alert(r["error"]);
                }
            })
        );
    }
}

function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((bytes) => bytes.toString(16).padStart(2, '0'))
            .join('');
        return hashHex;
    });
}