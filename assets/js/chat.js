$(document).ready(function () {
    // initialize variables
    myinfo = JSON.parse(localStorage.getItem('info'));
    mykey = deserializeRSAKey(localStorage.getItem('key'));
    myPublicKey = cryptico.publicKeyString(mykey);
    $.post("/api/getfriend.php").then(function (response) {
        friends = JSON.parse(response);
        friendsArr = $.map(JSON.parse(response), function (_) { return _ });
        friendsArr.sort(timeascend).forEach(function (friend) {
            showChat(friend);
        });
        friends
    })
    currentUser = -1;
    currentRelation = -1;
    currentPublicKey = "";
});

function timeascend(x, y) {
    return x["time"] - y["time"];
}
function timedescend(x, y) {
    return y["time"] - x["time"];
}

function nameascend(x, y) {
    return x["name"] - y["name"];
}

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
        showText(plaintext, new Date(), 0);//0 for send, 1 for receive
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

function showText(text, timestamp, inner) {
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
    return $newMessage;
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

function showChat(friend) {
    var $card = $('<a href="#" class="card border-0 text-reset" onclick="selectContact(' + friend["info"]["uid"] + ');"></a>');
    var $cardBody = $('<div class="card-body"></div>');
    var $row = $('<div class="row gx-5"></div>');
    var $avatarCol = $('<div class="col-auto"></div>');
    var $avatar = $('<div class="avatar"></div>');
    var $avatarimg;
    if (friend["avatar"] == null) {
        $avatarimg = $('<span class="avatar-text">' + getDisplayName(friend['info']).charAt(0) + '</span>');
    } else {
        $avatarimg = $('<img alt="#" class="avatar-img">');
        //$avatarimg.attr('src', contactinfo['avatar']);
    }
    $avatar.append($avatarimg);
    $avatarCol.append($avatar);
    $row.append($avatarCol);

    var $infoCol = $('<div class="col"></div>');
    var $contactInfo = $('<div class="d-flex align-items-center mb-3"></div>');
    var $name = $('<h5 class="me-auto mb-0">' + getDisplayName(friend['info']) + '</h5>');
    var $time = $('<span class="text-muted extra-small ms-2 last-chat-time">' + timeToString(new Date(parseInt(friend['time']))) + '</span>')
    $contactInfo.append($name);
    $contactInfo.append($time);
    var $message = $('<div class="d-flex align-items-center"> \
            <div class="line-clamp me-auto last-chat-message">'+ friend['message'] + ' \
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

function getUserInfo(userlist) {
    $.post("/api/getuserinfo.php", { "users": userlist }, function (result) {
        userinfo = JSON.parse(result);
        console.log(userinfo);
        userinfo.forEach(function (info) {
            //info["displayName"] = getDisplayName(info);
        })
    })
}

function getDisplayName(info) {
    if (info["name"] != null && info["name"] != "") {
        return info["name"];
    } else if (info["uname"] != null && info["uname"] != "") {
        return info["uname"];
    } else {
        return info["email"];
    }
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

function selectContact(uid) {
    if (uid == currentUser) {
        return;
    }
    currentUser = uid;
    currentRelation = friends[uid]['relationid'];
    currentPublicKey = friends[uid]['info']['publickey'];
    console.log("now chat with " + uid);
    $("#chatbox").empty();
    loadChatHistory(uid);
    $("#main").attr("class", "main is-visible");
}

function loadChatHistory(uid) {
    // this function is to load last 20 chat history when change contact
    $.post("/api/gethistory.php", { "relation": friends[uid]['relationid'], "count": 0 }).then(function (response) {
        var chathistory = $.map(JSON.parse(response), function (_) { return _ }) // convert JSON to array
        chathistory.sort(timeascend).forEach(function (message) {
            decodeShowMessage(message);
        });
    })
}

function decodeShowMessage(message) {
    var time = new Date(parseInt(message['time']));
    var plaintext = "[Undecyptable message]";
    var result = cryptico.decrypt(message['sender'], mykey);
    var inner = 0;
    if (result.status == 'success') {
        // if i can decrypt sender, that means the message was sent by myself
        plaintext = result.plaintext;
    } else {
        // otherwise this is a message that i received
        result = cryptico.decrypt(message['receiver'], mykey);
        if (result.status == 'success') {
            plaintext = result.plaintext;
            inner = 1;
        }
    }
    if (message['type'] == "1") {
        $("#chatbox").append(showText(plaintext, time, inner));
    }
    
    document.getElementById("chatbody").scroll({ top: chatbody.scrollHeight });
}

function getPreviousChatHistory(uid, count) {
    // this is for when user scroll to the top, load previous chat history
}


////////////////////////////////////////////////////////////////////////
// test only functions

function encryptMessage(plaintext, publicKey) {
    var result = cryptico.encrypt(plaintext, publicKey);
    if (result.status == 'success') {
        console.log(result.cipher);
    } else {
        console.log("failed to encrypt");
    }
}

function decryptMessage(cipher) {
    var result = cryptico.decrypt(cipher, mykey);

}