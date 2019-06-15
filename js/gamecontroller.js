$ = jQuery;

class GameController {
    /**
     * Creates a GameController object.
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
        this.scoreboard = "default";
        this.inPlay = false;
        this.setUp = false;
        this.kickoffSetUp = false;
        this.kickoff = false;
        this.kicking = false;
        this.returning = false;
        this.score = {
            "home": 0,
            "visitors": 0
        };
        this.isTouchdown = false;
    }

    /**
     * @description Returns the player at the position.
     * @param {int} col The column to get the player at.
     * @param {int} row The row to get the player at.
     * @returns {Player} Returns the player at the position or false if no player.
     */
    getPlayerAt(col, row) {
        for (var player in this.players) {
            if (this.players[player].col === col && this.players[player].row === row && this.players[player].onField) {
                return this.players[player];
            }
        }
        return false;
    }

    /**
     * @description Turns off every player.
     */
    clearField() {
        for (var player in this.players) {
            this.players[player].turnOff();
            this.players[player].setBlink("off");
        }
    }

    /**
     * @description Starts a new game.
     */
    startGame() {
        this.players.qb.direction = -1;
        this.quarter = 1;
        this.time = 15.0.toFixed(1);
        this.ballOn = 65;
        this.down = 1;
        this.toGo = 10;
        this.inPlay = false;
        this.setUp = false;
        this.kickoffSetUp = false;
        this.kickoff = true;
        this.kicking = false;
        this.returning = false;
        this.scoreboard = "default";
        this.score = {
            "home": 0,
            "visitors": 0
        };
        this.isTouchdown = false;
        this.defaultScoreboard();
        this.setUpKick();
    }

    /**
     * @description Shows the default Scoreboard.
     */
    defaultScoreboard() {
        this.scoreboard = "default";
        $("#down").text("");
        $("#toGo").text("");
        $("#fieldPosition").text(this.time);
    }

    /**
     * @description Displays where the ball is on a kick.
     */
    showKick() {
        this.scoreboard = "kick";
        $("#down").text("");
        $("#toGo").text("");
        if (this.ballOn < 50) {
            $("#fieldPosition").text("1- " + this.ballOn);
        } else if (this.ballOn > 50) {
            $("#fieldPosition").text((100 - this.ballOn) + " -1");
        } else {
            $("#fieldPosition").text(this.ballOn);
        }
    }

    /**
     * @description Displays the current status of the game.
     */
    showStatus() {
        this.scoreboard = "status";
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
        
        if (!this.setUp && !this.inPlay && !this.kickoff) {
            this.setUpPlay();
        } else if (!this.setUp && !this.inPlay && this.kickoff && !this.kicking) {
            this.setUpKick();
        }
    }

    /**
     * @description Displays the current score of the game.
     */
    showScore() {
        this.scoreboard = "score";
        $("#down").text(this.score.home);
        $("#toGo").text(this.score.visitors);
        $("#fieldPosition").text("Q" +this.quarter);
    }

    /**
     * @description Moves the QB up.
     */
    moveUp() {
        if (this.setUp) {
            this.startPlay();
        }
        if (this.kickoff) {
            this.addDefenders();
            this.kickoff = false;
        }
        if (this.players.qb.row > 1) {
            var checkPlayer = this.getPlayerAt(this.players.qb.col, this.players.qb.row - 1);
            if (checkPlayer) {
                this.stopPlay(checkPlayer);
            } else {
                this.players.qb.moveUp();
            }
        }
    }

    /**
     * @description Moves the QB down.
     */
    moveDown() {
        if (this.setUp) {
            this.startPlay();
        }
        if (this.kickoff) {
            this.addDefenders();
            this.kickoff = false;
        }
        if (this.players.qb.row < 3) {
            var checkPlayer = this.getPlayerAt(this.players.qb.col, this.players.qb.row + 1);
            if (checkPlayer) {
                this.stopPlay(checkPlayer);
            } else {
                this.players.qb.moveDown();
            }
        }
    }

    /**
     * @description Moves the QB right.
     */
    moveRight() {
        var checkPlayer
        if (this.setUp) {
            this.startPlay();
        }
        if (this.kickoff) {
            this.addDefenders();
            this.kickoff = false;
        }
        if (this.players.qb.col < 10) {
            checkPlayer = this.getPlayerAt(this.players.qb.col + 1, this.players.qb.row);
        } else if (this.players.qb.direction === -1) {
            checkPlayer = this.getPlayerAt(1, this.players.qb.row);
        } else {
            console.log(this.players.qb.direction);
            return false;
        }
        if (checkPlayer) {
            this.stopPlay(checkPlayer);
        } else {
            this.players.qb.moveRight();
            if (this.players.qb.direction === 1) {
                this.ballOn = this.ballOn - 1;
                this.toGo = this.toGo + 1;
            } else {
                this.ballOn = this.ballOn - 1;
                this.toGo = this.toGo - 1;
                if (this.ballOn < 1) {
                    this.isTouchdown = true;
                    this.stopPlay();
                }
            }
        }
    }

