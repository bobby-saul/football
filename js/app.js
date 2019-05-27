(function ($) {

    var players = {
        "qb": new Player($("#qb").get(0)),
        "receiver": new Player($("#receiver").get(0)),
        "d1": new Player($("#d1").get(0)),
        "d2": new Player($("#d2").get(0)),
        "d3": new Player($("#d3").get(0)),
        "d4": new Player($("#d4").get(0)),
        "d5": new Player($("#d5").get(0)),
        "d6": new Player($("#d6").get(0))
    };
    var game = new Game(players);
    game.setUpPlay();

}(jQuery));