class SoundController {

    /**
     * @description Creates a sound controller for the game.
     * @param {boolean} sound Whether to play music or not.
     * @param {boolean} vibrate Whether to vibrate or not.
     */
    constructor(sound, vibrate) {
        this.sound = sound;
        this.vibrate = vibrate;
        this.sounds = {
            "one_tone": new Audio("./audio/one_tone.mp3"),
            "two_tones": new Audio("./audio/two_tones.mp3"),
            "one_whistle": new Audio("./audio/one_whistle.mp3"),
            "two_whistles": new Audio("./audio/two_whistles.mp3"),
            "charge": new Audio("./audio/charge.mp3"),
            "crowd": new Audio("./audio/crowd.mp3"),
            "short_beep": new Audio("./audio/short_beep.mp3"),
            "buzzer": new Audio("./audio/buzzer.mp3")
        };
        this.vibrates = {
            "one_tone": [225],
            "two_tones": [225, 150, 225],
            "one_whistle": [225],
            "two_whistles": [200, 150, 200],
            "charge": [225, 50, 225, 50, 225, 50, 275, 100, 100, 50, 300],
            "crowd": [450, 100, 450],
            "short_beep": [50],
            "buzzer": [225]
        }
    }

    /**
     * @description Plays the sound and vibrates if allowed.
     * @param {String} sound The name of sound to play.
     */
    play(sound) {
        if (this.sound) {
            this.sounds[sound].currentTime = 0;
            this.sounds[sound].play();
        }
        if (this.vibrate) {
            window.navigator.vibrate(this.vibrates[sound]);
        }
    }
}
