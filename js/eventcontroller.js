class EventController {
    /**
     * Creates a EventController object to play the football game.
     * @param {object} players An object of players indexed by position in the game.
     */
    constructor (players) {
        this.players = players;
        this.qb = players.qb;
        this.keys = {
            "score": 65,
            "status": 83,
            "kick": 68,
            "pass": 32,
            "up": 38,
            "down": 40,
            "left": 37,
            "right": 39,
            "settings": 27
        };
        this.settingsOpen = true;
        this.keydown = false;
        this.game;

        $(".setting-form-wrapper input").on("keydown", this.changeKey.bind(this));
        $("#new-game-button").on("click", this.startGame.bind(this));
        $("#resume-game-button").on("click", this.resumeGame.bind(this));

        $(document).on("keydown", this.emitEvent.bind(this));
        $("button").on("mousedown", this.emitEvent.bind(this));
        $(document).on("mouseup", this.keyUp.bind(this));
        $(document).on("keyup", this.keyUp.bind(this));
    }

    /**
     * @description Changes the key code for the event.
     * @param {Event} e The event of the input change.
     */
    changeKey(e) {
        if (e.keyCode === 9 || e.keyCode === 16) {
            return true;
        }
        var key = $(e.target).attr("data-key");
        this.keys[key] = e.keyCode;
        $(e.target).val(e.key.replace(" ", "SPACE").toUpperCase());
        return false;
    }

    /**
     * @description Starts the game.
     */
    startGame() {
        if (typeof this.game !== "undefined") {
            this.game.clearGame();
        }
        $(".open-settings").removeClass("open-settings");
        this.settingsOpen = false;
        this.game = new GameController(this.players);
        this.game.startGame();
    }

    /**
     * @description Resumes the game.
     */
    resumeGame() {
        $(".open-settings").removeClass("open-settings");
        this.settingsOpen = false;
    }

    /**
     * @description Opens the setting menu.
     */
    openSettings() {
        this.settingsOpen = true;
        $("body").addClass("open-settings");
    }

    /**
     * @description Processed clicks and keypresses.
     * @param {Event} e The event of a key press or button click.
     */
    emitEvent(e) {
        var event;
        if (this.keydown || this.settingsOpen) {
            return;
        }
        this.keydown = true;
        if (typeof e.keyCode === "undefined") {
            event = $(e.currentTarget).attr("data-button-type");
            if (event === "SETTINGS") {
                this.openSettings();
            }
        } else {
            switch (e.keyCode) {
                case this.keys.up:
                case "UP":
                    event = "UP";
                    break;
                case this.keys.down:
                case "DOWN":
                    event = "DOWN";
                    break;
                case this.keys.right:
                case "RIGHT":
                    event = "RIGHT";
                    break;
                case this.keys.left:
                case "LEFT":
                    event = "LEFT";
                    break;
                case this.keys.kick:
                case "KICK":
                    event = "KICK";
                    break;
                case this.keys.pass:
                case "PASS":
                    event = "PASS";
                    break;
                case this.keys.status:
                case "STATUS":
                    event = "STATUS";
                    break;
                case this.keys.score:
                case "SCORE":
                    event = "SCORE";
                    break;
                case this.keys.settings:
                case "SETTINGS":
                    this.openSettings();
                    event = "SETTINGS";
                    break;
                default:
                    event = "UNDEFINED";
                    break;
            }
        }
        if(typeof this.game !== "undefined") {
            this.game.triggerEvent(event);
        }
    }

    /**
     * @description Unlocks the controller when a key or mouse is released.
     */
    keyUp() {
        this.keydown = false;
        if (typeof this.game !== "undefined") {
            this.game.defaultScoreboard();
        }
    }
}
