function signin() {
    var email = $("#signin-email").val();
    var passwordPlain = $("#signin-password").val();

    hash(passwordPlain).then((digestHex) =>
        $.post("/api/signin.php", { email: email, password: digestHex }, function (result) {
            r = JSON.parse(result);
            if (r["success"]) {
                success(r["info"], passwordPlain);
            } else {
                alert(r["error"]);
            }
        })
    );
}

function success(info, password) {
    localStorage.setItem("info", JSON.stringify(info));
    localStorage.setItem("key", serializeRSAKey(cryptico.generateRSAKey(password, 1024)));
    window.location.replace("/chat.html");
}

function serializeRSAKey(key) {
    // convert RSA key into a string that can be stored in local storage
    return JSON.stringify({
        coeff: key.coeff.toString(16),
        d: key.d.toString(16),
        dmp1: key.dmp1.toString(16),
        dmq1: key.dmq1.toString(16),
        e: key.e.toString(16),
        n: key.n.toString(16),
        p: key.p.toString(16),
        q: key.q.toString(16)
    })
}

//sha256 calculated hashed password
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