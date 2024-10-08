var EDGE_FRAME = "edge_frame";
var TOP_CHANNELLERS = "top_channellers";
var LEFT_ROUTER = "left_router";
var BOT_CHANNELLERS = "bot_channellers";
var FLIPPER_BUMPER = "flipper_bumper";
var RIGHT_CHANNELLER = "right_channeller";
var CIRCLE_BUMPER = "circle_bumper";
var PLATFORM = "platforms";
var CENTERSAFE = "centersafe";
var FLIPPER = "flipper";

function CTable(oBackGroundContainer, oForeGroundContainer){
    
    var _iWidth;
    var _iHeight;
    
    var _oTable;
    
    var _oModuleMultiplier;
    var _oModuleBumper;
    var _oModuleHole;
    var _oModuleRouter;
    var _oModuleLetters;
    var _oModuleJumper;
    var _oModuleJackpot;
    var _oModuleShield;
    var _oModuleStart;
    
    this._init = function(oBackGroundContainer, oForeGroundContainer){
        
        var oSprite = s_oSpriteLibrary.getSprite('pinball_bg');
        _iWidth = oSprite.width;
        _iHeight = oSprite.height; 
        
        _oTable = createBitmap(oSprite);
        _oTable.alpha = 1;
        oBackGroundContainer.addChild(_oTable);

        ZOOM_TABLE_SIZE = {w: _iWidth*ZOOM, h: _iHeight*ZOOM};

        _oModuleStart = new CModuleStart(oBackGroundContainer, oForeGroundContainer);
        _oModuleMultiplier = new CModuleMultiplier(oBackGroundContainer, oForeGroundContainer);
        _oModuleBumper = new CModuleBumper(oBackGroundContainer, oForeGroundContainer);
        _oModuleHole = new CModuleHole(oBackGroundContainer, oForeGroundContainer);
        _oModuleRouter = new CModuleRouter(oBackGroundContainer, oForeGroundContainer);
        _oModuleLetters = new CModuleLetters(oBackGroundContainer, oForeGroundContainer);
        _oModuleJumper = new CModuleJumper(oBackGroundContainer, oForeGroundContainer);
        _oModuleJackpot = new CModuleJackpot(oBackGroundContainer, oForeGroundContainer);
        _oModuleShield = new CModuleShield(oBackGroundContainer, oForeGroundContainer);

        this._buildTable();

        this._addCheckPoints();

    };

    this._buildTable = function(){
        var aLayers = TileMaps.levelsettings.layers;
        var iGeneralResitution = GENERAL_RESTITUTION;

        for(var j=0; j<aLayers.length; j++){
            if(aLayers[j].type === "objectgroup"){
                var aObjects = aLayers[j].objects;
                switch(aLayers[j].name){
                    case EDGE_FRAME:{
                            this._addShapes(aObjects, 0);
                            break;
                    }
                    case CENTERSAFE:{
                            var oCircle = aLayers[j].objects[0];
                            var aPoints = this.getAdjustedPoints(0, 0, [{x:oCircle.x, y:oCircle.y}] );
                            s_oObjectBuilder.addStaticCircle(oCircle.width/2, aPoints[0].x + oCircle.width/2, aPoints[0].y + oCircle.width/2, 0, 0, 0.75);
                            
                            var oSafePin = createBitmap(s_oSpriteLibrary.getSprite('safe_pin'));
                            oSafePin.x = oCircle.x;
                            oSafePin.y = oCircle.y;
                            oBackGroundContainer.addChild(oSafePin);
                            
                            break;
                    }
                    case TOP_CHANNELLERS:{
                            for(var i=0; i<aObjects.length; i++){
                                this._addPolygons(aObjects[i], iGeneralResitution*3/2);
                            }
                            
                            break;
                    }
                    case LEFT_ROUTER:{
                            this._addShapes(aObjects, 0);
                            break;
                    }
                    case BOT_CHANNELLERS:{
                            for(var i=0; i<aObjects.length; i++){
                                if(aObjects[i].ellipse){
                                    var aPoints = this.getAdjustedPoints(0, 0, [{x:aObjects[i].x, y:aObjects[i].y}] );
                                    s_oObjectBuilder.addStaticCircle(aObjects[i].width/2, aPoints[0].x + aObjects[i].width/2, aPoints[0].y + aObjects[i].width/2, 0, 0, 0);
                                }else {
                                    this._addPolygons(aObjects[i], iGeneralResitution/2);
                                }
                            }
                            
                            break;
                    }
                    case FLIPPER_BUMPER:{
                           
                            _oModuleBumper.buildFlipperBumper(aObjects);
                           
                            break;
                    }
                    case CIRCLE_BUMPER:{
                            _oModuleBumper.buildCircularBumper(aObjects);
                            break;
                    }
                    case RIGHT_CHANNELLER:{
                            for(var i=0; i<aObjects.length; i++){
                                this._addPolygons(aObjects[i], 0.7);
                            }
                            break;
                    }
                    case FLIPPER:{
                            var aObjects = aLayers[j].objects;
                            var oPolygons = aObjects[0];

                            var aPoints = this.getAdjustedPoints(0,0,oPolygons.polygon);

                            var oRightFlipper = s_oObjectBuilder.addRightFlipper(aPoints, 726, 1706,1, 0, iGeneralResitution);


                            var aObjects = aLayers[j].objects;
                            var oPolygons = aObjects[0];

                            var aPoints = this.getAdjustedPoints(0,0,oPolygons.polygon);

                            var oLeftFlipper = s_oObjectBuilder.addLeftFlipper(aPoints.reverse(), 326, 1706,1, 0, iGeneralResitution);
                            
                            
                            s_oGame.setFlippers(oRightFlipper, oLeftFlipper);
                            
                            break;
                    }
                        
                };
            }
        }
    };

   
    this._addPolygons = function(oPolygons, iRestitution){
        var aPoints = this.getAdjustedPoints(oPolygons.x, oPolygons.y, oPolygons.polygon);

        s_oObjectBuilder.addPolygon(aPoints, 0, 1, GENERAL_FRICTION, iRestitution);
    };
    
    this._addShapes = function(aShapes, iRestitution){
        for(var i=0; i<aShapes.length; i++){
            var aPoints = this.getAdjustedPoints(aShapes[i].x, aShapes[i].y, aShapes[i].polyline);

            for(var j=0; j<aPoints.length-1; j++){

                var oStartPos = {x: aPoints[j].x, y: aPoints[j].y};
                var oEndPos = {x: aPoints[j+1].x, y: aPoints[j+1].y};

                s_oObjectBuilder.addEdge(oStartPos, oEndPos, 0, 1, GENERAL_FRICTION, iRestitution);
            }
        }
    };
    

    this._addCheckPoints = function(){
        ////////////NEAR FLIPPER BUMPER
        var oPos = {x: 140, y: 1460};
        
        var oSprite = s_oSpriteLibrary.getSprite('button_light_0');
        var oLight = new CLightIndicator(oSprite, oPos.x, oPos.y, oBackGroundContainer);

        var oUserData = {contacttype: CONTACT_END, callback: this._onCheckPoint, params: oLight};
        var oLeftCheckPoint = s_oObjectBuilder.addButton(8, 40, oPos.x, oPos.y, 0, 0, 0, 0, oUserData);
        oLeftCheckPoint.GetFixtureList().SetSensor(true);
        
        var oPos = {x: 936, y: 1460};
        
        var oSprite = s_oSpriteLibrary.getSprite('button_light_0');
        var oLight = new CLightIndicator(oSprite, oPos.x, oPos.y, oBackGroundContainer);
        
        var oUserData = {contacttype: CONTACT_END, callback: this._onCheckPoint, params: oLight};
        var oRightCheckPoint = s_oObjectBuilder.addButton(8, 40, oPos.x, oPos.y, 0, 0, 0, 0, oUserData);
        oRightCheckPoint.GetFixtureList().SetSensor(true);
        
        ////////////NEAR SIDE EXIT 
        var oPos = {x:56, y: 1460};
        
        var oSprite = s_oSpriteLibrary.getSprite('button_light_1');
        var oLight = new CLightIndicator(oSprite, oPos.x, oPos.y, oBackGroundContainer);
        
        var oUserData = {contacttype: CONTACT_END, callback: this._onCheckPoint, params: oLight};
        var oLeftExitPoint = s_oObjectBuilder.addButton(8, 40, oPos.x, oPos.y, 0, 0, 0, 0, oUserData);
        oLeftExitPoint.GetFixtureList().SetSensor(true);
        
        var oPos = {x:1016, y: 1460};
        
        var oSprite = s_oSpriteLibrary.getSprite('button_light_1');
        var oLight = new CLightIndicator(oSprite, oPos.x, oPos.y, oBackGroundContainer);
        
        var oUserData = {contacttype: CONTACT_END, callback: this._onCheckPoint, params: oLight};
        var oRightExitPoint = s_oObjectBuilder.addButton(8, 40, oPos.x, oPos.y, 0, 0, 0, 0, oUserData);
        oRightExitPoint.GetFixtureList().SetSensor(true);

        ////////////BALL OUT
        var oUserData = {contacttype: CONTACT_END, callback: s_oGame.onBallOut, params: "checkpoint"};
        var oLeftExitPoint = s_oObjectBuilder.addButton(320, 8, 520, 1900, 0, 0, 0, 0, oUserData);
        oLeftExitPoint.GetFixtureList().SetSensor(true);

    };

    this._onCheckPoint = function(oParam){
        playSound("toggle", 1, false);
        s_oScoreController.addButtonScore();
        oParam.flashing();
    };

    this.resetOnExtraBall = function(){
        _oModuleJackpot.reset();
    };

    this.reset = function(){
        s_oScoreController.resetJackpot();
        s_oScoreController.resetMultiplier();
        s_oScoreController.resetCircleBumperLevel();

        _oModuleMultiplier.reset();
        _oModuleBumper.reset();
        _oModuleRouter.reset();
        _oModuleHole.reset();
        _oModuleLetters.reset();
        _oModuleJumper.reset();
        _oModuleJackpot.reset();
        _oModuleShield.reset();
    };


    this.stopLogoAnim = function(){
        _oModuleLetters.stopAnimLogo();
    };

    this.blockLaunch = function(){
        _oModuleStart.block();
    };

    this.unblockLaunch = function(){
         _oModuleStart.unBlock();
         _oModuleStart.startLighting();
         _oModuleLetters.animLogo();
    };

    this.loadSpring = function(){
        _oModuleStart.loadSpring();
    };

    this.releaseSpring = function(){
        _oModuleStart.releaseSpring();
    };

    this.shiftElementsToRight = function(){
        _oModuleMultiplier.shiftElementsToRight();
        _oModuleJumper.shiftElementsToRight();
    };
    
    this.shiftElementsToLeft = function(){
        _oModuleMultiplier.shiftElementsToLeft();
        _oModuleJumper.shiftElementsToLeft();
    };

    this.enableShieldBonus = function(){
        _oModuleHole.activeShieldLight();
    };

    this.activeShield = function(){
        _oModuleShield.enableShield();
    };

    this.enableExtraBallBonus = function(){
        _oModuleHole.activeExtraBallLight();
    };

    this.activeExtraBall = function(){
        s_oGame.setExtraBall();
    };

    this.enableJackpot = function(){
        _oModuleJackpot.enableJackpot();
    };

    this.onJackpotIncreased = function(iAmount){
        _oModuleJackpot.setJackpotAmount(iAmount);
    };

    this.getTableSize = function(){
        var oSize = {w: _iWidth, h: _iHeight};
        return oSize;
    };

    this.getAdjustedPoints = function(iStartX, iStartY, aPoints){

        var aNewPoints = new Array();
        for(var i=0; i<aPoints.length; i++){
            
            var iTranslationX = _oTable.x
            var iTranslationY = _oTable.y
            
            var iNewX = iTranslationX + iStartX + aPoints[i].x;
            var iNewY = iTranslationY + iStartY + aPoints[i].y;
            
            aNewPoints[i] = {x: iNewX, y: iNewY};
        }
        
        return aNewPoints;
       
    };
    
    this.update = function(){
        _oModuleJackpot.update();
        _oModuleRouter.update();
        _oModuleLetters.update();
    };
    
    s_oTable = this;
    this._init(oBackGroundContainer, oForeGroundContainer);
}


var s_oTable;