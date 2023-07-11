// initialize RSA keys
var myKey = cryptico.generateRSAKey("mypassword", 1024);
var publicKey = cryptico.publicKeyString(myKey);

// onClick send button
$("#sendMessageButton").on("click", function () {
    var plaintext = $.trim(document.getElementById("myMessage").value);
    if (plaintext != "") {
        showNewText(plaintext, new Date(), 0);//0 for send, 1 for receive
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
    var time = new Date(timestamp);
    var now = new Date();
    timeString = "";
    if (time.getFullYear() == now.getFullYear()) {
        // same year as today
        if (time.getMonth() == now.getMonth() && time.getDate() == now.getDate()) {
            // today
            // display time
            timeString = time.getHours() + ":" + time.getMinutes();
        } else {
            // not the same date as today
            // display date
            timeString = (time.getMonth() + 1) + '-' + time.getDate();
        }
    } else {
        // different year as today
        // display year and date
        timeString = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
    }
    $messageFooter.append($('<span class="extra-small text-muted">' + timeString + '</span>'));
    $messageInner.append($messageFooter);


    $newMessage.append($messageInner);
    $("#chatbox").append($newMessage);
    var chatbody = document.getElementById("chatbody");

    // scroll to the bottom
    chatbody.scroll({ top: chatbody.scrollHeight, behavior: 'smooth' });
}