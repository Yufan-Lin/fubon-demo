/* global AFRAME, THREE */

/**
 * Player for animation clips. Intended to be compatible with any model format that supports
 * skeletal or morph animations.
 */
AFRAME.registerComponent('play-all-model-animations', {

    schema: {
        isPlaySound: { type: "boolean", default: false }
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
        this.model.animations.forEach(animation => {
            var action = this.mixer.clipAction(animation, model);
            this.action = action;
            action.paused = true;
            action.play();
        });

        this.mixer.addEventListener('loop', function(e) {

            this.el.emit('loop');

        }.bind(this));

        this.el.emit('model-did-load', { entity: this.el });
    },

    tick: function(t, dt) {
        if (this.mixer && !isNaN(dt)) {
            this.mixer.update(dt / 1000);
        }
    },

    playAnimation: function() {
        this.model.animations.forEach(animation => {
            var action = this.mixer.clipAction(animation, this.model);
            action.paused = false;
            action.play();
        });
    },

    getActionTime: function() {

        return this.action.time
    }

});