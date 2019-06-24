(function ($) {

    var players = {
        "ball": new Player($("#ball").get(0), "ball"),
        "qb": new Player($("#qb").get(0), "offense"),
        "receiver": new Player($("#receiver").get(0), "offense"),
        "d1": new Player($("#d1").get(0), "defense"),
        "d2": new Player($("#d2").get(0), "defense"),
        "d3": new Player($("#d3").get(0), "defense"),
        "d4": new Player($("#d4").get(0), "defense"),
        "d5": new Player($("#d5").get(0), "defense"),
        "d6": new Player($("#d6").get(0), "defense")
    };
    var controller = new EventController(players);
    controller.startGame();

}(jQuery));