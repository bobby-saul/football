$ = jQuery;

class Game {
    /**
     * Creates a Game object.
     * @param {object} players An object of players indexed by position in the game.
     */
    constructor(players) {
        this.players = players;
        this.quarter = 1;
        this.time = 15.0;
        this.ballOn = 20;
        this.down = 1;
        this.toGo = 10;
        this.controller = new Controller(players);
        this.inPlay = false;
        this.setUp = false;

        $(document).on("keydown", this.nonPlayEvent.bind(this));
        $(".nonplay-button").on("mousedown", this.nonPlayEvent.bind(this));

        $(document).on("mouseup", this.controller.keyUp.bind(this.controller));
        $(document).on("keyup", this.controller.keyUp.bind(this.controller));
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
                this.ballOn = this.ballOn + 1;
                this.toGo = this.toGo - 1;
            } else if (moved.key === "LEFT" && this.players.qb.direction === 1) {
                this.ballOn = this.ballOn + 1;
                this.toGo = this.toGo - 1;
            } else if (moved.key === "LEFT" && this.players.qb.direction === -1) {
                this.ballOn = this.ballOn - 1;
                this.toGo = this.toGo + 1;
            }
        } else if (moved.type === "ARROW" && moved.status === -1) {
            this.stopPlay();
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
                if (!this.setUp) {
                    this.setUpPlay();
                }
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
        this.inPlay = true;
    }

    /**
     * @description Function to stop the play.
     */
    stopPlay() {
        console.log("end play");
        this.controller.inPlay = false;
        this.inPlay = false;
        this.setUp = false;
        if (this.toGo < 1) {
            this.toGo = 10;
            this.down = 1
        } else if (this.down > 3){
            console.log("turnover");
            this.toGo = 10;
            this.down = 1;
        } else {
            this.down = this.down + 1;
        }

        $(document).off("keydown");
        $(".inplay-button").off("mousedown");
        $(document).on("keydown", this.nonPlayEvent.bind(this));
    }

    /**
     * @description Function to set up the next play.
     */
    setUpPlay() {
        var _this = this;
        _this.setUp = true;

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

        $("#down").text(_this.down);
        $("#toGo").text(_this.toGo);
        $("#fieldPosition").text(_this.ballOn);
        _this.controller.inPlay = true;
        _this.toGo = _this.toGo + 1;
        if (_this.direction === -1){
            _this.ballOn = _this.ballOn + 1;
        } else {
            _this.ballOn = _this.ballOn - 1;
        }

        $(document).off("keydown");
        $(".inplay-button").off("mousedown");
        $(document).on("keydown", _this.inPlayEvent.bind(this));
        $(".inplay-button").on("mousedown", _this.inPlayEvent.bind(this));
    }
}