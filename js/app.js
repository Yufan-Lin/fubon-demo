// aframe event

AFRAME.registerComponent('show-view', {
    init: function() {
        let shownViews = document.querySelectorAll('.shown-view');
        shownViews.forEach((el) => {
            el.classList.remove('d-none');
        });
    }
});

AFRAME.registerComponent('audio-player', {
    schema: {
        target: { type: 'string', default: '' }
    },

    init: function() {
        this.model = null;
        this.mixer = null;

        var model = this.el.getObject3D('mesh');
        if (model) {
            this.load(model);
        } else {
            this.el.addEventListener('model-loaded', function(e) {
                this.load(e.detail.model);
            }.bind(this));
        }
    },

    load: function(model) {
        this.model = model;
        this.mixer = new THREE.AnimationMixer(model);
        this.mixer.addEventListener('loop', () => {
            console.log("sound!!!");
            let sound = document.querySelector(this.data.target);
            sound.play();
        });
    }
});

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

function playAudio() {
    let entities = document.querySelectorAll('[sound]');
    entities.forEach((el) => {
        el.components.sound.stopSound();
        el.components.sound.playSound();
    });

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

    // playAudio();
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