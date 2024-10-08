function CModuleRouter(oSpriteContainer, oForeGroundContainer){
    
    var _iTimeElapse;
    
    var _aScoreBonusLabel;
    
    var _oParent;
    
    this._init = function(oSpriteContainer, oForeGroundContainer){
        _iTimeElapse = 0;
        
        this._addRouterGate();
        
        this._addLabels();
        
        var iCurRouterLevel = s_oScoreController.getCurRouterLevel(); 
        _aScoreBonusLabel[iCurRouterLevel].highlight(2000);
        
        this._setIntervalTime();
        
    };
    
    this._setIntervalTime = function(){
        _iTimeElapse = TIME_ROUTER_SCORE_DECREASE;
    };
    
    this._addRouterGate = function(){
        var oGate = new CGateSystem(256, 176);
        oGate.addGate(60,8, 45);
        var oSprite = s_oSpriteLibrary.getSprite('gate');
        oGate.addSprite(oSprite, oForeGroundContainer, 25, oSprite.height/8, oSprite.width/2 + 16);
        
        oGate.addOpener(-40,40, 12, true);
        oGate.addCloser(56,-32, 12, true);
        oGate.addCloser(-148,176, 12, false);
        oGate.addPassingGateListener(this._routerPassed);
    };
    
    this._routerPassed = function(){
        
        var iCurRouterLevel = s_oScoreController.getCurRouterLevel(); 
        _aScoreBonusLabel[iCurRouterLevel].lit(true);
        
        s_oScoreController.addRouterScore();
        s_oScoreController.increaseRouterLevel();
        
        var iCurRouterLevel = s_oScoreController.getCurRouterLevel(); 
        _aScoreBonusLabel[iCurRouterLevel].highlight(2000);
        
        _oParent._setIntervalTime();
        
    };
    
    this._addLabels = function(){
        _aScoreBonusLabel = new Array();
        
        var oPos = {x: 188, y: 240};
        var iTextValueCounter = 0;
        
        var oSprite = s_oSpriteLibrary.getSprite('router_light_0');
        var oLight = new CLightIndicator(oSprite, oPos.x-116, oPos.y+384, oSpriteContainer);
        oLight.addText(TEXT_ROUTER_VALUE[iTextValueCounter], 0, 0, 26, "#f947ce");
        iTextValueCounter++;
        _aScoreBonusLabel.push(oLight);
        
        var oSprite = s_oSpriteLibrary.getSprite('router_light_1');
        var oLight = new CLightIndicator(oSprite, oPos.x-116, oPos.y+316, oSpriteContainer);
        oLight.addText(TEXT_ROUTER_VALUE[iTextValueCounter], 0, 0, 20, "#55bdf5");
        iTextValueCounter++;
        _aScoreBonusLabel.push(oLight);
        
        var oSprite = s_oSpriteLibrary.getSprite('router_light_2');
        var oLight = new CLightIndicator(oSprite, oPos.x-116, oPos.y+248, oSpriteContainer);
        oLight.addText(TEXT_ROUTER_VALUE[iTextValueCounter], 0, 0, 18, "#73ec34");
        iTextValueCounter++;
        _aScoreBonusLabel.push(oLight);
        
        var oSprite = s_oSpriteLibrary.getSprite('router_light_3');
        var oLight = new CLightIndicator(oSprite, oPos.x-108, oPos.y+180, oSpriteContainer);
        oLight.addText(TEXT_ROUTER_VALUE[iTextValueCounter], 0, 0, 18, "#f2a937");
        iTextValueCounter++;
        _aScoreBonusLabel.push(oLight);
        
        var oSprite = s_oSpriteLibrary.getSprite('router_light_4');
        var oLight = new CLightIndicator(oSprite, oPos.x-84, oPos.y+120, oSpriteContainer);
        oLight.addText(TEXT_ROUTER_VALUE[iTextValueCounter], 0, 0, 26, "#f22935");
        iTextValueCounter++;
        _aScoreBonusLabel.push(oLight);
        
        var oSprite = s_oSpriteLibrary.getSprite('router_light_5');
        var oLight = new CLightIndicator(oSprite, oPos.x-48, oPos.y+60, oSpriteContainer);
        oLight.addText(TEXT_ROUTER_VALUE[iTextValueCounter], 0, 0, 26, "#f3dc47");
        iTextValueCounter++;
        _aScoreBonusLabel.push(oLight);
        
        var oSprite = s_oSpriteLibrary.getSprite('router_light_6');
        var oLight = new CLightIndicator(oSprite, oPos.x, oPos.y, oSpriteContainer);
        oLight.addText(TEXT_ROUTER_VALUE[iTextValueCounter], 0, 0, 26, "#9e2bf2");
        iTextValueCounter++;
        _aScoreBonusLabel.push(oLight);
    };
    
    this._levelDecreased = function(){
        var iCurRouterLevel = s_oScoreController.getCurRouterLevel();
        if(iCurRouterLevel > 0){
            _aScoreBonusLabel[iCurRouterLevel].lit(false);
        
            s_oScoreController.decreaseRouterLevel();

            var iCurRouterLevel = s_oScoreController.getCurRouterLevel(); 
            _aScoreBonusLabel[iCurRouterLevel].highlight(2000);
        }
        
    };
    
    this.reset = function(){
        s_oScoreController.resetRouterLevel();
        
        for(var i=0; i<_aScoreBonusLabel.length; i++){
            _aScoreBonusLabel[i].slowOff(500, (_aScoreBonusLabel.length - i -1)*100);
        }
        
        var iCurRouterLevel = s_oScoreController.getCurRouterLevel(); 
        _aScoreBonusLabel[iCurRouterLevel].highlight(2000);
    };
    
    this.update = function(){
        _iTimeElapse -= s_iTimeElaps;
        if(_iTimeElapse<0){
            _oParent._setIntervalTime();
            _oParent._levelDecreased();
        }
    };
    
    _oParent = this;
    this._init(oSpriteContainer, oForeGroundContainer);
}



