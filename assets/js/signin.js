function signin() {
    var email = $("#signin-email").val();
    var passwordPlain = $("#signin-password").val();
    // generateRSAKey(passwordPlain);
    hash(passwordPlain).then((digestHex) =>
        $.post("/api/signin.php", { email: email, password: digestHex }, function (result) {
            r = JSON.parse(result);
            if(r["success"]){
                success(r["info"]);
            }else{
                alert(r["error"]);
            }
        })
    );
}

function success(info){
    
    window.location.replace("/chat.html");
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