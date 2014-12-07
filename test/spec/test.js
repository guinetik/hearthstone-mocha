/* global describe, it */

(function () {
    'use strict';
    describe('Hearthstone Combo Simulator', function () {
        describe("A Hero", function () {
            var hero;
            var coin;
            before(function () {
                var coinEffect = new Effect("Increased Mana", "Gain one mana crystal this turn only");
                coinEffect.setAction(function (target) {
                    target.setMana(target.getMana() + 1);
                });
                coin = new Spell("The Coin", 0);
                coin.setEffect(coinEffect);
            });
            beforeEach(function () {
                //create a random list of mock cards
                var cards = [];
                for(var i=0;i<30;i++) {
                    cards.push(coin);
                }
                hero = new Hero("druid", cards);
            });

            it("should have a class", function () {
                expect(hero.getType()).to.be.a("string");
            });

            it("should start with 30+ health", function () {
                assert(hero.getLife() >= 30, "the hero doesnt have 30 life");
            });

            it("should have a deck of 30 cards", function () {
                assert(hero.getDeck().length == 30, "the deck doesnt have 30 cards");
            });

            it("should have a hand of 4+ random cards", function () {
                hero.getMulligan();
                assert(hero.getHand().length >= 4, "the hero hand is empty");
            });

            it("should gain armor", function () {
                hero.gainArmor(5);
                assert(hero.getArmor() == 5, "no armor gained");
            });

            it("should loose armor, then health when taken damage", function () {
                hero.gainArmor(10);
                hero.takeDamage(25);
                assert(hero.getArmor() == 0, "no armor lost");
                assert(hero.getLife() == 15, "no life lost");
            });

            it("should lose health when taken damage if no armor", function () {
                var currentLife = hero.getLife();
                hero.takeDamage(3);
                assert(hero.getLife() == currentLife - 3, "there was a problem dealing damage to the hero")
            });

            it("should heal damage", function () {
                hero.takeDamage(10);
                var currentLife = hero.getLife();
                hero.heal(3);
                assert(hero.getLife() == currentLife + 3, "there was a problem healing the hero")
            });

            it("should not extend 30 health", function () {
                hero.heal(30);
                assert(hero.getLife() <= 30, "the hero cannot have more than 30 health")
            });

            it("should draw a card, but no more than 10", function () {
                var numCards = hero.getHand().length;
                hero.drawCard();
                assert(hero.getHand().length > numCards, "card not drawn. fatigue taken instead. hero life: " + hero.getLife());
            });

            it("should destroy all cards drawn whenever the hand is full", function() {

                hero.getMulligan(); // mulligan first hand
                for(var i=0;i<10;i++) { // draw 10 cards
                    hero.drawCard();
                }

                assert(hero.getHand().length == 10, "hand should be 10, got " + hero.getHand().length);
                assert(hero.getDeck().length == 16, "deck should be 16, got " + hero.getDeck().length);
            });

            it("should take incremental fatigue damage whenever a card is drawn with an empty deck", function() {

                hero.setDeck([]); // empty the deck
                var currentLife = hero.getLife();
                hero.drawCard(); //this should trigger 1 fatigue damage

                assert(hero.getLife() == currentLife-1, "fatigue damage not taken");

            });

            it("should die when life reaches 0", function () {

                hero.gainArmor(10);
                hero.takeDamage(40);

                assert(hero.getDead() == true, "hero didnt die from lethal");

            });

            it("should be able to play a card at his turn", function(){
                hero.getMulligan();

                var numCards = hero.getHand().length;
                hero.play(0, hero); //play the first card in the hand (a coin)
                assert(hero.getHand().length == numCards-1, "card wasnt played");
            });

            it("should ", function(){

            });
        });
        describe('A Card', function () {
            var card;
            beforeEach(function () {
                card = new Card("Mark of the Wild", 2, "spell");
            });
            it('should have a name', function () {
                expect(card.getName()).to.be.a("string");
            });
            it('should have a mana cost', function () {
                expect(card.getMana()).to.be.a("number");
            });
            it('should have a type', function () {
                expect(card.getType()).to.be.a("string");
            });
            it('should only have 3 types: minion, spell, weapon', function () {
                assert(card.getType() == "spell" || card.getType() == "minion" || card.getType() == "weapon",
                        "unrecognized card type: " + card.getType());
            });
        });
        describe('A spell', function () {
            var spell;

            beforeEach(function () {
                spell = new Spell("Healing Touch", 3);
            });

            it("should be of type spell", function () {
                assert(spell.getType() == "spell", "not a spell card");
            });

            it("should be have a valid target", function () {
                expect(spell.getTarget()).to.be.a("number");
            });

            it("should trigger an effect to a target", function () {
                var hero = new Hero("druid", []);
                hero.takeDamage(8); // take 8 damage to be healed later

                // create a heal effect that restores 8 life to a target
                var heal = new Effect("Gain Life", "Restore 8 Health");
                heal.setAction(
                    function(target){
                        target.heal(8);
                    }
                );
                spell.setEffect(heal);

                spell.getEffect().trigger(hero); //trigger this effect on the hero

                assert(hero.getLife() == 30, "hero should be at full health, got: " + hero.getLife());
            });
        });
    });
})();
