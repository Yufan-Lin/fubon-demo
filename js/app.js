// aframe event

AFRAME.registerComponent('show-view', {
    init: function() {
        let shownViews = document.querySelectorAll('.shown-view');
        shownViews.forEach((el) => {
            el.classList.remove('d-none');
        });
    }
});

function openArDemo() {

    window.open('ar-view.html', '_self');
}

let model = document.querySelector('#female-model-left');
model.addEventListener('loopEnd', (e) => {
    console.log('Looppppp');
});

// exec when init
var input = document.querySelector('input');
input.value = document.URL;

let arBtn = document.querySelector('#ar-button');
arBtn.addEventListener('click', (el) => {
    playAudio();
    window.open('ar-view.html', '_self');
});

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

    let sound = document.querySelector('#model-audio');
    sound.play()
    sound.pause();
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

let models = document.querySelectorAll('.female-model');
let messageView = document.querySelector('#loading-view');
let warningView = document.querySelector('#warning-view');
var loadedCount = 0;
let voiceLaggingTime = 0.2;
var isFirstEnter = true;
var isPlaySound = false;

models.forEach((el) => {
    el.addEventListener('model-did-load', (e) => {

        let entity = e.detail.entity;

        console.log("count: " + loadedCount);

        if (loadedCount == 0) {

            entity.addEventListener('loop', (e) => {

                let sound = document.querySelector('#model-audio');

                if (isPlaySound) {

                    sound.currentTime = voiceLaggingTime;
                    sound.play();
                }
            });
        }
        loadedCount++;
        showModels();
        playAnimation();
    });
});

function isModelLoadingComplete() {

    if (models.length == loadedCount) {

        messageView.classList.add('d-none');

        return true

    } else {

        return false
    }
}

function showModels() {

    if (isModelLoadingComplete()) {

        models.forEach((el) => {
            el.setAttribute('visible', true);
        });

        showFeatureTools();

        let camera = document.querySelector('[orbit-controls]');
        camera.setAttribute('orbit-controls', "enabled: true;");
    }
}

function showFeatureTools() {

    let buttons = document.querySelector('#ar-button-area');
    buttons.classList.remove('d-none');
}

function showWarning() {

    warningView.classList.remove('d-none');
    loardingView.classList.add('d-none');
}

function playAnimation() {

    if (isModelLoadingComplete() == false) { return }

    models.forEach((el) => {

        el.components['play-all-model-animations'].playAnimation();
    });

}

function togglePlaySound(el, supffix, isDelayPlay) {

    if (isModelLoadingComplete() == false) return

    let sound = document.querySelector('#model-audio');

    let actionTime = models[0].components['play-all-model-animations'].getActionTime() + voiceLaggingTime;
    console.log('time: ' + actionTime);
    let loadingDelayTime = 1;

    isPlaySound = !isPlaySound;

    if (isPlaySound == true) {

        if (isFirstEnter && isDelayPlay) {

            let hidden = 'hide-view';

            sound.play();
            sound.currentTime = actionTime;
            sound.pause();

            let soundBtn = document.querySelector('#sound-btn');
            soundBtn.classList.add(hidden);

            let loader = document.querySelector('.loader');
            loader.classList.remove(hidden);

            setTimeout(() => {

                let soundBtn = document.querySelector('#sound-btn');
                soundBtn.classList.remove(hidden);

                let loader = document.querySelector('.loader');
                loader.classList.add(hidden);

                sound.play();
                sound.currentTime = actionTime + loadingDelayTime;

            }, loadingDelayTime * 1000);

            isFirstEnter = false;

        } else {

            sound.play();
            sound.currentTime = actionTime;
        }

        var iconName = "btn-sound-play-" + supffix;

        el.style.backgroundImage = `url('img/${iconName}.png')`;

    } else {

        sound.pause();
        sound.currentTime = 0;

        var iconName = "btn-sound-stop-" + supffix;

        el.style.backgroundImage = `url('img/${iconName}.png')`;
    }

}