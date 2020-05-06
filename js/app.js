// aframe event

AFRAME.registerComponent('show-view', {
    init: function() {
        document.querySelector('#ar-button').classList.remove('d-none');
        document.querySelector('#side-info').classList.remove('d-none');
    }
});

// exec when init
var input = document.querySelector('input');
input.value = document.URL;

let arBtn = document.querySelector('#ar-button');
arBtn.addEventListener('click', (el) => {
    playAudio();
    window.open('ar-view.html', '_self');
});

function playAudio() {
    let audio = document.querySelector('#model-audio');
    audio.play();
}

// Alert

function showAlertView() {
    setTimeout(() => {
        var alert = document.querySelector('#alert-popover');
        alert.style.display = 'inline-block';
    }, 1000);
}

function hideAlertView() {
    var alert = document.querySelector('#alert-popover');
    alert.style.display = 'none';

    let mainView = document.querySelector('#main-div');
    let aScene = document.querySelector('a-scene');
    mainView.classList.remove('blur-view');
    aScene.classList.remove('blur-view');

    let alertBackgound = document.querySelector('#alert-background');
    alertBackgound.classList.add('d-none');

    playAudio();
}

function copyLink() {
    var input = document.querySelector('input');
    input.value = document.URL;

    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        // for ios

        var oldContentEditable = input.contentEditable
        var oldReadOnly = input.readOnly;

        input.contentEditable = true;
        input.readOnly = false;

        var range = document.createRange();
        range.selectNodeContents(input);

        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        input.setSelectionRange(0, 999999);

        input.contentEditable = oldContentEditable
        input.readOnly = oldReadOnly;

    } else {
        // for other os

        input.select();

    }

    document.execCommand('copy');

    input.blur();

    var copyButton = document.querySelector('#button-copy-link');
    copyButton.className = "btn btn-success";
    copyButton.textContent = "已複製";
}