function CModuleHole(oSpriteContainer, oForeGroundContainer){
    var _bScoreBonusActive;
    var _bShieldBonusActive;
    var _bExtraBallBonusActive;

    
    var _aScoreBonusLabel;
    
    var _oShieldLight;
    var _oExtraBallLight;
    var _oButtonSystem;
    var _oParent;
    
    this._init = function(oSpriteContainer, oForeGroundContainer){

        
        _bScoreBonusActive = false;
        _bShieldBonusActive = false;
        _bExtraBallBonusActive = false;

        
        this._addHole();
        this._addRightSystemButton();
        
        this._addLabels();
    };
    
    this._addHole = function(){
        var iX = 988;
        var iY = 680;
        var iHoldingTime = 1000;
        
        var oHole = new CHoleSystem(iX, iY, iHoldingTime);
        oHole.addHoleEventListener(this._onHole);
        oHole.setLaunchImpulse(0, 0.8);
        
        var oSprite = s_oSpriteLibrary.getSprite('hole');
        var oHoleSprite = createBitmap(oSprite);
        oHoleSprite.x = 932;
        oHoleSprite.y = 600;
        oForeGroundContainer.addChild(oHoleSprite);
        
    };
    
    this._addRightSystemButton = function(){
        var iWidth = 8;
        var iHeight = 56;
        var iX = 924;
        var iY = 980;
        var iOffset = 12;
        var iAngle = 0;
        var iNumButton = 4;
        
        _oButtonSystem = new CButtonSystem();
        var iCont = 2;
        for(var i=0; i<iNumButton; i++){
            var oSprite = s_oSpriteLibrary.getSprite('button_light_'+iCont);
            _oButtonSystem.addButton(iWidth, iHeight, iX, iY + i*(iHeight +iOffset), iAngle, oSprite, -52, 0, oSpriteContainer);
            
            var oSprite = s_oSpriteLibrary.getSprite('bumper_button');
            var oButton = new CLightIndicator(oSprite, iX - 6, iY + i*(iHeight +iOffset), oSpriteContainer);
            
            iCont++;
        }
        
        _oButtonSystem.addAllButtonHitListener(this._onAllButtonActive);
        _oButtonSystem.addSingleButtonListener(s_oScoreController.addButtonScore);
    };
    
    this._onAllButtonActive = function(){
        s_oScoreController.addTotalHoleButtonScore();
        
        if(!_bScoreBonusActive){
            _bScoreBonusActive = true;
            s_oScoreController.increaseHoleBonusLevel();
            var iCurHoleLevel = s_oScoreController.getCurHoleBonusLevel(); 
            _aScoreBonusLabel[iCurHoleLevel].highlight(2000);
        }
    };
    
    this._onHole = function(){

        _oButtonSystem.reset();

        if(_bScoreBonusActive){
            _bScoreBonusActive = false;
            s_oScoreController.addHoleScoreBonus();
            var iCurHoleLevel = s_oScoreController.getCurHoleBonusLevel(); 
            _aScoreBonusLabel[iCurHoleLevel].lit(true);
            
            if(iCurHoleLevel === HOLE_BONUS_SCORE.length-1){
                _oParent.reset();
            }
            
        }else {
            s_oScoreController.addStandardHoleScore();
        }

        
        if(_bExtraBallBonusActive){
            playSound("bonus_win_1", 1, false);
            _oParent._activeExtraBall();
        }
        if(_bShieldBonusActive){
            playSound("bonus_win_1", 1, false);
            _oParent._activeShield();
        }
        
    };
    
    this._activeShield = function(){
        _oParent.disableShieldLight();
        s_oTable.activeShield();
    };
    
    this._activeExtraBall = function(){
        _oParent.disableExtraBallLight();
        s_oTable.activeExtraBall();
    };
    
    this._addLabels = function(){
        _aScoreBonusLabel = new Array();
        
        var oPos = {x: 1008, y: 880};
        var iTextValueCounter = 0;
        
        var oSprite = s_oSpriteLibrary.getSprite('light_indicator_0');
        var oLight = new CLightIndicator(oSprite, oPos.x, oPos.y, oSpriteContainer);
        oLight.addText(TEXT_HOLE_VALUE[iTextValueCounter], 0, 0, 46, "#f68eff");
        oLight.textRotate(-20);
        oLight.scale(0.68);
        iTextValueCounter++;
        _aScoreBonusLabel.push(oLight);
        
        var oSprite = s_oSpriteLibrary.getSprite('light_indicator_0');
        var oLight = new CLightIndicator(oSprite, oPos.x, oPos.y+60, oSpriteContainer);
        oLight.addText(TEXT_HOLE_VALUE[iTextValueCounter], 0, 0, 46, "#f68eff");
        oLight.textRotate(-20);
        oLight.scale(0.68);
        iTextValueCounter++;
        _aScoreBonusLabel.push(oLight);
        
        var oSprite = s_oSpriteLibrary.getSprite('light_indicator_0');
        var oLight = new CLightIndicator(oSprite, oPos.x, oPos.y+120, oSpriteContainer);
        oLight.addText(TEXT_HOLE_VALUE[iTextValueCounter], 0, 0, 36, "#f68eff");
        oLight.textRotate(-20);
        oLight.scale(0.68);
        iTextValueCounter++;
        _aScoreBonusLabel.push(oLight);
        
        var oSprite = s_oSpriteLibrary.getSprite('light_indicator_0');
        var oLight = new CLightIndicator(oSprite, oPos.x, oPos.y+180, oSpriteContainer);
        oLight.addText(TEXT_HOLE_VALUE[iTextValueCounter], 0, 0, 34, "#f68eff");
        oLight.textRotate(-20);
        oLight.scale(0.68);
        iTextValueCounter++;
        _aScoreBonusLabel.push(oLight);
        
        var oSprite = s_oSpriteLibrary.getSprite('light_indicator_0');
        var oLight = new CLightIndicator(oSprite, oPos.x, oPos.y+240, oSpriteContainer);
        oLight.addText(TEXT_HOLE_VALUE[iTextValueCounter], 0, 0, 26, "#f68eff");
        oLight.textRotate(-20);
        oLight.scale(0.68);
        iTextValueCounter++;
        _aScoreBonusLabel.push(oLight);
        
        var oSprite = s_oSpriteLibrary.getSprite('light_indicator_0');
        var oLight = new CLightIndicator(oSprite, oPos.x, oPos.y+300, oSpriteContainer);
        oLight.addText(TEXT_HOLE_VALUE[iTextValueCounter], 0, 0, 26, "#f68eff");
        oLight.textRotate(-20);
        oLight.scale(0.68);
        iTextValueCounter++;
        _aScoreBonusLabel.push(oLight);
        
        var oSprite = s_oSpriteLibrary.getSprite('light_indicator_2');
        var oLight = new CLightIndicator(oSprite, oPos.x, oPos.y+360, oSpriteContainer);
        oLight.addText(TEXT_HOLE_VALUE[iTextValueCounter], 0, 0, 50, "#ff4040");
        oLight.textRotate(-20);
        oLight.scale(0.68);
        iTextValueCounter++;
        _aScoreBonusLabel.push(oLight);
        
        var oSpecialLabelContainer = new createjs.Container();
        oSpecialLabelContainer.x = 928;
        oSpecialLabelContainer.y = 820;
        oSpriteContainer.addChild(oSpecialLabelContainer);
        
        //////////////////OTHER BONUS
        var oSprite = s_oSpriteLibrary.getSprite('light_indicator_1');
        _oShieldLight = new CLightIndicator(oSprite, 0, 0, oSpecialLabelContainer);
        _oShieldLight.addPreciseText(TEXT_SHIELD, 0, 0, 20, "#000000", 90, 70)
        _oShieldLight.scale(0.7);
        _oShieldLight.rotate(25);

        var oSprite = s_oSpriteLibrary.getSprite('light_indicator_2');
        _oExtraBallLight = new CLightIndicator(oSprite, -28, 60, oSpecialLabelContainer);
        _oExtraBallLight.addPreciseText(TEXT_EXTRABALL, 0, -2, 20, "#000000", 90, 70);
        _oExtraBallLight.scale(0.7);
        _oExtraBallLight.rotate(25);

    };
    
    this.reset = function(){
        _bScoreBonusActive = false;
        s_oScoreController.resetHoleBonusLevel();
        
        for(var i=0; i<_aScoreBonusLabel.length; i++){
            _aScoreBonusLabel[i].slowOff(500, (_aScoreBonusLabel.length - i -1)*100);
        }
        
        _oButtonSystem.reset();
        
        this.disableShieldLight();
        this.disableExtraBallLight();
    };
    
    this.disableShieldLight = function(){
        _bShieldBonusActive = false;
        _oShieldLight.lit(false);
    };
    
    this.disableExtraBallLight = function(){
        _bExtraBallBonusActive = false;
        _oExtraBallLight.lit(false);
    };
    
    this.activeShieldLight = function(){
        _bShieldBonusActive = true;
        _oShieldLight.highlight(2000);
    };
    
    this.activeExtraBallLight = function(){
        _bExtraBallBonusActive = true;
        _oExtraBallLight.highlight(2000);
    };
    
    _oParent = this;
    this._init(oSpriteContainer, oForeGroundContainer);
}


