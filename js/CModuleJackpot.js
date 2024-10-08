function CModuleJackpot(oSpriteContainer, oForeGroundContainer){
    var _bEnableJackpot;
    
    var _iTimeElapse;
    
    var _oParent;
    var _oJackpotLight;
    var _oJackpotText;
    
    this._init = function(oSpriteContainer, oForeGroundContainer){
        _bEnableJackpot = false;
        
        _iTimeElapse = 0;
        
        this._addGate();
        this._addActiveIndicator();
        this._addJackpotAmountIndicator();

    };
    
    
    this._addGate = function(){
        var oGate = new CGateSystem(172, 620);
        oGate.addGate(60,8, 35);
        var oSprite = s_oSpriteLibrary.getSprite('gate');
        oGate.addSprite(oSprite, oForeGroundContainer, 5, 80, oSprite.width/2 - 6);
        oGate.setRestitution(0);
        
        oGate.addOpener(24,-60, 12, true);
        oGate.addCloser(-40,56, 12, true);
        
        oGate.addPassingGateListener(this._onJackpot);

    };
    
    this._onJackpot = function(){
        s_oScoreController.addGateScore();
        
        if(!_bEnableJackpot){
            return;
        }
        //trace("JACKPOT!!!"+s_oScoreController.getJackpotAmount());
        playSound("bonus_win_2", 1, false);
        s_oScoreController.addJackpotScore();
        
        if(s_oScoreController.getJackpotAmount() >= EXTRABALL_JACKPOT_SCORE_ACTIVATION){
            s_oTable.enableExtraBallBonus();
        }
        
        s_oScoreController.resetJackpot();
        
        _bEnableJackpot = false;
        _oJackpotLight.flashing();
    };
    
    this._addActiveIndicator = function(){
        var oSprite = s_oSpriteLibrary.getSprite('jackpot');
        _oJackpotLight = new CLightIndicator(oSprite, 190, 360, oSpriteContainer);
    };
    
    this._addJackpotAmountIndicator = function(){       
        var iSize = 28;
        var iNum = 0;
        _oJackpotText = new createjs.Text(iNum.toLocaleString(),iSize+"px "+SECONDARY_FONT, "#ff56b0");
        _oJackpotText.x = 220;
        _oJackpotText.y = 388;
        _oJackpotText.textAlign = "center";
        _oJackpotText.textBaseline = "middle";
        _oJackpotText.lineWidth = 200;
        _oJackpotText.rotation = -55;
        oSpriteContainer.addChild(_oJackpotText);
        
        _oJackpotText.cache(-110,-20,220, 40);
       
    };
    
    this.reset = function(){
        _oParent.disableJackpot();
    };
    
    this.enableJackpot = function(){
        _bEnableJackpot = true;
        _oJackpotLight.highlight(1000);
        
        _iTimeElapse = TIME_LAST_ACTIVE_JACKPOT;
    };
    
    this.disableJackpot = function(){
        _bEnableJackpot = false;
        _oJackpotLight.slowOff(1000, 0);
    };
    
    this.setJackpotAmount = function(iAmount){
        
        _oJackpotText.text = iAmount.toLocaleString();
        _oJackpotText.updateCache();
    };
    
    this.update = function(){
        if(_bEnableJackpot){
            _iTimeElapse -= s_iTimeElaps;
            if(_iTimeElapse<0){
                _oParent.disableJackpot();
            }
        }
    };
    
    _oParent = this;
    this._init(oSpriteContainer, oForeGroundContainer);
}


