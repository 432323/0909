function CHelpPanel(){
    var _bExitPanel;
    
    var _oText1;
    var _oText2;

    var _oFade;
    var _oPanelContainer;
    var _oParent;
    var _oListener;
    var _oListenerFade;

    var _pStartPanelPos;

    this._init = function(){
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 1;
        _oListenerFade = _oFade.on("mousedown",function(){_oParent._onExitHelp()});
        s_oStage.addChild(_oFade);
        
        new createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        _oPanelContainer = new createjs.Container();     
        _oListener = _oPanelContainer.on("mousedown",function(){_oParent._onExitHelp()});
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height/2;  
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        new createjs.Tween.get(_oPanelContainer).to({y:CANVAS_HEIGHT/2 - 40},500, createjs.Ease.cubicOut);

        if(s_bMobile){
            var oSprite = s_oSpriteLibrary.getSprite('flipper');
            var oRightFlipperSprite = createBitmap(oSprite);
            oRightFlipperSprite.x = 250;
            oRightFlipperSprite.y = -80;
            oRightFlipperSprite.regX = oSprite.width-7;
            oRightFlipperSprite.regY = 14;
            oRightFlipperSprite.scaleX = 0.5;
            oRightFlipperSprite.scaleY = 0.5;
            _oPanelContainer.addChild(oRightFlipperSprite);
            
            var oSprite = s_oSpriteLibrary.getSprite('flipper');
            var oLeftFlipperSprite = createBitmap(oSprite);
            oLeftFlipperSprite.x = -250;
            oLeftFlipperSprite.y = -80;
            oLeftFlipperSprite.regX = oSprite.width-7;
            oLeftFlipperSprite.regY = 14;
            oLeftFlipperSprite.scaleX = -0.5;
            oLeftFlipperSprite.scaleY = 0.5;
            _oPanelContainer.addChild(oLeftFlipperSprite);
            
            createjs.Tween.get(oLeftFlipperSprite, {loop:true}).to({rotation: -50}, 100, createjs.Ease.cubicIn).wait(Math.random()*500).to({rotation: 0}, 500, createjs.Ease.cubicIn);
            createjs.Tween.get(oRightFlipperSprite, {loop:true}).to({rotation: 50}, 100, createjs.Ease.cubicIn).wait(Math.random()*500).to({rotation: 0}, 500, createjs.Ease.cubicIn);
            
            var oText1Pos = {x: 0, y: -110};

            var iWidth = 300;
            var iHeight = 70;
            var iTextX = oText1Pos.x;
            var iTextY = oText1Pos.y;
            _oText1 = new CTLText(_oPanelContainer, 
                        iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                        20, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1.3,
                        2, 2,
                        TEXT_HELP1_MOBILE,
                        true, true, true,
                        false );
           
            
        }else {
            var oText1Pos = {x: -250, y: -110};
           
            var iWidth = 300;
            var iHeight = 80;
            var iTextX = oText1Pos.x;
            var iTextY = oText1Pos.y;
            _oText1 = new CTLText(_oPanelContainer, 
                        iTextX, iTextY-iHeight/2, iWidth, iHeight, 
                        20, "left", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1.3,
                        2, 2,
                        TEXT_HELP1,
                        true, true, true,
                        false );

            var oSprite = s_oSpriteLibrary.getSprite('keys');
            var oKeys = createBitmap(oSprite);
            oKeys.x = 130;
            oKeys.y = -100;
            oKeys.regX = oSprite.width/2;
            oKeys.regY = oSprite.height/2;
            _oPanelContainer.addChild(oKeys);
        }
        

        var oText2Pos = {x: 0, y:50};
  
        var iWidth = 400;
        var iHeight = 80;
        var iTextX = oText2Pos.x;
        var iTextY = oText2Pos.y;
        _oText2 = new CTLText(_oPanelContainer, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    20, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1.3,
                    2, 2,
                    TEXT_HELP2,
                    true, true, true,
                    false );

        
        var oSprite = s_oSpriteLibrary.getSprite('star');
        var oStar = createBitmap(oSprite);
        oStar.regX = oSprite.width/2;
        oStar.regY = oSprite.height/2;
        oStar.y = 120;
        _oPanelContainer.addChild(oStar);
        
    };

    this.unload = function(){
        s_oStage.removeChild(_oFade);
        s_oStage.removeChild(_oPanelContainer);

        _oListener = _oPanelContainer.off("mousedown",function(){_oParent._onExitHelp()});
        _oListenerFade = _oFade.off("mousedown",function(){_oParent._onExitHelp()});

    };

    this._onExitHelp = function(){
        if(_bExitPanel){
            return;
        }
        _bExitPanel = true;

        new createjs.Tween.get(_oFade).to({alpha:0},500);
        new createjs.Tween.get(_oPanelContainer).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){

            _oParent.unload();
            s_oGame._onExitHelp();
        });
    };

    _oParent=this;
    this._init();

}
