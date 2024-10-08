function CButtonSystem(){
    
    var _bAutomaticReset;
    var _bReturn;
    var _bActivated;
    
    var _aButtonsHit;
    var _aButtons;
    var _aSpriteButtons;
    
    var _oParent;
    
    var _cbCallBackTotal;
    var _cbCallBackSingle;
    
    this._init = function(){
        _bAutomaticReset = true;
        _bReturn = false;
        _bActivated = false;
        
        _aButtons = new Array();
        _aButtonsHit = new Array();
        _aSpriteButtons = new Array();
    };
    
    this.setAutoReset = function(bVal){
        _bAutomaticReset = bVal;
    };
    
    this.setReturn = function(bVal){
        _bReturn = bVal;
    };
    
    this.restart = function(){
        _bActivated = false;
        
        for(var i=0; i<_aButtonsHit.length; i++){
            _aButtonsHit[i] =  false;
            var oBody = _aButtons[i];
            oBody.SetActive(true);
            _aSpriteButtons[i].flashing();
        }
    };
    
    this.reset = function(){
        _bActivated = false;
        
        for(var i=0; i<_aButtonsHit.length; i++){
            _aButtonsHit[i] =  false;
            
            var oBody = _aButtons[i];
            oBody.SetActive(true);
            _aSpriteButtons[i].slowOff(500, (_aButtonsHit.length - i -1)*100);
        }
    };
    
    this.addButton = function(iWidth, iHeight, iX, iY, iAngle, oSprite, iXOffset, iYOffset, oSpriteContainer){
        var oUserData = {contacttype: CONTACT_BEGIN, callback: this._buttonHit, params: _aButtons.length};
        _aButtons.push( s_oObjectBuilder.addButton(iWidth, iHeight, iX, iY, iAngle, 0, 1, 0.8, oUserData) );
        _aButtonsHit.push(false);
        
        
        var oSpriteButtons = new CLightIndicator(oSprite, iX+iXOffset, iY+iYOffset, oSpriteContainer);
        oSpriteButtons.rotate(iAngle);
        _aSpriteButtons.push(oSpriteButtons);

    };
    
    this.flipButtonX = function(){
        for(var i=0; i<_aButtons.length; i++){
            _aSpriteButtons[i].flipX();
        }
    };
    
    this.setResititution = function(iValue){
        for(var i=0; i<_aButtons.length; i++){
            _aButtons[i].GetFixtureList().SetRestitution(iValue);
        }
    };
    
    this._buttonHit = function(iIndex){
        if(_aButtonsHit[iIndex]){
            playSound("pinball_button_off", 1, false);
        }else {
            playSound("pinball_button_on", 1, false);
        }
        
        _aButtonsHit[iIndex] =  true;
        
        var oBody = _aButtons[iIndex];
        
        if(_bReturn){
            s_oPhysicsController.disableBody(oBody);
        }
        
        _aSpriteButtons[iIndex].lit(true);
        
        if(_cbCallBackSingle){
            _cbCallBackSingle();
        }

        _oParent.checkTriggerEvent();

    };
    
    this.addSingleButtonListener = function(cbCallBack){
        _cbCallBackSingle = cbCallBack;
    };
    
    this.addAllButtonHitListener = function(cbCallBack){
        _cbCallBackTotal = cbCallBack;
    };
    
    this.checkTriggerEvent = function(){
        for(var i=0; i<_aButtonsHit.length; i++){
            if(!_aButtonsHit[i] || _bActivated){
                return;
            }
        }
        
        _bActivated = true;
        if(_bAutomaticReset){
            _bActivated = false;
            for(var i=0; i<_aButtonsHit.length; i++){
                _aSpriteButtons[i].flashing();
                _aButtonsHit[i] =  false;
            }

            setTimeout(function(){
                for(var i=0; i<_aButtonsHit.length; i++){
                    var oBody = _aButtons[i];
                    oBody.SetActive(true);
                }
            },500);

        }
        
        playSound("all_lights_on_1", 1, false);
        
        if(_cbCallBackTotal){
            _cbCallBackTotal();
        }
    };
    
    _oParent = this;
    this._init();
}


