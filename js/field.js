class Field {
    /**
     * @description Creates a field object.
     */
    constructor () {
        this.field = [
            [
                false, false, false, false, false, false, false, false, false, false
            ],
            [
                false, false, false, false, false, false, false, false, false, false
            ],
            [
                false, false, false, false, false, false, false, false, false, false
            ]
        ];
    }

    /**
     * @description Checks if a position is empty.
     * @param {int} col The column of the position to check.
     * @param {int} row The row of the position to check.
     * @returns false if the location is empty and true if it is occupied.
     */
    checkPos (col, row) {
        console.log(this.field);
        return this.field[row-1][col-1];
    }

    /**
     * @description Removes the position on the field.
     * @param {int} col The column of the position to remove.
     * @param {int} row The row of the position to remove.
     */
    removePos (col, row) {
        this.field[row-1][col-1] = false;
    }

    /**
     * @description Adds the position on the field.
     * @param {int} col The column of the position to add.
     * @param {int} row The row of the position to add.
     */
    addPos (col, row) {
        this.field[row-1][col-1] = false;
    }
}