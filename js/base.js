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

var isPlaySound = false;

function togglePlaySound(el, supffix) {
    console.log("Play" + isPlaySound);

    let entities = document.querySelectorAll('[sound]');

    isPlaySound = !isPlaySound;

    if (isPlaySound == true) {

        var iconName = "btn-sound-play-" + supffix;

        el.style.backgroundImage = `url('img/${iconName}.png')`;

        entities.forEach((el) => {
            el.setAttribute('play-all-model-animations', { isPlaySound: true });
            el.components.sound.playSound();
        });

    } else {

        var iconName = "btn-sound-stop-" + supffix;

        el.style.backgroundImage = `url('img/${iconName}.png')`;

        entities.forEach((el) => {
            el.setAttribute('play-all-model-animations', { isPlaySound: false });
            el.components.sound.pauseSound();
        });

    }

}