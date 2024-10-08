function CModuleStart(oSpriteContainer, oForeGroundContainer){
    var _bOnPlatform;
    var _bBlock;
    
    var _iTimeLoad;
    
    var _iArrowsCounter;
    var _aArrows;
    
    var _oElasticParameter;
    var _oSpring;
    var _oParent;
    
    this._init = function(oSpriteContainer, oForeGroundContainer){
        _bOnPlatform = true;
        _bBlock = false;
        
        _oElasticParameter = {max: 1976, min:1876};
        _iTimeLoad = 1000;
        
        this._addTunnelSprites();
        this._addStartGate();
        this._addLaunchPlatform();
        this._addLauncher();
        
    };
    
    this._addTunnelSprites = function(){
        var oSprite = s_oSpriteLibrary.getSprite('tunnel_start');
        var oTunnel = createBitmap(oSprite);
        oTunnel.x = 880;
        oTunnel.y = 140;
        oForeGroundContainer.addChild(oTunnel);
        
        _iArrowsCounter = 0;
        _aArrows = new Array();
        
        var oPos = {x: 994, y: 252};
        
        var oSprite = s_oSpriteLibrary.getSprite('arrow_start');
        var oArrow = new CLightIndicator(oSprite, oPos.x, oPos.y, oSpriteContainer);
        oArrow.rotate(-35);
        _aArrows.unshift(oArrow);
        
        var oSprite = s_oSpriteLibrary.getSprite('arrow_start');
        var oArrow = new CLightIndicator(oSprite, oPos.x + 50, oPos.y + 80, oSpriteContainer);
        oArrow.rotate(-25);
        _aArrows.unshift(oArrow);
        
        var oSprite = s_oSpriteLibrary.getSprite('arrow_start');
        var oArrow = new CLightIndicator(oSprite, oPos.x + 80, oPos.y + 170, oSpriteContainer);
        oArrow.rotate(-10);
        _aArrows.unshift(oArrow);
        
        var oSprite = s_oSpriteLibrary.getSprite('arrow_start');
        var oArrow = new CLightIndicator(oSprite, oPos.x + 94, oPos.y + 270, oSpriteContainer);
        oArrow.rotate(-5);
        _aArrows.unshift(oArrow);
        
        var oStartOffset = {x: 96, y: 380, pace: 100};
        for(var i=0; i<11; i++){
            var oSprite = s_oSpriteLibrary.getSprite('arrow_start');
            var oArrow = new CLightIndicator(oSprite, oPos.x + oStartOffset.x, oPos.y + oStartOffset.y +i*oStartOffset.pace, oSpriteContainer);
            _aArrows.unshift(oArrow);
        }
        
        this.startLighting();
        
        
    };
    
    this.startLighting = function(){
        _iArrowsCounter = 0;
        for(var i=0; i<_aArrows.length; i++){
            _aArrows[i].slowHighlight(1000, i*100, this.endLighting);
        }
    };
    
    this.endLighting = function(){
        _iArrowsCounter++;
        if(_iArrowsCounter >= _aArrows.length){
            _oParent.startLighting();
        }
    };
    
    this.stopAnimLighting = function(){
        for(var i=0; i<_aArrows.length; i++){
            _aArrows[i].slowOff(1000, 0);
        }
    };
    
    this._addStartGate = function(){
        var oGate = new CGateSystem(924, 176);
        oGate.addGate(60,8, -45);
        var oSprite = s_oSpriteLibrary.getSprite('gate');
        oGate.addSprite(oSprite, oForeGroundContainer, -68, oSprite.height/3, oSprite.width/2 + 6);
        
        var iIDPass = 0;
        var iIDNotPass = 1;
        
        oGate.addOpener(60,60, 12, iIDPass);
        oGate.addCloser(-56,-32, 12, iIDPass);
        oGate.addCloser(132,176, 12, iIDNotPass);
        oGate.addPassingGateListener(this._onStartGatePassed);
    };
    
    this._onStartGatePassed = function(){
        s_oGame.ballInGame(true);
        s_oScoreController.addGateScore();
        _bBlock = true;
        
        s_oTable.stopLogoAnim();
        
        _oParent.stopAnimLighting();
    };
    
    this._addLaunchPlatform = function(){
        var oUserData = {contacttype: CONTACT_BEGIN, callback: this._onPlatform, params: "platform"};
        var oLaunchPlatform = s_oObjectBuilder.addButton(60, 4, 1092, 1800, 0, 0, 0.33, 0.33, oUserData);
        
        var oUserData = {contacttype: CONTACT_BEGIN, callback: this._onAir, params: "platform"};
        var oSensorOurPlatform = s_oObjectBuilder.addButton(60, 4, 1092, 1732, 0, 0, 0.33, 0.33, oUserData);
        oSensorOurPlatform.GetFixtureList().SetSensor(true);
    };
    
    this._onPlatform = function(){
        _bOnPlatform = true;
    };
    
    this._onAir = function(){
        _bOnPlatform = false;
    };
    
    this._addLauncher = function(){
        
        var oSprite = s_oSpriteLibrary.getSprite('spring');
        _oSpring = createBitmap(oSprite);
        _oSpring.regY = oSprite.height;
        _oSpring.x = 1069;
        _oSpring.y = 1876;
        oForeGroundContainer.addChild(_oSpring);
        
        var oSprite = s_oSpriteLibrary.getSprite('start_platform');
        var oPlatform = createBitmap(oSprite);
        oPlatform.regX = oSprite.width;
        oPlatform.regY = oSprite.height;
        oPlatform.x = s_oTable.getTableSize().w;
        oPlatform.y = s_oTable.getTableSize().h;
        oForeGroundContainer.addChild(oPlatform);
        
        
        
    };

    this.block = function(){
        _bBlock = true;
    };
    
    this.unBlock = function(){
        _bBlock = false;
    };
    
    this.loadSpring = function(){
        if(_bBlock){
            return;
        }
        createjs.Tween.get(_oSpring, {override:true}).to({y: _oElasticParameter.max}, _iTimeLoad);
    };
    
    this.releaseSpring = function(){
        if(_bBlock){
            return;
        }

        createjs.Tween.get(_oSpring, {override:true}).to({y: _oElasticParameter.min}, 300, createjs.Ease.elasticOut);
        
        var iStrength = linearFunction(_oSpring.y, _oElasticParameter.min, _oElasticParameter.max, 0,  SPRING_MAX_STRENGTH);
        
        if(_bOnPlatform){
            playSound("launch", 1, false);
            s_oGame.launchBall(iStrength);
        }
    };
    
    _oParent = this;
    this._init(oSpriteContainer, oForeGroundContainer);
    
}


