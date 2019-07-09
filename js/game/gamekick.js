$ = jQuery;

/**
 * @description Displays where the ball is on a kick.
 */
GameController.prototype.showKick = function () {
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
 * @description Shows the animation before the kickoff.
 */
GameController.prototype.kickAnimation = function () {
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
            this.soundController.play("charge");
            this.kick("kickoff");
        }
    }.bind(this), this.ballSpeed);
}

/**
 * @description Kicks the ball to the other team.
 * @param {string} kickType The type of kick (kickoff, punt, fieldgoal).
 */
GameController.prototype.kick = function (kickType) {
    var distance;
    this.canPass = false;
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
    this.timer = setInterval(this.runClock.bind(this), this.ONESECOND);
    this.players.qb.turnOn();
    var loopIndex = 0;
    this.ballInAir = setInterval(function () {
        this.showKick();
        loopIndex += 1;

        if (this.players.qb.direction === 1){
            this.players.qb.moveLeft();
            this.ballOn += 1;
        } else {
            this.players.qb.moveRight();
            this.ballOn -= 1;
        }

        // Kicked to end zone.
        if ((this.players.qb.direction === 1 && this.ballOn > 99) || (this.players.qb.direction === -1 && this.ballOn < 1)) {
            clearInterval(this.ballInAir);
            clearInterval(this.timer);
            if (kickType === "fieldgoal") {
                this.fieldGoal();
            } else {
                this.returnKick();
            }
        } else if (loopIndex > distance) {
            clearInterval(this.ballInAir);
            clearInterval(this.timer);
            // If the field goal misses but is close its a turn over where the line of scrimage is.
            if (kickType === "fieldgoal" && (this.ballOn > 90 || this.ballOn < 10)) {
                this.ballOn = this.los;
                this.down = 1;
                this.toGo = 10;
                this.soundController.play("two_whistles");
                this.setUp = false;
                this.inPlay = false;
                this.kickoff = false;
                this.returning = false;
                this.players.qb.direction = -this.players.qb.direction;
                return;
            }
            this.returnKick();
        }
    }.bind(this), this.ballSpeed);
}

/**
 * @description Returns the kick.
 */
GameController.prototype.returnKick = function () {
    this.defaultScoreboard();
    this.soundController.play("one_tone");
    this.kicking = false;
    this.returning = true;
    this.players.qb.direction = -this.players.qb.direction;
    // Return the ball if not in end zone
    if (this.ballOn > 0 && this.ballOn < 100) {
        this.players.qb.setBlink("off");
        this.toGo = -99;
        this.setUp = true;
    } else { // else touchback.
        if (this.players.qb.direction === 1) {
            this.ballOn = 20;
        } else {
            this.ballOn = 80;
        }
        this.players.qb.setBlink("on");
        this.down = 1;
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
GameController.prototype.addDefenders = function (index) {
    if (!index) {
        index = 1;
    }
    if (this.inPlay){
        var position = this.getRandomOpen();
        this.players["d" + index].turnOn();
        this.players["d" + index].setScreen(position.col, position.row);
        var time = Math.random() * this.moveSpeed;
        if (index < 6) {
            setTimeout( function() {
                this.addDefenders(index + 1);
            }.bind(this), time);
        }
    }

}

/**
 * @description Sets up the kick off.
 */
GameController.prototype.setUpKick = function () {
    this.kickoffSetUp = true;
    this.los = this.ballOn;
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
}
