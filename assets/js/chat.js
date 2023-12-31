$(document).ready(function () {
    // initialize variables
    myinfo = JSON.parse(localStorage.getItem('info'));
    mykey = deserializeRSAKey(localStorage.getItem('key'));
    myPublicKey = cryptico.publicKeyString(mykey);
    $.post("/api/getfriend.php").then(function (response) {
        friends = JSON.parse(response);
        friendsArr = $.map(JSON.parse(response), function (_) { return _ });
        friendsArr.sort(timedescend).forEach(function (friend) {
            showChatCard(friend);
        });
        friends
    })
    loadMyInfo();
    loadAvatar();
    currentUser = -1;
    currentRelation = -1;
    currentPublicKey = "";
    currentLastMessageId = 0;
    getNewMessageIntervalId = 0;
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
    if (currentUser == -1 || currentRelation == -1 || currentRelation == "") {
        // have not select user to chat with
        return;
    }
    var plaintext = $.trim(document.getElementById("myMessage").value);
    if (plaintext != "") {
        uploadMessage(plaintext, 1);
        $("#myMessage").val("");
        document.getElementById("myMessage").style.height = "47px";
    } else {
        return;
    }
}

function encryptMessage(plaintext) {
    var ciphertext = cryptico.encrypt(encodeURI(plaintext), publicKey);
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

function htmlNewText(text, timestamp, inner) {
    // XSS protection when display text
    text = escapeHTML(text);

    var $newMessage = $('<div"></div>');
    $newMessage.attr('class', inner ? 'message' : 'message message-out');

    // setup avatar
    var $avatar = $('<a href="#" data-bs-toggle="modal" class="avatar avatar-responsive"></a>');
    $avatar.attr('data-bs-target', inner ? "#modal-user-profile" : "#modal-profile");
    var $avatarImg = inner ? getAvatarHtml(friends[currentUser]['info']) : getAvatarHtml(myinfo);
    //$avatarImg.attr('src', inner ? "assets/img/avatars/2.jpg" : "assets/img/avatars/1.jpg");
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

function showChatCard(friend) {
    var $card = $('<a href="#" class="card border-0 text-reset" onclick="selectContact(' + friend["info"]["uid"] + ');"></a>');
    var $cardBody = $('<div class="card-body"></div>');
    var $row = $('<div class="row gx-5"></div>');
    var $avatarCol = $('<div class="col-auto"></div>');
    var $avatar = $('<div class="avatar"></div>');
    var $avatarimg = getAvatarHtml(friend['info']);
    $avatar.append($avatarimg);
    $avatarCol.append($avatar);
    $row.append($avatarCol);

    var $infoCol = $('<div class="col"></div>');
    var $contactInfo = $('<div class="d-flex align-items-center mb-3"></div>');
    var $name = $('<h5 class="me-auto mb-0">' + getDisplayName(friend['info']) + '</h5>');
    var $time = $('<span class="text-muted extra-small ms-2 last-chat-time">' + timeToString(new Date(parseInt(friend['time']))) + '</span>')
    $contactInfo.append($name);
    $contactInfo.append($time);

    var plaintext = "[Undecryptable message]";
    if (friend['message']['type'] !== null) {
        var result = cryptico.decrypt(friend['message']['sender'], mykey);
        if (result.status == 'success') {
            // if i can decrypt sender, that means the message was sent by myself
            plaintext = "You: " + decodeURI(result.plaintext);
        } else {
            // otherwise this is a message that i received
            result = cryptico.decrypt(friend['message']['receiver'], mykey);
            if (result.status == 'success') {
                plaintext = decodeURI(result.plaintext);
            }
        }
    } else {
        plaintext = "[No message]";
    }


    var $message = $('<div class="d-flex align-items-center"> \
            <div class="line-clamp me-auto last-chat-message">'+ plaintext + ' \
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

function getAvatarHtml(info) {
    if (info["avatar"] == null) {
        $avatarHtml = $('<span class="avatar-text">' + getDisplayName(info).charAt(0) + '</span>');
    } else {
        $avatarHtml = $('<img alt="#" class="avatar-img">');
        var src = "/upload/img/avatar/" + info["avatar"];
        $avatarHtml.attr('src', src);
    }
    return $avatarHtml;
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
    $("#main").attr("class", "main is-visible");
    if (uid == currentUser) {
        return;
    }
    currentUser = uid;
    currentRelation = friends[uid]['relationid'];
    currentPublicKey = friends[uid]['info']['publickey'];
    console.log("now chat with " + uid);
    $("#chatbox").empty();
    $("#currentContactName").text(getDisplayName(friends[uid]['info']));
    $("#currentContactAvatar").empty();
    $("#currentContactAvatar").append(getAvatarHtml(friends[uid]['info']));
    $("#currentContactAvatarSm").empty();
    $("#currentContactAvatarSm").append(getAvatarHtml(friends[uid]['info']));
    $("#currentcontactprofileavatar").empty();
    $("#currentcontactprofileavatar").append(getAvatarHtml(friends[uid]['info']));
    loadChatHistory(uid);
    if (getNewMessageIntervalId == 0) {
        getNewMessageIntervalId = setInterval("retrieveNewMessage()", 1000);
    }
    $("#currentcontactprofileemail").text(friends[uid]['info']['email']);
    $("#currentcontactprofilephone").text(friends[uid]['info']['phone']);
    $("#currentcontactprofilename").text(getDisplayName(friends[uid]['info']));
    $("#currentcontactprofileuname").text(friends[uid]['info']['uname']);
}

function loadChatHistory(uid) {
    // this function is to load last 20 chat history when change contact
    $.post("/api/gethistory.php", { "relation": friends[uid]['relationid'] }).then(function (response) {
        var chathistory = $.map(JSON.parse(response), function (_) { return _ }) // convert JSON to array
        $("#emptyNotify").removeAttr("hidden");
        $("#emptyMessage").text("No chat history");
        chathistory.sort(timeascend).forEach(function (message) {
            decodeShowMessage(message);
        });
        document.getElementById("chatbody").scroll({ top: chatbody.scrollHeight });
    })
}

function decodeShowMessage(message) {
    $("#emptyNotify").prop("hidden", "hidden");
    var time = new Date(parseInt(message['time']));
    var plaintext = "[Undecyptable message]";
    var result = cryptico.decrypt(message['sender'], mykey);
    var inner = 0;
    currentLastMessageId = message['chatid'];
    if (result.status == 'success') {
        // if i can decrypt sender, that means the message was sent by myself
        plaintext = decodeURI(result.plaintext);
    } else {
        // otherwise this is a message that i received
        result = cryptico.decrypt(message['receiver'], mykey);
        if (result.status == 'success') {
            plaintext = decodeURI(result.plaintext);
            inner = 1;
        }
    }
    if (message['type'] == "1") {
        $("#chatbox").append(htmlNewText(plaintext, time, inner));
    }
}

function getPreviousChatHistory(uid, count) {
    // this is for when user scroll to the top, load previous chat history
}

function uploadMessage(plaintext, type) {
    currentPublicKey
    currentRelation

    var sender = "";
    var receiver = "";
    var senderresult = cryptico.encrypt(encodeURI(plaintext), myPublicKey);
    var receiverresult = cryptico.encrypt(encodeURI(plaintext), currentPublicKey);
    if (senderresult.status == 'success' && receiverresult.status == 'success') {
        console.log("encrypt success");
        sender = senderresult.cipher;
        receiver = receiverresult.cipher;

        $.post("/api/send.php", { "relation": currentRelation, "type": type, "sender": sender, "receiver": receiver }).then(function (response) {
            var sendresult = JSON.parse(response);
            if (sendresult['status'] == 'success') {
                currentLastMessageId = sendresult['id']
                console.log("send success");
                $("#chatbox").append(htmlNewText(plaintext, new Date(), 0));
                $("#emptyNotify").prop("hidden", "hidden");
                document.getElementById("chatbody").scroll({ top: chatbody.scrollHeight, behavior: 'smooth' });
            }
        })
    } else {
        alert("Something goes wrong, please reload the page.")
    }
}

function retrieveNewMessage() {
    // this function is to load last 20 chat history when change contact
    $.post("/api/getnewmessage.php", { "relation": friends[currentUser]['relationid'], "lastmessage": currentLastMessageId }).then(function (response) {
        var chathistory = $.map(JSON.parse(response), function (_) { return _ }) // convert JSON to array and sort, incase there are multiple messages received
        chathistory.sort(timeascend).forEach(function (message) {
            // new message received
            decodeShowMessage(message);
            document.getElementById("chatbody").scroll({ top: chatbody.scrollHeight, behavior: 'smooth' });
        });
    })
}

function uploadAvatar() {
    var formData = new FormData();
    formData.append('image', $('#upload-profile-photo')[0].files[0]);
    $.ajax({
        url: "/api/uploadavatar.php",
        data: formData,
        type: "POST",
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response["status"] == "success") {
                myinfo['avatar'] = response["avatar"];
                localStorage.setItem("info", JSON.stringify(myinfo));
                loadAvatar()  // reload my avatar
            }
        },
        failure: function (res) {
            alert("Error uploading avatar");
        }
    })
}

function loadAvatar() {
    var avatarlistbyid = ["#myAvatarSm", "#navbar-avatar-desktop", "#navbar-avatar-mobile", "#myprofileavatar", "#settings-avatar"];
    avatarlistbyid.forEach(function (avatarid) {
        $(avatarid).empty();
        $(avatarid).append(getAvatarHtml(myinfo));
    });
}

function loadMyInfo() {
    $("#myprofileemail").text(myinfo['email']);
    $("#myprofilephone").text(myinfo['phone']);
    $("#myprofilename").text(getDisplayName(myinfo));
    $("#myprofileuname").text(myinfo['uname']);
    $("#settings-name").text(getDisplayName(myinfo));
    $("#settings-email").text(myinfo['email']);
    $("#profile-uname").val(myinfo['uname']);
    $("#profile-name").val(myinfo['name']);
    $("#profile-email").val(myinfo['email']);
    $("#profile-phone").val(myinfo['phone']);
}

function updateinfo() {
    if (checkEmail() && checkPhone()) {
        var uname = $("#profile-uname").val();
        var name = $("#profile-name").val();
        var email = $("#profile-email").val();
        var phone = $("#profile-phone").val();

        $.post("/api/updateinfo.php", { uname: uname, name: name, email: email, phone: phone }).then(function (response) {
            r = JSON.parse(response);
            if (r["success"]) {
                // update my info
                myinfo["uname"] = uname;
                myinfo["name"] = name;
                myinfo["email"] = email;
                myinfo["phone"] = phone;
                localStorage.setItem("info", JSON.stringify(myinfo));
                loadMyInfo();
            } else {
                alert(r["error"]);
            }
        })
    }
}

function checkEmail() {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var input = document.getElementById("profile-email").value;
    if (input.match(validRegex)) {
        $("#profile-email").removeClass("is-invalid");
        return true;
    } else {
        $("#profile-email").addClass("is-invalid");
        return false;
    }
}

function checkPhone() {
    var validRegex = /^[0-9]{9,10}$/;
    var input = document.getElementById("profile-phone").value;
    if (input.match(validRegex) || input == "") {
        $("#profile-phone").removeClass("is-invalid");
        return true;
    } else {
        $("#profile-phone").addClass("is-invalid");
        return false;
    }
}

function signout() {
    $.post("/api/signout.php").then(function (response) {
        r = JSON.parse(response);
        if (r["success"]) {
            localStorage.clear();
            window.location.replace("/signin.html");
        } else {
            alert(r["Please try again or refresh the webpage"]);
        }
    })
}