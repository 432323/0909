function CModuleMultiplier(oSpriteContainer, oForeGroundContainer){
    
    var _aCapsule;
    var _aMultiplierIndicator;
    
    var _oToggleSystem;
    var _oParent;
    
    this._init = function(oSpriteContainer, oForeGroundContainer){
        this._addCapsule();
        this._addToggle();
        this._addMultiplierIndicator();
    };
    
    this._addCapsule = function(){
        _aCapsule = new Array();
        
        var oPos = {x: 428, y: 286};
        
        var oSprite = s_oSpriteLibrary.getSprite('capsule_0');
        var oCapsule = new CLightIndicator(oSprite, oPos.x, oPos.y, oForeGroundContainer);
        _aCapsule.push(oCapsule);
        
        var oSprite = s_oSpriteLibrary.getSprite('capsule_1');
        var oCapsule = new CLightIndicator(oSprite, oPos.x + 112, oPos.y + 26, oForeGroundContainer);
        _aCapsule.push(oCapsule);
        
        var oSprite = s_oSpriteLibrary.getSprite('capsule_2');
        var oCapsule = new CLightIndicator(oSprite, oPos.x + 228, oPos.y + 26, oForeGroundContainer);
        _aCapsule.push(oCapsule);
        
        var oSprite = s_oSpriteLibrary.getSprite('capsule_3');
        var oCapsule = new CLightIndicator(oSprite, oPos.x + 342, oPos.y, oForeGroundContainer);
        _aCapsule.push(oCapsule);
    };
    
    this._addToggle = function(){
        var iWidth = 4;
        var iHeight = 8;
        var iX = 380;
        var iY = 280;
        var iAngle = 0;
        
        var oSprite = s_oSpriteLibrary.getSprite('multiplier_toggle_light');
        
        _oToggleSystem = new CToggleSystem();
        _oToggleSystem.addButton(iWidth, iHeight, iX, iY, iAngle, oSprite, 0, -80, oSpriteContainer, TEXT_MULTI[0]);
        _oToggleSystem.addButton(iWidth, iHeight, iX +110, iY + 24, iAngle, oSprite, 0, -80, oSpriteContainer, TEXT_MULTI[1]);
        _oToggleSystem.addButton(iWidth, iHeight, iX +220, iY + 40, iAngle, oSprite, 0, -80, oSpriteContainer, TEXT_MULTI[2]);
        _oToggleSystem.addButton(iWidth, iHeight, iX +330, iY + 24, iAngle, oSprite, 0, -80, oSpriteContainer, TEXT_MULTI[3]);
        _oToggleSystem.addButton(iWidth, iHeight, iX +440, iY, iAngle, oSprite, 0, -80, oSpriteContainer, TEXT_MULTI[4]);
        
        _oToggleSystem.addAllButtonHitListener(this._onAllLightOn);
        _oToggleSystem.addSingleButtonListener(this._onToggle);
    };
    
    this._onToggle = function(iIndex){
        s_oScoreController.addMultiplierToggleScore();
        _oParent._radialAnim(iIndex);
    };
    
    this._onAllLightOn = function(){
        s_oScoreController.increaseMultiplier();
        s_oScoreController.addTotalMultiplierToggleScore();
        
        var iCurMult = s_oScoreController.getCurMultiplier();
        for(var i=2; i<=MAX_MULTIPLIER; i++){
            _aMultiplierIndicator[i].lit(false);
        }
        _aMultiplierIndicator[iCurMult].lit(true);
    };

    this._addMultiplierIndicator = function(){
        _aMultiplierIndicator = new Array();
        
        var oMultIndicatorContainer = new createjs.Container();
        oMultIndicatorContainer.x = 526;
        oMultIndicatorContainer.y = 1680;
        oSpriteContainer.addChild(oMultIndicatorContainer);
        
        var iNumMultiplierPerSide = Math.floor( (MAX_MULTIPLIER-1)/2 );
        var iCont = 2;
        
        var oLeftIndicator = new createjs.Container();
        oLeftIndicator.x = -440;
        oMultIndicatorContainer.addChild(oLeftIndicator);
        
        for(var i=0; i<iNumMultiplierPerSide; i++){
            var oSprite = s_oSpriteLibrary.getSprite('multiplier_light');
            var oMult = new CLightIndicator(oSprite, i*112, i*54, oLeftIndicator);
            oMult.addText("x"+iCont, 0, 0, 50, "#8416ff");
            oMult.rotate(25);
            _aMultiplierIndicator[iCont] = oMult;
            iCont++;
        };
        
        
        var oRightIndicator = new createjs.Container();
        oRightIndicator.x = 430;
        oMultIndicatorContainer.addChild(oRightIndicator);
        
        for(var i=0; i<iNumMultiplierPerSide; i++){
            var oSprite = s_oSpriteLibrary.getSprite('multiplier_light');
            var oMult = new CLightIndicator(oSprite, -i*112, i*54, oRightIndicator);
            oMult.addText("x"+iCont, 0, 0, 50, "#8416ff");
            oMult.rotate(-25);
            _aMultiplierIndicator[iCont] = oMult;
            iCont++;
        };
        
        if(iCont === MAX_MULTIPLIER){
            var oSprite = s_oSpriteLibrary.getSprite('multiplier_light');
            var oMult = new CLightIndicator(oSprite, 0, 160, oMultIndicatorContainer);
            oMult.addText("x"+iCont, 0, 0, 50, "#8416ff");
            _aMultiplierIndicator[iCont] = oMult;
        }

    };
    
    this._radialAnim = function(iStartIndex){
        var iCont = 0;
        for(var i=iStartIndex; i<_aCapsule.length; i++){
            _aCapsule[i].slowHighlight(500, iCont*150, function(){});
            iCont++;
        }
        
        if(iStartIndex>0){
            var iCont = 0;
            for(var i=iStartIndex-1; i>=0; i--){
                _aCapsule[i].slowHighlight(500, iCont*150, function(){});
                iCont++;
            }
        }
    };
    
    this.reset = function(){
        _oToggleSystem.reset();
       
        _aMultiplierIndicator.forEach(function(oObj){
            oObj.lit(false);
        });
    };
    
    this.shiftElementsToRight = function(){
        _oToggleSystem.shiftRight();
    };
    
    this.shiftElementsToLeft = function(){
        _oToggleSystem.shiftLeft();
    };
    
    _oParent = this;
    this._init(oSpriteContainer, oForeGroundContainer);
}