    /**
     * @description Moves the QB left.
     */
    moveLeft() {
        var checkPlayer
        if (this.setUp) {
            this.startPlay();
        }
        if (this.kickoff) {
            this.addDefenders();
            this.kickoff = false;
        }
        if (this.players.qb.col > 1) {
            checkPlayer = this.getPlayerAt(this.players.qb.col - 1, this.players.qb.row);
        } else if (this.players.qb.direction === 1) {
            checkPlayer = this.getPlayerAt(10, this.players.qb.row);
        } else {
            console.log(this.players.qb.direction);
            return false;
        }
        if (checkPlayer) {
            this.stopPlay(checkPlayer);
        } else {
            this.players.qb.moveLeft();
            if (this.players.qb.direction === 1) {
                this.ballOn = this.ballOn + 1;
                this.toGo = this.toGo - 1;
                if (this.ballOn > 99) {
                    this.isTouchdown = true;
                    this.stopPlay();
                }
            } else {
                this.ballOn = this.ballOn + 1;
                this.toGo = this.toGo + 1;
            }
        }
    }

    /**
     * @description Shows the animation before the kickoff.
     */
    kickAnimation() {
        this.kickoffSetUp = false;
        this.kicking = true;
        var loopIndex = 0;
        var runningStart = setInterval(function () {
            loopIndex += 1;

            if (this.players.qb.direction === 1){
                this.players.d1.moveLeft();
                this.players.d2.moveLeft();
                this.players.d3.moveLeft();
            } else {
                this.players.d1.moveRight();
                this.players.d2.moveRight();
                this.players.d3.moveRight();
            }

            if (loopIndex === 4) {
                clearInterval(runningStart);
                this.kick("kickoff");
            }
        }.bind(this), 100);
    }

    /**
     * @description Kicks the ball to the other team.
     * @param {string} kickType The type of kick (kickoff, punt, fieldgoal).
     */
    kick(kickType) {
        var distance;
        if (kickType === "kickoff") {
            // random distance between 50 - 80 yards
            distance = Math.random() * 30 + 50; 
        } else if (kickType === "punt") {
            // random distance between 35 - 60 yards
            distance = Math.random() * 25 + 35;
        } else {
            // random distance between 20 - 55 yards
            distance = Math.random() * 25 + 20;
        }
        
        this.clearField();
        clearInterval(this.timer);
        this.timer = setInterval(this.runClock.bind(this), 1000);
        this.players.qb.turnOn();
        var loopIndex = 0;
        var ballInAir = setInterval(function () {
            this.showKick();
            loopIndex += 1;

            if (this.players.qb.direction === 1){
                this.players.qb.moveLeft();
                this.ballOn += 1;
            } else {
                this.players.qb.moveRight();
                this.ballOn -= 1;
            }

            if (loopIndex > distance) {
                clearInterval(ballInAir);
                clearInterval(this.timer);
                this.returnKick();
            }
        }.bind(this), 100);
    }


    returnKick() {
        this.defaultScoreboard();
        this.kicking = false;
        this.returning = true;
        this.players.qb.direction = -this.players.qb.direction;
        if (this.ballOn > 0 && this.ballOn < 98) {
            this.players.qb.setBlink("off");
            this.toGo = -99;
            this.setUp = true;
        } else {
            if (this.players.qb.direction === 1) {
                this.ballOn = 20;
            } else {
                this.ballOn = 80;
            }
            this.players.qb.setBlink("on");
            this.toGo = 10;
            this.setUp = false;
            this.inPlay = false;
            this.kickoff = false;
            this.returning = false;
        }
    }

    /**
     * @description Starts adding defensive players at random times.
     * @param {int} index The index of the defensive player to add (1-6).
     */
    addDefenders(index) {
        if (!index) {
            index = 1;
        }
        if (this.inPlay){
            var position = this.getRandomOpen();
            this.players["d" + index].turnOn();
            this.players["d" + index].setScreen(position.col, position.row);
            var time = Math.random() * 1000;
            if (index < 6) {
                setTimeout( function() {
                    this.addDefenders(index + 1);
                }.bind(this), time);
            }
        }

    }

    getRandomOpen() {
        var col = Math.floor(Math.random() * 10 + 1);
        var row = Math.floor(Math.random() * 3 + 1);
        if (!this.getPlayerAt(col, row)) {
            return {"col": col, "row": row};
        } else {
            return this.getRandomOpen();
        }
    }

