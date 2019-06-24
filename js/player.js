$ = jQuery;

class Player {
    /**
     * Creates a Player object.
     * @param {object} element The DOM element of the Player.
     * @param {object} position "ball", "defense" or "offense".
     */
    constructor (element, position) {
        this.element = element;
        this.position = position;
        this.row = 1;
        this.col = 1;
        this.onField = false;
        this.direction = 1; // 1 = Visitors (right to left); -1 = Home (left to right);
    }

    /**
     * @description Returns the column and row of the player.
     * @returns {object} object.col and object.row
     */
    getPosition() {
        return {
            "col": this.col,
            "row": this.row
        };
    }

    /**
     * @description Sets the attributes of player in the DOM.
     */
    setElement() {
        $(this.element).attr("data-row", this.row);
        $(this.element).attr("data-col", this.col);
        $(this.element).attr("data-on-field", this.onField);
    }

    /**
     * @description Sets the players blink mode.
     * @param {string} blink "off", "on", or "slow" for how to blink the player.
     */
    setBlink(blink) {
        $(this.element).attr("data-blink", blink);
    }

    /**
     * @description Moves the player up.
     * @returns {boolean} If the move was successful.
     */
    moveUp() {
        if (this.row > 1) {
            this.row = this.row - 1;
        }
        this.setElement();
        return true;
    }

    /**
     * @description Moves the player down.
     * @returns {boolean} If the move was successful.
     */
    moveDown() {
        if (this.row < 3) {
            this.row = this.row + 1;
        }
        this.setElement();
        return true;
    }

    /**
     * @description Moves the player right.
     * @returns {boolean} If the move was successful.
     */
    moveRight() {
        if (this.col < 10) {
            this.col = this.col + 1;
        } else if (this.direction === -1) {
            this.col = 1;
        } else {
            return false;
        }
        this.setElement();
        return true;
    }

    /**
     * @description Moves the player left.
     * @returns {boolean} If the move was successful.
     */
    moveLeft() {
        if (this.col > 1) {
            this.col = this.col - 1;
        } else if (this.direction === 1) {
            this.col = 10;
        } else {
            return false;
        }
        this.setElement();
        return true;
    }

    /**
     * @description Sets the player to a specific location.
     * @param col The column of the player.
     * @param row The row of the player.
     */
    setScreen(col, row) {
        this.col = col;
        this.row = row;
        this.setElement();
    }

    /**
     * @description Reverses the direction of the player.
     */
    changeDirection() {
        this.direction = - this.direction;
    }

    /**
     * @description Turns the player on in the DOM.
     */
    turnOn() {
        this.onField = true;
        this.setElement();
    }

    /**
     * @description Turns the player off in the DOM.
     */
    turnOff() {
        this.onField = false;
        this.setElement();
    }
}