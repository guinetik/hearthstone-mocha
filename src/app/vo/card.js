/**
 * Created by guinetik on 12/3/14.
 */
var Hero = Class({
    type: "",
    mana:0,
    life: 0,
    fatigue:1,
    dead:false,
    armor: 0,
    deck: [],
    hand: [],
    'private __construct': function (type, deck, life) {
        this.type = type;
        this.deck = deck;
        if (life) this.life = life;
        else this.life = 30;
    },
    play:function(cardNum, target) {
        var card = this.hand[cardNum];
        card.getEffect().trigger(target); // trigger card effect
        this.hand.splice(cardNum, 1); // remove card from the hand
    },
    drawCard: function () {
        if(this.deck.length > 0) {
            var randomItem = Math.floor(Math.random()*this.deck.length);
            var randomCard = this.deck[randomItem];
            if(this.hand.length < 10) { // check if hand isn't full
                this.hand.push(randomCard); // add card to the hand
            }
            this.deck.splice(randomItem, 1); // remove the card from the deck
        } else {
            this.takeDamage(this.fatigue); // take fatigue damage
            this.fatigue++; // increment fatigue
        }
    },
    getMulligan: function () {
        for(var i=0;i<4;i++) {
            this.drawCard();
        }
    },
    takeDamage: function (ammount) {
        //if there's armor to take, take armor
        if (this.armor > 0) {
            var diff = this.armor - ammount;
            this.armor = Math.max(0, diff);
            //if damage is > armor, subtract the difference from life
            if (this.armor == 0) this.life += diff; // += because diff is always negative
        } else {
            //else take life
            this.life -= ammount;
        }

        if (this.life <= 0) {
            this.die();
        }
    },
    heal: function (ammount) {
        this.life += ammount;
        //if life > 30, set it back to 30
        if (this.life > 30) this.life = 30;
    },
    gainArmor: function (ammount) {
        this.armor += ammount;
    },
    die: function () {
        this.dead = true;
    }
});

var Effect = Class({
    name: "",
    text: "",
    action:"",
    'private __construct': function (name, text) {
        this.name = name;
        this.text = text;
    },
    trigger: function (target) {
        var action = this.getAction();
        action.call(this, target);
    }
});

var Card = Class({
    name: "",
    mana: 0,
    type: "",
    effect: new Effect(),
    'private __construct': function (name, mana, type) {
        this.name = name;
        this.mana = mana;
        this.type = type;
    }
});

var Spell = Class({extends: Card}, {
    target:0,
    /*AQUI TARGET SE REFERE AS SEQUINTES POSSIBILIDADES:
     * 0: EU MESMO
     * 1: MEU OPONENTE
     * 2: ALGUM MINION
     * 3: TODOS OS MEUS MINIONS
     * 4: ALGUM MINION INIMIGO
     * 5: TODOS OS MINIONS INIMIGOS
     * WHENEVER A SPELL IS CAST,
     * THE SYSTEM MUST CHECK THE AUTHENTICITY OF IT'S TARGET
     * BEFORE RELEASING ITS EFFECT*/
    'private __construct': function (name, mana, target) {
        this.name = name;
        this.mana = mana;
        this.target = target;
        this.type = "spell";
    }

});