    triggerEvent(event) {
        console.log(event);
        switch (event) {
            case "UP":
                if (this.inPlay || this.setUp) {
                    this.moveUp();
                }
                break;
            case "DOWN":
                if (this.inPlay || this.setUp) {
                    this.moveDown();
                }
                break;
            case "RIGHT":
                if (this.inPlay || this.setUp) {
                    this.moveRight();
                }
                break;
            case "LEFT":
                if (this.inPlay || this.setUp) {
                    this.moveLeft();
                }
                break;
            case "KICK":
                if (this.kickoff && this.kickoffSetUp) {
                    this.kickAnimation();
                }
                if (this.setUp && !this.returning) {
                    this.setUp = false;
                    this.kickoff = true;
                    this.kick("punt");
                }
                break;
            case "PASS":
                break;
            case "STATUS":
                this.showStatus();
                break;
            case "SCORE":
                this.showScore();
                break;
            default:
                break;
        }
    }

    /**
     * @description Adds seven points to the offense.
     */
    touchdown() {
        if (this.players.qb.direction === -1) {
            this.score.home += 7;
            this.ballOn = 65;
        } else {
            this.score.visitors += 7;
            this.ballOn = 35;
        }
        this.kickoff = true;
        this.isTouchdown = false;
    }

    /**
     * @description Adds two points to the defense.
     */
    safety() {
        if (this.players.qb.direction === -1) {
            this.score.visitors += 2;
            this.ballOn = 80;
        } else {
            this.score.home += 2;
            this.ballOn = 20;
        }
        this.down = 1;
        this.toGo = -99;
        this.kickoff = true;
    }

    /**
     * @description Function to starts the play.
     */
    startPlay() {
        console.log("start play");
        this.setUp = false;
        this.toGo = this.toGo + 1;
        clearInterval(this.timer);
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
    stopPlay(defender) {
        console.log("end play");
        clearInterval(this.timer);
        this.inPlay = false;
        this.kicking = false;
        this.returning = false;

        if (typeof defender !== "undefined") {
            defender.setBlink("on");
            this.players.qb.setBlink("on");
        }

        if (this.isTouchdown) {
            this.touchdown();
            return;
        }

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
        if (this.scoreboard === "default") {
            $("#fieldPosition").text(this.time);
        }
        if (this.time < 0.1) {
            console.log("Time is out!");
            clearInterval(this.timer);
        }
    }

    /**
     * @description Sets up the kick off.
     */
    setUpKick() {
        this.kickoffSetUp = true;
        this.clearField();
        if (this.players.qb.direction === 1){
            this.players.qb.setScreen(4,2);
            this.players.qb.setBlink("on");
            this.players.qb.turnOn();
            this.players.d1.setScreen(10,1);
            this.players.d1.turnOn();
            this.players.d2.setScreen(9,2);
            this.players.d2.turnOn();
            this.players.d3.setScreen(10,3);
            this.players.d3.turnOn();
        } else {
            this.players.qb.setScreen(6,2);
            this.players.qb.setBlink("on");
            this.players.qb.turnOn();
            this.players.d1.setScreen(1,1);
            this.players.d1.turnOn();
            this.players.d2.setScreen(2,2);
            this.players.d2.turnOn();
            this.players.d3.setScreen(1,3);
            this.players.d3.turnOn();
        }

        if (this.time < 0.1) {
            this.quarter = this.quarter + 1;
            this.time = 15.0.toFixed(1);
        }
    }

    /**
     * @description Function to set up the next play.
     */
    setUpPlay() {
        this.setUp = true;
        this.clearField();

        for (var player in this.players) {
            this.players[player].setBlink("off");
        }

        if (this.players.qb.direction === -1){
            this.players.qb.setScreen(3,2);
            this.players.qb.turnOn();

            // this.players.d1.setScreen(4,1);
            // this.players.d1.turnOn();
            this.players.d2.setScreen(4,2);
            this.players.d2.turnOn();
            this.players.d3.setScreen(4,3);
            this.players.d3.turnOn();
            this.players.d4.setScreen(6,2);
            this.players.d4.turnOn();
            this.players.d5.setScreen(8,1);
            this.players.d5.turnOn();
            this.players.d6.setScreen(10,3);
            this.players.d6.turnOn();
        } else {
            this.players.qb.setScreen(8,2);
            this.players.qb.turnOn();

            // this.players.d1.setScreen(7,1);
            // this.players.d1.turnOn();
            this.players.d2.setScreen(7,2);
            this.players.d2.turnOn();
            this.players.d3.setScreen(7,3);
            this.players.d3.turnOn();
            this.players.d4.setScreen(5,2);
            this.players.d4.turnOn();
            this.players.d5.setScreen(3,1);
            this.players.d5.turnOn();
            this.players.d6.setScreen(1,3);
            this.players.d6.turnOn();
        }

        if (this.time < 0.1) {
            this.quarter = this.quarter + 1;
            this.time = 15.0.toFixed(1);
        }
    }
}