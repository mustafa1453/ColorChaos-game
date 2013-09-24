/**
 * Created by mustafa1453 on 9/22/13.
 */
$(function() {
    $('#alert-noheader').click(function(e) {
        $.fn.SimpleModal({
            hideHeader: true,
            closeButton: false,
            btn_ok: 'Close window',
            width: 600,
            model: 'alert',
            contents: 'Fill the board with one color within the allowed steps.' +
                'Game starts from the top left cell. ' +
                'Select a color by clicking on one of the squares on the left and ' +
                'the cells will change color to selected - so you can connect neighboring cells of the same color. ' +
                'Grab the box to the minimum number of moves.'
        }).showModal();
    });

    var colors = ["red", "blue", "orange", "violet", "green", "yellow"];
    var gameArray;
    var size = 14; // 14 for small. 28 for large field.
    init(size);

    $(".refresh").click(function() {
        init(size);
    });

    $(".complexity").click(function() {
        var complex = $(this);
        complex.parent().find(".complexity").removeClass("active");
        complex.addClass("active");
        size = complex.data("type") === "small" ? 14 : 28;
        init(size);
    })

    $(".colors .color").click(function() {
        var gameColor = $(".game .color");
        var oldColor = $(gameColor[0]).attr("class");
        var colorName = oldColor.replace("color ", "").split(" ").filter(function(el) {
            if (colors.indexOf(el) != -1) {
                return el;
            }
        })[0];
        var colorIndex = colors.indexOf(colorName);
        var color = $(this).attr("class");
        var newColorName = color.replace("color ", "").split(" ").filter(function(el) {
            if (colors.indexOf(el) != -1) {
                return el;
            }
        })[0];
        var newColorIndex = colors.indexOf(newColorName);
        var tmpArray = clone(gameArray);
        gameColor.each(function(index, element) {
            if ($(this).attr("class") === oldColor) {
                var x = Math.floor(index / size);
                var y = index % size;
                if (isNear(clone(gameArray), x, y, colorIndex)) {
                    tmpArray[x][y] = newColorIndex;
                    $(this).removeClass().addClass(color);
                }
            }
        });
        gameArray = clone(tmpArray);
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

    function init(size) {
        gameArray = new Array();
        for (var i = 0; i < size; i++) {
            gameArray[i] = new Array();
        }
        $(".game .color").remove();
        for (var i = 0; i < size * size; i++) {
            var color = "";
            if (size > 14) {
                color = " big";
            }
            $(".game").append('<div class="color' + color + '"></div>');
        }
        $(".game .color").each(function(index, element) {
            var color = Math.floor(Math.random() * 6);
            gameArray[Math.floor(index / size)][index % size] = color;
            $(this).addClass(colors[color]);
        });
    }

    function clone(original) {
        var newObj = (original instanceof Array) ? [] : {};
        for (i in original) {
            if (i == 'clone') continue;
            if (original[i] && typeof original[i] == "object") {
                newObj[i] = clone(original[i]);
            }
            else {
                newObj[i] = original[i]
            }
        } return newObj;
    }
});