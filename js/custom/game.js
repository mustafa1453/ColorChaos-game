/**
 * Created by mustafa1453 on 9/22/13.
 */
var colors = ["red", "blue", "orange", "violet", "green", "yellow"];
$(function() {
    var gameColor = $(".game .color");
    var chooser = $(".colors .color");
    var gameArray = new Array();
    var tmpArray = new Array();
    var iMax = 5;
    for (var i = 0; i < iMax; i++) {
        gameArray[i] = new Array();
        tmpArray[i] = new Array();
    }
    gameColor.each(function(index, element) {
        var color = Math.floor(Math.random() * 6);
        gameArray[Math.floor(index / 5)][index % 5] = color;
        $(this).addClass(colors[color]);
    });
    chooser.click(function() {
        var oldColor = $(gameColor[0]).attr("class");
        var color = $(this).attr("class");
        // Loop all boxes with the same color, and find if they are neighborhood for first colorbox.
        tmpArray = gameArray;
        gameColor.each(function(index, element) {
            console.log(index);
            if ($(this).attr("class") === oldColor) {
                var x = Math.floor(index / 5);
                var y = index % 5;
                var cleanColor = oldColor.replace("color ", "");
                var colorIndex = colors.indexOf(cleanColor);
                if (isNear(gameArray, x, y, colorIndex)) {
                    tmpArray[x][y] = colorIndex;
                    $(this).removeClass().addClass(color);
                }
            }
        });
        gameArray = tmpArray;
    });


    // Just test
    /*gameArray[0][0] = 5;
    gameArray[1][0] = 5;*/
    /*if (isNear(gameArray, 1, 0, 5)) {
        console.log("Path is find");
    }*/

    function isNear(grid, x, y, color) {
        var isFind = false;
        var easystar = new EasyStar.js();
        easystar.setGrid(grid);
        easystar.setAcceptableTiles([color]);
        easystar.findPath(0, 0, x, y, function(path) {
            if (path === null) {
                isFind = false;
            } else {
                isFind = true;
            }
        });
        easystar.calculate();
        return isFind;
    }

    // showMatrix(gameArray);
    /*function showMatrix(matrix) {
        for (row in matrix) {
            console.log(matrix[row]);
        }
    }*/
});