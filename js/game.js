$ = jQuery;

class Game {
    /**
     * Creates a Game object.
     * @param {object} players An object of players indexed by position in the game.
     */
    constructor(players) {
        this.players = players;
        this.quarter = 1;
        this.time = 15.0.toFixed(1);
        this.timer;
        this.ballOn = 20;
        this.down = 1;
        this.toGo = 10;
        this.controller = new Controller(players);
        this.inPlay = false;
        this.setUp = false;
        this.score = {
            "home": 0,
            "visitors": 0
        };

        $(document).on("keydown", this.nonPlayEvent.bind(this));
        $(".nonplay-button").on("mousedown", this.nonPlayEvent.bind(this));

        $(document).on("mouseup", this.endEvent.bind(this));
        $(document).on("keyup", this.endEvent.bind(this));
    }

    /**
     * @description Resets the scoreboard and triggers the controller's key up function.
     * @param {Event} e 
     */
    endEvent(e) {
        this.controller.keyUp();
        $("#down").text("");
        $("#toGo").text("");
        $("#fieldPosition").text(this.time);
    }

    /**
     * @description Displays the current status of the game.
     */
    showStatus() {
        $("#down").text(this.down);
        if (this.toGo < 1) {
            $("#toGo").text("0");
        } else {
            $("#toGo").text(this.toGo);
        }
        if (this.ballOn < 50) {
            $("#fieldPosition").text("1- " + this.ballOn);
        } else if (this.ballOn > 50) {
            $("#fieldPosition").text((100 - this.ballOn) + " -1");
        } else {
            $("#fieldPosition").text(this.ballOn);
        }
        
        if (!this.setUp) {
            this.setUpPlay();
        }
    }

    /**
     * @description Displays the current score of the game.
     */
    showScore() {
        $("#down").text(this.score.home);
        $("#toGo").text(this.score.visitors);
        $("#fieldPosition").text("Q" +this.quarter);
    }

    /**
     * 
     * @description Adds seven points to the offense.
     */
    touchdown() {
        this.stopPlay();
        if (this.players.qb.direction === -1) {
            this.score.home += 7;
            this.players.qb.direction = 1;
            this.ballOn = 20;
            this.down = 1;
            this.toGo = 10;
        } else {
            this.score.visitors += 7;
            this.players.qb.direction = -1;
            this.ballOn = 80;
            this.down = 1;
            this.toGo = 10;
        }
    }

    /**
     * @description Adds two points to the defense.
     */
    safety() {
        if (this.players.qb.direction === -1) {
            this.score.visitors += 2;
            this.players.qb.direction = 1;
            this.ballOn = 20;
            this.down = 1;
            this.toGo = 10;
        } else {
            this.score.home += 2;
            this.players.qb.direction = -1;
            this.ballOn = 80;
            this.down = 1;
            this.toGo = 10;
        }
    }

    /**
     * @description Function to determind whether to send event to controller if currently in a play.
     * @param {Event} e The event.
     */
    inPlayEvent(e) {
        if (typeof e.key === "undefined") {
            e.key = $(e.currentTarget).attr("data-button-type");
        }
        var moved = this.controller.keyDown(e);
        if (moved.type === "ARROW" && moved.status === 1) {
            if (!this.inPlay) {
                this.startPlay();
            }
            if (moved.key === "RIGHT" && this.players.qb.direction === 1) {
                this.ballOn = this.ballOn - 1;
                this.toGo = this.toGo + 1;
            } else if (moved.key === "RIGHT" && this.players.qb.direction === -1) {
                this.ballOn = this.ballOn - 1;
                this.toGo = this.toGo - 1;
                if (this.ballOn < 1) {
                    this.touchdown();
                }
            } else if (moved.key === "LEFT" && this.players.qb.direction === 1) {
                this.ballOn = this.ballOn + 1;
                this.toGo = this.toGo - 1;
                if (this.ballOn > 99) {
                    this.touchdown();
                }
            } else if (moved.key === "LEFT" && this.players.qb.direction === -1) {
                this.ballOn = this.ballOn + 1;
                this.toGo = this.toGo + 1;
            }
        } else if (moved.type === "ARROW" && moved.status === -1) {
            if (!this.inPlay) {
                this.startPlay();
            }
            this.stopPlay();
        } else if (moved.key === "STATUS") {
            this.showStatus();
        } else if (moved.key === "SCORE") {
            this.showScore();
        }
    }

