window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  ActorRenderer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1a792KO87NBg7vCCIp1jq+j", "ActorRenderer");
    "use strict";
    var Game = require("Game");
    var Types = require("Types");
    var Utils = require("Utils");
    var ActorPlayingState = Types.ActorPlayingState;
    cc.Class({
      extends: cc.Component,
      properties: {
        playerInfo: cc.Node,
        stakeOnTable: cc.Node,
        cardInfo: cc.Node,
        cardPrefab: cc.Prefab,
        anchorCards: cc.Node,
        spPlayerName: cc.Sprite,
        labelPlayerName: cc.Label,
        labelTotalStake: cc.Label,
        spPlayerPhoto: cc.Sprite,
        callCounter: cc.ProgressBar,
        labelStakeOnTable: cc.Label,
        spChips: {
          default: [],
          type: cc.Sprite
        },
        labelCardInfo: cc.Label,
        spCardInfo: cc.Sprite,
        animFX: cc.Node,
        cardSpace: 0
      },
      onLoad: function onLoad() {},
      init: function init(playerInfo, playerInfoPos, stakePos, turnDuration, switchSide) {
        this.actor = this.getComponent("Actor");
        this.isCounting = false;
        this.counterTimer = 0;
        this.turnDuration = turnDuration;
        this.playerInfo.position = playerInfoPos;
        this.stakeOnTable.position = stakePos;
        this.labelPlayerName.string = playerInfo.name;
        this.updateTotalStake(playerInfo.gold);
        var photoIdx = playerInfo.photoIdx % 5;
        this.spPlayerPhoto.spriteFrame = Game.instance.assetMng.playerPhotos[photoIdx];
        this.animFX = this.animFX.getComponent("FXPlayer");
        this.animFX.init();
        this.animFX.show(false);
        this.cardInfo.active = false;
        if (switchSide) {
          this.spCardInfo.getComponent("SideSwitcher").switchSide();
          this.spPlayerName.getComponent("SideSwitcher").switchSide();
        }
      },
      update: function update(dt) {
        if (this.isCounting) {
          this.callCounter.progress = this.counterTimer / this.turnDuration;
          this.counterTimer += dt;
          if (this.counterTimer >= this.turnDuration) {
            this.isCounting = false;
            this.callCounter.progress = 1;
          }
        }
      },
      initDealer: function initDealer() {
        this.actor = this.getComponent("Actor");
        this.animFX = this.animFX.getComponent("FXPlayer");
        this.animFX.init();
        this.animFX.show(false);
      },
      updateTotalStake: function updateTotalStake(num) {
        this.labelTotalStake.string = "$" + num;
      },
      startCountdown: function startCountdown() {
        if (this.callCounter) {
          this.isCounting = true;
          this.counterTimer = 0;
        }
      },
      resetCountdown: function resetCountdown() {
        if (this.callCounter) {
          this.isCounting = false;
          this.counterTimer = 0;
          this.callCounter.progress = 0;
        }
      },
      playBlackJackFX: function playBlackJackFX() {
        this.animFX.playFX("blackjack");
      },
      playBustFX: function playBustFX() {
        this.animFX.playFX("bust");
      },
      onDeal: function onDeal(card, show) {
        var newCard = cc.instantiate(this.cardPrefab).getComponent("Card");
        this.anchorCards.addChild(newCard.node);
        newCard.init(card);
        newCard.reveal(show);
        var startPos = cc.v2(0, 0);
        var index = this.actor.cards.length - 1;
        var endPos = cc.v2(this.cardSpace * index, 0);
        newCard.node.setPosition(startPos);
        this._updatePointPos(endPos.x);
        var moveAction = cc.moveTo(.5, endPos);
        var callback = cc.callFunc(this._onDealEnd, this);
        newCard.node.runAction(cc.sequence(moveAction, callback));
      },
      _onDealEnd: function _onDealEnd(target) {
        this.resetCountdown();
        this.actor.state === ActorPlayingState.Normal && this.startCountdown();
        this.updatePoint();
      },
      onReset: function onReset() {
        this.cardInfo.active = false;
        this.anchorCards.removeAllChildren();
        this._resetChips();
      },
      onRevealHoldCard: function onRevealHoldCard() {
        var card = cc.find("cardPrefab", this.anchorCards).getComponent("Card");
        card.reveal(true);
        this.updateState();
      },
      updatePoint: function updatePoint() {
        this.cardInfo.active = true;
        this.labelCardInfo.string = this.actor.bestPoint;
        switch (this.actor.hand) {
         case Types.Hand.BlackJack:
          this.animFX.show(true);
          this.animFX.playFX("blackjack");
          break;

         case Types.Hand.FiveCard:
        }
      },
      _updatePointPos: function _updatePointPos(xPos) {
        this.cardInfo.setPosition(xPos + 50, 0);
      },
      showStakeChips: function showStakeChips(stake) {
        var chips = this.spChips;
        var count = 0;
        stake > 5e4 ? count = 5 : stake > 25e3 ? count = 4 : stake > 1e4 ? count = 3 : stake > 5e3 ? count = 2 : stake > 0 && (count = 1);
        for (var i = 0; i < count; ++i) chips[i].enabled = true;
      },
      _resetChips: function _resetChips() {
        for (var i = 0; i < this.spChips.length; ++i) this.spChips.enabled = false;
      },
      updateState: function updateState() {
        switch (this.actor.state) {
         case ActorPlayingState.Normal:
          this.cardInfo.active = true;
          this.spCardInfo.spriteFrame = Game.instance.assetMng.texCardInfo;
          this.updatePoint();
          break;

         case ActorPlayingState.Bust:
          var min = Utils.getMinMaxPoint(this.actor.cards).min;
          this.labelCardInfo.string = "\u7206\u724c(" + min + ")";
          this.spCardInfo.spriteFrame = Game.instance.assetMng.texBust;
          this.cardInfo.active = true;
          this.animFX.show(true);
          this.animFX.playFX("bust");
          this.resetCountdown();
          break;

         case ActorPlayingState.Stand:
          var max = Utils.getMinMaxPoint(this.actor.cards).max;
          this.labelCardInfo.string = "\u505c\u724c(" + max + ")";
          this.spCardInfo.spriteFrame = Game.instance.assetMng.texCardInfo;
          this.resetCountdown();
        }
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game",
    Types: "Types",
    Utils: "Utils"
  } ],
  Actor: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7d008dTf6xB2Z0wCAdzh1Rx", "Actor");
    "use strict";
    var Types = require("Types");
    var Utils = require("Utils");
    var ActorPlayingState = Types.ActorPlayingState;
    cc.Class({
      extends: cc.Component,
      properties: {
        cards: {
          default: [],
          serializable: false,
          visible: false
        },
        holeCard: {
          default: null,
          serializable: false,
          visible: false
        },
        bestPoint: {
          get: function get() {
            var minMax = Utils.getMinMaxPoint(this.cards);
            return minMax.max;
          }
        },
        hand: {
          get: function get() {
            var count = this.cards.length;
            this.holeCard && ++count;
            if (count >= 5) return Types.Hand.FiveCard;
            if (2 === count && 21 === this.bestPoint) return Types.Hand.BlackJack;
            return Types.Hand.Normal;
          }
        },
        canReport: {
          get: function get() {
            return this.hand !== Types.Hand.Normal;
          },
          visible: false
        },
        renderer: {
          default: null,
          type: cc.Node
        },
        state: {
          default: ActorPlayingState.Normal,
          notify: function notify(oldState) {
            this.state !== oldState && this.renderer.updateState();
          },
          type: ActorPlayingState,
          serializable: false
        }
      },
      init: function init() {
        this.ready = true;
        this.renderer = this.getComponent("ActorRenderer");
      },
      addCard: function addCard(card) {
        this.cards.push(card);
        this.renderer.onDeal(card, true);
        var cards = this.holeCard ? [ this.holeCard ].concat(this.cards) : this.cards;
        Utils.isBust(cards) && (this.state = ActorPlayingState.Bust);
      },
      addHoleCard: function addHoleCard(card) {
        this.holeCard = card;
        this.renderer.onDeal(card, false);
      },
      stand: function stand() {
        this.state = ActorPlayingState.Stand;
      },
      revealHoldCard: function revealHoldCard() {
        if (this.holeCard) {
          this.cards.unshift(this.holeCard);
          this.holeCard = null;
          this.renderer.onRevealHoldCard();
        }
      },
      report: function report() {
        this.state = ActorPlayingState.Report;
      },
      reset: function reset() {
        this.cards = [];
        this.holeCard = null;
        this.reported = false;
        this.state = ActorPlayingState.Normal;
        this.renderer.onReset();
      }
    });
    cc._RF.pop();
  }, {
    Types: "Types",
    Utils: "Utils"
  } ],
  AssetMng: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "54522LcoVpPHbrqYgwp/1Qm", "AssetMng");
    "use strict";
    var AssetMng = cc.Class({
      extends: cc.Component,
      properties: {
        texBust: cc.SpriteFrame,
        texCardInfo: cc.SpriteFrame,
        texCountdown: cc.SpriteFrame,
        texBetCountdown: cc.SpriteFrame,
        playerPhotos: [ cc.SpriteFrame ]
      }
    });
    cc._RF.pop();
  }, {} ],
  AudioMng: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "01ca4tStvVH+JmZ5TNcmuAu", "AudioMng");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        winAudio: {
          default: null,
          url: cc.AudioClip
        },
        loseAudio: {
          default: null,
          url: cc.AudioClip
        },
        cardAudio: {
          default: null,
          url: cc.AudioClip
        },
        buttonAudio: {
          default: null,
          url: cc.AudioClip
        },
        chipsAudio: {
          default: null,
          url: cc.AudioClip
        },
        bgm: {
          default: null,
          url: cc.AudioClip
        }
      },
      playMusic: function playMusic() {
        cc.audioEngine.playMusic(this.bgm, true);
      },
      pauseMusic: function pauseMusic() {
        cc.audioEngine.pauseMusic();
      },
      resumeMusic: function resumeMusic() {
        cc.audioEngine.resumeMusic();
      },
      _playSFX: function _playSFX(clip) {
        cc.audioEngine.playEffect(clip, false);
      },
      playWin: function playWin() {
        this._playSFX(this.winAudio);
      },
      playLose: function playLose() {
        this._playSFX(this.loseAudio);
      },
      playCard: function playCard() {
        this._playSFX(this.cardAudio);
      },
      playChips: function playChips() {
        this._playSFX(this.chipsAudio);
      },
      playButton: function playButton() {
        this._playSFX(this.buttonAudio);
      }
    });
    cc._RF.pop();
  }, {} ],
  Bet: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "28f38yToT1Pw7NgyeCvRxDC", "Bet");
    "use strict";
    var Game = require("Game");
    cc.Class({
      extends: cc.Component,
      properties: {
        chipPrefab: cc.Prefab,
        btnChips: {
          default: [],
          type: cc.Node
        },
        chipValues: {
          default: [],
          type: "Integer"
        },
        anchorChipToss: cc.Node
      },
      init: function init() {
        this._registerBtns();
      },
      _registerBtns: function _registerBtns() {
        var self = this;
        var registerBtn = function registerBtn(index) {
          self.btnChips[i].on("touchstart", function(event) {
            Game.instance.addStake(self.chipValues[index]) && self.playAddChip();
          }, this);
        };
        for (var i = 0; i < self.btnChips.length; ++i) registerBtn(i);
      },
      playAddChip: function playAddChip() {
        var startPos = cc.v2(2 * (Math.random() - .5) * 50, 2 * (Math.random() - .5) * 50);
        var chip = cc.instantiate(this.chipPrefab);
        this.anchorChipToss.addChild(chip);
        chip.setPosition(startPos);
        chip.getComponent("TossChip").play();
      },
      resetChips: function resetChips() {
        Game.instance.resetStake();
        Game.instance.info.enabled = false;
        this.resetTossedChips();
      },
      resetTossedChips: function resetTossedChips() {
        this.anchorChipToss.removeAllChildren();
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  ButtonScaler: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a171dSnCXFMRIqs1IWdvgWM", "ButtonScaler");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        pressedScale: 1,
        transDuration: 0
      },
      onLoad: function onLoad() {
        var self = this;
        var audioMng = cc.find("Menu/AudioMng") || cc.find("Game/AudioMng");
        audioMng && (audioMng = audioMng.getComponent("AudioMng"));
        self.initScale = this.node.scale;
        self.button = self.getComponent(cc.Button);
        self.scaleDownAction = cc.scaleTo(self.transDuration, self.pressedScale);
        self.scaleUpAction = cc.scaleTo(self.transDuration, self.initScale);
        function onTouchDown(event) {
          this.stopAllActions();
          audioMng && audioMng.playButton();
          this.runAction(self.scaleDownAction);
        }
        function onTouchUp(event) {
          this.stopAllActions();
          this.runAction(self.scaleUpAction);
        }
        this.node.on("touchstart", onTouchDown, this.node);
        this.node.on("touchend", onTouchUp, this.node);
        this.node.on("touchcancel", onTouchUp, this.node);
      }
    });
    cc._RF.pop();
  }, {} ],
  Card: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ab67e5QkiVCBZ3DIMlWhiAt", "Card");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        point: cc.Label,
        suit: cc.Sprite,
        mainPic: cc.Sprite,
        cardBG: cc.Sprite,
        redTextColor: cc.Color.WHITE,
        blackTextColor: cc.Color.WHITE,
        texFrontBG: cc.SpriteFrame,
        texBackBG: cc.SpriteFrame,
        texFaces: {
          default: [],
          type: cc.SpriteFrame
        },
        texSuitBig: {
          default: [],
          type: cc.SpriteFrame
        },
        texSuitSmall: {
          default: [],
          type: cc.SpriteFrame
        }
      },
      init: function init(card) {
        var isFaceCard = card.point > 10;
        this.mainPic.spriteFrame = isFaceCard ? this.texFaces[card.point - 10 - 1] : this.texSuitBig[card.suit - 1];
        this.point.string = card.pointName;
        card.isRedSuit ? this.point.node.color = this.redTextColor : this.point.node.color = this.blackTextColor;
        this.suit.spriteFrame = this.texSuitSmall[card.suit - 1];
      },
      reveal: function reveal(isFaceUp) {
        this.point.node.active = isFaceUp;
        this.suit.node.active = isFaceUp;
        this.mainPic.node.active = isFaceUp;
        this.cardBG.spriteFrame = isFaceUp ? this.texFrontBG : this.texBackBG;
      }
    });
    cc._RF.pop();
  }, {} ],
  Dealer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ce2dfoqEulHCLjS1Z9xPN7t", "Dealer");
    "use strict";
    var Actor = require("Actor");
    var Utils = require("Utils");
    cc.Class({
      extends: Actor,
      properties: {
        bestPoint: {
          get: function get() {
            var cards = this.holeCard ? [ this.holeCard ].concat(this.cards) : this.cards;
            var minMax = Utils.getMinMaxPoint(cards);
            return minMax.max;
          },
          override: true
        }
      },
      init: function init() {
        this._super();
        this.renderer.initDealer();
      },
      wantHit: function wantHit() {
        var Game = require("Game");
        var Types = require("Types");
        var bestPoint = this.bestPoint;
        if (21 === bestPoint) return false;
        if (bestPoint <= 11) return true;
        var player = Game.instance.player;
        var outcome = Game.instance._getPlayerResult(player, this);
        switch (outcome) {
         case Types.Outcome.Win:
          return true;

         case Types.Outcome.Lose:
          return false;
        }
        return this.bestPoint < 17;
      }
    });
    cc._RF.pop();
  }, {
    Actor: "Actor",
    Game: "Game",
    Types: "Types",
    Utils: "Utils"
  } ],
  Decks: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "17024G0JFpHcLI5GREbF8VN", "Decks");
    "use strict";
    var Types = require("Types");
    function Decks(numberOfDecks) {
      this._numberOfDecks = numberOfDecks;
      this._cardIds = new Array(52 * numberOfDecks);
      this.reset();
    }
    Decks.prototype.reset = function() {
      this._cardIds.length = 52 * this._numberOfDecks;
      var index = 0;
      var fromId = Types.Card.fromId;
      for (var i = 0; i < this._numberOfDecks; ++i) for (var cardId = 0; cardId < 52; ++cardId) {
        this._cardIds[index] = fromId(cardId);
        ++index;
      }
    };
    Decks.prototype.draw = function() {
      var cardIds = this._cardIds;
      var len = cardIds.length;
      if (0 === len) return null;
      var random = Math.random();
      var index = random * len | 0;
      var result = cardIds[index];
      var last = cardIds[len - 1];
      cardIds[index] = last;
      cardIds.length = len - 1;
      return result;
    };
    module.exports = Decks;
    cc._RF.pop();
  }, {
    Types: "Types"
  } ],
  FXPlayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "68da2yjdGVMSYhXLN9DukIB", "FXPlayer");
    "use strict";
    cc.Class({
      extends: cc.Component,
      init: function init() {
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.getComponent(cc.Sprite);
      },
      show: function show(_show) {
        this.sprite.enabled = _show;
      },
      playFX: function playFX(name) {
        this.anim.stop();
        this.anim.play(name);
      },
      hideFX: function hideFX() {
        this.sprite.enabled = false;
      }
    });
    cc._RF.pop();
  }, {} ],
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "63738OONCFKHqsf4QSeJSun", "Game");
    "use strict";
    var players = require("PlayerData").players;
    var Decks = require("Decks");
    var Types = require("Types");
    var ActorPlayingState = Types.ActorPlayingState;
    var Fsm = require("game-fsm");
    var Game = cc.Class({
      extends: cc.Component,
      properties: {
        playerAnchors: {
          default: [],
          type: cc.Node
        },
        playerPrefab: cc.Prefab,
        dealer: cc.Node,
        inGameUI: cc.Node,
        betUI: cc.Node,
        assetMng: cc.Node,
        audioMng: cc.Node,
        turnDuration: 0,
        betDuration: 0,
        totalChipsNum: 0,
        totalDiamondNum: 0,
        numberOfDecks: {
          default: 1,
          type: "Integer"
        }
      },
      statics: {
        instance: null
      },
      onLoad: function onLoad() {
        Game.instance = this;
        this.inGameUI = this.inGameUI.getComponent("InGameUI");
        this.assetMng = this.assetMng.getComponent("AssetMng");
        this.audioMng = this.audioMng.getComponent("AudioMng");
        this.betUI = this.betUI.getComponent("Bet");
        this.inGameUI.init(this.betDuration);
        this.betUI.init();
        this.dealer = this.dealer.getComponent("Dealer");
        this.dealer.init();
        this.player = null;
        this.createPlayers();
        this.info = this.inGameUI.resultTxt;
        this.totalChips = this.inGameUI.labelTotalChips;
        this.decks = new Decks(this.numberOfDecks);
        this.fsm = Fsm;
        this.fsm.init(this);
        this.updateTotalChips();
        this.audioMng.playMusic();
      },
      addStake: function addStake(delta) {
        if (this.totalChipsNum < delta) {
          console.log("not enough chips!");
          this.info.enabled = true;
          this.info.string = "\u91d1\u5e01\u4e0d\u8db3!";
          return false;
        }
        this.totalChipsNum -= delta;
        this.updateTotalChips();
        this.player.addStake(delta);
        this.audioMng.playChips();
        this.info.enabled = false;
        this.info.string = "\u8bf7\u4e0b\u6ce8";
        return true;
      },
      resetStake: function resetStake() {
        this.totalChipsNum += this.player.stakeNum;
        this.player.resetStake();
        this.updateTotalChips();
      },
      updateTotalChips: function updateTotalChips() {
        this.totalChips.string = this.totalChipsNum;
        this.player.renderer.updateTotalStake(this.totalChipsNum);
      },
      createPlayers: function createPlayers() {
        for (var i = 0; i < 5; ++i) {
          var playerNode = cc.instantiate(this.playerPrefab);
          var anchor = this.playerAnchors[i];
          var switchSide = i > 2;
          anchor.addChild(playerNode);
          playerNode.position = cc.v2(0, 0);
          var playerInfoPos = cc.find("anchorPlayerInfo", anchor).getPosition();
          var stakePos = cc.find("anchorStake", anchor).getPosition();
          var actorRenderer = playerNode.getComponent("ActorRenderer");
          actorRenderer.init(players[i], playerInfoPos, stakePos, this.turnDuration, switchSide);
          if (2 === i) {
            this.player = playerNode.getComponent("Player");
            this.player.init();
          }
        }
      },
      hit: function hit() {
        this.player.addCard(this.decks.draw());
        this.player.state === ActorPlayingState.Bust && this.fsm.onPlayerActed();
        this.audioMng.playCard();
        this.audioMng.playButton();
      },
      stand: function stand() {
        this.player.stand();
        this.audioMng.playButton();
        this.fsm.onPlayerActed();
      },
      deal: function deal() {
        this.fsm.toDeal();
        this.audioMng.playButton();
      },
      start: function start() {
        this.fsm.toBet();
        this.audioMng.playButton();
      },
      report: function report() {
        this.player.report();
        this.fsm.onPlayerActed();
      },
      quitToMenu: function quitToMenu() {
        cc.director.loadScene("menu");
      },
      onEnterDealState: function onEnterDealState() {
        this.betUI.resetTossedChips();
        this.inGameUI.resetCountdown();
        this.player.renderer.showStakeChips(this.player.stakeNum);
        this.player.addCard(this.decks.draw());
        var holdCard = this.decks.draw();
        this.dealer.addHoleCard(holdCard);
        this.player.addCard(this.decks.draw());
        this.dealer.addCard(this.decks.draw());
        this.audioMng.playCard();
        this.fsm.onDealed();
      },
      onPlayersTurnState: function onPlayersTurnState(enter) {
        enter && this.inGameUI.showGameState();
      },
      onEnterDealersTurnState: function onEnterDealersTurnState() {
        while (this.dealer.state === ActorPlayingState.Normal) this.dealer.wantHit() ? this.dealer.addCard(this.decks.draw()) : this.dealer.stand();
        this.fsm.onDealerActed();
      },
      onEndState: function onEndState(enter) {
        if (enter) {
          this.dealer.revealHoldCard();
          this.inGameUI.showResultState();
          var outcome = this._getPlayerResult(this.player, this.dealer);
          switch (outcome) {
           case Types.Outcome.Win:
            this.info.string = "You Win";
            this.audioMng.pauseMusic();
            this.audioMng.playWin();
            this.totalChipsNum += this.player.stakeNum;
            var winChipsNum = this.player.stakeNum;
            !this.player.state === Types.ActorPlayingState.Report && (this.player.hand === Types.Hand.BlackJack ? winChipsNum *= 1.5 : winChipsNum *= 2);
            this.totalChipsNum += winChipsNum;
            this.updateTotalChips();
            break;

           case Types.Outcome.Lose:
            this.info.string = "You Lose";
            this.audioMng.pauseMusic();
            this.audioMng.playLose();
            break;

           case Types.Outcome.Tie:
            this.info.string = "Draw";
            this.totalChipsNum += this.player.stakeNum;
            this.updateTotalChips();
          }
        }
        this.info.enabled = enter;
      },
      onBetState: function onBetState(enter) {
        if (enter) {
          this.decks.reset();
          this.player.reset();
          this.dealer.reset();
          this.info.string = "\u8bf7\u4e0b\u6ce8";
          this.inGameUI.showBetState();
          this.inGameUI.startCountdown();
          this.audioMng.resumeMusic();
        }
        this.info.enabled = enter;
      },
      _getPlayerResult: function _getPlayerResult(player, dealer) {
        var Outcome = Types.Outcome;
        return player.state === ActorPlayingState.Bust ? Outcome.Lose : dealer.state === ActorPlayingState.Bust ? Outcome.Win : player.state === ActorPlayingState.Report ? Outcome.Win : player.hand > dealer.hand ? Outcome.Win : player.hand < dealer.hand ? Outcome.Lose : player.bestPoint === dealer.bestPoint ? Outcome.Tie : player.bestPoint < dealer.bestPoint ? Outcome.Lose : Outcome.Win;
      }
    });
    cc._RF.pop();
  }, {
    Decks: "Decks",
    PlayerData: "PlayerData",
    Types: "Types",
    "game-fsm": "game-fsm"
  } ],
  HotUpdate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bcfc3MIMElM5o0xYeuoNv7J", "HotUpdate");
    "use strict";
    var UpdatePanel = require("../UI/UpdatePanel");
    var customManifestStr = JSON.stringify({
      packageUrl: "http://139.162.56.106/tutorial-hot-update/remote-assets/",
      remoteManifestUrl: "http://139.162.56.106/tutorial-hot-update/remote-assets/project.manifest",
      remoteVersionUrl: "http://139.162.56.106/tutorial-hot-update/remote-assets/version.manifest",
      version: "1.0.0",
      assets: {
        "src/cocos2d-jsb.ce1b2.js": {
          size: 2973428,
          md5: "9d7b18a8ccc5cb75fcbf9768e66df981"
        },
        "src/project.dev.07318.js": {
          size: 89022,
          md5: "073186b2bb0d8995930c10405d554c60"
        },
        "src/settings.dada6.js": {
          size: 7492,
          md5: "dada69b46c4c0e5f57a0939f9e8fb5c7"
        },
        "res/import/02/024cf3666.3f588.json": {
          size: 14794,
          md5: "3f5887e09a81a0e23d6ae7a5a681c962"
        },
        "res/import/05/055fd0727.bb3c6.json": {
          size: 4818,
          md5: "bb3c632a7183ff0e4a79abaee6e19dfb"
        },
        "res/import/07/07df488d9.9a5da.json": {
          size: 341,
          md5: "9a5da7b108bde1716f492c3ae27a79c9"
        },
        "res/import/09/0936e069c.e71ec.json": {
          size: 10928,
          md5: "e71ec60706a552836136086c770c9384"
        },
        "res/import/0b/0b24a7a80.ddd78.json": {
          size: 78356,
          md5: "ddd78956033ea1348c6ab7e80935eced"
        },
        "res/import/0e/0e93aeaa-0b53-4e40-b8e0-6268b4e07bd7.c8c88.json": {
          size: 3545,
          md5: "c8c8840ec328fb78670c803184897a90"
        },
        "res/import/14/144c3297-af63-49e8-b8ef-1cfa29b3be28.c870e.json": {
          size: 1786,
          md5: "c870edc523764c395590566c5fceaea7"
        },
        "res/import/28/2874f8dd-416c-4440-81b7-555975426e93.42725.json": {
          size: 3197,
          md5: "4272505fc3b89d3a0a407498b936b0d7"
        },
        "res/import/2a/2a296057-247c-4a1c-bbeb-0548b6c98650.8bd58.json": {
          size: 270,
          md5: "8bd5883e722f957ddec43f050ae28b2e"
        },
        "res/import/3a/3a7bb79f-32fd-422e-ada2-96f518fed422.8b874.json": {
          size: 168,
          md5: "8b8745118af36550c04d0b991caebe01"
        },
        "res/import/49/49539cb0-3893-459a-b310-7cc1b7f6d335.8a363.json": {
          size: 72,
          md5: "8a36388cda7c3773b5bf7a53d8824535"
        },
        "res/import/6d/6d91e591-4ce0-465c-809f-610ec95019c6.2f5cc.json": {
          size: 15303,
          md5: "2f5cc6227bf85bcc84ec7d19765d887b"
        },
        "res/import/6f/6f801092-0c37-4f30-89ef-c8d960825b36.58d0e.json": {
          size: 161,
          md5: "58d0ec4426c5cf4e40b43488a88d97d4"
        },
        "res/import/79/79eafaef-b7ef-45d9-9c3f-591dc836fc7a.1cc93.json": {
          size: 15423,
          md5: "1cc9383d9c3e31e0a03116aefb72ac57"
        },
        "res/import/7a/7afd064b-113f-480e-b793-8817d19f63c3.e5a11.json": {
          size: 162,
          md5: "e5a1199c53ab040a2da8a21dc8df6a08"
        },
        "res/import/9e/9e2ae507-fae5-4511-940b-f2e46f81b790.98f6b.json": {
          size: 74,
          md5: "98f6b1d93a4ee3a1f2074be9ce00fbb2"
        },
        "res/import/c0/c0040c95-c57f-49cd-9cbc-12316b73d0d4.21150.json": {
          size: 995,
          md5: "2115086df85cd0d2fd2f30091fb16423"
        },
        "res/import/cf/cf7e0bb8-a81c-44a9-ad79-d28d43991032.247fd.json": {
          size: 167,
          md5: "247fd79cda4bfa4c822745ce5adab12d"
        },
        "res/import/e9/e9cd33c3-477d-41dd-b1e9-a25c66412443.3f79d.json": {
          size: 76,
          md5: "3f79d93ce8d42b186ecd43d868c8d023"
        },
        "res/import/ec/eca5d2f2-8ef6-41c2-bbe6-f9c79d09c432.fa7d0.json": {
          size: 190,
          md5: "fa7d0b492f50e393abec4919dbc049c1"
        },
        "res/raw-assets/02/0275e94c-56a7-410f-bd1a-fc7483f7d14a.cea68.png": {
          size: 82,
          md5: "cea68f0d7cba38440224f6f74531e2d8"
        },
        "res/raw-assets/49/49539cb0-3893-459a-b310-7cc1b7f6d335.f45ec.mp3": {
          size: 971644,
          md5: "f45ec6666f06b729d8c0461bc89d4b94"
        },
        "res/raw-assets/6e/6e056173-d285-473c-b206-40a7fff5386e.6d3cf.png": {
          size: 1633,
          md5: "6d3cf6c6ee7dbfbab63c2bbd2d135ad5"
        },
        "res/raw-assets/71/71561142-4c83-4933-afca-cb7a17f67053.c06a9.png": {
          size: 1050,
          md5: "c06a93f5f1a8a1c6edc4fd8b52e96cbf"
        },
        "res/raw-assets/99/99170b0b-d210-46f1-b213-7d9e3f23098a.d1118.png": {
          size: 1177,
          md5: "d1118d133683bb4227d5e60c79c846b7"
        },
        "res/raw-assets/9e/9e2ae507-fae5-4511-940b-f2e46f81b790.90d17.mp3": {
          size: 3179,
          md5: "90d17b1a25200c90e292d9a3748c9fec"
        },
        "res/raw-assets/a5/a5a9e16f-0ef7-46f3-aa69-564b6532d3f6.a6e5e.png": {
          size: 397884,
          md5: "a6e5e6efb87e299927e1beae036f2503"
        },
        "res/raw-assets/b4/b43ff3c2-02bb-4874-81f7-f2dea6970f18.83fcc.png": {
          size: 1114,
          md5: "83fcc9912e01ae5411c357651fb8b1cf"
        },
        "res/raw-assets/bc/bc490754-c551-492e-a583-1c5c8de2f448.79fa9.png": {
          size: 546622,
          md5: "79fa9a07887c7f46f4a2d6d61e4d19d0"
        },
        "res/raw-assets/c5/c5f60c62-1ec5-4865-9a5b-25b3ec70f247.03bcf.png": {
          size: 83306,
          md5: "03bcfba7bef8c4048cab7b0c3b144ad8"
        },
        "res/raw-assets/cf/cfef78f1-c8df-49b7-8ed0-4c953ace2621.a4b59.png": {
          size: 1140,
          md5: "a4b5953dffeb145b4b70072d91c4052b"
        },
        "res/raw-assets/e8/e851e89b-faa2-4484-bea6-5c01dd9f06e2.90cf4.png": {
          size: 1082,
          md5: "90cf45d059d0408bec327f66eae5764c"
        },
        "res/raw-assets/e9/e9cd33c3-477d-41dd-b1e9-a25c66412443.065e0.manifest": {
          size: 7349,
          md5: "065e0e849e673ee23e16bc7e521b0fa5"
        }
      },
      searchPaths: []
    });
    cc.Class({
      extends: cc.Component,
      properties: {
        panel: UpdatePanel,
        manifestUrl: {
          type: cc.Asset,
          default: null
        },
        updateUI: cc.Node,
        _updating: false,
        _canRetry: false,
        _storagePath: ""
      },
      checkCb: function checkCb(event) {
        cc.log("Code: " + event.getEventCode());
        switch (event.getEventCode()) {
         case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
          this.panel.info.string = "No local manifest file found, hot update skipped.";
          break;

         case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
         case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
          this.panel.info.string = "Fail to download manifest file, hot update skipped.";
          break;

         case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
          this.panel.info.string = "Already up to date with the latest remote version.";
          break;

         case jsb.EventAssetsManager.NEW_VERSION_FOUND:
          this.panel.info.string = "New version found, please try to update.";
          this.panel.checkBtn.active = false;
          this.panel.fileProgress.progress = 0;
          this.panel.byteProgress.progress = 0;
          break;

         default:
          return;
        }
        this._am.setEventCallback(null);
        this._checkListener = null;
        this._updating = false;
      },
      updateCb: function updateCb(event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
         case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
          this.panel.info.string = "No local manifest file found, hot update skipped.";
          failed = true;
          break;

         case jsb.EventAssetsManager.UPDATE_PROGRESSION:
          this.panel.byteProgress.progress = event.getPercent();
          this.panel.fileProgress.progress = event.getPercentByFile();
          this.panel.fileLabel.string = event.getDownloadedFiles() + " / " + event.getTotalFiles();
          this.panel.byteLabel.string = event.getDownloadedBytes() + " / " + event.getTotalBytes();
          var msg = event.getMessage();
          msg && (this.panel.info.string = "Updated file: " + msg);
          break;

         case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
         case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
          this.panel.info.string = "Fail to download manifest file, hot update skipped.";
          failed = true;
          break;

         case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
          this.panel.info.string = "Already up to date with the latest remote version.";
          failed = true;
          break;

         case jsb.EventAssetsManager.UPDATE_FINISHED:
          this.panel.info.string = "Update finished. " + event.getMessage();
          needRestart = true;
          break;

         case jsb.EventAssetsManager.UPDATE_FAILED:
          this.panel.info.string = "Update failed. " + event.getMessage();
          this.panel.retryBtn.active = true;
          this._updating = false;
          this._canRetry = true;
          break;

         case jsb.EventAssetsManager.ERROR_UPDATING:
          this.panel.info.string = "Asset update error: " + event.getAssetId() + ", " + event.getMessage();
          break;

         case jsb.EventAssetsManager.ERROR_DECOMPRESS:
          this.panel.info.string = event.getMessage();
        }
        if (failed) {
          this._am.setEventCallback(null);
          this._updateListener = null;
          this._updating = false;
        }
        if (needRestart) {
          this._am.setEventCallback(null);
          this._updateListener = null;
          var searchPaths = jsb.fileUtils.getSearchPaths();
          var newPaths = this._am.getLocalManifest().getSearchPaths();
          console.log(JSON.stringify(newPaths));
          Array.prototype.unshift.apply(searchPaths, newPaths);
          cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(searchPaths));
          jsb.fileUtils.setSearchPaths(searchPaths);
          cc.audioEngine.stopAll();
          cc.game.restart();
        }
      },
      loadCustomManifest: function loadCustomManifest() {
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
          var manifest = new jsb.Manifest(customManifestStr, this._storagePath);
          this._am.loadLocalManifest(manifest, this._storagePath);
          this.panel.info.string = "Using custom manifest";
        }
      },
      retry: function retry() {
        if (!this._updating && this._canRetry) {
          this.panel.retryBtn.active = false;
          this._canRetry = false;
          this.panel.info.string = "Retry failed Assets...";
          this._am.downloadFailedAssets();
        }
      },
      checkUpdate: function checkUpdate() {
        if (this._updating) {
          this.panel.info.string = "Checking or updating ...";
          return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
          var url = this.manifestUrl.nativeUrl;
          cc.loader.md5Pipe && (url = cc.loader.md5Pipe.transformURL(url));
          this._am.loadLocalManifest(url);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
          this.panel.info.string = "Failed to load local manifest ...";
          return;
        }
        this._am.setEventCallback(this.checkCb.bind(this));
        this._am.checkUpdate();
        this._updating = true;
      },
      hotUpdate: function hotUpdate() {
        if (this._am && !this._updating) {
          this._am.setEventCallback(this.updateCb.bind(this));
          if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            var url = this.manifestUrl.nativeUrl;
            cc.loader.md5Pipe && (url = cc.loader.md5Pipe.transformURL(url));
            this._am.loadLocalManifest(url);
          }
          this._failCount = 0;
          this._am.update();
          this.panel.updateBtn.active = false;
          this._updating = true;
        }
      },
      show: function show() {
        false === this.updateUI.active && (this.updateUI.active = true);
      },
      onLoad: function onLoad() {
        if (!cc.sys.isNative) return;
        this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "blackjack-test-remote-asset";
        cc.log("Storage path for remote asset : " + this._storagePath);
        this.versionCompareHandle = function(versionA, versionB) {
          cc.log("JS Custom Version Compare: version A is " + versionA + ", version B is " + versionB);
          var vA = versionA.split(".");
          var vB = versionB.split(".");
          for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) continue;
            return a - b;
          }
          return vB.length > vA.length ? -1 : 0;
        };
        this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
        var panel = this.panel;
        this._am.setVerifyCallback(function(path, asset) {
          var compressed = asset.compressed;
          var expectedMD5 = asset.md5;
          var relativePath = asset.path;
          var size = asset.size;
          if (compressed) {
            panel.info.string = "Verification passed : " + relativePath;
            return true;
          }
          panel.info.string = "Verification passed : " + relativePath + " (" + expectedMD5 + ")";
          return true;
        });
        this.panel.info.string = "Hot update is ready, please check or directly update.";
        if (cc.sys.os === cc.sys.OS_ANDROID) {
          this._am.setMaxConcurrentTask(2);
          this.panel.info.string = "Max concurrent tasks count have been limited to 2";
        }
        this.panel.fileProgress.progress = 0;
        this.panel.byteProgress.progress = 0;
      },
      onDestroy: function onDestroy() {
        if (this._updateListener) {
          this._am.setEventCallback(null);
          this._updateListener = null;
        }
      }
    });
    cc._RF.pop();
  }, {
    "../UI/UpdatePanel": "UpdatePanel"
  } ],
  InGameUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f192efroeFEyaxtfh8TVXYz", "InGameUI");
    "use strict";
    var Game = require("Game");
    cc.Class({
      extends: cc.Component,
      properties: {
        panelChat: cc.Node,
        panelSocial: cc.Node,
        betStateUI: cc.Node,
        gameStateUI: cc.Node,
        resultTxt: cc.Label,
        betCounter: cc.ProgressBar,
        btnStart: cc.Node,
        labelTotalChips: cc.Label
      },
      init: function init(betDuration) {
        this.panelChat.active = false;
        this.panelSocial.active = false;
        this.resultTxt.enabled = false;
        this.betStateUI.active = true;
        this.gameStateUI.active = false;
        this.btnStart.active = false;
        this.betDuration = betDuration;
        this.betTimer = 0;
        this.isBetCounting = false;
      },
      startCountdown: function startCountdown() {
        if (this.betCounter) {
          this.betTimer = 0;
          this.isBetCounting = true;
        }
      },
      resetCountdown: function resetCountdown() {
        if (this.betCounter) {
          this.betTimer = 0;
          this.isBetCounting = false;
          this.betCounter.progress = 0;
        }
      },
      showBetState: function showBetState() {
        this.betStateUI.active = true;
        this.gameStateUI.active = false;
        this.btnStart.active = false;
      },
      showGameState: function showGameState() {
        this.betStateUI.active = false;
        this.gameStateUI.active = true;
        this.btnStart.active = false;
      },
      showResultState: function showResultState() {
        this.betStateUI.active = false;
        this.gameStateUI.active = false;
        this.btnStart.active = true;
      },
      toggleChat: function toggleChat() {
        this.panelChat.active = !this.panelChat.active;
      },
      toggleSocial: function toggleSocial() {
        this.panelSocial.active = !this.panelSocial.active;
      },
      update: function update(dt) {
        if (this.isBetCounting) {
          this.betCounter.progress = this.betTimer / this.betDuration;
          this.betTimer += dt;
          if (this.betTimer >= this.betDuration) {
            this.isBetCounting = false;
            this.betCounter.progress = 1;
          }
        }
      }
    });
    cc._RF.pop();
  }, {
    Game: "Game"
  } ],
  Menu: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "20f60m+3RlGO7x2/ARzZ6Qc", "Menu");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        audioMng: cc.Node
      },
      onLoad: function onLoad() {
        this.audioMng = this.audioMng.getComponent("AudioMng");
        this.audioMng.playMusic();
        cc.director.preloadScene("table", function() {
          cc.log("Next scene preloaded");
        });
      },
      playGame: function playGame() {
        cc.director.loadScene("table");
      },
      update: function update(dt) {}
    });
    cc._RF.pop();
  }, {} ],
  ModalUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "54397cUxehGzqEqpMUGHejs", "ModalUI");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        mask: cc.Node
      },
      onLoad: function onLoad() {},
      onEnable: function onEnable() {
        this.mask.on("touchstart", function(event) {
          event.stopPropagation();
        });
        this.mask.on("touchend", function(event) {
          event.stopPropagation();
        });
      },
      onDisable: function onDisable() {
        this.mask.off("touchstart", function(event) {
          event.stopPropagation();
        });
        this.mask.off("touchend", function(event) {
          event.stopPropagation();
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  PlayerData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4f9c5eXxqhHAKLxZeRmgHDB", "PlayerData");
    "use strict";
    var players = [ {
      name: "\u71c3\u70e7\u5427\uff0c\u86cb\u86cb\u513f\u519b",
      gold: 3e3,
      photoIdx: 0
    }, {
      name: "\u5730\u65b9\u653f\u5e9c",
      gold: 2e3,
      photoIdx: 1
    }, {
      name: "\u624b\u673a\u8d85\u4eba",
      gold: 1500,
      photoIdx: 2
    }, {
      name: "\u5929\u7075\u7075\uff0c\u5730\u7075\u7075",
      gold: 500,
      photoIdx: 3
    }, {
      name: "\u54df\u54df\uff0c\u5207\u514b\u95f9",
      gold: 9e3,
      photoIdx: 4
    }, {
      name: "\u5b66\u59d0\u4e0d\u8981\u6b7b",
      gold: 5e3,
      photoIdx: 5
    }, {
      name: "\u63d0\u767e\u4e07",
      gold: 1e4,
      photoIdx: 6
    } ];
    module.exports = {
      players: players
    };
    cc._RF.pop();
  }, {} ],
  Player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "226a2AvzRpHL7SJGTMy5PDX", "Player");
    "use strict";
    var Actor = require("Actor");
    cc.Class({
      extends: Actor,
      init: function init() {
        this._super();
        this.labelStake = this.renderer.labelStakeOnTable;
        this.stakeNum = 0;
      },
      reset: function reset() {
        this._super();
        this.resetStake();
      },
      addCard: function addCard(card) {
        this._super(card);
      },
      addStake: function addStake(delta) {
        this.stakeNum += delta;
        this.updateStake(this.stakeNum);
      },
      resetStake: function resetStake(delta) {
        this.stakeNum = 0;
        this.updateStake(this.stakeNum);
      },
      updateStake: function updateStake(number) {
        this.labelStake.string = number;
      }
    });
    cc._RF.pop();
  }, {
    Actor: "Actor"
  } ],
  RankItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1657ewfijBOXLq5zGqr6PvE", "RankItem");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        spRankBG: cc.Sprite,
        labelRank: cc.Label,
        labelPlayerName: cc.Label,
        labelGold: cc.Label,
        spPlayerPhoto: cc.Sprite,
        texRankBG: cc.SpriteFrame,
        texPlayerPhoto: cc.SpriteFrame
      },
      init: function init(rank, playerInfo) {
        if (rank < 3) {
          this.labelRank.node.active = false;
          this.spRankBG.spriteFrame = this.texRankBG[rank];
        } else {
          this.labelRank.node.active = true;
          this.labelRank.string = (rank + 1).toString();
        }
        this.labelPlayerName.string = playerInfo.name;
        this.labelGold.string = playerInfo.gold.toString();
        this.spPlayerPhoto.spriteFrame = this.texPlayerPhoto[playerInfo.photoIdx];
      },
      update: function update(dt) {}
    });
    cc._RF.pop();
  }, {} ],
  RankList: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fe3fcIxCFFLrKHg6s5+xRUU", "RankList");
    "use strict";
    var players = require("PlayerData").players;
    cc.Class({
      extends: cc.Component,
      properties: {
        scrollView: cc.ScrollView,
        prefabRankItem: cc.Prefab,
        rankCount: 0
      },
      onLoad: function onLoad() {
        this.content = this.scrollView.content;
        this.populateList();
      },
      populateList: function populateList() {
        for (var i = 0; i < this.rankCount; ++i) {
          var playerInfo = players[i];
          var item = cc.instantiate(this.prefabRankItem);
          item.getComponent("RankItem").init(i, playerInfo);
          this.content.addChild(item);
        }
      },
      update: function update(dt) {}
    });
    cc._RF.pop();
  }, {
    PlayerData: "PlayerData"
  } ],
  SideSwitcher: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3aae7lZKyhPqqsLD3wMKl6X", "SideSwitcher");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        retainSideNodes: {
          default: [],
          type: cc.Node
        }
      },
      switchSide: function switchSide() {
        this.node.scaleX = -this.node.scaleX;
        for (var i = 0; i < this.retainSideNodes.length; ++i) {
          var curNode = this.retainSideNodes[i];
          curNode.scaleX = -curNode.scaleX;
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  TossChip: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b4eb5Lo6U1IZ4eJWuxShCdH", "TossChip");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        anim: cc.Animation
      },
      play: function play() {
        this.anim.play("chip_toss");
      }
    });
    cc._RF.pop();
  }, {} ],
  Types: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5b633QMQxpFmYetofEvK2UD", "Types");
    "use strict";
    var Suit = cc.Enum({
      Spade: 1,
      Heart: 2,
      Club: 3,
      Diamond: 4
    });
    var A2_10JQK = "NAN,A,2,3,4,5,6,7,8,9,10,J,Q,K".split(",");
    function Card(point, suit) {
      Object.defineProperties(this, {
        point: {
          value: point,
          writable: false
        },
        suit: {
          value: suit,
          writable: false
        },
        id: {
          value: 13 * (suit - 1) + (point - 1),
          writable: false
        },
        pointName: {
          get: function get() {
            return A2_10JQK[this.point];
          }
        },
        suitName: {
          get: function get() {
            return Suit[this.suit];
          }
        },
        isBlackSuit: {
          get: function get() {
            return this.suit === Suit.Spade || this.suit === Suit.Club;
          }
        },
        isRedSuit: {
          get: function get() {
            return this.suit === Suit.Heart || this.suit === Suit.Diamond;
          }
        }
      });
    }
    Card.prototype.toString = function() {
      return this.suitName + " " + this.pointName;
    };
    var cards = new Array(52);
    Card.fromId = function(id) {
      return cards[id];
    };
    (function createCards() {
      for (var s = 1; s <= 4; s++) for (var p = 1; p <= 13; p++) {
        var card = new Card(p, s);
        cards[card.id] = card;
      }
    })();
    var ActorPlayingState = cc.Enum({
      Normal: -1,
      Stand: -1,
      Report: -1,
      Bust: -1
    });
    var Outcome = cc.Enum({
      Win: -1,
      Lose: -1,
      Tie: -1
    });
    var Hand = cc.Enum({
      Normal: -1,
      BlackJack: -1,
      FiveCard: -1
    });
    module.exports = {
      Suit: Suit,
      Card: Card,
      ActorPlayingState: ActorPlayingState,
      Hand: Hand,
      Outcome: Outcome
    };
    cc._RF.pop();
  }, {} ],
  UpdatePanel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0bccdokJC9JurBPF9qmzraw", "UpdatePanel");
    "use strict";
    module.exports = cc.Class({
      extends: cc.Component,
      properties: {
        info: cc.Label,
        fileProgress: cc.ProgressBar,
        fileLabel: cc.Label,
        byteProgress: cc.ProgressBar,
        byteLabel: cc.Label,
        close: cc.Node,
        checkBtn: cc.Node,
        retryBtn: cc.Node,
        updateBtn: cc.Node
      },
      onLoad: function onLoad() {
        this.close.on(cc.Node.EventType.TOUCH_END, function() {
          this.node.parent.active = false;
        }, this);
      }
    });
    cc._RF.pop();
  }, {} ],
  Utils: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "73590esk6xP9ICqhfUZalMg", "Utils");
    "use strict";
    function getMinMaxPoint(cards) {
      var hasAce = false;
      var min = 0;
      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        1 === card.point && (hasAce = true);
        min += Math.min(10, card.point);
      }
      var max = min;
      hasAce && min + 10 <= 21 && (max += 10);
      return {
        min: min,
        max: max
      };
    }
    function isBust(cards) {
      var sum = 0;
      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        sum += Math.min(10, card.point);
      }
      return sum > 21;
    }
    var isMobile = function isMobile() {
      return cc.sys.isMobile;
    };
    module.exports = {
      isBust: isBust,
      getMinMaxPoint: getMinMaxPoint,
      isMobile: isMobile
    };
    cc._RF.pop();
  }, {} ],
  "game-fsm": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6510d1SmQRMMYH8FEIA7zXq", "game-fsm");
    "use strict";
    var State = require("state.com");
    var instance;
    var model;
    var playing;
    function on(message) {
      return function(msgToEvaluate) {
        return msgToEvaluate === message;
      };
    }
    var evaluating = false;
    exports = {
      init: function init(target) {
        State.console = console;
        model = new State.StateMachine("root");
        var initial = new State.PseudoState("init-root", model, State.PseudoStateKind.Initial);
        var bet = new State.State("\u4e0b\u6ce8", model);
        playing = new State.State("\u5df2\u5f00\u5c40", model);
        var settled = new State.State("\u7ed3\u7b97", model);
        initial.to(bet);
        bet.to(playing).when(on("deal"));
        playing.to(settled).when(on("end"));
        settled.to(bet).when(on("bet"));
        bet.entry(function() {
          target.onBetState(true);
        });
        bet.exit(function() {
          target.onBetState(false);
        });
        settled.entry(function() {
          target.onEndState(true);
        });
        settled.exit(function() {
          target.onEndState(false);
        });
        var initialP = new State.PseudoState("init \u5df2\u5f00\u5c40", playing, State.PseudoStateKind.Initial);
        var deal = new State.State("\u53d1\u724c", playing);
        var playersTurn = new State.State("\u73a9\u5bb6\u51b3\u7b56", playing);
        var dealersTurn = new State.State("\u5e84\u5bb6\u51b3\u7b56", playing);
        initialP.to(deal);
        deal.to(playersTurn).when(on("dealed"));
        playersTurn.to(dealersTurn).when(on("player acted"));
        deal.entry(function() {
          target.onEnterDealState();
        });
        playersTurn.entry(function() {
          target.onPlayersTurnState(true);
        });
        playersTurn.exit(function() {
          target.onPlayersTurnState(false);
        });
        dealersTurn.entry(function() {
          target.onEnterDealersTurnState();
        });
        instance = new State.StateMachineInstance("fsm");
        State.initialise(model, instance);
      },
      toDeal: function toDeal() {
        this._evaluate("deal");
      },
      toBet: function toBet() {
        this._evaluate("bet");
      },
      onDealed: function onDealed() {
        this._evaluate("dealed");
      },
      onPlayerActed: function onPlayerActed() {
        this._evaluate("player acted");
      },
      onDealerActed: function onDealerActed() {
        this._evaluate("end");
      },
      _evaluate: function _evaluate(message) {
        if (evaluating) {
          setTimeout(function() {
            State.evaluate(model, instance, message);
          }, 1);
          return;
        }
        evaluating = true;
        State.evaluate(model, instance, message);
        evaluating = false;
      },
      _getInstance: function _getInstance() {
        return instance;
      },
      _getModel: function _getModel() {
        return model;
      }
    };
    module.exports = exports;
    cc._RF.pop();
  }, {
    "state.com": "state.com"
  } ],
  "state.com": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "71d9293mx9CFryhJvRw85ZS", "state.com");
    "use strict";
    var StateJS;
    (function(StateJS) {
      var Behavior = function() {
        function Behavior(behavior) {
          this.actions = [];
          behavior && this.push(behavior);
        }
        Behavior.prototype.push = function(behavior) {
          Array.prototype.push.apply(this.actions, behavior instanceof Behavior ? behavior.actions : arguments);
          return this;
        };
        Behavior.prototype.hasActions = function() {
          return 0 !== this.actions.length;
        };
        Behavior.prototype.invoke = function(message, instance, history) {
          void 0 === history && (history = false);
          this.actions.forEach(function(action) {
            return action(message, instance, history);
          });
        };
        return Behavior;
      }();
      StateJS.Behavior = Behavior;
    })(StateJS || (StateJS = {}));
    var StateJS;
    (function(StateJS) {
      (function(PseudoStateKind) {
        PseudoStateKind[PseudoStateKind["Initial"] = 0] = "Initial";
        PseudoStateKind[PseudoStateKind["ShallowHistory"] = 1] = "ShallowHistory";
        PseudoStateKind[PseudoStateKind["DeepHistory"] = 2] = "DeepHistory";
        PseudoStateKind[PseudoStateKind["Choice"] = 3] = "Choice";
        PseudoStateKind[PseudoStateKind["Junction"] = 4] = "Junction";
        PseudoStateKind[PseudoStateKind["Terminate"] = 5] = "Terminate";
      })(StateJS.PseudoStateKind || (StateJS.PseudoStateKind = {}));
      var PseudoStateKind = StateJS.PseudoStateKind;
    })(StateJS || (StateJS = {}));
    var StateJS;
    (function(StateJS) {
      (function(TransitionKind) {
        TransitionKind[TransitionKind["Internal"] = 0] = "Internal";
        TransitionKind[TransitionKind["Local"] = 1] = "Local";
        TransitionKind[TransitionKind["External"] = 2] = "External";
      })(StateJS.TransitionKind || (StateJS.TransitionKind = {}));
      var TransitionKind = StateJS.TransitionKind;
    })(StateJS || (StateJS = {}));
    var StateJS;
    (function(StateJS) {
      var Element = function() {
        function Element(name, parent) {
          this.name = name;
          this.qualifiedName = parent ? parent.qualifiedName + Element.namespaceSeparator + name : name;
        }
        Element.prototype.toString = function() {
          return this.qualifiedName;
        };
        Element.namespaceSeparator = ".";
        return Element;
      }();
      StateJS.Element = Element;
    })(StateJS || (StateJS = {}));
    var __extends = (void 0, function(d, b) {
      for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
      function __() {
        this.constructor = d;
      }
      __.prototype = b.prototype;
      d.prototype = new __();
    });
    var StateJS;
    (function(StateJS) {
      var Region = function(_super) {
        __extends(Region, _super);
        function Region(name, state) {
          _super.call(this, name, state);
          this.vertices = [];
          this.state = state;
          this.state.regions.push(this);
          this.state.getRoot().clean = false;
        }
        Region.prototype.getRoot = function() {
          return this.state.getRoot();
        };
        Region.prototype.accept = function(visitor, arg1, arg2, arg3) {
          return visitor.visitRegion(this, arg1, arg2, arg3);
        };
        Region.defaultName = "default";
        return Region;
      }(StateJS.Element);
      StateJS.Region = Region;
    })(StateJS || (StateJS = {}));
    var StateJS;
    (function(StateJS) {
      var Vertex = function(_super) {
        __extends(Vertex, _super);
        function Vertex(name, parent) {
          _super.call(this, name, parent = parent instanceof StateJS.State ? parent.defaultRegion() : parent);
          this.outgoing = [];
          this.region = parent;
          if (this.region) {
            this.region.vertices.push(this);
            this.region.getRoot().clean = false;
          }
        }
        Vertex.prototype.getRoot = function() {
          return this.region.getRoot();
        };
        Vertex.prototype.to = function(target, kind) {
          void 0 === kind && (kind = StateJS.TransitionKind.External);
          return new StateJS.Transition(this, target, kind);
        };
        Vertex.prototype.accept = function(visitor, arg1, arg2, arg3) {};
        return Vertex;
      }(StateJS.Element);
      StateJS.Vertex = Vertex;
    })(StateJS || (StateJS = {}));
    var StateJS;
    (function(StateJS) {
      var PseudoState = function(_super) {
        __extends(PseudoState, _super);
        function PseudoState(name, parent, kind) {
          void 0 === kind && (kind = StateJS.PseudoStateKind.Initial);
          _super.call(this, name, parent);
          this.kind = kind;
        }
        PseudoState.prototype.isHistory = function() {
          return this.kind === StateJS.PseudoStateKind.DeepHistory || this.kind === StateJS.PseudoStateKind.ShallowHistory;
        };
        PseudoState.prototype.isInitial = function() {
          return this.kind === StateJS.PseudoStateKind.Initial || this.isHistory();
        };
        PseudoState.prototype.accept = function(visitor, arg1, arg2, arg3) {
          return visitor.visitPseudoState(this, arg1, arg2, arg3);
        };
        return PseudoState;
      }(StateJS.Vertex);
      StateJS.PseudoState = PseudoState;
    })(StateJS || (StateJS = {}));
    var StateJS;
    (function(StateJS) {
      var State = function(_super) {
        __extends(State, _super);
        function State(name, parent) {
          _super.call(this, name, parent);
          this.exitBehavior = new StateJS.Behavior();
          this.entryBehavior = new StateJS.Behavior();
          this.regions = [];
        }
        State.prototype.defaultRegion = function() {
          return this.regions.reduce(function(result, region) {
            return region.name === StateJS.Region.defaultName ? region : result;
          }, void 0) || new StateJS.Region(StateJS.Region.defaultName, this);
        };
        State.prototype.isFinal = function() {
          return 0 === this.outgoing.length;
        };
        State.prototype.isSimple = function() {
          return 0 === this.regions.length;
        };
        State.prototype.isComposite = function() {
          return this.regions.length > 0;
        };
        State.prototype.isOrthogonal = function() {
          return this.regions.length > 1;
        };
        State.prototype.exit = function(exitAction) {
          this.exitBehavior.push(exitAction);
          this.getRoot().clean = false;
          return this;
        };
        State.prototype.entry = function(entryAction) {
          this.entryBehavior.push(entryAction);
          this.getRoot().clean = false;
          return this;
        };
        State.prototype.accept = function(visitor, arg1, arg2, arg3) {
          return visitor.visitState(this, arg1, arg2, arg3);
        };
        return State;
      }(StateJS.Vertex);
      StateJS.State = State;
    })(StateJS || (StateJS = {}));
    var StateJS;
    (function(StateJS) {
      var FinalState = function(_super) {
        __extends(FinalState, _super);
        function FinalState(name, parent) {
          _super.call(this, name, parent);
        }
        FinalState.prototype.accept = function(visitor, arg1, arg2, arg3) {
          return visitor.visitFinalState(this, arg1, arg2, arg3);
        };
        return FinalState;
      }(StateJS.State);
      StateJS.FinalState = FinalState;
    })(StateJS || (StateJS = {}));
    var StateJS;
    (function(StateJS) {
      var StateMachine = function(_super) {
        __extends(StateMachine, _super);
        function StateMachine(name) {
          _super.call(this, name, void 0);
          this.clean = false;
        }
        StateMachine.prototype.getRoot = function() {
          return this.region ? this.region.getRoot() : this;
        };
        StateMachine.prototype.accept = function(visitor, arg1, arg2, arg3) {
          return visitor.visitStateMachine(this, arg1, arg2, arg3);
        };
        return StateMachine;
      }(StateJS.State);
      StateJS.StateMachine = StateMachine;
    })(StateJS || (StateJS = {}));
    var StateJS;
    (function(StateJS) {
      var Transition = function() {
        function Transition(source, target, kind) {
          var _this = this;
          void 0 === kind && (kind = StateJS.TransitionKind.External);
          this.transitionBehavior = new StateJS.Behavior();
          this.onTraverse = new StateJS.Behavior();
          this.source = source;
          this.target = target;
          this.kind = target ? kind : StateJS.TransitionKind.Internal;
          this.guard = source instanceof StateJS.PseudoState ? Transition.TrueGuard : function(message) {
            return message === _this.source;
          };
          this.source.outgoing.push(this);
          this.source.getRoot().clean = false;
        }
        Transition.prototype.else = function() {
          this.guard = Transition.FalseGuard;
          return this;
        };
        Transition.prototype.when = function(guard) {
          this.guard = guard;
          return this;
        };
        Transition.prototype.effect = function(transitionAction) {
          this.transitionBehavior.push(transitionAction);
          this.source.getRoot().clean = false;
          return this;
        };
        Transition.prototype.accept = function(visitor, arg1, arg2, arg3) {
          return visitor.visitTransition(this, arg1, arg2, arg3);
        };
        Transition.prototype.toString = function() {
          return "[" + (this.target ? this.source + " -> " + this.target : this.source) + "]";
        };
        Transition.TrueGuard = function() {
          return true;
        };
        Transition.FalseGuard = function() {
          return false;
        };
        return Transition;
      }();
      StateJS.Transition = Transition;
    })(StateJS || (StateJS = {}));
    var StateJS;
    (function(StateJS) {
      var Visitor = function() {
        function Visitor() {}
        Visitor.prototype.visitElement = function(element, arg1, arg2, arg3) {};
        Visitor.prototype.visitRegion = function(region, arg1, arg2, arg3) {
          var _this = this;
          var result = this.visitElement(region, arg1, arg2, arg3);
          region.vertices.forEach(function(vertex) {
            vertex.accept(_this, arg1, arg2, arg3);
          });
          return result;
        };
        Visitor.prototype.visitVertex = function(vertex, arg1, arg2, arg3) {
          var _this = this;
          var result = this.visitElement(vertex, arg1, arg2, arg3);
          vertex.outgoing.forEach(function(transition) {
            transition.accept(_this, arg1, arg2, arg3);
          });
          return result;
        };
        Visitor.prototype.visitPseudoState = function(pseudoState, arg1, arg2, arg3) {
          return this.visitVertex(pseudoState, arg1, arg2, arg3);
        };
        Visitor.prototype.visitState = function(state, arg1, arg2, arg3) {
          var _this = this;
          var result = this.visitVertex(state, arg1, arg2, arg3);
          state.regions.forEach(function(region) {
            region.accept(_this, arg1, arg2, arg3);
          });
          return result;
        };
        Visitor.prototype.visitFinalState = function(finalState, arg1, arg2, arg3) {
          return this.visitState(finalState, arg1, arg2, arg3);
        };
        Visitor.prototype.visitStateMachine = function(stateMachine, arg1, arg2, arg3) {
          return this.visitState(stateMachine, arg1, arg2, arg3);
        };
        Visitor.prototype.visitTransition = function(transition, arg1, arg2, arg3) {};
        return Visitor;
      }();
      StateJS.Visitor = Visitor;
    })(StateJS || (StateJS = {}));
    var StateJS;
    (function(StateJS) {
      var StateMachineInstance = function() {
        function StateMachineInstance(name) {
          void 0 === name && (name = "unnamed");
          this.last = {};
          this.isTerminated = false;
          this.name = name;
        }
        StateMachineInstance.prototype.setCurrent = function(region, state) {
          this.last[region.qualifiedName] = state;
        };
        StateMachineInstance.prototype.getCurrent = function(region) {
          return this.last[region.qualifiedName];
        };
        StateMachineInstance.prototype.toString = function() {
          return this.name;
        };
        return StateMachineInstance;
      }();
      StateJS.StateMachineInstance = StateMachineInstance;
    })(StateJS || (StateJS = {}));
    var StateJS;
    (function(StateJS) {
      function setRandom(generator) {
        random = generator;
      }
      StateJS.setRandom = setRandom;
      function getRandom() {
        return random;
      }
      StateJS.getRandom = getRandom;
      var random = function random(max) {
        return Math.floor(Math.random() * max);
      };
    })(StateJS || (StateJS = {}));
    var StateJS;
    (function(StateJS) {
      function isActive(element, stateMachineInstance) {
        if (element instanceof StateJS.Region) return isActive(element.state, stateMachineInstance);
        if (element instanceof StateJS.State) return !element.region || isActive(element.region, stateMachineInstance) && stateMachineInstance.getCurrent(element.region) === element;
      }
      StateJS.isActive = isActive;
    })(StateJS || (StateJS = {}));
    var StateJS;
    (function(StateJS) {
      function isComplete(element, instance) {
        if (element instanceof StateJS.Region) return instance.getCurrent(element).isFinal();
        if (element instanceof StateJS.State) return element.regions.every(function(region) {
          return isComplete(region, instance);
        });
        return true;
      }
      StateJS.isComplete = isComplete;
    })(StateJS || (StateJS = {}));
    var StateJS;
    (function(StateJS) {
      function initialise(stateMachineModel, stateMachineInstance, autoInitialiseModel) {
        void 0 === autoInitialiseModel && (autoInitialiseModel = true);
        if (stateMachineInstance) {
          autoInitialiseModel && false === stateMachineModel.clean && initialise(stateMachineModel);
          StateJS.console.log("initialise " + stateMachineInstance);
          stateMachineModel.onInitialise.invoke(void 0, stateMachineInstance);
        } else {
          StateJS.console.log("initialise " + stateMachineModel.name);
          stateMachineModel.accept(new InitialiseElements(), false);
          stateMachineModel.clean = true;
        }
      }
      StateJS.initialise = initialise;
      function evaluate(stateMachineModel, stateMachineInstance, message, autoInitialiseModel) {
        void 0 === autoInitialiseModel && (autoInitialiseModel = true);
        StateJS.console.log(stateMachineInstance + " evaluate " + message);
        autoInitialiseModel && false === stateMachineModel.clean && initialise(stateMachineModel);
        if (stateMachineInstance.isTerminated) return false;
        return evaluateState(stateMachineModel, stateMachineInstance, message);
      }
      StateJS.evaluate = evaluate;
      function evaluateState(state, stateMachineInstance, message) {
        var result = false;
        state.regions.every(function(region) {
          if (evaluateState(stateMachineInstance.getCurrent(region), stateMachineInstance, message)) {
            result = true;
            return StateJS.isActive(state, stateMachineInstance);
          }
          return true;
        });
        if (result) message !== state && StateJS.isComplete(state, stateMachineInstance) && evaluateState(state, stateMachineInstance, state); else {
          var transitions = state.outgoing.filter(function(transition) {
            return transition.guard(message, stateMachineInstance);
          });
          1 === transitions.length ? result = traverse(transitions[0], stateMachineInstance, message) : transitions.length > 1 && StateJS.console.error(state + ": multiple outbound transitions evaluated true for message " + message);
        }
        return result;
      }
      function traverse(transition, instance, message) {
        var onTraverse = new StateJS.Behavior(transition.onTraverse), target = transition.target;
        while (target && target instanceof StateJS.PseudoState && target.kind === StateJS.PseudoStateKind.Junction) {
          target = (transition = selectTransition(target, instance, message)).target;
          onTraverse.push(transition.onTraverse);
        }
        onTraverse.invoke(message, instance);
        target && target instanceof StateJS.PseudoState && target.kind === StateJS.PseudoStateKind.Choice ? traverse(selectTransition(target, instance, message), instance, message) : target && target instanceof StateJS.State && StateJS.isComplete(target, instance) && evaluateState(target, instance, target);
        return true;
      }
      function selectTransition(pseudoState, stateMachineInstance, message) {
        var results = pseudoState.outgoing.filter(function(transition) {
          return transition.guard(message, stateMachineInstance);
        });
        if (pseudoState.kind === StateJS.PseudoStateKind.Choice) return 0 !== results.length ? results[StateJS.getRandom()(results.length)] : findElse(pseudoState);
        if (!(results.length > 1)) return results[0] || findElse(pseudoState);
        StateJS.console.error("Multiple outbound transition guards returned true at " + this + " for " + message);
      }
      function findElse(pseudoState) {
        return pseudoState.outgoing.filter(function(transition) {
          return transition.guard === StateJS.Transition.FalseGuard;
        })[0];
      }
      function leave(elementBehavior) {
        return elementBehavior[0] || (elementBehavior[0] = new StateJS.Behavior());
      }
      function beginEnter(elementBehavior) {
        return elementBehavior[1] || (elementBehavior[1] = new StateJS.Behavior());
      }
      function endEnter(elementBehavior) {
        return elementBehavior[2] || (elementBehavior[2] = new StateJS.Behavior());
      }
      function enter(elementBehavior) {
        return new StateJS.Behavior(beginEnter(elementBehavior)).push(endEnter(elementBehavior));
      }
      function ancestors(vertex) {
        return (vertex.region ? ancestors(vertex.region.state) : []).concat(vertex);
      }
      var InitialiseTransitions = function(_super) {
        __extends(InitialiseTransitions, _super);
        function InitialiseTransitions() {
          _super.apply(this, arguments);
        }
        InitialiseTransitions.prototype.visitTransition = function(transition, behaviour) {
          transition.kind === StateJS.TransitionKind.Internal ? transition.onTraverse.push(transition.transitionBehavior) : transition.kind === StateJS.TransitionKind.Local ? this.visitLocalTransition(transition, behaviour) : this.visitExternalTransition(transition, behaviour);
        };
        InitialiseTransitions.prototype.visitLocalTransition = function(transition, behaviour) {
          var _this = this;
          transition.onTraverse.push(function(message, instance) {
            var targetAncestors = ancestors(transition.target), i = 0;
            while (StateJS.isActive(targetAncestors[i], instance)) ++i;
            leave(behaviour(instance.getCurrent(targetAncestors[i].region))).invoke(message, instance);
            transition.transitionBehavior.invoke(message, instance);
            while (i < targetAncestors.length) _this.cascadeElementEntry(transition, behaviour, targetAncestors[i++], targetAncestors[i], function(behavior) {
              behavior.invoke(message, instance);
            });
            endEnter(behaviour(transition.target)).invoke(message, instance);
          });
        };
        InitialiseTransitions.prototype.visitExternalTransition = function(transition, behaviour) {
          var sourceAncestors = ancestors(transition.source), targetAncestors = ancestors(transition.target), i = Math.min(sourceAncestors.length, targetAncestors.length) - 1;
          while (sourceAncestors[i - 1] !== targetAncestors[i - 1]) --i;
          transition.onTraverse.push(leave(behaviour(sourceAncestors[i])));
          transition.onTraverse.push(transition.transitionBehavior);
          while (i < targetAncestors.length) this.cascadeElementEntry(transition, behaviour, targetAncestors[i++], targetAncestors[i], function(behavior) {
            return transition.onTraverse.push(behavior);
          });
          transition.onTraverse.push(endEnter(behaviour(transition.target)));
        };
        InitialiseTransitions.prototype.cascadeElementEntry = function(transition, behaviour, element, next, task) {
          task(beginEnter(behaviour(element)));
          next && element instanceof StateJS.State && element.regions.forEach(function(region) {
            task(beginEnter(behaviour(region)));
            region !== next.region && task(endEnter(behaviour(region)));
          });
        };
        return InitialiseTransitions;
      }(StateJS.Visitor);
      var InitialiseElements = function(_super) {
        __extends(InitialiseElements, _super);
        function InitialiseElements() {
          _super.apply(this, arguments);
          this.behaviours = {};
        }
        InitialiseElements.prototype.behaviour = function(element) {
          return this.behaviours[element.qualifiedName] || (this.behaviours[element.qualifiedName] = []);
        };
        InitialiseElements.prototype.visitElement = function(element, deepHistoryAbove) {
          if (StateJS.console !== defaultConsole) {
            leave(this.behaviour(element)).push(function(message, instance) {
              return StateJS.console.log(instance + " leave " + element);
            });
            beginEnter(this.behaviour(element)).push(function(message, instance) {
              return StateJS.console.log(instance + " enter " + element);
            });
          }
        };
        InitialiseElements.prototype.visitRegion = function(region, deepHistoryAbove) {
          var _this = this;
          var regionInitial = region.vertices.reduce(function(result, vertex) {
            return vertex instanceof StateJS.PseudoState && vertex.isInitial() ? vertex : result;
          }, void 0);
          region.vertices.forEach(function(vertex) {
            vertex.accept(_this, deepHistoryAbove || regionInitial && regionInitial.kind === StateJS.PseudoStateKind.DeepHistory);
          });
          leave(this.behaviour(region)).push(function(message, stateMachineInstance) {
            return leave(_this.behaviour(stateMachineInstance.getCurrent(region))).invoke(message, stateMachineInstance);
          });
          deepHistoryAbove || !regionInitial || regionInitial.isHistory() ? endEnter(this.behaviour(region)).push(function(message, stateMachineInstance, history) {
            enter(_this.behaviour((history || regionInitial.isHistory()) && stateMachineInstance.getCurrent(region) || regionInitial)).invoke(message, stateMachineInstance, history || regionInitial.kind === StateJS.PseudoStateKind.DeepHistory);
          }) : endEnter(this.behaviour(region)).push(enter(this.behaviour(regionInitial)));
          this.visitElement(region, deepHistoryAbove);
        };
        InitialiseElements.prototype.visitPseudoState = function(pseudoState, deepHistoryAbove) {
          _super.prototype.visitPseudoState.call(this, pseudoState, deepHistoryAbove);
          pseudoState.isInitial() ? endEnter(this.behaviour(pseudoState)).push(function(message, stateMachineInstance) {
            return traverse(pseudoState.outgoing[0], stateMachineInstance);
          }) : pseudoState.kind === StateJS.PseudoStateKind.Terminate && beginEnter(this.behaviour(pseudoState)).push(function(message, stateMachineInstance) {
            return stateMachineInstance.isTerminated = true;
          });
        };
        InitialiseElements.prototype.visitState = function(state, deepHistoryAbove) {
          var _this = this;
          state.regions.forEach(function(region) {
            region.accept(_this, deepHistoryAbove);
            leave(_this.behaviour(state)).push(leave(_this.behaviour(region)));
            endEnter(_this.behaviour(state)).push(enter(_this.behaviour(region)));
          });
          this.visitVertex(state, deepHistoryAbove);
          leave(this.behaviour(state)).push(state.exitBehavior);
          beginEnter(this.behaviour(state)).push(state.entryBehavior);
          beginEnter(this.behaviour(state)).push(function(message, stateMachineInstance) {
            state.region && stateMachineInstance.setCurrent(state.region, state);
          });
        };
        InitialiseElements.prototype.visitStateMachine = function(stateMachine, deepHistoryAbove) {
          var _this = this;
          _super.prototype.visitStateMachine.call(this, stateMachine, deepHistoryAbove);
          stateMachine.accept(new InitialiseTransitions(), function(element) {
            return _this.behaviour(element);
          });
          stateMachine.onInitialise = enter(this.behaviour(stateMachine));
        };
        return InitialiseElements;
      }(StateJS.Visitor);
      var defaultConsole = {
        log: function log(message) {
          var optionalParams = [];
          for (var _i = 1; _i < arguments.length; _i++) optionalParams[_i - 1] = arguments[_i];
        },
        warn: function warn(message) {
          var optionalParams = [];
          for (var _i = 1; _i < arguments.length; _i++) optionalParams[_i - 1] = arguments[_i];
        },
        error: function error(message) {
          var optionalParams = [];
          for (var _i = 1; _i < arguments.length; _i++) optionalParams[_i - 1] = arguments[_i];
          throw message;
        }
      };
      StateJS.console = defaultConsole;
    })(StateJS || (StateJS = {}));
    var StateJS;
    (function(StateJS) {
      function validate(stateMachineModel) {
        stateMachineModel.accept(new Validator());
      }
      StateJS.validate = validate;
      function ancestors(vertex) {
        return (vertex.region ? ancestors(vertex.region.state) : []).concat(vertex);
      }
      var Validator = function(_super) {
        __extends(Validator, _super);
        function Validator() {
          _super.apply(this, arguments);
        }
        Validator.prototype.visitPseudoState = function(pseudoState) {
          _super.prototype.visitPseudoState.call(this, pseudoState);
          if (pseudoState.kind === StateJS.PseudoStateKind.Choice || pseudoState.kind === StateJS.PseudoStateKind.Junction) {
            0 === pseudoState.outgoing.length && StateJS.console.error(pseudoState + ": " + pseudoState.kind + " pseudo states must have at least one outgoing transition.");
            pseudoState.outgoing.filter(function(transition) {
              return transition.guard === StateJS.Transition.FalseGuard;
            }).length > 1 && StateJS.console.error(pseudoState + ": " + pseudoState.kind + " pseudo states cannot have more than one Else transitions.");
          } else {
            0 !== pseudoState.outgoing.filter(function(transition) {
              return transition.guard === StateJS.Transition.FalseGuard;
            }).length && StateJS.console.error(pseudoState + ": " + pseudoState.kind + " pseudo states cannot have Else transitions.");
            pseudoState.isInitial() && (1 !== pseudoState.outgoing.length ? StateJS.console.error(pseudoState + ": initial pseudo states must have one outgoing transition.") : pseudoState.outgoing[0].guard !== StateJS.Transition.TrueGuard && StateJS.console.error(pseudoState + ": initial pseudo states cannot have a guard condition."));
          }
        };
        Validator.prototype.visitRegion = function(region) {
          _super.prototype.visitRegion.call(this, region);
          var initial;
          region.vertices.forEach(function(vertex) {
            if (vertex instanceof StateJS.PseudoState && vertex.isInitial()) {
              initial && StateJS.console.error(region + ": regions may have at most one initial pseudo state.");
              initial = vertex;
            }
          });
        };
        Validator.prototype.visitState = function(state) {
          _super.prototype.visitState.call(this, state);
          state.regions.filter(function(state) {
            return state.name === StateJS.Region.defaultName;
          }).length > 1 && StateJS.console.error(state + ": a state cannot have more than one region named " + StateJS.Region.defaultName);
        };
        Validator.prototype.visitFinalState = function(finalState) {
          _super.prototype.visitFinalState.call(this, finalState);
          0 !== finalState.outgoing.length && StateJS.console.error(finalState + ": final states must not have outgoing transitions.");
          0 !== finalState.regions.length && StateJS.console.error(finalState + ": final states must not have child regions.");
          finalState.entryBehavior.hasActions() && StateJS.console.warn(finalState + ": final states may not have entry behavior.");
          finalState.exitBehavior.hasActions() && StateJS.console.warn(finalState + ": final states may not have exit behavior.");
        };
        Validator.prototype.visitTransition = function(transition) {
          _super.prototype.visitTransition.call(this, transition);
          transition.kind === StateJS.TransitionKind.Local && -1 === ancestors(transition.target).indexOf(transition.source) && StateJS.console.error(transition + ": local transition target vertices must be a child of the source composite sate.");
        };
        return Validator;
      }(StateJS.Visitor);
    })(StateJS || (StateJS = {}));
    module.exports = StateJS;
    cc._RF.pop();
  }, {} ]
}, {}, [ "Actor", "ActorRenderer", "AssetMng", "AudioMng", "Bet", "Card", "Dealer", "FXPlayer", "Game", "Menu", "Player", "SideSwitcher", "TossChip", "ButtonScaler", "InGameUI", "ModalUI", "RankItem", "RankList", "UpdatePanel", "state.com", "Decks", "HotUpdate", "PlayerData", "Types", "Utils", "game-fsm" ]);