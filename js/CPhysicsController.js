function CPhysicsController(){
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2World = Box2D.Dynamics.b2World;
    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    var b2MassData = Box2D.Collision.Shapes.b2MassData;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    var b2WorldManifold = Box2D.Collision.b2WorldManifold;

    var _oGravity;
    var _oWorld;
    var _oPhysicController = this;
    
    var _aBodyToDeactive;
    var _aBodyToActive;
    
    var _oDebugCtx;
        
    this.init = function(){
        _oGravity = new b2Vec2(0, GRAVITY);
        _oWorld = new b2World(_oGravity,  true);

        _aBodyToDeactive = new Array();
        _aBodyToActive = new Array();

        if(DEBUG_BOX2D){

            var canv = document.createElement('canvas');
            canv.id = 'debug';
            canv.width = s_oCanvas.width;
            canv.height = s_oCanvas.height;
            canv.style.position = "fixed";
            document.body.appendChild(canv); // adds the canvas to the body element

            $( "#debug" ).css( 'pointer-events', 'none' );
        
            var canvas = document.getElementById("debug");
            _oDebugCtx = canvas.getContext("2d");
            
            //setup debug draw
            var oDebugDraw = new b2DebugDraw();
            oDebugDraw.SetSprite(_oDebugCtx);
            oDebugDraw.SetDrawScale(WORLD_SCALE*ZOOM);
            oDebugDraw.SetFillAlpha(DEBUG_BOX2D_ALPHA);
            oDebugDraw.SetLineThickness(1.0);
            oDebugDraw.SetFlags(b2DebugDraw.e_shapeBit);
            
            _oWorld.SetDebugDraw(oDebugDraw);
        
            sizeHandler();
        }
        
        this.createAContactListener();

    };
    
    this.createAContactListener = function () {
        
        var listener = new Box2D.Dynamics.b2ContactListener;

        listener.BeginContact = function (contact) {
            var oUserDataA = contact.GetFixtureA().GetUserData();
            var oUserDataB = contact.GetFixtureB().GetUserData();

            s_oPhysicsController.processContactEvent(CONTACT_BEGIN, oUserDataA, contact);
            s_oPhysicsController.processContactEvent(CONTACT_BEGIN, oUserDataB, contact);
            
        };
        listener.EndContact = function (contact) {
            var oUserDataA = contact.GetFixtureA().GetUserData();
            var oUserDataB = contact.GetFixtureB().GetUserData();

            s_oPhysicsController.processContactEvent(CONTACT_END, oUserDataA, contact);
            s_oPhysicsController.processContactEvent(CONTACT_END, oUserDataB, contact);
        };

        _oWorld.SetContactListener(listener);
    };
    
    this.destroyBodyVector = function(vBody){
        _oWorld.DestroyBody(vBody);
    };
    
    this.destroyAllBodies = function () {
        // GET THE FIRST BODY OF THE LIST
        var b2Bodies = _oWorld.GetBodyList();
        
        // UNTIL WE REACH THE END OF THE LIST (NULL), LOOP
        while (b2Bodies) {
            // GET THE NEXT ON THE LIST, DESTROY IT
            var b2Current = b2Bodies;
            var b2Bodies = b2Bodies.GetNext();
            _oWorld.DestroyBody(b2Current);
        }
    };
    
    this.destroyAllJoints = function () {
        var b2Joints = _oWorld.GetJointList();
        
        while (b2Joints) {
            var b2Current = b2Joints;
            var b2Joints = b2Joints.GetNext();
            _oWorld.DestroyJoint(b2Current);            
        }
    };

    this.destroyAllContacts = function(){
        var b2Contacts = _oWorld.GetContactList();
        
        while (b2Contacts) {
            var b2Contact = b2Contacts.GetNext();
            _oWorld.DestroyJoint(b2Contact);
        }
    };
    
    this.unload = function(){
        s_oPhysicsController.destroyAllJoints();
        s_oPhysicsController.destroyAllBodies();
        s_oPhysicsController.destroyAllContacts();
        
        if(DEBUG_BOX2D){
            document.getElementById("debug").remove();
        }
        s_oPhysicsController = null;
        _oWorld = null;
    };
    
    this.processContactEvent = function(iContactType, oUserData, contact){ 
        if(oUserData && oUserData.contacttype === iContactType){
            oUserData.callback(oUserData.params, contact);
        }
    };
    
    this.startComputing = function(oElement){
        oElement.GetBody().SetActive(true);
    };
    
    this.movePlayer = function(oBox, iX, iY){
        var oPos = {x: iX / WORLD_SCALE, y: iY / WORLD_SCALE};
        oBox.GetBody().SetPosition(oPos);
    };
    
    this.applyImpulse = function(oElement){
        oElement.GetBody().ApplyImpulse( {x:0.8,y:1}, oElement.GetBody().GetWorldCenter() );
    };
    
    this.decreaseSpeedRotation = function(oElement){
        var iNewAngularVelocity = oElement.GetBody().GetAngularVelocity()*0.99;
        oElement.GetBody().SetAngularVelocity(iNewAngularVelocity);
    };
    
    this.getSpeedRotation = function(oElement){
        return oElement.GetBody().GetAngularVelocity();
    };
    
    this.moveObject = function(oElement, iNewX, iY){
        var oPos = {x: iNewX/WORLD_SCALE, y:iY/WORLD_SCALE};
        oElement.GetBody().SetPosition(oPos);
    };
    
    this.destroyBody = function(oElement){
        _oWorld.DestroyBody(oElement.GetBody());
    };
    
    this.getInstance = function(){
        if(_oPhysicController===null){
            _oPhysicController=new CPhysicsController();
        }
        return _oPhysicController;
    };
    
    this.update = function(oCamera) {
        // Update the box2d world
        _oWorld.Step(1 / FPS, 8, 8);
        
        if(DEBUG_BOX2D){
            
            _oDebugCtx.save(); 
            _oDebugCtx.clearRect(0, 0, s_oCanvas.width, s_oCanvas.height);
            _oDebugCtx.translate(oCamera.x, oCamera.y);

            _oWorld.DrawDebugData();
            
            _oDebugCtx.restore();
        }
        _oWorld.ClearForces();

        this._deactiveAllBodyInList();
        this._activeAllBodyInList();

    };

    this.getWorld = function(){
        return _oWorld;
    };
    
    this.getElementPosition = function(oElement) {
        var oPos = oElement.GetBody().GetPosition();
        return {x: oPos.x*WORLD_SCALE, y: oPos.y*WORLD_SCALE, angle: oElement.GetBody().GetAngle()*180/Math.PI};
    };
    
    this.getElementAngle = function(oElement) {
        return oElement.GetBody().GetAngle()*180/Math.PI;
    };
    
    this.enableBody = function(oBody, oPos){
        _aBodyToActive.push({body:oBody, pos: oPos});
    };
    
    this.disableBody = function(oBody, oPos){
        _aBodyToDeactive.push({body:oBody, pos: oPos});
    };
    
    this._deactiveAllBodyInList = function(){
        for(var i=0; i<_aBodyToDeactive.length; i++){
            _aBodyToDeactive[i].body.SetActive(false);
            
            if(_aBodyToDeactive[i].pos){
                var oNewPos = {x: _aBodyToDeactive[i].pos.x / WORLD_SCALE, y: _aBodyToDeactive[i].pos.y / WORLD_SCALE};
                _aBodyToDeactive[i].body.SetPosition(oNewPos);
            }
        }
        
        _aBodyToDeactive = new Array();
    };
    
    this._activeAllBodyInList = function(){
        for(var i=0; i<_aBodyToActive.length; i++){
            _aBodyToActive[i].body.SetActive(true);
            
            if(_aBodyToActive[i].pos){
                var oNewPos = {x: _aBodyToActive[i].pos.x / WORLD_SCALE, y: _aBodyToActive[i].pos.y / WORLD_SCALE};
                _aBodyToActive[i].body.SetPosition(oNewPos);
            }
        }
        
        _aBodyToActive = new Array();
    };
    
    this.init();
    s_oPhysicsController = this;
}

var s_oPhysicsController = null;