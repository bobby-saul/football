class Controller {
    /**
     * Creates a Controller object to play the football game.
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
        this.inPlay = false;
        this.keydown = false;
    }

    /**
     * @description Processes an event and returns an object on how it was processed.
     * @param {Event} e The event of a key press or button click.
     * @returns {obect} 
     *      - object.key The name of the event processed.
     *      - object.type The type of event processed.
     *      - object.status If the event was fully processed:
     *          -1 = The event fails to fully process and ends the current play.
     *          0 = The event fails to fully process but should not end the current play.
     *          1 = The event was fully processed.
     */
    keyDown(e) {
        var position = this.qb.getPosition();
        var playerPosition;
        if (!this.keydown) {
            this.keydown = true;
            switch (e.key.toUpperCase()) {
                case this.keys.up:
                case "UP":
                    if (!this.inPlay) {
                        return { "key": "UP", "type": "ARROW", "status": 0};
                    }
                    position.row = position.row - 1 ;
                    for (var player in this.players) {
                        playerPosition = this.players[player].getPosition();
                        if (this.players[player].onField && playerPosition.col === position.col && playerPosition.row === position.row) {
                            return { "key": "UP", "type": "ARROW", "status": -1};
                        }
                    }
                    this.qb.moveUp();
                    return { "key": "UP", "type": "ARROW", "status": 1};
                case this.keys.down:
                case "DOWN":
                    if (!this.inPlay) {
                        return { "key": "DOWN", "type": "ARROW", "status": 0};
                    }
                    position.row = position.row + 1;
                    for (var player in this.players) {
                        playerPosition = this.players[player].getPosition();
                        if (this.players[player].onField && playerPosition.col === position.col && playerPosition.row === position.row) {
                            return { "key": "DOWN", "type": "ARROW", "status": -1};
                        }
                    }
                    this.qb.moveDown();
                    return { "key": "DOWN", "type": "ARROW", "status": 1};
                case this.keys.right:
                case "RIGHT":
                    if (!this.inPlay) {
                        return { "key": "RIGHT", "type": "ARROW", "status": 0};
                    }
                    position.col = position.col + 1;
                    for (var player in this.players) {
                        playerPosition = this.players[player].getPosition();
                        if (this.players[player].onField && playerPosition.col === position.col && playerPosition.row === position.row) {
                            return { "key": "RIGHT", "type": "ARROW", "status": -1};
                        }
                    }
                    if (this.qb.moveRight()) {
                        return { "key": "RIGHT", "type": "ARROW", "status": 1};
                    } else {
                        return { "key": "RIGHT", "type": "ARROW", "status": 0};
                    }
                case this.keys.left:
                case "LEFT":
                    if (!this.inPlay) {
                        return { "key": "LEFT", "type": "ARROW", "status": 0};
                    }
                    position.col = position.col - 1;
                    for (var player in this.players) {
                        playerPosition = this.players[player].getPosition();
                        if (this.players[player].onField && playerPosition.col === position.col && playerPosition.row === position.row) {
                            return { "key": "LEFT", "type": "ARROW", "status": -1};
                        }
                    }
                    if (this.qb.moveLeft()) {
                        return { "key": "LEFT", "type": "ARROW", "status": 1};
                    } else {
                        return { "key": "LEFT", "type": "ARROW", "status": 0};
                    }
                case this.keys.status:
                case "STATUS":
                    return { "key": "STATUS", "type": "GAME", "status": 1};
                default:
                    return { "key": e.key.toUpperCase(), "type": "GAME", "status": 1};
            }
        }
        return true;
    }

    /**
     * @description Unlocks the controller when a key or mouse is released.
     */
    keyUp() {
        this.keydown = false;
    }
}
