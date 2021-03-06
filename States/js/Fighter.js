class Fighter {
    constructor(character, health, lives, startx, starty, controlnum) {

        this.character = game.add.sprite(startx, starty, character);//player character variable to access sprite from phaser and all its properties character variable is name of spritesheet to use
        this.health = health;//player start health
        this.lives = lives;
        this.attacking = false; //Controls when to register active hit frames
        this.deltDamage = false;
        this.attack = '';
        this.airTime = 0;
        this.deathBlast = game.add.sprite(game.world.width * 0.2, game.world.width * 0.05, "deathBlast");
        this.deathBlast.visible = false;
        this.jumpKickBulletSpeedCons = 150;
        this.combo = 0;
        this.comboclock = 0;

        this.useItem = false;
        this.throwItem = false;

        this.hangingState = "NotHanging";
        this.hangingTimer = 0;

        this.DMGModifier = 0;
        //this.DMGModifier = [0,0,0,0,0,0,0,0,0];

        this.resettint();

        switch (character) {
            case 'dude':
                this.fighterStyle = {
                    font: "bold 32px Skranji", fill: '#0076b9', boundsAlignH: "left", boundsAlignV: "top"
                };
                this.damageBox = 'blueDamageBox';
                break;
            case 'chick':
                this.fighterStyle = {
                    font: "bold 32px Skranji", fill: "#ff7000", boundsAlignH: "left", boundsAlignV: "top"
                };
                this.damageBox = 'orangeDamageBox';
                break;
            case 'dude':
                this.fighterStyle = {
                    font: "bold 32px Skranji", fill: "#0076b9", boundsAlignH: "left", boundsAlignV: "top"
                };
                this.damageBox = 'blueDamageBox';
                break;
            case 'chick':
                this.fighterStyle = {
                    font: "bold 32px Skranji", fill: "#ff7000", boundsAlignH: "left", boundsAlignV: "top"
                };
                this.damageBox = 'orangeDamageBox';
                break;

        }

        //Allows an animation event to take place
        this.inputLock = false;
        //Cooldown for dash movement
        this.dashCD = 0;
        //Cooldown for warlock kick
        this.warlockCD = 0;
        //Cooldown for uppercut
        this.uppercutCD = 0;
        //cooldown for all basic moves
        this.basicCD = 0;
        //cooldown for air dodging
        this.airDodgeCD = 0;

        //turns on and off the auto reset of zero x velocity when the player is standing
        this.xZero = true;

        //Respawn Animation Activator Switch
        this.respawnSwitch = false;
        //m is the respawn animation counter
        this.m = 0;
        //Invincibility boolean
        this.invincible = false;

        this.startx = startx;
        this.starty = starty;

        this.character.hasItem = false;

        //Cooldown for attacks
        this.hitCD = 0;

        //Switch for when an attack is on CD
        this.hitSwitchPunch = false;
        this.hitSwitchKick = false;


        //shielding is the boolean if the shield is up or not
        this.shielding = false;

        //hitVelocity determines the knockback
        this.hitVelocity = 0;
        //Hit stun counter
        this.stunCounter = 0;
        this.stunCounterLock = 0;

        this.controlnum = controlnum;
        this.state = 0;

        this.jumps = 0;

        this.character.anchor.setTo(0.5, 0);

        this.AImode = 1;
        this.reaction = 0;

        //  We need to enable physics on the player
        game.physics.arcade.enable(this.character);

        //  Player physics properties. Give the little guy a slight bounce.
        this.character.body.bounce.y = 0;//0.2;
        this.character.body.gravity.y = 650;
        this.character.body.collideWorldBounds = false;

        this.character.body.setSize(30, 70, 10, 0)
        this.character.scale.x = 1.75; //1.25
        this.character.scale.y = 1.75; //1.25

        //Player animations

        //idle animation
        this.aniHang = this.character.animations.add('hang', [6], 5, true);

        this.aniRight = this.character.animations.add('right', [3, 4, 5, 6, 7], 10, false);
        this.aniRight.onComplete.add(this.walkEnd, this);

        //idle animation
        this.aniIdle = this.character.animations.add('idle', [5, 6, 7, 5, 6, 7], 6, true);
        this.aniIdle.onComplete.add(this.IdleEnd, this);

        //jump animation
        this.aniJump = this.character.animations.add('jump', [13, 14], 5, false); //need to adjust animation speed
        this.aniJump.onStart.add(this.jumpStart, this);
        this.aniJump.onComplete.add(this.jumpEnd, this);
        
        //shield animation
        this.aniShield = this.character.animations.add('shield', [10], 2, false);
        this.aniShield.onComplete.add(this.shieldEnd, this);

        //punch animations
        this.aniPunchWindUp= this.character.animations.add('punchwindup', [0,1,0], 5, false);
        this.aniPunchWindUp.onStart.add(this.PunchWindUpStart, this);
        this.aniPunchWindUp.onComplete.add(this.PunchWindUpEnd, this);

        this.aniPunch = this.character.animations.add('punch', [8, 7, 6], 10, false);
        this.aniPunch.onStart.add(this.punchStart, this);
        this.aniPunch.onComplete.add(this.punchEnd, this);

        //kick
        this.aniKickWindUp= this.character.animations.add('kickwindup', [11,11,11], 10, false);
        this.aniKickWindUp.onStart.add(this.KickWindUpStart, this);
        this.aniKickWindUp.onComplete.add(this.KickWindUpEnd, this);

        this.aniKick = this.character.animations.add('kick', [12, 12, 12, 11, 6], 10, false);
        this.aniKick.onStart.add(this.kickStart, this);
        this.aniKick.onComplete.add(this.kickEnd, this);

        //dash
        this.aniDash = this.character.animations.add('dash', [5], 15, false);
        this.aniDash.onStart.add(this.dashStart, this);
        this.aniDash.onComplete.add(this.dashEnd, this);

        //Tatsumaki (i am weeb)
        this.aniJumpKickWindUp= this.character.animations.add('JumpKickwindup', [14,14], 5, false);
        this.aniJumpKickWindUp.onStart.add(this.JumpKickWindUpStart, this);
        this.aniJumpKickWindUp.onComplete.add(this.JumpKickWindUpEnd, this);

        this.aniJumpKick = this.character.animations.add('jumpKick', [14, 13, 12, 12, 12], 15, false);
        this.aniJumpKick.onStart.add(this.jumpKickStart, this);
        this.aniJumpKick.onComplete.add(this.jumpKickEnd, this);

        //Uppercut (change 16 later for a better uppercut frame)
        this.aniUppercutWindUp= this.character.animations.add('Uppercutwindup', [13,14,14], 5, false);
        this.aniUppercutWindUp.onStart.add(this.UppercutWindUpStart, this);
        this.aniUppercutWindUp.onComplete.add(this.UppercutWindUpEnd, this);
        
        this.aniUppercut = this.character.animations.add('uppercut', [16, 16, 14, 13], 10, false);
        this.aniUppercut.onStart.add(this.uppercutStart, this);
        this.aniUppercut.onComplete.add(this.uppercutEnd, this);

        //Slow warlock punch
        this.aniWarlockWindUp= this.character.animations.add('Warlockwindup', [13,13], 5, false);
        this.aniWarlockWindUp.onStart.add(this.WarlockWindUpStart, this);
        this.aniWarlockWindUp.onComplete.add(this.WarlockWindUpEnd, this);
        
        this.aniWarlock = this.character.animations.add('warlock', [13, 13, 11, 12], 7, false);
        this.aniWarlock.onStart.add(this.warlockStart, this);
        this.aniWarlock.onComplete.add(this.warlockEnd, this);

        //player got hit animation
        this.aniKo = this.character.animations.add('ko', [12], 5, false);
        this.aniKo.onComplete.add(this.koEnd, this);

        //Player air swipe forward/neutral
        this.aniAirFWindUp= this.character.animations.add('AirFwindup', [24,24], 5, false);
        this.aniAirFWindUp.onStart.add(this.AirFWindUpStart, this);
        this.aniAirFWindUp.onComplete.add(this.AirFWindUpEnd, this);
        
        this.aniAirF = this.character.animations.add('airforward', [24, 24, 25, 25, 25], 7, false);
        this.aniAirF.onStart.add(this.airforwardStart, this);
        this.aniAirF.onComplete.add(this.airforwardEnd, this);

        //Player air swipe down
        this.aniAirDWindUp= this.character.animations.add('AirDwindup', [28,28], 5, false);
        this.aniAirDWindUp.onStart.add(this.AirDWindUpStart, this);
        this.aniAirDWindUp.onComplete.add(this.AirDWindUpEnd, this);

        this.aniAirD = this.character.animations.add('airdown', [28, 28, 29, 30], 7, false);
        this.aniAirD.onStart.add(this.airdownStart, this);
        this.aniAirD.onComplete.add(this.airdownEnd, this);

        //Player air swipe neutral
        this.aniAirNWindUp= this.character.animations.add('airNwindup', [31,31], 5, false);
        this.aniAirNWindUp.onStart.add(this.AirNWindUpStart, this);
        this.aniAirNWindUp.onComplete.add(this.AirNWindUpEnd, this);

        this.aniAirN = this.character.animations.add('airneutral', [31, 31, 32, 32], 7, false);
        this.aniAirN.onStart.add(this.airneutralStart, this);
        this.aniAirN.onComplete.add(this.airneutralEnd, this);

        //Player juggle
        this.aniJuggleWindUp= this.character.animations.add('Jugglewindup', [26,26], 5, false);
        this.aniJuggleWindUp.onStart.add(this.JuggleWindUpStart, this);
        this.aniJuggleWindUp.onComplete.add(this.JuggleWindUpEnd, this);

        this.aniJuggle = this.character.animations.add('juggle', [26, 21, 22, 23], 7, false);
        this.aniJuggle.onStart.add(this.JuggleStart, this);
        this.aniJuggle.onComplete.add(this.JuggleEnd, this);

        //Player Air Dodge
        this.aniAirDodge = this.character.animations.add('airDodge', [6], 15, false);
        this.aniAirDodge.onStart.add(this.airDodgeStart, this);
        this.aniAirDodge.onComplete.add(this.airDodgeEnd, this);

        this.nespad = new nespad(controlnum);

        if (controlnum == 1) {
            this.controller1 = game.input.keyboard.addKeys({ 'jump': Phaser.KeyCode.E, 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D, 'basic': Phaser.KeyCode.T, 'special': Phaser.KeyCode.R, 'shield': Phaser.KeyCode.Y });
        }
        else if (controlnum == 2) {
            this.controller1 = game.input.keyboard.addKeys({ 'jump': Phaser.KeyCode.I, 'up': Phaser.KeyCode.UP, 'down': Phaser.KeyCode.DOWN, 'left': Phaser.KeyCode.LEFT, 'right': Phaser.KeyCode.RIGHT, 'basic': Phaser.KeyCode.P, 'special': Phaser.KeyCode.O, 'shield': Phaser.KeyCode.OPEN_BRACKET });
        }
        else if (controlnum == -1) {
            this.controller1 = new vpad(-1);
        }
        else if (controlnum == -2) {
            this.controller1 = new vpad(-2);
        }

        // weapons
        this.weapon1 = game.add.weapon(1, 'slash');
        
        this.weapon1.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weapon1.bulletLifespan = 50;
        this.weapon1.bulletSpeed = 0;
        this.weapon1.fireRate = 100;
        this.weapon1.trackSprite(this.character, 30, 20, true);

        this.weaponKick = game.add.weapon(1, 'slash');
        this.weaponKick.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weaponKick.bulletLifespan = 50;
        this.weaponKick.bulletSpeed = 0;
        this.weaponKick.fireRate = 100;
        this.weaponKick.trackSprite(this.character, 50, 50, true);

        this.weaponUppercut = game.add.weapon(1, 'slash');
        this.weaponUppercut.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weaponUppercut.bulletLifespan = 50;
        this.weaponUppercut.bulletSpeed = 0;
        this.weaponUppercut.fireRate = 100;
        this.weaponUppercut.trackSprite(this.character, 30, 10, true);

        //Weapon used for jump kick
        this.jumpKick = game.add.weapon(1, 'slash');
        this.jumpKick.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.jumpKick.bulletLifespan = 300;
        this.jumpKick.bulletSpeed = 150;
        this.jumpKick.fireRate = 100;
        this.jumpKick.trackSprite(this.character, 50, 50, true);

        //Weapon used for swipe down attacks
        this.weaponSwipeD = game.add.weapon(3, 'SwipeH');
        this.weaponSwipeD.alpha = 0;
        this.weaponSwipeD.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weaponSwipeD.bulletLifespan = 50;
        this.weaponSwipeD.bulletSpeed = 0;
        this.weaponSwipeD.fireRate = 100;
        this.weaponSwipeD.trackSprite(this.character, 0, 120, true);

        //Weapon used for swipe forward down attacks
        this.weaponSwipeFD = game.add.weapon(1, 'SwipeV');
        this.weaponSwipeFD.alpha = 0;
        this.weaponSwipeFD.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weaponSwipeFD.bulletLifespan = 50;
        this.weaponSwipeFD.bulletSpeed = 0;
        this.weaponSwipeFD.fireRate = 100;
        this.weaponSwipeFD.trackSprite(this.character, 20, 20, true);

        //Weapon used for swipe forward up attacks
        this.weaponSwipeFU = game.add.weapon(1, 'SwipeV');
        this.weaponSwipeFU.alpha = 0;
        this.weaponSwipeFU.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weaponSwipeFU.bulletLifespan = 50;
        this.weaponSwipeFU.bulletSpeed = 0;
        this.weaponSwipeFU.fireRate = 100;
        this.weaponSwipeFU.trackSprite(this.character, 20, 20, true);

        //Weapon used for swipe up attacks
        this.weaponSwipeU = game.add.weapon(1, 'SwipeH');
        this.weaponSwipeU.alpha = 0;
        this.weaponSwipeU.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weaponSwipeU.bulletLifespan = 50; 
        this.weaponSwipeU.bulletSpeed = 0;
        this.weaponSwipeU.fireRate = 100;
        this.weaponSwipeU.trackSprite(this.character, 0, 20, true);

        //end of weapons

        //used to create the trail effect for knockback
        this.dustTrail = game.add.weapon(20, 'dust');
        this.dustTrail.alpha = .5;
        this.dustTrail.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.dustTrail.bulletLifespan = 500;
        this.dustTrail.bulletSpeed = 0;
        this.dustTrail.fireRate = 200;
        this.dustTrail.trackSprite(this.character, 0, -50, true);

        this.stocks = game.add.group();

        this.updateStocks();
    }

    //Method to check whether or not fighter is currently trying to execute a combo

    updateStocks() {
        for (var g = this.lives - 1; g > -1; g--) {

            if (this.controlnum == -1 || this.controlnum == 1) //For the vpad
            {
                //sets up the cell for the damage icon and stocks
                var damageBox1 = game.add.sprite(0, game.world.game.world.height - 75, this.damageBox);
                damageBox1.scale.setTo(5.5, 2.2);
                var stock = this.stocks.create((30) + (90 * g / this.lives), game.world.height - 25, 'blueStock');
                stock.anchor.setTo(.5, .5);
            }

        }
        for (var h = 0; h < this.lives; h++) {
            if (this.controlnum == 2 || this.controlnum == -2) {
            
                //sets up the cell for the damage icon and stocks
                var damageBox2 = game.add.sprite(game.world.width*0.9, game.world.game.world.height - 75, this.damageBox);
                damageBox2.scale.setTo(5.5, 2.2);
                var stock = this.stocks.create((game.world.width * .95) + (30 * h), game.world.height - 25, 'blueStock');
                stock.anchor.setTo(.5, .5);
            }
        }
    }

    combocheck() {
        if (this.combo > 0 && this.comboclock > 0) {
            this.comboclock--;
        }
        else if (this.comboclock == 0) {
            this.combo = 0;
        }
    }
    resettint() {;
        if(this.controlnum <= 1 && this.controlnum >= -1) {
            this.character.tint = gameManager.playerTint[0];
        }
        else if(this.controlnum > 1 || this.controlnum < 0) {
            this.character.tint =  gameManager.playerTint[1];
        }
    }

    randtint() {
        this.character.tint = Math.random() * 0xffffff;
    }

    getleft() {
        if (this.testconnect == true) {
            if (nescontroller._axes[1] == -1) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (this.controlnum < 0) {
            //logic to change tint of button depending on whether it is pressed down or not for mobile version
            if (this.controller1.leftpress && this.controlnum == -1) {
                this.controller1.buttonleft.tint = 0;
            }
            else if (this.controlnum == -1) {
                this.controller1.buttonleft.tint = 0xffffff;
            }
            return this.controller1.leftpress;
        }
        else {
            return this.controller1.left.isDown;
        }

    }
    getright() {
        if (this.testconnect == true) {
            if (nescontroller._axes[1] == 1) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (this.controlnum < 0) {
            //logic to change tint of button depending on whether it is pressed down or not for mobile version
            if (this.controller1.rightpress && this.controlnum == -1) {
                this.controller1.buttonright.tint = 0;
            }
            else if (this.controlnum == -1) {
                this.controller1.buttonright.tint = 0xffffff;
            }
            return this.controller1.rightpress;
        }
        else {
            return this.controller1.right.isDown;
        }

    }
    getup() {
        if (this.testconnect == true) {
            if (nescontroller._axes[5] == -1) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (this.controlnum < 0) {
            //logic to change tint of button depending on whether it is pressed down or not for mobile version
            if (this.controller1.uppress && this.controlnum == -1) {
                this.controller1.buttonup.tint = 0;
            }
            else if (this.controlnum == -1) {
                this.controller1.buttonup.tint = 0xffffff;
            }
            return this.controller1.uppress;
        }
        else {
            return this.controller1.up.isDown;
        }

    }
    getdown() {
        if (this.testconnect == true) {
            if (nescontroller._axes[5] == 1) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (this.controlnum < 0) {
            //logic to change tint of button depending on whether it is pressed down or not for mobile version
            if (this.controller1.downpress && this.controlnum == -1) {
                this.controller1.buttondown.tint = 0;
            }
            else if (this.controlnum == -1) {
                this.controller1.buttondown.tint = 0xffffff;
            }
            return this.controller1.downpress;
        }
        else {
            return this.controller1.down.isDown;
        }

    }
    geta() {
        if (this.testconnect == true) {
            return this.nespad.nessaButton;
        }
        else if (this.controlnum < 0) {
            //logic to change tint of button depending on whether it is pressed down or not for mobile version
            if (this.controller1.apress && this.controlnum == -1) {
                this.controller1.buttona.tint = 0;
            }
            else if (this.controlnum == -1) {
                this.controller1.buttona.tint = 0xffffff;
            }
            return this.controller1.apress;
        }
        else {
            return this.controller1.basic.isDown;
        }

    }
    getb() {
        if (this.testconnect == true) {
            return this.nespad.nesbButton;
        }
        else if (this.controlnum < 0) {
            //logic to change tint of button depending on whether it is pressed down or not for mobile version
            if (this.controller1.bpress && this.controlnum == -1) {
                this.controller1.buttonb.tint = 0;
            }
            else if (this.controlnum == -1) {
                this.controller1.buttonb.tint = 0xffffff;
            }
            return this.controller1.bpress;
        }
        else {
            return this.controller1.special.isDown;
        }

    }
    getx() {
        if (this.testconnect == true) {
            return this.nespad.nesxButton;
        }
        else if (this.controlnum < 0) {
            //logic to change tint of button depending on whether it is pressed down or not for mobile version
            if (this.controller1.xpress && this.controlnum == -1) {
                this.controller1.buttonx.tint = 0;
            }
            else if (this.controlnum == -1) {
                this.controller1.buttonx.tint = 0xffffff;
            }
            return this.controller1.xpress;
        }
        else {
            return this.controller1.shield.isDown;
        }
    }
    gety() {
        if (this.testconnect == true) {
            return this.nespad.nesyButton;
        }
        else if (this.controlnum < 0) {
            if (this.controller1.ypress && this.controlnum == -1) {
                this.controller1.buttony.tint = 0;
            }
            else if (this.controlnum == -1) {
                this.controller1.buttony.tint = 0xffffff;
            }
            return this.controller1.ypress;
        }
        else {
            return this.controller1.jump.isDown;
        }

    }

    //animation events
    IdleEnd() {
        this.inputLock = false;
    }

    PunchWindUpStart() {
        this.inputLock = true;
    }
    PunchWindUpEnd() {

        this.aniPunch.play(10, false);
    }

    KickWindUpStart() {
        this.inputLock = true;
    }
    KickWindUpEnd() {
        this.aniKick.play(10, false);
    }

    AirFWindUpStart() {
        this.inputLock = true;
    }
    AirFWindUpEnd() {
        this.aniAirF.play(10, false);
    }

    AirDWindUpStart() {
        this.inputLock = true;
    }
    AirDWindUpEnd() {
        this.aniAirD.play(10, false);
    }

    AirNWindUpStart() {
        this.inputLock = true;
    }
    AirNWindUpEnd() {
        this.aniAirN.play(10, false);
    }

    UppercutWindUpStart() {
        this.inputLock = true;
    }
    UppercutWindUpEnd() {
        this.aniUppercut.play(10, false);
    }

    WarlockWindUpStart() {
        this.inputLock = true;
    }
    WarlockWindUpEnd() {
        this.aniWarlock.play(3, false);
    }

    JumpKickWindUpStart() {
        this.inputLock = true;
    }
    JumpKickWindUpEnd() {
        this.aniJumpKick.play(7, false);
    }
    
    JuggleWindUpStart() {
        this.inputLock = true;
    }
    JuggleWindUpEnd() {
        this.aniJuggle.play(10, false);
    }

    punchStart() {
        if (this.character.scale.x < 0) //If facing left, flip the angle of the hitbox
        {
            this.weapon1.bulletAngleOffset = 40;
        }
        else {
            this.weapon1.bulletAngleOffset = -40;
        }
        this.attack = 'punch';
        this.weapon1.fire();
        this.attacking = true;
        this.inputLock = true;
    }
    punchEnd() {
        this.aniIdle.play(10, false);
        this.attacking = false;
        this.deltDamage = false;
        this.inputLock = false;
        this.attack = '';
        this.basicCD = 15;

    }

    airforwardStart() {
        this.attack = 'airforward';
        this.weaponSwipeFU.fire();
        this.attacking = true;
        this.inputLock = true;
    }
    airforwardEnd() {
        this.attacking = false;
        this.deltDamage = false;
        this.inputLock = false;
        this.attack = '';
        this.basicCD = 15;
        this.aniIdle.play(10, false);
    }
    airdownStart() {
        this.attack = 'airdown';
        this.weaponSwipeD.fire();
        this.attacking = true;
        this.inputLock = true;
    }
    airdownEnd() {
        this.attacking = false;
        this.deltDamage = false;
        this.inputLock = false;
        this.attack = '';
        this.basicCD = 15;
        this.aniIdle.play(10, false);
    }
    airneutralStart() {
        this.attack = 'airneutral';
        this.weaponSwipeFD.fire();
        this.attacking = true;
        this.inputLock = true;
    }
    airneutralEnd() {
        this.attacking = false;
        this.deltDamage = false;
        this.inputLock = false;
        this.attack = '';
        this.basicCD = 15;
        this.aniIdle.play(10, false);
    }
    JuggleStart() {
        this.attack = 'juggle';
        this.weaponSwipeU.fire();
        this.attacking = true;
        this.inputLock = true;
    }
    JuggleEnd() {
        this.attacking = false;
        this.deltDamage = false;
        this.inputLock = false;
        this.attack = '';
        this.basicCD = 15;
        this.aniIdle.play(10, false);
    }
    kickStart() {
        this.attacking = true;
        this.attack = 'kick';
        this.weaponKick.fire();
        this.inputLock = true;
    }
    kickEnd() {
        this.aniIdle.play(10, false);
        this.attacking = false;
        this.deltDamage = false;
        this.inputLock = false;
        this.attack = '';
        this.basicCD = 25;
        
    }
    jumpStart() {
        this.character.body.velocity.y = game.world.height*-3 + this.jumpSpeed;
        if(muteState==false)
        jumpSound.play();

        this.shielding = false;
        this.character.animations.play('jump');
    }
    jumpEnd() {
        this.aniIdle.play(10, false);
    }
    koEnd() {
        this.aniIdle.play(10, false);
        this.inputLock = false;
    }
    walkEnd() {
        this.character.animations.play('idle');
        
    }
    dashStart() {
        this.character.alpha = 0.5;
        this.xZero = false;
        this.invincible = true;

        this.character.body.velocity.x = 500 * this.character.scale.x;
        this.inputLock = true;
    }
    dashEnd() {
        this.aniIdle.play(10, false);
        this.invincible = false;
        this.character.alpha = 1;
        this.inputLock = false;
        this.xZero = true;
        this.dashCD = 60;
    }
    jumpKickTimer() {
        if (this.attacking) {
            this.jumpKick.fire();
            this.character.body.velocity.x = 150 * this.character.scale.x;
            this.character.body.velocity.y = -100;
            this.inputLock = true;
        }
        else {
            this.xZero = true;
            this.inputLock = false;
            this.aniIdle.play(10, false);
            
        }

    }
    jumpKickTimer2() {
        this.xZero = true;
    }
    jumpKickStart() {
        this.attacking = true;
        this.attack = 'jumpKick';
        this.inputLock = true;
        this.xZero = false;
        game.time.events.add(Phaser.Timer.SECOND * .3, this.jumpKickTimer, this);
    }
    jumpKickEnd() {
        this.aniIdle.play(10, false);
        this.attacking = true;
        this.deltDamage = false;
        this.inputLock = false;
        game.time.events.add(Phaser.Timer.SECOND * .05, this.jumpKickTimer2, this);
        this.attack = '';
    }
    uppercutStart() {
        if (this.character.scale.x < 0) //If facing left, flip the angle of the hitbox
        {
            this.weaponUppercut.bulletAngleOffset = 40;
        }
        else {
            this.weaponUppercut.bulletAngleOffset = -40;
        }
        this.character.body.velocity.y = 0;
        this.character.body.velocity.x = 50 * this.character.scale.x;
        this.character.body.velocity.y -= 600;
        this.attacking = true;
        this.attack = 'uppercut';
        this.weaponUppercut.fire();
        this.inputLock = true;
    }
    uppercutEnd() {
        this.aniIdle.play(10, false);
        this.attacking = false;
        this.deltDamage = false;
        this.inputLock = false;
        this.attack = '';
        this.uppercutCD = 60;
    }
    warlockTimer() {
        if (this.attacking) {
            this.weaponKick.fire();
            this.character.body.moves = true;
            this.character.body.velocity.x = 5 * this.character.scale.x;
            this.inputLock = true;
        }
        else {
            this.xZero = true;
            this.character.body.moves = true;
            this.inputLock = false;
            this.aniIdle.play(10, true);
        }
    }
    warlockStart() {
        this.xZero = false;
        this.inputLock = true;
        this.attacking = true;
        if (this.character.body.touching.down) {
            this.character.body.moves = false;
        }
        this.attack = 'warlock';
        this.character.body.velocity.x = 5 * this.character.scale.x;
        game.time.events.add(Phaser.Timer.SECOND * 1.15, this.warlockTimer, this);
    }

    warlockEnd() {
        this.aniIdle.play(10, false);
        this.attacking = false;
        this.character.body.moves = true;
        this.deltDamage = false;
        this.attack = '';
        this.inputLock = false;
        this.warlockCD = 30;
        this.xZero = true;
    }
    shieldEnd() {
        this.shielding = false;
        this.aniIdle.play(10, false);
    }

    airDodgeTimer() {
        //Timer till invicibility wears off for air dodge
        this.invincible = false;
    }

    airDodgeStart() {
        this.character.alpha = 0.5;
        this.invincible = true;
        this.xZero = false;
        if (this.getleft() || this.getright()) {
            this.character.body.velocity.y = 0;
            this.character.body.velocity.x = 200 * this.character.scale.x;
        }
        if (this.controller1.up.isDown) {
            this.character.body.velocity.y = 0;
            this.character.body.velocity.y = -250;
        }
        else if (this.controller1.down.isDown) {
            this.character.body.velocity.y = 0;
            this.character.body.velocity.y = 150;
        }
        this.inputLock = true;
        game.time.events.add(Phaser.Timer.SECOND * 1.25, this.airDodgeTimer, this);

    }

    airDodgeEnd() {
        this.aniIdle.play(10, false);
        this.character.alpha = 1;
        this.airDodgeCD = 60;
        this.xZero = true;
        this.inputLock = false;
    }

    stuncounterset(stunnum){
        this.stunCounter = stunnum;
        this.stunCounterLock = 1;
    }

    //method to verify if fighter is touching a side of a platform, if true, fighter grabs ledge 
    checkLedge(leftedge, rightedge) {

        if(game.physics.arcade.overlap(this.character, leftedge) && this.character.scale.x > 0 && this.hangingState != "LetGo" ){
            this.velocity = 0;
            this.character.x = leftedge.x;
            this.character.y = leftedge.y - 25;
            
            if(this.hangingState == "NotHanging"){
                this.character.animations.play('hang', true);
                //Cancels all other states
                this.character.body.velocity.x = 0;
                this.character.body.velocity.y = 0;
                this.character.alpha = 1;
                this.invincible = false;
                this.inputLock = false;
                this.dashCD = 0;
                this.warlockCD = 0;
                this.uppercutCD = 0;
                this.basicCD = 0;
                this.airDodgeCD = 0;
                
                this.hangingState = "Hanging";
            }
        }

        if(game.physics.arcade.overlap(this.character, rightedge) && this.character.scale.x < 0 && this.hangingState != "LetGo") {

            this.velocity = 0;
            this.character.x = (rightedge.x);
            this.character.y = (rightedge.y - 25);
            
            if(this.hangingState == "NotHanging"){
                this.character.animations.play('hang', true);
                //Cancels all other states
                this.character.body.velocity.x = 0;
                this.character.body.velocity.y = 0;
                this.character.alpha = 1;
                this.invincible = false;
                this.inputLock = false;
                this.dashCD = 0;
                this.warlockCD = 0;
                this.uppercutCD = 0;
                this.basicCD = 0;
                this.airDodgeCD = 0;
                
                this.hangingState = "Hanging";
            }
            
        }

        this.ledgeRecover(leftedge, rightedge);
        
        this.updateHangingTimer();
    }

    //method to allow fighter to pull theirself up ledge when a up command is pushed

    ledgeRecover(leftedge, rightedge) {
        if(this.hangingState == "Hanging") {
            if(this.getup() == true || this.gety() == true) {
                this.character.body.velocity.y = -500;
                this.hangingState = "LetGo";
                this.hangingTimer = 100;
            }
            else if(this.getdown() == true) {
                this.character.body.velocity.y = 200;
                this.hangingState = "LetGo";
                this.hangingTimer = 100;
            }
            else if(this.geta() || this.getb() == true) {
                //if facing right
                if(this.character.scale.x > 0) {
                    this.character.body.position.y -= 170;
                    this.character.body.position.x += 100;
                }
                else {
                    this.character.body.position.y -= 170;
                    this.character.body.position.x -= 100;
                }
                this.hangingState = "LetGo";
                this.hangingTimer = 100;
            }
            else if(this.getx() == true) {
                //if facing right
                if(this.character.scale.x > 0) {
                    this.character.body.position.y -= 170;
                    this.character.body.position.x += 100;
                }
                else {
                    this.character.body.position.y -= 170;
                    this.character.body.position.x -= 100;
                }

                this.hangingState = "LetGo";
                
                this.hangingTimer = 100;
            }

        }
    }

    //method to reset timer to ensure when fighter lets go of a ledge, they do not instantly  grab onto same ledge again accidentally
    updateHangingTimer(){
        if(this.hangingTimer > 0) {
            this.hangingTimer--;
        }
        else {
            this.hangingState = "NotHanging";
        }
    }

    checkface(facing){

        if (facing === "Left" && this.character.scale.x > 0){
            this.character.scale.x *= -1;
            this.weapontracking();
        }

        if (facing === "Right" && this.character.scale.x < 0){
            this.character.scale.x *= -1;
            this.weapontracking();
        }
    }

    weapontracking() {

        if(this.character.scale.x > 0) {
            
            this.weapon1.trackSprite(this.character, 30, 20, true);
            this.weaponKick.trackSprite(this.character, 50, 50, true);
            this.weaponUppercut.trackSprite(this.character, 30, 10, true);
            this.jumpKick.trackSprite(this.character, 50, 50, true);
            this.jumpKick.bulletSpeed = this.jumpKickBulletSpeedCons;

            this.weaponSwipeD.trackSprite(this.character, 0, 90, true);                    
            this.weaponSwipeFD.trackSprite(this.character, 25, 30, true);
            this.weaponSwipeFU.trackSprite(this.character, 25, 20, true);
            this.weaponSwipeU.trackSprite(this.character, 0, 10, true);

            /*if(this.weaponSwipeFU.scale.x >= 0){
                this.weaponSwipeD.bullets.scale.x*=-1;
                this.weaponSwipeFU.bullets.scale.x*=-1;
                this.weaponSwipeFD.bullets.scale.x*=-1;
                this.weaponSwipeU.bullets.scale.x*=-1;
            }*/
            
        }
        else if (this.character.scale.x < 0) {
            
            this.weapon1.trackSprite(this.character, 30, -20, true);
            this.weaponKick.trackSprite(this.character, 50, -50, true);
            this.weaponUppercut.trackSprite(this.character, 30, -10, true);
            this.jumpKick.trackSprite(this.character, 50, -50, true );
            this.jumpKick.bulletSpeed = -1 * this.jumpKickBulletSpeedCons;

            this.weaponSwipeD.trackSprite(this.character, 0, -90, true);                    
            this.weaponSwipeFD.trackSprite(this.character, 25, -30, true);
            this.weaponSwipeFU.trackSprite(this.character, 25, -20, true);
            this.weaponSwipeU.trackSprite(this.character, 0, -10, true);

            /*if(this.weaponSwipeFU.scale.x <= 0){
                this.weaponSwipeD.bullets.scale.x*=-1;
                this.weaponSwipeFU.bullets.scale.x*=-1;
                this.weaponSwipeFD.bullets.scale.x*=-1;
                this.weaponSwipeU.bullets.scale.x*=-1;
            }*/
        }

    }

    updateInput() {
        
        //Cooldown for attacks
        if (this.dashCD != 0) {
            this.dashCD -= 1;
        }
        if (this.uppercutCD != 0) {
            this.uppercutCD -= 1;
        }
        if (this.warlockCD != 0) {
            this.warlockCD -= 1;
        }
        if (this.basicCD != 0) {
            this.basicCD -= 1;
        }
        if (this.airDodgeCD != 0) {
            this.airDodgeCD -= 1;
        }
        //Cooldown for hit stun
        if (this.stunCounter != 0) {
            this.stunCounter -= 1;
        }
        if(this.stunCounter == 0 && this.stunCounterLock == 1){
            this.resettint();
            this.stunCounterLock = 0;
        }
        
        //update function to decrease/increase the hit velocity based on the original direction of the punch. The natural slowing down of hit velocity
        if (this.hitVelocity < 0) {
            this.hitVelocity += 1;
        }
        else if (this.hitVelocity > 0) {
            this.hitVelocity -= 1;
        }
        else {
            this.hitVelocity = 0;
        }

        //control logic for real keyboard
        if (this.controlnum >= -2) {
            
            if (this.character.body.touching.down) //prevents jumping when in the air
            {
                this.airTime = 0;
            }
            else if (this.airTime <= 5) {
                this.airTime++;
            }

            //Shield and item use logic
            if (this.getx() && this.stunCounter == 0 && this.hitVelocity == 0 && !this.inputLock) {

                if (this.character.hasItem) {
                    //If he has an item, USE IT!
                    this.useItem = true;
                }
                else if (this.character.body.touching.down) {
                    this.character.body.velocity.x = 0;
                    this.character.animations.play('shield');
                    this.shielding = true;
                    this.inputLock = true;
                    
                }
                else {
                    if (this.airDodgeCD == 0) {
                        this.aniAirDodge.play(4, false);
                        this.shielding = true;
                    }
                }
            }

            //air forawrd swipe (air launcher)
            else if (this.geta() && this.character.body.touching.down == false && (this.getleft() || this.getright()) && !(this.m < 120 && this.m != 0) && this.stunCounter == 0 && !this.inputLock && this.basicCD == 0) {
                this.aniAirF.play(10, false);

                this.shielding = false;
                this.hitSwitchPunch = true;
            }

            // air down attack, spike kick sweep
            else if (this.geta() && this.character.body.touching.down == false && this.getdown() && !(this.m < 120 && this.m != 0) && this.stunCounter == 0 && !this.inputLock && this.basicCD == 0) {
                this.aniAirD.play(10, false);

                this.shielding = false;
                this.hitSwitchPunch = true;
            }

            //juggle move aka up normal attack, can be done in air and on ground
            else if (this.geta() && (this.getup()) && !(this.m < 120 && this.m != 0) && this.stunCounter == 0 && !this.inputLock && this.basicCD == 0) {
                this.aniJuggle.play(10, false);

                this.shielding = false;
                this.hitSwitchPunch = true;
            }

            //air neutral attack logic (air spike)
            else if (this.geta() && this.character.body.touching.down == false && !(this.m < 120 && this.m != 0) && this.stunCounter == 0 && !this.inputLock && this.basicCD == 0) {
                this.aniAirN.play(10, false);

                this.shielding = false;
                this.hitSwitchPunch = true;
            }

            //punch logic
            else if (this.geta() && !(this.m < 120 && this.m != 0) && this.stunCounter == 0 && !this.inputLock && this.basicCD == 0) {

                this.combo++;

                this.comboclock = 60;

                if (this.combo == 1) {
                    //logic to change direction facing
                    if (this.character.scale.x < 0) {
                        this.character.body.velocity.x = -250 + this.moveSpeed;
                    }
                    else {
                        this.character.body.velocity.x = 250 + this.moveSpeed;
                    }
                    this.aniPunchWindUp.play(10, false);
                    this.hitSwitchPunch = true;
                }
                else if (this.combo == 2) {
                    //logic to change direction facing
                    if (this.character.scale.x < 0) {
                        this.character.body.velocity.x = -350 - this.moveSpeed;
                    }
                    else {
                        this.character.body.velocity.x = 350 + this.moveSpeed;
                    }
                    this.aniKickWindUp.play(10, false);
                    
                    this.shielding = false;
                    this.hitSwitchKick = true;
                }
                else if (this.combo == 3) {
                    //logic to change direction facing
                    if (this.character.scale.x < 0) {
                        this.character.body.velocity.x = -250 + this.moveSpeed;
                    }
                    else {
                        this.character.body.velocity.x = 250 + this.moveSpeed;
                    }
        
                    this.aniUppercutWindUp.play(10, false);
                    
                    this.shielding = false;
                    this.hitSwitchPunch = true;
                    this.combo = 0;
                }

            }

            // Kick logic
            else if (this.geta() && this.getdown() && !(this.m < 120 && this.m != 0) && this.stunCounter == 0 && !this.inputLock && this.basicCD == 0) {
                //  Move to the right

                //logic to change direction facing
                if (this.character.scale.x < 0) {
                    this.character.body.velocity.x = -350 - this.moveSpeed;
                }
                else {
                    this.character.body.velocity.x = 350 + this.moveSpeed;
                }
                this.aniKickWindup.play(10, false);

                if (this.character.body.touching.down) {
                    this.character.body.velocity.y = -200;
                }

                this.shielding = false;
                this.hitSwitchKick = true;
            }

            //Use item logic
            else if (this.geta() && this.getdown() == false && this.getright() == false && this.getleft() == false && !(this.m < 120 && this.m != 0) && this.stunCounter == 0 && !this.inputLock && this.basicCD == 0) {
                //logic to change direction facing
                if (this.character.scale.x < 0) {
                    this.character.body.velocity.x = -250 + this.moveSpeed;
                }
                else {
                    this.character.body.velocity.x = 250 + this.moveSpeed;
                }
                this.aniPunchWindUp.play(10, false);

                this.shielding = false;
                this.hitSwitchPunch = true;
            }

            else if (this.getb() && !this.inputLock && this.getup() && !(this.m < 120 && this.m != 0) && this.stunCounter == 0 && this.uppercutCD == 0) {
                this.aniUppercutWindUp.play(10, false);
            }
            else if (this.getb() && !this.inputLock && this.getright() && !(this.m < 120 && this.m != 0) && this.stunCounter == 0 && this.dashCD == 0) {
                this.aniDash.play(5, false);
            }
            else if (this.getb() && !this.inputLock && this.getleft() && !(this.m < 120 && this.m != 0) && this.stunCounter == 0 && this.dashCD == 0) {
                this.aniDash.play(5, false);
            }
            else if (this.getb() && !this.inputLock && this.getdown() && !(this.m < 120 && this.m != 0) && this.stunCounter == 0) {
                this.aniJumpKickWindUp.play(10, false);
            }
            else if (this.getb() && this.getleft() == false && this.getright() == false && this.getup() == false && !this.inputLock && !(this.m < 120 && this.m != 0) && this.stunCounter == 0 && this.warlockCD == 0) {
                this.aniWarlockWindUp.play(10, false);
            }

            //check to see if air time is truly necessary, cant seem to jump in air if you run off platform
            else if (this.gety() && this.jumps <= 5 && !(this.m < 120 && this.m != 0) && this.stunCounter == 0 && !this.inputLock) {
                this.character.body.velocity.y = -550 + this.jumpSpeed;
                
                if(muteState==false){
                    jumpSound.play();
                }
                
                this.jumps += 1;
                this.shielding = false;
                this.character.animations.play('jump');
            }
            else if (this.getleft() && !(this.m < 120 && this.m != 0) && this.stunCounter == 0 && !this.inputLock) {

                if (this.character.body.touching.down) {
                    this.jumps = 0;
                }

                this.checkface("Left");
                
                if (this.character.body.touching.down) {
                    this.character.body.velocity.x = -250 + this.hitVelocity;
                }
                else {
                    this.character.body.velocity.x = -200 + this.hitVelocity;
                }
                
                //Determines the hitvelocity of the player based on inputs from keyboard to decrease the velocity
                if (this.hitVelocity != 0) {
                    if (this.hitVelocity + -125 < 0) {
                        this.hitVelocity = 0;
                    }
                    else {
                        this.hitVelocity += -125;
                    }
                }
                this.character.animations.play('right');
                this.shielding = false;
            }
            else if (this.getright() && !(this.m < 120 && this.m != 0) && this.stunCounter == 0 && !this.inputLock) {
                //  Move to the right
                if (this.character.body.touching.down) {
                    this.jumps = 0;
                }

                this.checkface("Right");
                    
                if (this.character.body.touching.down) {
                    this.character.body.velocity.x = 250 + this.hitVelocity;
                }
                else {
                    this.character.body.velocity.x = 200 + this.hitVelocity;
                }
                //Determines the hitvelocity of the player based on inputs from keyboard to decrease the velocity
                if (this.hitVelocity != 0) {
                    if (this.hitVelocity + 125 > 0) {
                        this.hitVelocity = 0;
                    }
                    else {
                        this.hitVelocity += 125;
                    }
                }
                this.character.animations.play('right');
                this.shielding = false;
            }
            else {
                //Code that assigns the velocity of the player based on the current hitVelocity. Keeps track of jump count and determines the idle animation of the character
                if (this.hitVelocity != 0) {
                    this.character.body.velocity.x = this.hitVelocity;
                }
                else {
                    if (this.xZero) {
                        this.character.body.velocity.x = 0;
                    }
                }
                if (this.stunCounter > 0) {
                    this.character.animations.play('ko');

                    //make player flash different colors when taking damage
                    this.character.tint = Math.random() * 0xffffff;

                    //If hit really hard, add a dust trail that depends on hit velocity
                    if (this.hitVelocity > 350 || this.hitVelocity < -350) {
                        this.dustTrail.fire();
                        game.camera.shake(0.04, 20);
                    }

                }

                if (this.character.body.touching.down) {
                    this.jumps = 0;
                }
            }
        }
    }
}