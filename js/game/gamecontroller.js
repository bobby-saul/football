$ = jQuery;

class GameController {
    /**
     * Creates a GameController object.
     * @param {object} players An object of players indexed by position in the game.
     */
    constructor(players) {
        this.gameOn = false;
        this.players = players;
        this.ONESECOND = 1000;
        this.moveSpeed = 1000;
        this.ballSpeed = 100;
        this.quarter = 1;
        this.time = 15.0.toFixed(1);
        this.timer;
        this.defenseMove;
        this.ballOn = 20;
        this.los = 20;
        this.down = 1;
        this.toGo = 10;
        this.scoreboard = "default";
        this.inPlay = false;
        this.setUp = false;
        this.canPass = false;
        this.passing = false;
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
     * @description Starts a new game.
     */
    startGame() {
        this.gameOn = true;
        this.players.qb.direction = -1;
        this.quarter = 1;
        this.time = 15.0.toFixed(1);
        this.ballOn = 65;
        this.los = 65;
        this.down = 1;
        this.toGo = 10;
        this.inPlay = false;
        this.setUp = false;
        this.canPass = false;
        this.passing = false;
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

    triggerEvent(event) {
        switch (event) {
            case "UP":
                if ((this.inPlay || this.setUp) && !this.passing && this.gameOn) {
                    this.moveUp();
                }
                break;
            case "DOWN":
                if ((this.inPlay || this.setUp) && !this.passing && this.gameOn) {
                    this.moveDown();
                }
                break;
            case "RIGHT":
                if ((this.inPlay || this.setUp) && !this.passing && this.gameOn) {
                    this.moveRight();
                    if (this.canPass && (this.players.qb.direction === 1 && this.ballOn >= this.los) || (this.players.qb.direction === -1 && this.ballOn <= this.los)) {
                        this.canPass = false;
                        this.players.receiver.turnOff();
                    }
                }
                break;
            case "LEFT":
                if ((this.inPlay || this.setUp) && !this.passing && this.gameOn) {
                    this.moveLeft();
                    if (this.canPass && (this.players.qb.direction === 1 && this.ballOn >= this.los) || (this.players.qb.direction === -1 && this.ballOn <= this.los)) {
                        this.canPass = false;
                        this.players.receiver.turnOff();
                    }
                }
                break;
            case "KICK":
                // If kickoff
                if (this.kickoff && this.kickoffSetUp && !this.passing && this.gameOn) {
                    this.kickAnimation();
                }
                // If punt
                else if (this.setUp && !this.returning && !this.passing && this.gameOn) {
                    this.setUp = false;
                    this.kickoff = true;
                    this.kick("punt");
                }
                // If field goal
                else if (this.inPlay && !this.passing && this.gameOn) {
                    if (this.players.qb.direction === 1 && this.players.qb.row === 2 && this.ballOn === this.los -3) {
                        this.kickoff = true;
                        this.kick("fieldgoal");
                    } else if (this.players.qb.direction === -1 && this.players.qb.row === 2 && this.ballOn === this.los + 3) {
                        this.kickoff = true;
                        this.kick("fieldgoal");
                    }
                }
                break;
            case "PASS":
                if (this.canPass && !this.passing && this.inPlay && this.gameOn) {
                    this.pass();
                }
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
}
