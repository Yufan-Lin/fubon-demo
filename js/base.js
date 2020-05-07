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
}

let models = document.querySelectorAll('.female-model');

var loadedCount = 0;

let voiceLaggingTime = 0.2;

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

var isPlaySound = false;

function togglePlaySound(el, supffix) {
    console.log("Play" + isPlaySound);

    let sound = document.querySelector('#model-audio');

    let actionTime = models[0].components['play-all-model-animations'].getActionTime() + voiceLaggingTime;
    console.log('time: ' + actionTime);

    isPlaySound = !isPlaySound;

    if (isPlaySound == true) {

        sound.play();
        sound.currentTime = actionTime;

        var iconName = "btn-sound-play-" + supffix;

        el.style.backgroundImage = `url('img/${iconName}.png')`;

    } else {

        sound.pause();
        sound.currentTime = 0;

        var iconName = "btn-sound-stop-" + supffix;

        el.style.backgroundImage = `url('img/${iconName}.png')`;
    }

}