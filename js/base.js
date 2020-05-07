window.onload = () => {
    document.addEventListener('touchstart', (event) => {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    let sound = document.querySelector('#model-audio');
    sound.play();
    sound.pause();
}

let models = document.querySelectorAll('.female-model');
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
        playAnimation();
    });
});

function playAnimation() {

    if (loadedCount < models.length) return

    models.forEach((el) => {

        el.components['play-all-model-animations'].playAnimation();
    });

}

function togglePlaySound(el, supffix, isDelayPlay) {
    console.log("Play" + isPlaySound);

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