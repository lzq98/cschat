$(document).ready(function () {
    // initialize variables
    myinfo = JSON.parse(localStorage.getItem('info'));
    mykey = deserializeRSAKey(localStorage.getItem('key'));
    // getChatList();
    getFriendList();
});

// onClick send button
$("#sendMessageButton").on("click", function (event) {
    event.preventDefault();
    sendMessage();
});

$("#myMessage").on("keydown", function (event) {
    var keyCode = event.keyCode || event.which;
    if (keyCode == 13) {
        event.preventDefault();
        sendMessage();
    }
});

function sendMessage() {
    var plaintext = $.trim(document.getElementById("myMessage").value);
    if (plaintext != "") {
        showNewText(plaintext, new Date(), 0);//0 for send, 1 for receive
        var ciphertext = encryptMessage(plaintext);
        //upload(ciphertext, timestamp);
        //alert(ciphertext);
        $("#myMessage").val("");
        document.getElementById("myMessage").style.height = "47px";
    } else {
        alert("no input");
    }
}

function encryptMessage(plaintext) {
    var ciphertext = cryptico.encrypt(plaintext, publicKey);
    if (ciphertext.status) {
        return ciphertext.cipher;
    } else {
        alert("something goes wrong, please reload the page");
    }
}

function deserializeRSAKey(key) {
    let json = JSON.parse(key);
    let rsa = new RSAKey();
    rsa.setPrivateEx(json.n, json.e, json.d, json.p, json.q, json.dmp1, json.dmq1, json.coeff);
    return rsa;
}

function showNewText(text, timestamp, inner) {
    // XSS protection when display text
    text = escapeHTML(text);

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
    timeString = timeToString(timestamp);
    $messageFooter.append($('<span class="extra-small text-muted">' + timeString + '</span>'));
    $messageInner.append($messageFooter);


    $newMessage.append($messageInner);
    $("#chatbox").append($newMessage);
    var chatbody = document.getElementById("chatbody");

    // scroll to the bottom
    chatbody.scroll({ top: chatbody.scrollHeight, behavior: 'smooth' });
}

function timeToString(time) {
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
    return timeString;
}

function showChat(chat) {
    var $card = $('<a href="#" class="card border-0 text-reset" onclick="selectContact(this.id);"></a>');
    $card.attr('id', 'c' + chat["relationid"]);
    var $cardBody = $('<div class="card-body"></div>');
    var $row = $('<div class="row gx-5"></div>');
    var $avatarCol = $('<div class="col-auto"></div>');
    var $avatar = $('<div class="avatar"></div>');
    var $avatarimg;
    if (true) {
        $avatarimg = $('<span class="avatar-text">M</span>');
    } else {
        $avatarimg = $('<img alt="#" class="avatar-img">');
        //$avatarimg.attr('src', contactinfo['avatar']);
    }
    $avatar.append($avatarimg);
    $avatarCol.append($avatar);
    $row.append($avatarCol);

    var $infoCol = $('<div class="col"></div>');
    var $contactInfo = $('<div class="d-flex align-items-center mb-3"></div>');
    var $name = $('<h5 class="me-auto mb-0">' + "name" + '</h5>');
    var $time = $('<span class="text-muted extra-small ms-2 last-chat-time">' + timeToString(new Date(parseInt(chat['time']))) + '</span>')
    $contactInfo.append($name);
    $contactInfo.append($time);
    var $message = $('<div class="d-flex align-items-center"> \
            <div class="line-clamp me-auto last-chat-message">'+ chat['message'] + ' \
            </div> \
            <div class="badge badge-circle bg-primary ms-5 unread"> \
                <span class="unread-count"></span> \
            </div> \
        </div > '
    );
    $infoCol.append($contactInfo);
    $infoCol.append($message);
    $row.append($infoCol);
    $cardBody.append($row);
    $card.append($cardBody);
    $('#chatlist').append($card);
}

function getFriendList() {
    $.post("/api/getfriend.php", function (result) {
        r = JSON.parse(result);
        if (r.length > 0) {
            $("#chatlist").empty();
            r.forEach(showChat);
        }
    })
}

function escapeHTML(str) {
    return str.replace(
        /[&<>'"]/g,
        tag =>
        ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

function selectContact(id) {
    $("#main").attr("class", "main is-visible");
}