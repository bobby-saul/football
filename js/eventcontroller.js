class EventController {
    /**
     * Creates a EventController object to play the football game.
     * @param {object} players An object of players indexed by position in the game.
     */
    constructor (players) {
        this.players = players;
        this.qb = players.qb;
        this.keys = {
            "score": "A",
            "status": "S",
            "kick": "D",
            "pass": " ",
            "up": "ARROWUP",
            "down": "ARROWDOWN",
            "left": "ARROWLEFT",
            "right": "ARROWRIGHT",
        };
        this.keydown = false;
        this.game;

        $(document).on("keydown", this.emitEvent.bind(this));
        $("button").on("mousedown", this.emitEvent.bind(this));
        $(document).on("mouseup", this.keyUp.bind(this));
        $(document).on("keyup", this.keyUp.bind(this));
    }

    startGame() {
        this.game = new GameController(this.players);
        this.game.startGame();
    }

    /**
     * @description Processed clicks and keypresses.
     * @param {Event} e The event of a key press or button click.
     */
    emitEvent(e) {
        var event;
        if (this.keydown) {
            return;
        }
        this.keydown = true;
        if (typeof e.key === "undefined") {
            event = $(e.currentTarget).attr("data-button-type");
        } else {
            switch (e.key.toUpperCase()) {
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
        this.game.defaultScoreboard();
    }
}
