window.addEventListener("load", () => {

    let models = document.querySelectorAll('.female-model');

    window.addEventListener('arjs-video-loaded', (e) => {

        isCameraReady = true;

        showModels();

        hideMainDiv();
    });

    window.addEventListener('camera-error', (e) => {

        isCameraReady = false;

        models.forEach((el) => {
            el.setAttribute('visible', false);
        });

        showWarning();
    });

}, false);

function hideMainDiv() {

    let mainView = document.querySelector('#main-div');
    mainView.classList.add('d-none');
}

let models = document.querySelectorAll('.female-model');
let messageView = document.querySelector('#loading-view');
let warningView = document.querySelector('#warning-view');
var loadedCount = 0;
let voiceLaggingTime = 0.2;
var isFirstEnter = true;
var isPlaySound = false;
var isCameraReady = false;

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

    if (isModelLoadingComplete() && isCameraReady) {

        models.forEach((el) => {
            el.setAttribute('visible', true);
        });

        showFeatureTools();

        let camera = document.querySelector('[orbit-controls]');
        camera.setAttribute('orbit-controls', "enabled: true;");
    }
}

function showFeatureTools() {

    let buttons = document.querySelector('.buttons');
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