"use strict";

// hide local variables scope
(function()
{
	// jQuery-style notation
	var $ = function (a) { return document.getElementById(a);}

	function errorF() { alert("Request Error. Check internet connection and try again"); }
    function timeoutF() { alert("Request Timeout. Check internet connection and try again"); }
    function logF(jsontest) { alert(jsontest); }
    function appendLogF(jsontest) { $("log").appendChild(document.createTextNode(jsontest)); }
    function setText(nodeName, text)
    {
        if ($(nodeName).childNodes.length > 0)
        {
            $(nodeName).replaceChild(document.createTextNode(text), $(nodeName).childNodes[0] );
        }
        else
        {
            $(nodeName).appendChild(document.createTextNode(text));
        }
    }
    function hide(el) { $(el).style.display="none"; }
    function show(el) { $(el).style.display="inline"; }
 
    // Function to POST JSON queries
    function postJSON(url, obj_to_send, responseF, errorF, timeoutF)
    {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function()
        {
            if (xmlhttp.readyState != 4) return;
            clearTimeout(timeout); // cancel timeout object
            if (xmlhttp.status == 200) responseF( xmlhttp.responseText ); else errorF();
        };
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var timeout = setTimeout( function () {xmlhttp.abort(); timeoutF();}, 10000); // 10 sec timeout
        xmlhttp.send("json="+encodeURIComponent(JSON.stringify(obj_to_send)));
    }
	
    var myitems = [];
	
	$("buybutton").onclick = function()
	{
		$('dialogprice').innerHTML = calculatePrice()[0].toFixed(2);
		$('buydialog').style.display='block';
	}
 
 
    $("login").onclick = function()
    {
        $('logindialog').style.display='block';
    }
 
    $("checkcookiebutton").onclick = function()
    {
        postJSON("checkcookie.php", "", logF, errorF, timeoutF);
    }
 
 
    $("showregisterdialog").onclick = function()
    {
        $('logindialog').style.display='none';
        $('registerdialog').style.display='block';
    }
 
    $("reg_verpass").oninput = function()
    {
        $("reg_verpass").setCustomValidity($("reg_verpass").value === $("reg_pass").value ? "" : "Passwords do not match");
    }
 
    $("loginbutton").onclick = function()
    {
        var log_request = { log_email:$("log_email").value,
                            log_pass:$("log_pass").value   };
 
        postJSON("login.php", log_request,
            function(js)
            {
                alert(js);
                var resp = JSON.parse(js);
                if (resp.error == 0)
                {
                    setText('registration', "Logged in as " + resp.user);
                    show("signout");
                    hide("login");
                    hide("logindialog");
                }
                else
                {
                    alert("Login failed");
                }
            }, errorF, timeoutF);
    }
 
    // verify session
    function verifysession()
    {
        postJSON("checksession.php", "",
            function(js)
            {
                alert(js);
                var resp = JSON.parse(js);
                if (resp.error == 0)
                {
                    setText("registration", "Logged in as " + resp.user);
                    show("signout");
                    hide("login");
                }
                else
                {
                    setText("registration", "");
                    hide("signout");
                    show("login");
                }
            }
            , errorF, timeoutF);
    }
 
    verifysession();
 
 
    $("checksession").onclick = function()
    {
        verifysession()
    }
 
    $("signout").onclick = function()
    {
        postJSON("signout.php", "",
        function(js)
        {
            alert(js);
            var resp = JSON.parse(js);
            if (resp.error == 0)
            {
                setText("registration", "");
                hide("signout");
                show("login");
            }
        }, errorF, timeoutF);
    }
 
    $("register").onclick = function()
    {
        var reg_request = { reg_first:$("reg_first").value,
                            reg_last:$("reg_last").value,
                            reg_email:$("reg_email").value,
                            reg_pass:$("reg_pass").value   };
 
        postJSON("register.php", reg_request,
            function(js)
            {
                alert(js);
                var resp = JSON.parse(js);
                if (resp.error == 0)
                {
                    setText('registration', "Logged in as " + resp.user);
                    show("signout");
                    hide("login");
                    hide("registerdialog");
                }
            }, errorF, timeoutF);
    }
	
	function w3_open() {
        document.getElementsByClassName("w3-sidenav")[0].style.display = "block";
        document.getElementsByClassName("w3-overlay")[0].style.display = "block";
    }

    function w3_close() {
        document.getElementsByClassName("w3-sidenav")[0].style.display = "none";
        document.getElementsByClassName("w3-overlay")[0].style.display = "none";
    }
	
    function updateContentF(jsontext)
    {
		if (jsontext) myitems = JSON.parse(jsontext);
				
        var itemcontainer = $("itemcontainer");
        itemcontainer.innerHTML = '<hr>';


    for(var i in myitems)
    {
        var item = myitems[i];

        if(item.href == "#") {
            itemcontainer.innerHTML += '<div class="w3-col">' +
                '<h2>' +
                item.name;

            +'</h2>';
            if (item.foto == 1) itemcontainer.innerHTML += '<div class="w3-round-jumbo w3-tag w3-red" h2>ФОТО</div></h2>';
            itemcontainer.innerHTML += '<br>' + item.desc + '<hr>' +
                '</div>';
        }
        else {
            itemcontainer.innerHTML += '<div class="w3-col">' +
                '<h2><a href="' + item.href + '">' +
                item.name;

            +'</h2></a>';
            if (item.foto == 1) itemcontainer.innerHTML += '<div class="w3-round-jumbo w3-tag w3-red" h2>ФОТО</div></h2>';
            itemcontainer.innerHTML += '<br>' + item.desc + '<hr>' +
                '</div>';
        }
    }
        selectionChangeF();
	}
	
    // loading shop items
    postJSON("index.php", "", updateContentF, errorF, timeoutF);
	
})();