    /**
     * @description Function to determind whether to send event to controller if not currently in a play.
     * @param {Event} e The event.
     */
    nonPlayEvent(e) {
        if (typeof e.key === "undefined") {
            e.key = $(e.currentTarget).attr("data-button-type");
        }
        var event = this.controller.keyDown(e);
        switch (event.key) {
            case "STATUS":
                this.showStatus();
                break;
            case "SCORE":
                this.showScore();
                break;
            default: 
                console.log(event);
                break;
        }
    }

    /**
     * @description Function to starts the play.
     */
    startPlay() {
        console.log("start play");
        this.toGo = this.toGo + 1;
        this.timer = setInterval(this.runClock.bind(this), 1000);
        this.inPlay = true;
        if (this.players.qb.direction === 1) {
            this.ballOn = this.ballOn - 1;
        } else {
            this.ballOn = this.ballOn + 1;
        }
    }

    /**
     * @description Function to stop the play.
     */
    stopPlay() {
        console.log("end play");
        clearInterval(this.timer);
        this.controller.inPlay = false;
        this.inPlay = false;
        this.setUp = false;

        $(document).off("keydown");
        $(".inplay-button").off("mousedown");
        $(document).on("keydown", this.nonPlayEvent.bind(this));

        if (this.ballOn < 1 && this.players.qb.direction === 1) {
            this.safety();
            return;
        } else if (this.ballOn > 99 && this.players.qb.direction === -1) {
            this.safety();
            return;
        }

        if (this.toGo < 1) {
            if (this.players.qb.direction === 1 && this.ballOn > 90) {
                this.toGo = 100 - this.ballOn;
            } else if (this.players.qb.direction === -1 && this.ballOn < 10) {
                this.toGo = this.ballOn;
            } else {
                this.toGo = 10;
            }
            this.down = 1
        } else if (this.down > 3){
            console.log("turnover");
            this.players.qb.changeDirection();
            this.toGo = 10;
            this.down = 1;
        } else {
            this.down = this.down + 1;
        }
    }

    /**
     * @description Starts running the game clock.
     */
    runClock () {
        this.time = (this.time - 0.1).toFixed(1);
        if (!this.controller.keydown) {
            $("#fieldPosition").text(this.time);
        }
        if (this.time < 0.1) {
            console.log("Time is out!");
            clearInterval(this.timer);
        }
    }

    /**
     * @description Function to set up the next play.
     */
    setUpPlay() {
        var _this = this;
        _this.setUp = true;
        _this.controller.inPlay = true;

        if (_this.players.qb.direction === -1){
            _this.players.qb.setScreen(3,2);
            _this.players.qb.turnOn();

            // _this.players.d1.setScreen(4,1);
            // _this.players.d1.turnOn();
            _this.players.d2.setScreen(4,2);
            _this.players.d2.turnOn();
            _this.players.d3.setScreen(4,3);
            _this.players.d3.turnOn();
            _this.players.d4.setScreen(6,2);
            _this.players.d4.turnOn();
            _this.players.d5.setScreen(8,1);
            _this.players.d5.turnOn();
            _this.players.d6.setScreen(10,3);
            _this.players.d6.turnOn();
        } else {
            _this.players.qb.setScreen(8,2);
            _this.players.qb.turnOn();

            // _this.players.d1.setScreen(7,1);
            // _this.players.d1.turnOn();
            _this.players.d2.setScreen(7,2);
            _this.players.d2.turnOn();
            _this.players.d3.setScreen(7,3);
            _this.players.d3.turnOn();
            _this.players.d4.setScreen(5,2);
            _this.players.d4.turnOn();
            _this.players.d5.setScreen(3,1);
            _this.players.d5.turnOn();
            _this.players.d6.setScreen(1,3);
            _this.players.d6.turnOn();
        }

        if (_this.time < 0.1) {
            _this.quarter = _this.quarter + 1;
            _this.time = 15.0.toFixed(1);
        }

        $(document).off("keydown");
        $(".inplay-button").off("mousedown");
        $(document).on("keydown", _this.inPlayEvent.bind(this));
        $(".inplay-button").on("mousedown", _this.inPlayEvent.bind(this));
    }
}