$ = jQuery;

/**
 * @description Passes the ball.
 */
GameController.prototype.pass = function() {
    if (this.players.qb.direction === 1) {
        this.players.ball.setScreen(this.players.qb.col - 1, this.players.qb.row);
    } else {
        this.players.ball.setScreen(this.players.qb.col + 1, this.players.qb.row);
    }
    var player = this.getPlayerAt(this.players.ball.col, this.players.ball.row);
    if (!player) {
        this.players.ball.turnOn();
        clearInterval(this.passing);
        this.passing = setInterval(function () {
            if (this.players.qb.direction === 1) {
                this.players.ball.moveLeft();
            } else {
                this.players.ball.moveRight();
            }
            var player = this.getPlayerAt(this.players.ball.col, this.players.ball.row);
            // Completion
            if (player.position === "offense"){
                clearInterval(this.passing);
                console.log("Completion");
                this.players.ball.turnOff();
                this.players.receiver.turnOff();
                this.caughtPass();
                this.players.qb.setScreen(this.players.ball.col, this.players.ball.row);
                if (this.ballOn > 99 || this.ballOn < 1) {
                    this.isTouchdown = true;
                    this.stopPlay();
                }
            }
            // Interception
            if (player.position === "defense"){
                if ((this.players.qb.direction === 1 && player.col < 8) || (this.players.qb.direction === -1 && player.col > 3)) {
                    clearInterval(this.passing);
                    console.log("Interception pass");
                    this.players.ball.turnOff();
                    this.players.qb.direction = -this.players.qb.direction;
                    this.caughtPass();
                    if (this.ballOn > 99 ) {
                        this.ballOn = 80;
                    } else if (this.ballOn < 1) {
                        this.ballOn = 20;
                    }
                    this.down = 1;
                    this.toGo = -99;
                    this.stopPlay(player);
                }
            }
            // Incomplete pass
            if (this.players.ball.col > 9 || this.players.ball.col < 2 ){
                clearInterval(this.passing);
                console.log("Incomplete pass");
                this.players.ball.turnOff();
                this.incompletePass();
            }
        }.bind(this), this.ballSpeed);
    } else {
        this.passing = false;
        if (player.position === "offense"){
            this.players.ball.turnOff();
            this.players.receiver.turnOff();
            this.caughtPass();
            this.players.qb.setScreen(this.players.ball.col, this.players.ball.row);
            if (this.ballOn > 99 || this.ballOn < 1) {
                this.isTouchdown = true;
                this.stopPlay();
            }
        }
        // Interception
        if (player.position === "defense"){
            if ((this.players.qb.direction === 1 && player.col < 8) || (this.players.qb.direction === -1 && player.col > 3)) {
                this.players.ball.turnOff();
                this.players.qb.direction = -this.players.qb.direction;
                this.caughtPass();
                if (this.ballOn > 99 ) {
                    this.ballOn = 80;
                } else if (this.ballOn < 1) {
                    this.ballOn = 20;
                }
                this.down = 1;
                this.toGo = -99;
                this.stopPlay(player);
            }
        }
    }
}

/**
 * @description Sets ball back to line of scrimage.
 */
GameController.prototype.incompletePass = function () {
    var qbDistance = this.ballOn - this.los;
    this.ballOn = this.los;
    this.toGo = this.toGo - Math.abs(qbDistance);
    console.log(qbDistance);
    this.passing = false;
    this.stopPlay();
}

/**
 * @description Moves the ball position and to go mark to the point of the catch.
 */
GameController.prototype.caughtPass = function () {
    var qbDistance = this.players.qb.col - this.players.ball.col;
    this.ballOn = this.ballOn + qbDistance;
    this.toGo = this.toGo - Math.abs(qbDistance);
    this.passing = false;
}

/**
 * @description Adds the receiver to the play.
 */
GameController.prototype.addReciever = function () {
    var row = Math.random();
    if (this.players.qb.direction === 1) {
        if (row > 0.5){
            this.players.receiver.setScreen(6, 1);
        } else {
            this.players.receiver.setScreen(6, 3);
        }
    } else {
        if (row > 0.5){
            this.players.receiver.setScreen(5, 1);
        } else {
            this.players.receiver.setScreen(5, 3);
        }
    }
    this.players.receiver.setBlink("slow");
    this.players.receiver.turnOn();
}

GameController.prototype.getRandomOpen = function () {
    var col = Math.floor(Math.random() * 10 + 1);
    var row = Math.floor(Math.random() * 3 + 1);
    if (!this.getPlayerAt(col, row)) {
        return {"col": col, "row": row};
    } else {
        return this.getRandomOpen();
    }
}
