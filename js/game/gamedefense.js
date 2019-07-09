$ = jQuery;

/**
 * @description Moves random defensive player.
 */
GameController.prototype.moveRandomDefense = function () {
    setTimeout(function () {
        // Get movable defense;
        var playableDefense = [];
        for(var player in this.players) {
            if (this.players[player].onField && this.players[player].position === "defense") {
                playableDefense.push(player);
            }
        }
    
        // Get random movable player
        var defense = playableDefense[Math.floor(Math.random() * playableDefense.length)];
        this.moveDefense(defense);

        // Call self if still in play
        if (this.inPlay) {
            this.moveRandomDefense();
        }
    }.bind(this), Math.random() * this.moveSpeed);
}

/**
 * @description Moves defense in a random direction closest to qb.
 * @param {string} player The index of the GameController's players object of player to move.
 */
GameController.prototype.moveDefense = function (player) {
    if (this.inPlay && !this.kickoff) {
        var newSpotPlayer
        // If needs to change vertical and horizontal
        if (this.players.qb.col !== this.players[player].col && this.players.qb.row !== this.players[player].row) {
            // Move horizontal
            if (Math.random() < 0.5) {
                // Move left
                if (this.players.qb.col < this.players[player].col) {
                    newSpotPlayer = this.getPlayerAt(this.players[player].col - 1, this.players[player].row);
                    if (!newSpotPlayer) {
                        this.players[player].moveLeft();
                    } else if (newSpotPlayer.position === "qb" && !this.passing) {
                        this.soundController.play("one_whistle");
                        this.stopPlay(this.players[player]);
                    } else if (newSpotPlayer.position === "defense" && this.hardMode) {
                        this.moveDefense(this.getPlayerIndexAt(this.players[player].col - 1, this.players[player].row));
                    }
                } else { // Move right
                    newSpotPlayer = this.getPlayerAt(this.players[player].col + 1, this.players[player].row);
                    if (!newSpotPlayer) {
                        this.players[player].moveRight();
                    } else if (newSpotPlayer.position === "qb" && !this.passing) {
                        this.soundController.play("one_whistle");
                        this.stopPlay(this.players[player]);
                    } else if (newSpotPlayer.position === "defense" && this.hardMode) {
                        this.moveDefense(this.getPlayerIndexAt(this.players[player].col + 1, this.players[player].row));
                    }
                }
            } else { // Move vertical
                // Move up
                if (this.players.qb.row < this.players[player].row) {
                    newSpotPlayer = this.getPlayerAt(this.players[player].col, this.players[player].row - 1);
                    if (!newSpotPlayer) {
                        this.players[player].moveUp();
                    } else if (newSpotPlayer.position === "qb" && !this.passing) {
                        this.soundController.play("one_whistle");
                        this.stopPlay(this.players[player]);
                    } else if (newSpotPlayer.position === "defense" && this.hardMode) {
                        this.moveDefense(this.getPlayerIndexAt(this.players[player].col, this.players[player].row - 1));
                    }
                } else { // Move down
                    newSpotPlayer = this.getPlayerAt(this.players[player].col, this.players[player].row + 1);
                    if (!newSpotPlayer) {
                        this.players[player].moveDown();
                    } else if (newSpotPlayer.position === "qb" && !this.passing) {
                        this.soundController.play("one_whistle");
                        this.stopPlay(this.players[player]);
                    } else if (newSpotPlayer.position === "defense" && this.hardMode) {
                        this.moveDefense(this.getPlayerIndexAt(this.players[player].col, this.players[player].row + 1));
                    }
                }
            }
        } else if (this.players.qb.col !== this.players[player].col) { // Move horizontal
            // Move left
            if (this.players.qb.col < this.players[player].col) {
                newSpotPlayer = this.getPlayerAt(this.players[player].col - 1, this.players[player].row);
                if (!newSpotPlayer) {
                    this.players[player].moveLeft();
                } else if (newSpotPlayer.position === "qb" && !this.passing) {
                    this.soundController.play("one_whistle");
                    this.stopPlay(this.players[player]);
                } else if (newSpotPlayer.position === "defense" && this.hardMode) {
                    this.moveDefense(this.getPlayerIndexAt(this.players[player].col - 1, this.players[player].row));
                }
            } else { // Move right
                newSpotPlayer = this.getPlayerAt(this.players[player].col + 1, this.players[player].row);
                if (!newSpotPlayer) {
                    this.players[player].moveRight();
                } else if (newSpotPlayer.position === "qb" && !this.passing) {
                    this.soundController.play("one_whistle");
                    this.stopPlay(this.players[player]);
                } else if (newSpotPlayer.position === "defense" && this.hardMode) {
                    this.moveDefense(this.getPlayerIndexAt(this.players[player].col + 1, this.players[player].row));
                }
            }
        } else { // Move vertical
            // Move up
            if (this.players.qb.row < this.players[player].row) {
                newSpotPlayer = this.getPlayerAt(this.players[player].col, this.players[player].row - 1);
                if (!newSpotPlayer) {
                    this.players[player].moveUp();
                } else if (newSpotPlayer.position === "qb" && !this.passing) {
                    this.soundController.play("one_whistle");
                    this.stopPlay(this.players[player]);
                } else if (newSpotPlayer.position === "defense" && this.hardMode) {
                    this.moveDefense(this.getPlayerIndexAt(this.players[player].col, this.players[player].row - 1));
                }
            } else { // Move down
                newSpotPlayer = this.getPlayerAt(this.players[player].col, this.players[player].row + 1);
                if (!newSpotPlayer) {
                    this.players[player].moveDown();
                } else if (newSpotPlayer.position === "qb" && !this.passing) {
                    this.soundController.play("one_whistle");
                    this.stopPlay(this.players[player]);
                } else if (newSpotPlayer.position === "defense" && this.hardMode) {
                    this.moveDefense(this.getPlayerIndexAt(this.players[player].col, this.players[player].row + 1));
                }
            }
        }
    }
}
