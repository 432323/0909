function CToggleSystem(){
    
    var _aButtonsHit;
    var _aPhysicsButtons;
    var _aSpriteButtons;
    
    var _oParent;
    
    var _cbCallBackTotal;
    var _cbCallBackSingle;
    
    this._init = function(){
        _aPhysicsButtons = new Array();
        _aButtonsHit = new Array();
        _aSpriteButtons = new Array();
    };
    
    this.restart = function(){
        for(var i=0; i<_aButtonsHit.length; i++){
            _aButtonsHit[i] =  false;
            _aSpriteButtons[i].flashing();
        }
    };
    
    this.reset = function(){
        for(var i=0; i<_aButtonsHit.length; i++){
            _aButtonsHit[i] =  false;
            _aSpriteButtons[i].slowOff(500, (_aButtonsHit.length - i -1)*100);
        }
    };
    
    this.addButton = function(iWidth, iHeight, iX, iY, iAngle, oSprite, iXOffset, iYOffset, oSriteContainer, szText){
        var oUserData = {contacttype: CONTACT_BEGIN, callback: this._buttonHit, params: _aPhysicsButtons.length};
        _aPhysicsButtons.push( s_oObjectBuilder.addButton(iWidth, iHeight, iX, iY, iAngle, 0, 1, 1, oUserData) );
        _aPhysicsButtons[_aPhysicsButtons.length-1].GetFixtureList().SetSensor(true);
        _aButtonsHit.push(false);
        
        var oLight = new CLightIndicator(oSprite, iX + iXOffset, iY + iYOffset, oSriteContainer);
        oLight.addText(szText, 0, 0, 40, "#000000");
        _aSpriteButtons.push(oLight);
        
    };
    
    this._buttonHit = function(iIndex){
        _aButtonsHit[iIndex] =  true;
        playSound("toggle", 1, false);

        _aSpriteButtons[iIndex].lit(_aButtonsHit[iIndex]);
        
        if(_cbCallBackSingle){
            _cbCallBackSingle(iIndex);
        }
        
        _oParent.checkTriggerEvent();
    };
    
    this.addSingleButtonListener = function(cbCallBack){
        _cbCallBackSingle = cbCallBack;
    };
    
    this.addAllButtonHitListener = function(cbCallBack){
        _cbCallBackTotal = cbCallBack;
    };
    
    this.shiftRight = function(){
        var oLastElement = _aButtonsHit.pop();
        _aButtonsHit.unshift(oLastElement);
        
        for(var i=0; i<_aSpriteButtons.length; i++){
            _aSpriteButtons[i].lit(_aButtonsHit[i]);
        }
    };
    
    this.shiftLeft = function(){
        var oFirstElement = _aButtonsHit.shift();
        _aButtonsHit.push(oFirstElement);
        
        for(var i=0; i<_aSpriteButtons.length; i++){
            _aSpriteButtons[i].lit(_aButtonsHit[i]);
        }
    };
    
    this.checkTriggerEvent = function(){
        for(var i=0; i<_aButtonsHit.length; i++){
            if(!_aButtonsHit[i]){
                return;
            }
        }

        _oParent.restart();
        playSound("all_lights_on_2", 1, false);
        
        if(_cbCallBackTotal){
            _cbCallBackTotal();
        }
    };
    
    _oParent = this;
    this._init();
}


