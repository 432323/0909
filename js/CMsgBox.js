function CMsgBox(szMsg, oFunction) {

    var _oTitleStroke;
    var _oTitle;
    var _oButYes;
    var _oFade;
    var _oPanelContainer;
    var _oParent;
    var _oListener;
    
    var _pStartPanelPos;

    this._init = function (szMsg, oFunction) {
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oListener = _oFade.on("mousedown",function(){});
        s_oStage.addChild(_oFade);
        
        new createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        _oPanelContainer = new createjs.Container();        
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height/2;  
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        new createjs.Tween.get(_oPanelContainer).to({y:CANVAS_HEIGHT/2 - 40},500, createjs.Ease.quartIn);
        
        _oTitleStroke = new createjs.Text(szMsg," 20px "+PRIMARY_FONT, "#000000");
        _oTitleStroke.y = -oSprite.height/2 + 60;
        _oTitleStroke.textAlign = "center";
        _oTitleStroke.textBaseline = "middle";
        _oTitleStroke.lineWidth = 550;
        _oTitleStroke.outline = 5;
        _oPanelContainer.addChild(_oTitleStroke);

        _oTitle = new createjs.Text(szMsg," 20px "+PRIMARY_FONT, "#ffffff");
        _oTitle.y = _oTitleStroke.y;
        _oTitle.textAlign = "center";
        _oTitle.textBaseline = "middle";
        _oTitle.lineWidth = 550;
        _oPanelContainer.addChild(_oTitle);

        _oButYes = new CGfxButton(0, 80, s_oSpriteLibrary.getSprite('but_yes'), _oPanelContainer);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onButYes, this);
        _oButYes.pulseAnimation();
        
    };

    this._onButYes = function () {
        _oButYes.setClickable(false);
        
        new createjs.Tween.get(_oFade).to({alpha:0},500);
        new createjs.Tween.get(_oPanelContainer).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){

            _oParent.unload();
            if(oFunction){
                oFunction();
            }
        }); 
    };

    this.changeMessage = function(szText){
        _oTitleStroke.text = szText;
        _oTitle.text = szText;
    };

    this.unload = function () {
        _oButYes.unload();

        s_oStage.removeChild(_oFade);
        s_oStage.removeChild(_oPanelContainer);

        _oFade.off("mousedown",_oListener);
    };

    _oParent = this;
    this._init(szMsg, oFunction);
}

