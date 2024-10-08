function CModuleShield(oSpriteContainer, oForeGroundContainer){
    
    var _oLeftShield;
    var _oRightShield;
    var _oLeftShieldSprite;
    var _oRightShieldSprite;
    
    this._init = function(oSpriteContainer, oForeGroundContainer){
        this._addRightShield();
        this._addLeftShield();
    };
    
    this._addRightShield = function(){

        var iX = 1016;
        var iY = 1580;
        var iHoldingTime = 1000;
        
        _oRightShield = new CHoleSystem(iX, iY, iHoldingTime);
        _oRightShield.addHoleEventListener(this._onRightShieldUsed);
        var iImpulse = - ( 0.3 + 0.2*Math.random() );
        _oRightShield.setLaunchImpulse(0, iImpulse);
        s_oPhysicsController.disableBody(_oRightShield.getHole());
        
        
        var oSprite = s_oSpriteLibrary.getSprite('shield');
        _oRightShieldSprite = new CLightIndicator(oSprite, iX, iY, oSpriteContainer);
        _oRightShieldSprite.lit(true);

        
    };
    
    this._addLeftShield = function(){

        var iX = 54;
        var iY = 1580;
        var iHoldingTime = 1000;
        
        _oLeftShield = new CHoleSystem(iX, iY, iHoldingTime);
        _oLeftShield.addHoleEventListener(this._onLeftShieldUsed);
        var iImpulse = - ( 0.3 + 0.2*Math.random() );
        _oLeftShield.setLaunchImpulse(0, iImpulse);
        
        var oSprite = s_oSpriteLibrary.getSprite('shield');
        _oLeftShieldSprite = new CLightIndicator(oSprite, iX, iY, oSpriteContainer);
        _oLeftShieldSprite.lit(true);
    };
    
    this._onRightShieldUsed = function(){
        s_oPhysicsController.disableBody(_oRightShield.getHole());
        _oRightShieldSprite.slowOff(1000, 500);
    };
    
    this._onLeftShieldUsed = function(){
        s_oPhysicsController.disableBody(_oLeftShield.getHole());
        _oLeftShieldSprite.slowOff(1000, 500);
        
    };
    
    this.reset = function(){
        s_oPhysicsController.disableBody(_oRightShield.getHole());
        s_oPhysicsController.disableBody(_oLeftShield.getHole());
        _oRightShieldSprite.lit(false);
        _oLeftShieldSprite.lit(false);
    };
    
    this.enableShield = function(){
        s_oPhysicsController.enableBody(_oRightShield.getHole());
        s_oPhysicsController.enableBody(_oLeftShield.getHole());
        _oRightShieldSprite.slowOn(500, 0);
        _oLeftShieldSprite.slowOn(500, 0);
    };
    
    
    
    this._init(oSpriteContainer, oForeGroundContainer);
    
}


