// initialize RSA keys
var myKey = cryptico.generateRSAKey("mypassword", 1024);
var publicKey = cryptico.publicKeyString(myKey);

// onClick send button
$("#sendMessageButton").on("click", function () {
    var plaintext = $.trim(document.getElementById("myMessage").value);
    if (plaintext != "") {
        var timestamp = new Date();
        //showMessage(0, plaintext, timestamp);//0 for me, 1 for the contact
        var ciphertext = encryptMessage(plaintext);
        //upload(ciphertext, timestamp);
        //alert(ciphertext);
        $("#myMessage").val("");
    } else {
        alert("no input");
    }
});

function encryptMessage(plaintext) {
    var ciphertext = cryptico.encrypt(plaintext, publicKey);
    if (ciphertext.status) {
        return ciphertext.cipher;
    }else{
        alert("something goes wrong, please reload the page");
    }
}