"use strict";

window.onerror = function (message, url, line, col, err) {
	console.log(message, url, line, col, err);
}

function $(id) {
	return document.getElementById(id);
}

function $$(selectors) {
	return document.querySelectorAll(selectors);
}

var config = {};

function overlay_app() {

    if (window.location.hash) {
        var hash = window.location.hash;

        try {
            hash = hash.substring(1);
            config = JSON.parse(hash);
        } catch {
            config = JSON.parse(decodeURI(hash));
        }
    }

    if (config.drag) {
        dragElement($('notification'));
        dragElement($('scoreboard'));
        dragElement($('events'));
    }

}

function updateConfig() {
    window.location.hash = '#' + JSON.stringify(config);
}

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

    if (document.getElementById(elmnt.id + "header")) {
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {

        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;

        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {

        document.onmouseup = null;
        document.onmousemove = null;
    }
}

this.addEventListener('load', overlay_app);