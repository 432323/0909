function CPausePanel(oContainer) {
    var _oFade;
    var _oPanelContainer;
    var _oParent;
    
    var _pStartPanelPos;

    this._init = function (oContainer) {
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oFade.on("mousedown",function(){});
        oContainer.addChild(_oFade);
        
        _oPanelContainer = new createjs.Container();        
        oContainer.addChild(_oPanelContainer);


        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT/2;  


        var oTitle = new createjs.Text(TEXT_PAUSE," 54px "+PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        oTitle.y = 0;
        oTitle.textAlign = "center";
        oTitle.textBaseline = "middle";
        oTitle.lineWidth = 400;
        _oPanelContainer.addChild(oTitle);

        _oFade.alpha = 0;
        _oPanelContainer.alpha = 0;

    };

    this.show = function(){        
        createjs.Tween.get(_oFade).to({alpha:0.7},500);
        createjs.Tween.get(_oPanelContainer).to({alpha:1},500);
    };
    
    this.hide = function () {
        createjs.Tween.get(_oFade).to({alpha:0},500);
        createjs.Tween.get(_oPanelContainer).to({alpha:0},500);

    };

    _oParent = this;
    this._init(oContainer);
}

