var SINGLE_BUTTON_SCORE = 50;
var CIRCLE_BUMPER_SCORE = [10,20,50,100,200,500,1000];
var GATE_SCORE = 100;
var ROUTER_GATE_SCORE = [50, 100, 200, 500, 1000, 2000, 5000];
var MULTIPLIER_TOGGLE_SCORE = 100;
var HOLE_BONUS_SCORE = [1000, 5000, 10000, 50000, 100000, 500000, 1000000];
var HOLE_STANDARD_SCORE = 500;
var SINGLE_LETTERS_LIT_SCORE = 50000;
var ALL_LETTERS_LIT_SCORE = 5000000;
var JUMPER_SCORE = 500;
var ALL_JUMPER_BUTTONS_SCORE = 5000;

function CSCoreController(){
    
    var _aCbCompleted;
    var _aCbOwner;
    
    var _iTotalScore;
    var _iMultiplier;
    var _iJackpot;
    
    var _iCircleBumperLevel;
    var _iRouterLevel;
    
    var _iHoleBonusLevel;
    
    this._init = function(){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _iTotalScore = 0;
        _iMultiplier = 1;
        _iJackpot = 0;
        
        _iCircleBumperLevel = 0;
        _iRouterLevel = 0;
        
        _iHoleBonusLevel = -1;
    };
    
    this._increaseJackpot = function(iScore){
        var iJackpotToAdd = Math.floor(iScore*SCORE_RATIO_TO_ADD_AT_JACKPOT);
        _iJackpot += iJackpotToAdd;
        
        if(_aCbCompleted[ON_INCREASE_JACKPOT]){
            _aCbCompleted[ON_INCREASE_JACKPOT].call(_aCbOwner[ON_INCREASE_JACKPOT], _iJackpot);
        }
    };
    
    this._addScore = function(iScore){
        _iTotalScore += iScore;
        s_oScoreController._increaseJackpot(iScore);

        if(_aCbCompleted[ON_INCREASE_SCORE]){
            _aCbCompleted[ON_INCREASE_SCORE].call(_aCbOwner[ON_INCREASE_SCORE], _iTotalScore);
        }
    };
    
    this.resetScore = function(){
        _iTotalScore = 0;
        s_oScoreController._addScore(0);
    };
    
    this.getScore = function(){
        return _iTotalScore;
    };
    
    this.addEventListener = function(iEvent,cbCompleted, cbOwner){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };
    
    this.resetCircleBumperLevel = function(){
        _iCircleBumperLevel = 0;
    };
    
    this.resetJackpot = function(){
        _iJackpot = 0;
        if(_aCbCompleted[ON_INCREASE_JACKPOT]){
            _aCbCompleted[ON_INCREASE_JACKPOT].call(_aCbOwner[ON_INCREASE_JACKPOT], _iJackpot);
        }
    };
    
    this.resetMultiplier = function(){
        _iMultiplier = 1;
    };
    
    this.getJackpotAmount = function(){
        return _iJackpot;
    };
    
    this.addButtonScore = function(){
        var iScoreToAdd = SINGLE_BUTTON_SCORE*_iMultiplier;
        s_oScoreController._addScore(iScoreToAdd);
    };

    ///////////CIRCLE BUMPER SCORE
    this.increaseCircleBumperLevel = function(){
        _iCircleBumperLevel++;
        if(_iCircleBumperLevel === CIRCLE_BUMPER_SCORE.length){
            _iCircleBumperLevel = CIRCLE_BUMPER_SCORE.length-1;
        }
    };
    
    this.getBumperValue = function(){
        return CIRCLE_BUMPER_SCORE[_iCircleBumperLevel];
    };
    
    this.addCircleBumperScore = function(){
        var iScoreToAdd = CIRCLE_BUMPER_SCORE[_iCircleBumperLevel]*_iMultiplier;
        s_oScoreController._addScore(iScoreToAdd);
    };
    
    ///////////GATE SCORE
    this.addGateScore = function(){
        var iScoreToAdd = GATE_SCORE*_iMultiplier;
        s_oScoreController._addScore(iScoreToAdd);
    };
    
    this.addRouterScore = function(){
        var iScoreToAdd = ROUTER_GATE_SCORE[_iRouterLevel]*_iMultiplier;
        s_oScoreController._addScore(iScoreToAdd);
    };
    
    this.increaseRouterLevel = function(){
        _iRouterLevel++;
        if(_iRouterLevel === ROUTER_GATE_SCORE.length){
            _iRouterLevel = ROUTER_GATE_SCORE.length-1;
        }
    };
    
    this.decreaseRouterLevel = function(){
        _iRouterLevel--;
        if(_iRouterLevel < 0){
            _iRouterLevel = 0;
        }
    };
    
    this.getCurRouterLevel = function(){
        return _iRouterLevel;
    };
    
    this.resetRouterLevel = function(){
        _iRouterLevel = 0;
    };
    
    ///////////MULTIPLIER SCORE
    this.addMultiplierToggleScore = function(){
        var iScoreToAdd = MULTIPLIER_TOGGLE_SCORE*_iMultiplier;
        s_oScoreController._addScore(iScoreToAdd);
    };
    
    this.addTotalMultiplierToggleScore = function(){
        var iScoreToAdd = MULTIPLIER_TOGGLE_SCORE*10*_iMultiplier;
        s_oScoreController._addScore(iScoreToAdd);
    };
    
    this.increaseMultiplier = function(){
        _iMultiplier++;
        if(_iMultiplier >= MAX_MULTIPLIER){
            _iMultiplier = MAX_MULTIPLIER;
        }
    };
    
    this.getCurMultiplier = function(){
        return _iMultiplier;
    };
    
    ///////////HOLE BONUS SCORE
    this.addTotalHoleButtonScore = function(){
        var iScoreToAdd = SINGLE_BUTTON_SCORE*10*_iMultiplier;
        s_oScoreController._addScore(iScoreToAdd);
    };
    
    this.addStandardHoleScore = function(){
        var iScoreToAdd = HOLE_STANDARD_SCORE*_iMultiplier;
        s_oScoreController._addScore(iScoreToAdd);
    };
    
    this.addHoleScoreBonus = function(){
        var iScoreToAdd = HOLE_BONUS_SCORE[_iHoleBonusLevel]*_iMultiplier;
        s_oScoreController._addScore(iScoreToAdd);
    };
    
    this.increaseHoleBonusLevel = function(){
        _iHoleBonusLevel++;
    };
    
    this.decreaseHoleBonusLevel = function(){
        _iHoleBonusLevel--;
    };
    
    this.resetHoleBonusLevel = function(){
        _iHoleBonusLevel = -1;
    };
    
    this.getCurHoleBonusLevel = function(){
        return _iHoleBonusLevel;
    };
    
    ///////////LETTERS SCORE
    this.addSingleLettersScore = function(){
        var iScoreToAdd = SINGLE_LETTERS_LIT_SCORE*_iMultiplier;
        s_oScoreController._addScore(iScoreToAdd);
    };
    
    this.addAllLettersScore = function(){
        var iScoreToAdd = ALL_LETTERS_LIT_SCORE*_iMultiplier;
        s_oScoreController._addScore(iScoreToAdd);
    };
    
    ///////////JUMPER SCORE
    this.addAllJumperButtonsScore = function(){
        var iScoreToAdd = ALL_JUMPER_BUTTONS_SCORE*_iMultiplier;
        s_oScoreController._addScore(iScoreToAdd);
    };
    
    this.addJumperScore = function(){
        var iScoreToAdd = JUMPER_SCORE*_iMultiplier;
        s_oScoreController._addScore(iScoreToAdd);
    };
    
    ///////////JACKPOT SCORE
    this.addJackpotScore = function(){
        s_oScoreController._addScore(_iJackpot);
    };
    
    
    
    s_oScoreController = this;
    this._init();
}

var s_oScoreController;
