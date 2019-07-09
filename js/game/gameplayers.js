$ = jQuery;

/**
 * @description Returns the player at the position.
 * @param {int} col The column to get the player at.
 * @param {int} row The row to get the player at.
 * @returns {Player} Returns the player at the position or false if no player.
 */
GameController.prototype.getPlayerAt = function (col, row) {
    for (var player in this.players) {
        if (this.players[player].col === col && this.players[player].row === row && this.players[player].onField && this.players[player].position !== "ball") {
            return this.players[player];
        }
    }
    return false;
}

/**
 * @description Returns the player index at the position.
 * @param {int} col The column to get the player at.
 * @param {int} row The row to get the player at.
 * @returns {String} Returns the player index at the position or false if no player.
 */
GameController.prototype.getPlayerIndexAt = function (col, row) {
    for (var player in this.players) {
        if (this.players[player].col === col && this.players[player].row === row && this.players[player].onField && this.players[player].position !== "ball") {
            return player;
        }
    }
    return false;
}

/**
 * @description Turns off every player.
 */
GameController.prototype.clearField = function () {
    for (var player in this.players) {
        this.players[player].turnOff();
        this.players[player].setBlink("off");
    }
}

/**
 * @description Moves the QB up.
 */
GameController.prototype.moveUp = function () {
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
            this.soundController.play("one_whistle");
            this.stopPlay(checkPlayer);
        } else {
            this.players.qb.moveUp();
        }
    }
}

/**
 * @description Moves the QB down.
 */
GameController.prototype.moveDown = function () {
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
            this.soundController.play("one_whistle");
            this.stopPlay(checkPlayer);
        } else {
            this.players.qb.moveDown();
        }
    }
}

/**
 * @description Moves the QB right.
 */
GameController.prototype.moveRight = function () {
    var checkPlayer;
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
        return false;
    }
    if (checkPlayer) {
        this.soundController.play("one_whistle");
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
            } else if (this.toGo === 0) {
                this.soundController.play("short_beep");
            }
        }
    }
}

/**
 * @description Moves the QB left.
 */
GameController.prototype.moveLeft = function () {
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
        return false;
    }
    if (checkPlayer) {
        this.soundController.play("one_whistle");
        this.stopPlay(checkPlayer);
    } else {
        this.players.qb.moveLeft();
        if (this.players.qb.direction === 1) {
            this.ballOn = this.ballOn + 1;
            this.toGo = this.toGo - 1;
            if (this.ballOn > 99) {
                this.isTouchdown = true;
                this.stopPlay();
            } else if (this.toGo === 0) {
                this.soundController.play("short_beep");
            }
        } else {
            this.ballOn = this.ballOn + 1;
            this.toGo = this.toGo + 1;
        }
    }
}
