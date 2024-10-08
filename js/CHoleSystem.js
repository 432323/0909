function CHoleSystem(iX, iY, iHoldingTime){

    var _cbCallBack;
    
    var _oHole;
    var _oParent;
    
    var _vLaunchImpulse;
    
    this._init = function(iX, iY, iHoldingTime){
        var oUserData = {contacttype: CONTACT_BEGIN, callback: this._holeHit, params: "hole_enabled"};
        _oHole = s_oObjectBuilder.addStaticCircle(1, iX, iY, 0, 0, 0, oUserData);
        _oHole.GetBody().GetFixtureList().SetSensor(true);
    };
    
    this.addHoleEventListener = function(cbCallBack){
        _cbCallBack = cbCallBack;
    };
    
    this.setLaunchImpulse = function(iX, iY){
        _vLaunchImpulse = {x:iX, y:iY};
    };
    
    this._disableHole = function(){
        _oHole.SetUserData({contacttype: CONTACT_BEGIN, callback: _oParent._wakeUpHole, params: "hole_disabled"});
    };
    
    this._wakeUpHole = function(){
        _oHole.SetUserData({contacttype: CONTACT_END, callback: _oParent._enableHole, params: "hole_wake"});
    };
    
    this._enableHole = function(){
        _oHole.SetUserData({contacttype: CONTACT_BEGIN, callback: _oParent._holeHit, params: "hole_enabled"});
    };
    
    this._releaseBall = function(oBall){
        oBall.SetActive(true);
        
        if(_vLaunchImpulse){
            _oParent._enableHole();
            oBall.ApplyImpulse(_vLaunchImpulse, oBall.GetPosition());
        }
        
    };
    
    this._centerBallInHole = function(oBall){
        _oParent._disableHole();

        oBall.SetLinearVelocity({x:0,y:0});
        oBall.SetAngularVelocity(0);

        var oPos = {x: iX, y: iY};
        s_oPhysicsController.disableBody(oBall, oPos);

        playSound("in_hole", 1, false);
        
        setTimeout(function(){
            playSound("out_hole", 1, false);
            _oParent._releaseBall(oBall);
        }, iHoldingTime);
    };
    
    this._getBall = function(oContactData){
        var oInfoA = oContactData.GetFixtureA().GetUserData();
        var oInfoB = oContactData.GetFixtureB().GetUserData();
        
        var oBall;
        if(oInfoA.id && oInfoA.id === "ball"){
            oBall = oContactData.GetFixtureA().GetBody();
        }
        if(oInfoB.id && oInfoB.id === "ball"){
            oBall = oContactData.GetFixtureB().GetBody();
        }
        
        return oBall;
    };
    
    this._holeHit = function(aParam, oContactData){
        
        var oBall = _oParent._getBall(oContactData);
        _oParent._centerBallInHole(oBall);
        
        
        if(_cbCallBack){
            _cbCallBack();
        }
    };
    
    this.getHole = function(){
        return _oHole.GetBody();
    };
    
    _oParent = this;
    this._init(iX, iY, iHoldingTime);
}


