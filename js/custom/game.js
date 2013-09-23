/**
 * Created by mustafa1453 on 9/22/13.
 */
$(function() {
    Object.prototype.clone = function() {
        var newObj = (this instanceof Array) ? [] : {};
        for (i in this) {
            if (i == 'clone') continue;
            if (this[i] && typeof this[i] == "object") {
                newObj[i] = this[i].clone();
            } else newObj[i] = this[i]
        } return newObj;
    };

    var colors = ["red", "blue", "orange", "violet", "green", "yellow"];
    var gameColor = $(".game .color");
    var chooser = $(".colors .color");
    var gameArray = new Array();
    var iMax = 5;
    for (var i = 0; i < iMax; i++) {
        gameArray[i] = new Array();
    }

    gameColor.each(function(index, element) {
        var color = Math.floor(Math.random() * 6);
        gameArray[Math.floor(index / 5)][index % 5] = color;
        $(this).addClass(colors[color]);
    });

    chooser.click(function() {
        var oldColor = $(gameColor[0]).attr("class");
        var colorIndex = colors.indexOf(oldColor.replace("color ", ""));
        var color = $(this).attr("class");
        var newColorIndex = colors.indexOf(color.replace("color ", ""));
        var tmpArray = gameArray.clone();
        gameColor.each(function(index, element) {
            console.log(index);
            if ($(this).attr("class") === oldColor) {
                var x = Math.floor(index / 5);
                var y = index % 5;
                if (isNear(gameArray.clone(), x, y, colorIndex)) {
                    tmpArray[x][y] = newColorIndex;
                    $(this).removeClass().addClass(color);
                }
            }
        });
        gameArray = tmpArray.clone();
    });

    function isNear(matrix, y, x, color) {
        matrix.forEach(function(row, i) {
            matrix[i] = row.map(function(item) { return item == color ? 0 : 1; });
        });
        var grid = new PF.Grid(matrix.length, matrix.length, matrix);
        var finder = new PF.AStarFinder();
        var path = finder.findPath(0, 0, x, y, grid);
        return path.length > 0;
    }

    function showMatrix(matrix) {
        for (row in matrix) {
            console.log(matrix[row]);
        }
    }
});