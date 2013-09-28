/**
 * Created by mustafa1453 on 9/22/13.
 */
$(function() {
    if (navigator.userAgent.indexOf('Chrome') === -1){
        $(".title").addClass("not-chrome");
    }

    var caravans = 0;

    var colors = ["red", "blue", "orange", "violet", "green", "yellow"];
    var gameArray;
    var size = 14;
    var turns = 0;
    var maxTurns = 25;
    var indexes;
    var lang = 'eng';
    init(size);

    $(".refresh").click(function() {
        init(size);
    });

    $(".complexity").click(function() {
        var complex = $(this);
        var type = complex.data("type");
        complex.parent().find(".complexity").removeClass("active");
        complex.parent().find('.complexity[data-type="' + type +'"]').addClass("active");
        size = type === "small" ? 14 : 28; // 14 for small. 28 for large field.
        maxTurns = size == 14 ? 25 : 50; // 25 for small. 50 for large field.
        init(size);
    })

    $(".colors .color").click(function() {
        if (turns < maxTurns && !isWin(gameArray)) {
            turns += 1;
            $(".turns .button-label[data-lang='eng']").text("Turns: " + turns + "/" + maxTurns);
            $(".turns .button-label[data-lang='rus']").text("Ходы: " + turns + "/" + maxTurns);
        }
        else if (!isWin(gameArray))  {
            $.fn.SimpleModal({
                hideHeader: true,
                closeButton: false,
                btn_ok: 'Close',
                width: 600,
                model: 'alert',
                contents: '<p data-lang="eng">You lose. Do not get discouraged. Please try again.</p>' +
                    '<p data-lang="rus">Вы проиграли. Не расстраивайтесь, и попробуйте еще раз.</p>'
            }).showModal();
            translate();
            init(size);
            return;
        }
        var gameColor = $(".game .color");
        var oldColorName = $(gameColor[0]).attr("class").replace("color ", "").split(" ").filter(function(el) {
            if (colors.indexOf(el) != -1) {
                return el;
            }
        })[0];
        var oldColorIndex = colors.indexOf(oldColorName);
        var newColor = $(this).attr("class");
        var newColorName = newColor.replace("color ", "").split(" ").filter(function(el) {
            if (colors.indexOf(el) != -1) {
                return el;
            }
        })[0];
        var newColorIndex = colors.indexOf(newColorName);
        var tmpArray = clone(gameArray);
        gameColor.each(function(index, element) {
            if ($(this).attr("class").indexOf(oldColorName) >= 0) {
                var x = Math.floor(index / size);
                var y = index % size;
                if (indexes.indexOf(index) >= 0 || isNear(clone(gameArray), x, y, oldColorIndex)) {
                    if (indexes.indexOf(index) === -1) {
                        indexes.push(index);
                    }
                    tmpArray[x][y] = newColorIndex;
                    $(this).removeClass().addClass(newColor);
                    if (size > 14) {
                        $(this).addClass("big");
                    }
                }
            }
        });
        gameArray = clone(tmpArray);
        if (isWin(gameArray) && turns <= maxTurns) {
            $.fn.SimpleModal({
                hideHeader: true,
                closeButton: false,
                btn_ok: 'Close',
                width: 600,
                model: 'alert',
                contents: '<p data-lang="eng">You win. Our congratulations.</p>' +
                    '<p data-lang="rus">Вы победили. Наши поздравления.</p>'
            }).showModal();
            translate();
        }
    });

    $('[data-lang="rus"]').hide();

    $('.lang div').click(function() {
        lang = $(this).attr("class");
        translate();
    });

    $('.caravan .btn').click(function(e) {
        caravans++;
        var image = Math.floor(Math.random() * 11);
        $.fn.SimpleModal({
            hideHeader: true,
            closeButton: false,
            btn_ok: 'Close',
            width: 400,
            model: 'alert',
            contents: '<img style="max-height: 200px;" src="img/' + image + '.jpg">' +
                '<p data-lang="eng">It\'s a wonderfull game where you can rob the caravan. You have robed the caravan.</p>' +
                '<p data-lang="rus">Это чумачечая игра, где вы такоже можете ограбить корован. О, смотрите-ка, еще один попался.</p>' +
                '<p data-lang="eng">Number of robed caravans: ' + caravans + '.</p>' +
                '<p data-lang="rus">Количество ограбленых корованов: ' + caravans + '.</p>'
        }).showModal();
        translate();
    });

    $('.rules .btn').click(function(e) {
        $.fn.SimpleModal({
            hideHeader: true,
            closeButton: false,
            btn_ok: 'Close|Закрыть',
            width: 600,
            model: 'alert',
            contents:
                '<p data-lang="eng">Fill the board with one color within the allowed steps.' +
                    'Game starts from the top left cell. ' +
                    'Select a color by clicking on one of the squares on the left and ' +
                    'the cells will change color to selected - so you can connect neighboring cells of the same color. ' +
                    'Grab the box to the minimum number of moves.</p>' +
                    '<p data-lang="rus">Заполните поле одним цветом за ограниченое количество ходов. ' +
                    'Игра начинаеться с верхнего левого квадрата. ' +
                    'Выберете цвет, нажав на один из кругов слева, и квадраты окрасятся этим цветом - ' +
                    'так вы присоедините соседние квадраты того же цвета. ' +
                    'Заполнить поле нужно за минимальное число ходов.</p>'
        }).showModal();
        translate();
    });

    function translate() {
        if (lang == "rus") {
            $(".simple-modal-footer a").text("Закрыть");
            $('[data-lang="eng"]').hide();
            $('[data-lang="rus"]').show();
        }
        if (lang == "eng") {
            $(".simple-modal-footer a").text("Close");
            $('[data-lang="eng"]').show();
            $('[data-lang="rus"]').hide();
        }
    }

    function isNear(matrix, y, x, color) {
        matrix.forEach(function(row, i) {
            matrix[i] = row.map(function(item) { return item == color ? 0 : 1; });
        });
        var grid = new PF.Grid(matrix.length, matrix.length, matrix);
        var finder = new PF.AStarFinder();
        var path = finder.findPath(0, 0, x, y, grid);
        return path.length > 0;
    }

    function init(size) {
        turns = 0;
        indexes = new Array()
        $(".turns .button-label[data-lang='eng']").text("Turns: " + turns + "/" + maxTurns);
        $(".turns .button-label[data-lang='rus']").text("Ходы: " + turns + "/" + maxTurns);
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

    function isWin(matrix) {
        var temp = matrix[0][0];
        for (var row = 0; row < matrix.length; row++) {
            for (var cell = 0; cell < matrix[row].length; cell++) {
                if (temp != matrix[row][cell]) {
                    return false;
                }
            }
        }
        return true;
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
