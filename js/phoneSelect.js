function phoneSelect(targetStr, rowNumber) {
    if (targetStr) {
        this.target = targetStr;
    } else {
        this.target = "body";
    }
    if (rowNumber) {
        this.row = rowNumber;
    } else {
        this.row = 1;
    }
    this.clock = [];
    this.data = [];
    for (var i = 0; i < this.row; i++) {
        this.clock[i] = 0;
        this.data[i] = [];
    }
    $(this.target).empty();
    $(this.target).append('<div class="phoneSelect">' + 
    '<div class="line" id="line1"></div>' + 
    '<div class="line" id="line2"></div>' + 
    '<div class="frame">' + 
    '</div>' + 
    '</div>');
    this.reflash();
}
phoneSelect.prototype.inited = 0;
phoneSelect.prototype.degArray = [0, 330, 300, 270, 240, 210, 180, 150, 120, 90, 60, 30];
phoneSelect.prototype.Z = 200;
phoneSelect.prototype.H = 108;
phoneSelect.prototype.row = 1;
phoneSelect.prototype.clock = [0];
phoneSelect.prototype.data = [[]];
phoneSelect.prototype.target = "body";
phoneSelect.prototype.callback = function() {}
phoneSelect.prototype.result = function(row) {
    var result = [];
    $(this.target).find(".selected").each(function() {
        result[Number($(this).parents(".roll").attr("roll"))] = $(this).attr("value");
    });
    this.callback({
        result: result,
        row: row
    });
}
phoneSelect.prototype.set = function(rowNumber, rowData) {
    this.data[rowNumber] = rowData;
	var df=0;
	$.each(rowData,function(index,value){
		if(value.selected){
			df=index;
			}
		});
    this.reflash(rowNumber,df);
    this.result(rowNumber);
}
phoneSelect.prototype.run = function(i) {
    var that = this;
    $(that.target).find("[roll='" + i + "'] .point").removeClass("selected");
    for (var x = 0; x < that.degArray.length; x++) {
        var showOp = Math.abs(0.5 - (((that.degArray[x] + (that.clock[i] * 30)) % 360) / 360 || 1));
        var offset = that.clock[i] % 12;
        if (showOp == 0.5) {
            showOp = 1;
        } else if (showOp < 0.2) {
            showOp = 0;
        } else {
            showOp = showOp * 0.8;
        }
        $(that.target).find("[roll='" + i + "'] .point").eq(x).css({
            "transition-timing-function": "cubic-bezier(0.1, 0.57, 0.1, 1)",
            "-webkit-transition-timing-function": "cubic-bezier(0.1, 0.57, 0.1, 1)",
            "transition-duration": "1000ms",
            "-webkit-transition-duration": "1000ms",
            "transform": "rotateX(" + (that.degArray[x] + (that.clock[i] * 30)) + "deg) translateZ(" + that.Z + "px)",
            "-webkit-transform": "rotateX(" + (that.degArray[x] + (that.clock[i] * 30)) + "deg) translateZ(" + that.Z + "px)",
            "height": that.H + "px",
            "line-height": that.H + "px",
            "opacity": showOp
        })
    }
    for (var y = -3; y <= 3; y++) {
        var pointNumber = offset + y;
        if (pointNumber < 0) {
            pointNumber = 12 + pointNumber;
        }
        if (pointNumber > 11) {
            pointNumber = pointNumber - 12;
        }
        var str = "";
        if (that.data[i] && that.data[i][that.clock[i] + y] && typeof (that.data[i][that.clock[i] + y].label)) {
            str = that.data[i][that.clock[i] + y].label;
        }
        var val = "";
        if (that.data[i] && that.data[i][that.clock[i] + y] && typeof (that.data[i][that.clock[i] + y].value)) {
            val = that.data[i][that.clock[i] + y].value;
        }
        $(that.target).find("[roll='" + i + "'] [point='" + pointNumber + "']").html(str);
        $(that.target).find("[roll='" + i + "'] [point='" + pointNumber + "']").attr("value", val);
        if (y == 0) {
            $(that.target).find("[roll='" + i + "'] [point='" + pointNumber + "']").addClass("selected");
        }
    }
}
phoneSelect.prototype.reflash = function(num,df) {
    var that = this;
    if (typeof (num) != "number") {
        for (var i = 0; i < that.row; i++) {
            var newRoll = $('<div class="roll" roll="' + i + '"></div>').appendTo($(that.target).find(".frame"));
            newRoll.css("width", (1 / that.row * 100) + "%");
            for (var y = 0; y < 12; y++) {
                var newPoint = $('<div class="point" point="' + y + '" value=""></div>').appendTo(newRoll);
            }
            that.run(i)
            that.inited = 1;
            newRoll.unbind("swipeup").bind("swipeup", function() {
                var index = Number($(this).attr("roll"));
                if (that.clock[index] == that.data[index].length - 1) {
                    return false;
                }
                that.clock[index]++;
                that.run(index);
                that.result(index);
            });
            newRoll.unbind("swipedown").bind("swipedown", function() {
                var index = Number($(this).attr("roll"));
                if (that.clock[index] == 0) {
                    return false;
                }
                that.clock[index]--;
                that.run(index);
                that.result(index);
            });
        }
        $(that.target).find(".frame").append('<div class="clear"></div>');
    } else {
		if(df){
			that.clock[num]=df;
			}else{
			that.clock[num] = 0;	
				}
        that.run(num);
    }
}
