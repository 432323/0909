var GATE_LISTENER_STATE_CLOSED = 0;
var GATE_LISTENER_STATE_OPEN = 1;

function CGateSystem(iX, iY){

    var _iCurIDOpening;
    var _iFirstGateOpeningID;

    var _cbCallBack;
    
    
    var _oGate;
    var _oParent;
    
    this._init = function(iX, iY){
        _iCurIDOpening = null;
        _iFirstGateOpeningID = null;

    };
    
    this.addGate = function(iWidth, iHeight, iAngle){
        _oGate = s_oObjectBuilder.addButton(iWidth, iHeight, iX, iY, iAngle, 0, 1, 0.4);
    };
    
    this.addSprite = function(oSprite, oSpriteContainer, iAngle, iRegY, iRegX){
        var oGateSprite = createBitmap(oSprite);
        oGateSprite.x = iX;
        oGateSprite.y = iY;
        oGateSprite.regX = iRegX;
        oGateSprite.regY = iRegY;
        oGateSprite.rotation = iAngle;
        oSpriteContainer.addChild(oGateSprite);
    };
    
    this.addOpener = function(iLocalX, iLocalY, iRadius, iOpeningID, iGateID){
        var oUserData = {contacttype: CONTACT_BEGIN, callback: this._openGate, params: {openingid: iOpeningID, gateid: iGateID}};
        var iPosX = (iX + iLocalX);
        var iPosY = (iY + iLocalY);
        var oOpener = s_oObjectBuilder.addStaticCircle(iRadius, iPosX, iPosY, 0, 0, 0, oUserData);
        oOpener.GetBody().GetFixtureList().SetSensor(true);
    };
    
    this.addCloser = function(iLocalX, iLocalY, iRadius, iClosingID, iGateID){
        var oUserData = {contacttype: CONTACT_BEGIN, callback: this._closeGate, params: {openingid: iClosingID, gateid: iGateID}};
        var iPosX = (iX + iLocalX);
        var iPosY = (iY + iLocalY);
        var oCloser = s_oObjectBuilder.addStaticCircle(iRadius, iPosX, iPosY, 0, 0, 0, oUserData);
        oCloser.GetBody().GetFixtureList().SetSensor(true);
    };
    
    this.addPassingGateListener = function(cbCallBack){
        _cbCallBack = cbCallBack;
    };
    
    this.setRestitution = function(iValue){
        _oGate.GetFixtureList().SetRestitution(iValue);
    };
    
    this._openGate = function(oData){
    
        _iCurIDOpening = oData.openingid;
        if(_iFirstGateOpeningID === null){
            _iFirstGateOpeningID = oData.gateid;
        }

        if(_iFirstGateOpeningID !== oData.gateid){
            _oParent._gatePassedCorrectly();
        }

        s_oPhysicsController.disableBody(_oGate);
               
    };
    
    this._closeGate = function(oData){
        if(_iCurIDOpening === oData.openingid){
            _oParent._gatePassedCorrectly();
        }
       
        _iCurIDOpening = null;
        _iFirstGateOpeningID = null;
       
        _oGate.SetActive(true);
    };
    
    this._gatePassedCorrectly = function(){
        if(_cbCallBack){
            _cbCallBack(_iFirstGateOpeningID);
        }
        playSound("gate", 1, false);
        _iCurIDOpening = null;
        _iFirstGateOpeningID = null;
    };
    
    _oParent = this;
    this._init(iX, iY);
    
}


