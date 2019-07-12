$ = jQuery;

/**
 * @description Adds seven points to the offense.
 */
GameController.prototype.touchdown = function () {
    if (this.players.qb.direction === -1) {
        this.score.home += 7;
        this.ballOn = 65;
    } else {
        this.score.visitors += 7;
        this.ballOn = 35;
    }
    this.soundController.play("crowd");
    this.kickoff = true;
    this.isTouchdown = false;
    this.clearField();
}

/**
 * @description Adds three points to the offense.
 */
GameController.prototype.fieldGoal = function () {
    if (this.players.qb.direction === -1) {
        this.score.home += 3;
        this.ballOn = 65;
    } else {
        this.score.visitors += 3;
        this.ballOn = 35;
    }
    this.soundController.play("crowd");
    this.setUp = false;
    this.inPlay = false;
    this.kickoff = true;
    this.returning = false;
    this.clearField();
}

/**
 * @description Adds two points to the defense.
 */
GameController.prototype.safety = function () {
    if (this.players.qb.direction === -1) {
        this.score.visitors += 2;
        this.ballOn = 80;
    } else {
        this.score.home += 2;
        this.ballOn = 20;
    }
    this.soundController.play("two_tones");
    this.down = 1;
    this.toGo = -99;
    this.kickoff = true;
}

/**
 * @description Function to starts the play.
 */
GameController.prototype.startPlay = function () {
    this.setUp = false;
    this.toGo = this.toGo + 1;
    clearInterval(this.timer);
    this.timer = setInterval(this.runClock.bind(this), this.ONESECOND);
    this.moveRandomDefense();
    this.inPlay = true;
    if (this.players.qb.direction === 1) {
        this.ballOn = this.ballOn - 1;
        if (this.canPass) {
            this.addReciever();
        }
    } else {
        this.ballOn = this.ballOn + 1;
        if (this.canPass) {
            this.addReciever();
        }
    }
}

/**
 * @description Function to stop the play.
 */
GameController.prototype.stopPlay = function (defender) {
    console.log("stop play:");
    console.log(defender);
    clearInterval(this.timer);
    this.inPlay = false;
    this.kicking = false;
    this.returning = false;
    this.canPass = false;
    this.passing = false;

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
    } else if (this.down > 3){ // Turnover on downs.
        this.soundController.play("two_whistles");
        this.players.qb.changeDirection();
        this.toGo = 10;
        this.down = 1;
    } else {
        this.down = this.down + 1;
    }

    if (this.time < 0.1 && this.quarter > 3) {
        this.gameOn = false;
        this.showScore();
    }
}

/**
 * @description Starts running the game clock.
 */
GameController.prototype.runClock = function () {
    this.time = (this.time - 0.1).toFixed(1);
    if (this.scoreboard === "default") {
        $("#fieldPosition").text(this.time);
    }
    if (this.time < 0.1) {
        this.soundController.play("buzzer");
        clearInterval(this.timer);
    }
}

/**
 * @description Function to set up the next play.
 */
GameController.prototype.setUpPlay = function () {
    this.setUp = true;
    this.clearField();
    this.los = this.ballOn;
    this.canPass = true;

    for (var player in this.players) {
        this.players[player].setBlink("off");
    }

    if (this.players.qb.direction === -1){
        this.players.qb.setScreen(3,2);
        this.players.qb.turnOn();

        this.players.d1.setScreen(4,1);
        this.players.d1.turnOn();
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

        this.players.d1.setScreen(7,1);
        this.players.d1.turnOn();
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
}
