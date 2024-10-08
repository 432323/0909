var STATE_START = 0;
var STATE_JUMPER = 1;
var STATE_SHIELD = 2;
var STATE_EXTRABALL = 3;
var STATE_DIRECTIONAL_JUMPER = 4;

var DIRECTION_UP = 0;
var DIRECTION_MID = 1;
var DIRECTION_RIGHT = 2;

function CModuleJumper(oSpriteContainer, oForeGroundContainer){
    var _iCurState;
    var _iCurArrowActive;
    
    var _aArrows;
    
    var _oParent;
    var _oBumper;
    var _oJumperSprite;
    var _oButtonSystem;
    
    this._init = function(oSpriteContainer, oForeGroundContainer){
        _iCurState = STATE_START;
        _iCurArrowActive = DIRECTION_UP;
        
        this._addJumper();
        this._addJumperButtons();
        this._addArrows();
        
    };
    
    this._addJumper = function(){
        var iAngle = 45;
        
        var oUserData = {contacttype: CONTACT_BEGIN, callback: this._onJumper, params: "bumper"};
        _oBumper = s_oObjectBuilder.addButton(100, 12, 68, 1220, iAngle, 0, 0, 0, oUserData);
        _oBumper.GetFixtureList().SetSensor(true);
        s_oPhysicsController.disableBody(_oBumper);
        
        var oSprite = s_oSpriteLibrary.getSprite('jumper');
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX: (oSprite.width/2)/2, regY: oSprite.height/2}, 
                        animations: {state_true:[0],state_false:[1]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oJumperSprite = createSprite(oSpriteSheet, "state_false",(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
        _oJumperSprite.x = 68;
        _oJumperSprite.y = 1220;
        _oJumperSprite.rotation = iAngle;
        _oJumperSprite.visible = false;
        oSpriteContainer.addChild(_oJumperSprite);
        
        /////INVISIBLE SAFER
        var oUserData = {contacttype: CONTACT_BEGIN, callback: function(){}, params: "bumper"};
        var oBumper = s_oObjectBuilder.addButton(60, 8, 188, 800, iAngle+15, 0, 0, 1, oUserData);
        oBumper.GetFixtureList().SetSensor(true);
        
    };

    this._onJumper = function(aParam, oContact){       
        s_oScoreController.addJumperScore();
        
        var oInfoA = oContact.GetFixtureA().GetUserData();
        var oInfoB = oContact.GetFixtureB().GetUserData();
        var oBall;
        if(oInfoA.id && oInfoA.id === "ball"){
            oBall = oContact.GetFixtureA().GetBody();
        }
        if(oInfoB.id && oInfoB.id === "ball"){
            oBall = oContact.GetFixtureB().GetBody();
        }

        if(_iCurState >= STATE_DIRECTIONAL_JUMPER){
            _oParent._jumperModeDirectional(oBall);
        } else {
            _oParent._jumperModeWeak(oBall);
        }

        _oJumperSprite.gotoAndStop("state_true");
        setTimeout(function(){
            _oJumperSprite.gotoAndStop("state_false");
        }, 100);

        playSound("jumper", 1, false);
    };
    
    this._jumperModeWeak = function(oBall){
        var oBallPos = new Box2D.Common.Math.b2Vec2(oBall.GetPosition().x*WORLD_SCALE, oBall.GetPosition().y*WORLD_SCALE);
        var iX = Math.random()*960;
        var oTargetPos = new Box2D.Common.Math.b2Vec2(iX, 960);  ////RIGHT


        oBallPos.Subtract(oTargetPos);
        oBallPos.Normalize();
        
        var oNormal = new Box2D.Common.Math.b2Vec2(oBallPos.x, oBallPos.y);

        var iForce = 6 +Math.random()*2;
        
        oBall.SetLinearVelocity({x:0,y:0});
        oBall.SetAngularVelocity(0);
        
        oNormal.Multiply(-oBall.GetMass()*iForce);
        oBall.ApplyImpulse(oNormal, oBall.GetPosition());
    };
    
    this._jumperModeDirectional = function(oBall){
        var oBallPos = new Box2D.Common.Math.b2Vec2(oBall.GetPosition().x*WORLD_SCALE, oBall.GetPosition().y*WORLD_SCALE);
        var oTargetPos = _oParent._getDirection();

        oBallPos.Subtract(oTargetPos);
        oBallPos.Normalize();
        
        var oNormal = new Box2D.Common.Math.b2Vec2(oBallPos.x, oBallPos.y);

        var iForce = 32;
        
        oBall.SetLinearVelocity({x:0,y:0});
        oBall.SetAngularVelocity(0);
        
        oNormal.Multiply(-oBall.GetMass()*iForce);
        oBall.ApplyImpulse(oNormal, oBall.GetPosition());
    };
    
    this._getDirection = function(){
        var oDirection;
        switch(_iCurArrowActive){
            case DIRECTION_UP:{
                    oDirection = new Box2D.Common.Math.b2Vec2(78, 640);
                    break;
            }
            case DIRECTION_MID:{
                    oDirection = new Box2D.Common.Math.b2Vec2(740, 640);
                    break;
            }
            case DIRECTION_RIGHT:{
                    oDirection = new Box2D.Common.Math.b2Vec2(1408, 600);
                    break;
            }
        }
        
        return oDirection;
    };
    
    ////////////// CONTROL BUTTONS
    this._addJumperButtons = function(){
        var iWidth = 8;
        var iHeight = 56;
        var iX = 38;
        var iY = 860;
        var iOffset = 12;
        var iAngle = 0;
        var iNumButton = 5;
        
        _oButtonSystem = new CButtonSystem();
        var oSprite = s_oSpriteLibrary.getSprite('bumper_button');
        for(var i=0; i<iNumButton; i++){
            _oButtonSystem.addButton(iWidth, iHeight, iX, iY + i*(iHeight +iOffset), iAngle, oSprite, 0, 0, oSpriteContainer);
        }
        
        _oButtonSystem.addAllButtonHitListener(this._onAllButtonActive);
        _oButtonSystem.addSingleButtonListener(/*(function(){trace("SINGLE")}*/s_oScoreController.addButtonScore);
        _oButtonSystem.flipButtonX();
    };
    
    this._onAllButtonActive = function(){
        s_oScoreController.addAllJumperButtonsScore();
        _oParent.changeState();
    };
    
    this._addArrows = function(){
        _aArrows = new Array();
        
        var oPos = {x: 68, y: 1080};
        var oSprite = s_oSpriteLibrary.getSprite('arrow_light_1');
        var oArrowUp = new CLightIndicator(oSprite, oPos.x+20, oPos.y-20, oSpriteContainer);
        oArrowUp.rotate(-5);
        _aArrows.push(oArrowUp);
        
        var oSprite = s_oSpriteLibrary.getSprite('arrow_light_1');
        var oArrowMid = new CLightIndicator(oSprite, oPos.x+112, oPos.y+20, oSpriteContainer);
        oArrowMid.rotate(40);
        _aArrows.push(oArrowMid);
        
        var oSprite = s_oSpriteLibrary.getSprite('arrow_light_1');
        var oArrowRight = new CLightIndicator(oSprite, oPos.x+172, oPos.y+80, oSpriteContainer);
        oArrowRight.rotate(55);
        _aArrows.push(oArrowRight);
        
    };
    
    this.reset = function(){
        _oButtonSystem.reset();
        
        _iCurState = STATE_START;
        _iCurArrowActive = DIRECTION_UP;
        
        for(var i=0; i<_aArrows.length; i++){
            _aArrows[i].slowOff(1000,0);
        }
        
        s_oPhysicsController.disableBody(_oBumper);
        _oJumperSprite.visible = false;
        
    };
    
    this.shiftElementsToRight = function(){
        if(_iCurState < STATE_DIRECTIONAL_JUMPER){
            return;
        }
        
        _iCurArrowActive++;
        if(_iCurArrowActive === _aArrows.length){
            _iCurArrowActive = 0;
        }
        for(var i=0; i<_aArrows.length; i++){
            _aArrows[i].lit(false);
        }
        _aArrows[_iCurArrowActive].lit(true);
    };
    
    this.shiftElementsToLeft = function(){
        if(_iCurState < STATE_DIRECTIONAL_JUMPER){
            return;
        }
        
        _iCurArrowActive--;
        if(_iCurArrowActive < 0){
            _iCurArrowActive = _aArrows.length-1;
        }
        for(var i=0; i<_aArrows.length; i++){
            _aArrows[i].lit(false);
        }
        _aArrows[_iCurArrowActive].lit(true);
    };
    
    this.changeState = function(){
        s_oTable.enableJackpot();

        _iCurState++;
        switch(_iCurState){
            case STATE_START:{
                    
                    break;
            }
            case STATE_JUMPER:{
                    _oBumper.SetActive(true);
                    _oJumperSprite.visible = true;
                    break;
            }
            case STATE_SHIELD:{
                    s_oTable.enableShieldBonus();
                    break;
            }
            case STATE_EXTRABALL:{
                    s_oTable.enableExtraBallBonus();
                    break;
            }
            case STATE_DIRECTIONAL_JUMPER:{
                    _aArrows[_iCurArrowActive].lit(true);
                    break;
            }
            default :{
                    if(_iCurState % SHIELD_ACTIVATION_THRESHOLD === 0){
                        s_oTable.enableShieldBonus();
                    }
                    break;
            }
        }
    };
    
    _oParent = this;
    this._init(oSpriteContainer, oForeGroundContainer);
    
}


