$ = jQuery;

/**
 * @description Shows the default Scoreboard.
 */
GameController.prototype.defaultScoreboard = function () {
    this.scoreboard = "default";
    $("#down").text("");
    $("#toGo").text("");
    $("#fieldPosition").text(this.time);
}

/**
 * @description Displays the current status of the game.
 */
GameController.prototype.showStatus = function() {
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
    
    if (!this.setUp && !this.inPlay && !this.kicking) {
        if (this.time < 0.1) {
            this.quarter = this.quarter + 1;
            this.time = 15.0.toFixed(1);
            if (this.quarter === 3) {
                this.players.qb.direction = 1;
                this.ballOn = 35;
                this.kickoff = true;
            }
        }
        if (!this.kickoff) {
            this.setUpPlay();
        } else {
            this.setUpKick();
        }
    }
}

/**
 * @description Displays the current score of the game.
 */
GameController.prototype.showScore = function () {
    this.scoreboard = "score";
    $("#down").text(this.score.home);
    $("#toGo").text(this.score.visitors);
    $("#fieldPosition").text("Q" +this.quarter);
}
