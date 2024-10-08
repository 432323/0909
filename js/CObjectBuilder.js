function CObjectBuilder(){
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2World = Box2D.Dynamics.b2World;
    var b2MassData = Box2D.Collision.Shapes.b2MassData;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

    var _oWorld;

    var _oGame;
    var _oPhysicController;
    
    this.init = function(){

        _oPhysicController = s_oPhysicsController.getInstance();
        _oGame = s_oGame;
        _oWorld = _oPhysicController.getWorld();
        
    };

    this.addButton = function(iWidth,iHeight,iX,iY, iAngle, density, friction, restitution, oUserData) {
        // Create some objects in the world
        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;
        oFixDef.color = 0xffffff;
        oFixDef.userData = oUserData;

        var oBodyDef = new b2BodyDef;
        //create ground
        oBodyDef.type = b2Body.b2_staticBody;

        oFixDef.shape = new b2PolygonShape;
        oFixDef.shape.SetAsBox((iWidth/2)/ WORLD_SCALE, (iHeight/2)/ WORLD_SCALE);


        oBodyDef.position.Set(iX/ WORLD_SCALE, iY/ WORLD_SCALE);
        oBodyDef.angle = iAngle*Math.PI/180;
        var oBody = _oWorld.CreateBody(oBodyDef);
        oBody.CreateFixture(oFixDef);
        
        return oBody;
    };
    
    this.addEdge = function(v1, v2, iAngle, density, friction, restitution){
        // Create some objects in the world
        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;
        
        var oBodyDef = new b2BodyDef;
        //create ground
        oBodyDef.type = b2Body.b2_staticBody;
        oFixDef.shape = new b2PolygonShape;
        
        var oPos1 = new b2Vec2(v1.x/ WORLD_SCALE,v1.y/ WORLD_SCALE);
        var oPos2 = new b2Vec2(v2.x/ WORLD_SCALE,v2.y/ WORLD_SCALE);
        
        oFixDef.shape.SetAsEdge(oPos1, oPos2);

        oBodyDef.angle = iAngle*Math.PI/180;
        var oBody = _oWorld.CreateBody(oBodyDef);
        oBody.CreateFixture(oFixDef);
        
        
        return oBody;
    };
    
    this.addPolygon = function(aPoints, iAngle, density, friction, restitution) {
        // Create some objects in the world
        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;

        var oBodyDef = new b2BodyDef;
        //create ground
        oBodyDef.type = b2Body.b2_staticBody;
        oFixDef.shape = new b2PolygonShape;
        
        var points = [];
        for (var i = 0; i < aPoints.length; i++) {
            var vec = new b2Vec2();
            
            vec.Set(aPoints[i].x/ WORLD_SCALE, aPoints[i].y/ WORLD_SCALE);
            points.push(vec);
        }
        
        oFixDef.shape.SetAsArray(points, points.length);
        
        oBodyDef.angle = iAngle*Math.PI/180;
        _oWorld.CreateBody(oBodyDef).CreateFixture(oFixDef); 
    };
    
    this.addBall = function(iWidth,iX,iY, density, friction, restitution) {
        // Create some objects in the world
        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;
        oFixDef.userData = {id:"ball"};
        var oBodyDef = new b2BodyDef;

        //create some objects
        oBodyDef.type = b2Body.b2_dynamicBody;
        oFixDef.shape = new b2CircleShape( iWidth/WORLD_SCALE );         //radius
        oBodyDef.allowSleep = false;
        oBodyDef.bullet = true;

        oBodyDef.position.x = iX/WORLD_SCALE;
        oBodyDef.position.y = iY/WORLD_SCALE;
        var oBody = _oWorld.CreateBody(oBodyDef)
        var oCrateFixture = oBody.CreateFixture(oFixDef);
        
        return oBody;
   };

    this.addCircle = function(iWidth,iX,iY, density, friction, restitution) {
        // Create some objects in the world
        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;

        var oBodyDef = new b2BodyDef;

        //create some objects
        oBodyDef.type = b2Body.b2_dynamicBody;
        oFixDef.shape = new b2CircleShape( iWidth/WORLD_SCALE );         //radius
        oBodyDef.position.x = iX/WORLD_SCALE;
        oBodyDef.position.y = iY/WORLD_SCALE;
        var oCrateFixture = _oWorld.CreateBody(oBodyDef).CreateFixture(oFixDef);
        return oCrateFixture;
   };

    this.addStaticCircle = function(iWidth, iX, iY, density, friction, restitution, oUserData) {
        // Create some objects in the world
        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;
        oFixDef.userData = oUserData;

        var oBodyDef = new b2BodyDef;

        //create some objects
        oBodyDef.type = b2Body.b2_staticBody;
        oFixDef.shape = new b2CircleShape( iWidth/WORLD_SCALE );         //radius
        oBodyDef.position.x = iX/WORLD_SCALE;
        oBodyDef.position.y = iY/WORLD_SCALE;
        var oCrateFixture = _oWorld.CreateBody(oBodyDef).CreateFixture(oFixDef);
        return oCrateFixture;
   };

    this.addRevoluteRectangle = function(iWidth,iHeight,iX,iY, density, friction, restitution, bHadToMove) {
        // Create some objects in the world
        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;

        var oBodyDef = new b2BodyDef;
        //create ground
        oBodyDef.type = b2Body.b2_dynamicBody;
        if(bHadToMove){
            oBodyDef.angularVelocity = 3;
        }
        oFixDef.shape = new b2PolygonShape;
        oFixDef.shape.SetAsBox(iWidth/WORLD_SCALE, iHeight/WORLD_SCALE);
        oBodyDef.position.Set(iX/WORLD_SCALE, iY/WORLD_SCALE);
        var Body1 = _oWorld.CreateBody(oBodyDef);
        var oCrateFixture1 = Body1.CreateFixture(oFixDef);
        
        var oPivotfixDef = new b2FixtureDef;
        oPivotfixDef.density = 3.0;
        oPivotfixDef.friction = 1;
        oPivotfixDef.restitution = 0.1;
        var oPivotoBodyDef = new b2BodyDef;
        //create ground
        oPivotoBodyDef.type = b2Body.b2_staticBody;
        oPivotfixDef.shape = new b2CircleShape(10/WORLD_SCALE);
        oPivotoBodyDef.position.Set(iX/WORLD_SCALE, iY/WORLD_SCALE);
        var pivotBody = _oWorld.CreateBody(oPivotoBodyDef);
        var oCrateFixture2 = pivotBody.CreateFixture(oPivotfixDef);
        
        //Revolute joint
        var jointDef = new b2RevoluteJointDef();
        jointDef.Initialize(Body1, pivotBody, Body1.GetWorldCenter());
        _oWorld.CreateJoint(jointDef);
        return {fixture1: oCrateFixture1, fixture2:oCrateFixture2};
    };

   
    this.addLeftFlipper = function(aPoints,iX,iY, density, friction, restitution) {
        // Create some objects in the world
        
        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;
        
        var oBodyDef = new b2BodyDef;
        //create ground
        oBodyDef.type = b2Body.b2_dynamicBody;
        oFixDef.shape = new b2PolygonShape;
        var points = [];
        for (var i = 0; i < aPoints.length; i++) {
            var vec = new b2Vec2();
            
            vec.Set((aPoints[i].x/ WORLD_SCALE)*-1, aPoints[i].y/ WORLD_SCALE);
            points.push(vec);
        }
        oFixDef.shape.SetAsArray(points, points.length);
        oBodyDef.position.Set((iX)/WORLD_SCALE, (iY+28)/WORLD_SCALE);
        
        var Body1 = _oWorld.CreateBody(oBodyDef);
        var oCrateFixture1 = Body1.CreateFixture(oFixDef);

       
       
        var oPivotfixDef = new b2FixtureDef;
        oPivotfixDef.density = density;
        oPivotfixDef.friction = friction;
        oPivotfixDef.restitution = restitution;
        var oPivotoBodyDef = new b2BodyDef;
        //create ground
        oPivotoBodyDef.type = b2Body.b2_staticBody;
        oPivotfixDef.shape = new b2CircleShape(11/WORLD_SCALE);
        oPivotoBodyDef.position.Set(iX/WORLD_SCALE, iY/WORLD_SCALE);
        var pivotBody = _oWorld.CreateBody(oPivotoBodyDef);     
        var oCrateFixture2 = pivotBody.CreateFixture(oPivotfixDef);

        //Revolute joint
        var jointDef = new b2RevoluteJointDef();
        var vPivot = {x: pivotBody.GetWorldCenter().x, y: pivotBody.GetWorldCenter().y};
        jointDef.Initialize(Body1, pivotBody, vPivot);
        
        jointDef.lowerAngle = 5.0 * Math.PI / 180.0;
        jointDef.upperAngle = 50.0 * Math.PI / 180.0;
        jointDef.enableLimit = true;
        jointDef.maxMotorTorque = 1000.0;
        jointDef.enableMotor = true;
        
        var oJoint = _oWorld.CreateJoint(jointDef);
        oJoint.EnableMotor(true); 
        return oJoint;
    };
   
    this.addRightFlipper = function(aPoints,iX,iY, density, friction, restitution) {
        // Create some objects in the world
        
        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;
        
        var oBodyDef = new b2BodyDef;
        //create ground
        oBodyDef.type = b2Body.b2_dynamicBody;
        oFixDef.shape = new b2PolygonShape;
        var points = [];
        for (var i = 0; i < aPoints.length; i++) {
            var vec = new b2Vec2();
            
            vec.Set(aPoints[i].x/ WORLD_SCALE, aPoints[i].y/ WORLD_SCALE);
            points.push(vec);
        }
        oFixDef.shape.SetAsArray(points, points.length);
        oBodyDef.position.Set((iX)/WORLD_SCALE, (iY+28)/WORLD_SCALE);
        
        var Body1 = _oWorld.CreateBody(oBodyDef);
        var oCrateFixture1 = Body1.CreateFixture(oFixDef);
       
       
        var oPivotfixDef = new b2FixtureDef;
        oPivotfixDef.density = density;
        oPivotfixDef.friction = friction;
        oPivotfixDef.restitution = restitution;
        var oPivotoBodyDef = new b2BodyDef;
        //create ground
        oPivotoBodyDef.type = b2Body.b2_staticBody;
        oPivotfixDef.shape = new b2CircleShape(11/WORLD_SCALE);
        oPivotoBodyDef.position.Set(iX/WORLD_SCALE, iY/WORLD_SCALE);
        var pivotBody = _oWorld.CreateBody(oPivotoBodyDef);     
        var oCrateFixture2 = pivotBody.CreateFixture(oPivotfixDef);

        //Revolute joint
        var jointDef = new b2RevoluteJointDef();
        var vPivot = {x: pivotBody.GetWorldCenter().x, y: pivotBody.GetWorldCenter().y};
        jointDef.Initialize(Body1, pivotBody, vPivot);
        
        jointDef.lowerAngle = -50.0 * Math.PI / 180.0;
        jointDef.upperAngle = -5.0 * Math.PI / 180.0;
        jointDef.enableLimit = true;
        jointDef.maxMotorTorque = 1000.0;
        jointDef.enableMotor = true;
        
        var oJoint = _oWorld.CreateJoint(jointDef);
        oJoint.EnableMotor(true); 

        return oJoint;
    };

    this.addRectangle = function(iWidth,iHeight,iX,iY,iAngle, density, friction, restitution) {        
        // Create some objects in the world
        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;

        var oBodyDef = new b2BodyDef;
        //create ground
        oBodyDef.type = b2Body.b2_staticBody;
        oFixDef.shape = new b2PolygonShape;
        oFixDef.shape.SetAsBox(iWidth/WORLD_SCALE, iHeight/WORLD_SCALE);
        oBodyDef.position.Set(iX/WORLD_SCALE, iY/WORLD_SCALE);
        oBodyDef.angle = iAngle*Math.PI/180;
        var Body1 = _oWorld.CreateBody(oBodyDef);
        var oCrateFixture = Body1.CreateFixture(oFixDef);
        
        return oCrateFixture;
    };
   
    this.init();
    s_oObjectBuilder = this;
}

var s_oObjectBuilder = null;