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
    } else {
        alert("something goes wrong, please reload the page");
    }
}

function showNewText(text, timestamp, inner) {
    var $newMessage = $('<div"></div>');
    $newMessage.attr('class', inner ? 'message' : 'message message-out');

    // setup avatar
    var $avatar = $('<a href="#" data-bs-toggle="modal" class="avatar avatar-responsive"></a>');
    $avatar.attr('data-bs-target', inner ? "#modal-user-profile" : "#modal-profile");
    var $avatarImg = $('<img class="avatar-img" alt="">');
    $avatarImg.attr('src', inner ? "assets/img/avatars/2.jpg" : "assets/img/avatars/1.jpg");
    $avatar.append($avatarImg);
    $newMessage.append($avatar);

    var $messageInner = $('<div class="message-inner"></div>');
    var $messageBody = $('<div class="message-body"></div>');
    var $messageContent = $('<div class="message-content"></div>');
    var $messageText = $('<div class="message-text"></div');
    $messageText.append('</p>' + text + '</p>');
    $messageContent.append($messageText);
    $messageBody.append($messageContent);
    $messageInner.append($messageBody);

    var $messageFooter = $('<div class="message-footer"></div>');
    $messageFooter.append($('<span class="extra-small text-muted">' + timestamp + '</span>'));
    $messageInner.append($messageFooter);
    

    $newMessage.append($messageInner);
    $("#chatbox").append($newMessage);
    var chatbody = document.getElementById("chatbody");

    // scroll to the bottom
    chatbody.scroll({ top: chatbody.scrollHeight, behavior: 'smooth' });
}