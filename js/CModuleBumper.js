function CModuleBumper(oSpriteContainer, oForeGroundContainer){
    
    var _iCircleBumperTextSize = 40;
    
    var _aBumperSprite;
    
    var _oBumperText;
    var _oBumperTextOutline;
    var _oButtonSystem;
    var _oRightFlipper;
    var _oLeftFlipper;
    
    this._init = function(oSpriteContainer, oForeGroundContainer){
        this._addLinearBumper();
        this._addCircularBumperSystemButton();
    };
    
    ///////////////////////FLIPPER BUMPER
    this.buildFlipperBumper = function(oData){
        var iRestitution = 0.3;
        
        for(var i=0; i<oData.length; i++){
            var oGeometry = oData[i];
            var aPoints = s_oTable.getAdjustedPoints(oGeometry.x, oGeometry.y, oGeometry.polygon);

            s_oObjectBuilder.addPolygon(aPoints, 0, 1, 0.7, iRestitution);
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('flipper_bumper');
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX: (oSprite.width/2)/2, regY: oSprite.height/2}, 
                        animations: {state_true:[0],state_false:[1]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oRightFlipper = createSprite(oSpriteSheet, "state_false",(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
        _oRightFlipper.x = 840;
        _oRightFlipper.y = 1460;
        oSpriteContainer.addChild(_oRightFlipper);

        _oLeftFlipper = createSprite(oSpriteSheet, "state_false",(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
        _oLeftFlipper.x = 240;
        _oLeftFlipper.y = 1460;
        _oLeftFlipper.scaleX = -1;
        oSpriteContainer.addChild(_oLeftFlipper);
        
    };
    
    this._addLinearBumper = function(){
        
        var oUserData = {contacttype: CONTACT_BEGIN, callback: this._leftFlipperBumperCollision, params: "bumper"};
        var oBumper = s_oObjectBuilder.addButton(220, 12, 252, 1460, 66.7, 0, 0, 0, oUserData);
        oBumper.GetFixtureList().SetSensor(true);
        
        var oUserData = {contacttype: CONTACT_BEGIN, callback: this._rightFlipperBumperCollision, params: "bumper"};
        var oBumper = s_oObjectBuilder.addButton(220, 12, 824, 1460, -69, 0, 0, 0, oUserData);
        oBumper.GetFixtureList().SetSensor(true);
        
    };
    
    this._leftFlipperBumperCollision = function(aParam, oContact){       
        var oNormal = new Box2D.Common.Math.b2Vec2(-0.4, 0.5);
        
        var oInfoA = oContact.GetFixtureA().GetUserData();
        var oInfoB = oContact.GetFixtureB().GetUserData();
        var oBall;
        if(oInfoA.id && oInfoA.id === "ball"){
            oBall = oContact.GetFixtureA().GetBody();
        }
        if(oInfoB.id && oInfoB.id === "ball"){
            oBall = oContact.GetFixtureB().GetBody();
        }

        oBall.SetLinearVelocity({x:0,y:0});
        oBall.SetAngularVelocity(0);

        var iForce = 20;
        oNormal.Multiply(-oBall.GetMass()*iForce);
        oBall.ApplyImpulse(oNormal, oBall.GetPosition());
        
        _oLeftFlipper.gotoAndStop("state_true");
        setTimeout(function(){
            _oLeftFlipper.gotoAndStop("state_false");
        }, 100);
        
        playSound("bumper", 1, false);
        s_oScoreController.addButtonScore();
    };
    
    this._rightFlipperBumperCollision = function(aParam, oContact){       
        var oNormal = new Box2D.Common.Math.b2Vec2(0.4, 0.5);
        
        var oInfoA = oContact.GetFixtureA().GetUserData();
        var oInfoB = oContact.GetFixtureB().GetUserData();
        var oBall;
        if(oInfoA.id && oInfoA.id === "ball"){
            oBall = oContact.GetFixtureA().GetBody();
        }
        if(oInfoB.id && oInfoB.id === "ball"){
            oBall = oContact.GetFixtureB().GetBody();
        }

        oBall.SetLinearVelocity({x:0,y:0});
        oBall.SetAngularVelocity(0);

        var iForce = 20;
        oNormal.Multiply(-oBall.GetMass()*iForce);
        oBall.ApplyImpulse(oNormal, oBall.GetPosition());
        
        _oRightFlipper.gotoAndStop("state_true");
        setTimeout(function(){
            _oRightFlipper.gotoAndStop("state_false");
        }, 100);
        
        playSound("bumper", 1, false);
        s_oScoreController.addButtonScore();
    };
    
    ///////////////////////CIRCULAR BUMPER
    this.buildCircularBumper = function(oData){
        
        _oBumperTextOutline = new createjs.Text(s_oScoreController.getBumperValue(),_iCircleBumperTextSize+"px "+PRIMARY_FONT, "#c6c6c6");
        _oBumperTextOutline.x = 694;
        _oBumperTextOutline.y = 570;
        _oBumperTextOutline.rotation = -25;
        _oBumperTextOutline.textAlign = "center";
        _oBumperTextOutline.textBaseline = "middle";
        _oBumperTextOutline.lineWidth = 200;
        _oBumperTextOutline.outline = 3;
        oSpriteContainer.addChild(_oBumperTextOutline);
        
        _oBumperText = new createjs.Text(s_oScoreController.getBumperValue(),_iCircleBumperTextSize+"px "+PRIMARY_FONT, "#88028b");
        _oBumperText.x = 694;
        _oBumperText.y = 570;
        _oBumperText.rotation = -25;
        _oBumperText.textAlign = "center";
        _oBumperText.textBaseline = "middle";
        _oBumperText.lineWidth = 200;
        oSpriteContainer.addChild(_oBumperText);
        
        _aBumperSprite = new Array();
        for(var i=0; i<oData.length; i++){
            var oGeometry = oData[i];
            var aPoints = s_oTable.getAdjustedPoints(0, 0, [{x:oGeometry.x, y:oGeometry.y}] );
            var iIndex = i;
            this._addCircularBumper(oGeometry.width/2, aPoints[0].x + oGeometry.width/2, aPoints[0].y + oGeometry.width/2, iIndex);
        }
    };

    this._addCircularBumper = function(iRad, iX, iY, iIndex){
        var oUserData = {contacttype: CONTACT_BEGIN, callback: this._circularBumperCollision, params: /*"bumper_"+*/iIndex};
        var oBumper = s_oObjectBuilder.addStaticCircle(iRad, iX, iY, 0, 0, 0, oUserData);
        
        _aBumperSprite[iIndex] = new createjs.Container();
        _aBumperSprite[iIndex].x = iX;
        _aBumperSprite[iIndex].y = iY;
        oForeGroundContainer.addChild(_aBumperSprite[iIndex]);
        
        var oSprite = s_oSpriteLibrary.getSprite('bumper');
        var iWidth = oSprite.width/7;
        var iHeight = oSprite.height/2;
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: iHeight, regX: iWidth/2, regY: iHeight/2}, 
                        animations: {idle:[0],hit:[0,13, "idle"]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
	var oBumperSprite = createSprite(oSpriteSheet, "hit",iWidth/2,iHeight/2,iWidth,iHeight);
        _aBumperSprite[iIndex].addChild(oBumperSprite);
    };
    
    this._circularBumperCollision = function(aParam, oContact){  
        
        _aBumperSprite[aParam].scaleX = 0.9;
        _aBumperSprite[aParam].scaleY = 0.9;
        _aBumperSprite[aParam].children[0].gotoAndPlay("hit");
        createjs.Tween.get(_aBumperSprite[aParam], {override:true}).to({scaleX: 1, scaleY:1}, 0.1);
        
        var worldManifold = new Box2D.Collision.b2WorldManifold();
        oContact.GetWorldManifold( worldManifold );

        var oPoint = worldManifold.m_points[0];
        var oNormal = worldManifold.m_normal;
        
        var oInfoA = oContact.GetFixtureA().GetUserData();
        var oInfoB = oContact.GetFixtureB().GetUserData();
        var oBall;
        if(oInfoA.id && oInfoA.id === "ball"){
            oBall = oContact.GetFixtureA().GetBody();
        }
        if(oInfoB.id && oInfoB.id === "ball"){
            oBall = oContact.GetFixtureB().GetBody();
        }

        oBall.SetLinearVelocity({x:0,y:0});
        oBall.SetAngularVelocity(0);
        
        var iForce = 14;
        oNormal.Multiply(-oBall.GetMass()*iForce);
        oBall.ApplyImpulse(oNormal, oBall.GetPosition());
        
        playSound("bumper", 1, false);
        s_oScoreController.addCircleBumperScore();
    };
    
    
    
    ///////////////////////LEVEL UP SYSTEM
    this._addCircularBumperSystemButton = function(){
        var iWidth = 8;
        var iHeight = 60;
        var iX = 930;
        var iY = 340;
        var iOffset = 10;
        var iAngle = -13;
        var iNumButton = 3;
        
        _oButtonSystem = new CButtonSystem();
        var oSprite = s_oSpriteLibrary.getSprite('bumper_button');
        for(var i=0; i<iNumButton; i++){
            var iAngleOffset = ( i*18 );
            _oButtonSystem.addButton(iWidth, iHeight, iX+iAngleOffset, iY + i*(iHeight +iOffset), iAngle, oSprite, 0, 0, oSpriteContainer);
        }
        _oButtonSystem.setReturn(true);
        _oButtonSystem.addAllButtonHitListener(this._onBumperLevelUp);
        _oButtonSystem.addSingleButtonListener(/*(function(){trace("SINGLE")}*/s_oScoreController.addButtonScore);
    };
    
    this._onBumperLevelUp = function(){
        s_oScoreController.increaseCircleBumperLevel();
        
        _oBumperText.text = s_oScoreController.getBumperValue();
        _oBumperTextOutline.text = s_oScoreController.getBumperValue();
        
        var iTextSize = _oBumperText.getBounds().width;
        
        var iNewSize = _iCircleBumperTextSize;
        while(iTextSize >= 80){
            iNewSize--;
            _oBumperText.font = " "+iNewSize+"px "+PRIMARY_FONT;
            _oBumperTextOutline.font = " "+iNewSize+"px "+PRIMARY_FONT;
            iTextSize = _oBumperText.getBounds().width;
        }
    };
    
    this.reset = function(){
        _oButtonSystem.reset();
        
        _oBumperText.font = " "+_iCircleBumperTextSize+"px "+PRIMARY_FONT;
        _oBumperText.text = s_oScoreController.getBumperValue();
        
        _oBumperTextOutline.font = " "+_iCircleBumperTextSize+"px "+PRIMARY_FONT;
        _oBumperTextOutline.text = s_oScoreController.getBumperValue();
    };
    
    this._init(oSpriteContainer, oForeGroundContainer);
    
}


