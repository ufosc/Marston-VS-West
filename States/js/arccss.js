var arccssState = {
    create: function () {
       
        //Reset values to default so if player wants to play again, it does not start off "ready" to play
        charSelected1 = false;
        charSelected2 = false;
        botSelected = false;
        controlOptionAI = -2;
        charName1 = "";
        charName2 = "";
        multimanmode = false;

        var backgroundSprite = game.add.image(0, 0, 'menuBackground');
        backgroundSprite.anchor.setTo(0,0);
        var logo = game.add.image(game.world.width * .5, game.world.height * .5, 'logo');
        logo.anchor.setTo(.5,.5);
        logo.scale.setTo(.8,.8);

        key1 = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        
        LabIcon = game.add.sprite(game.world.width * 0.3, game.world.height * .5, 'LabIcon');
        LabIcon.anchor.setTo(.5, 1);
        LabIcon.scale.setTo(5, 5);
        game.physics.arcade.enable(LabIcon);
        LabIcon.tint = 0xffffff;

        GothIcon = game.add.sprite(game.world.width * 0.7, game.world.height * .5, 'GothIcon');
        GothIcon.anchor.setTo(.5, 1);
        GothIcon.scale.setTo(5, 5);
        game.physics.arcade.enable(GothIcon);
        GothIcon.tint = 0xffffff;

        BoxIcon = game.add.sprite(game.world.width * 0.3, game.world.height * .5, 'BoxIcon');
        BoxIcon.anchor.setTo(.5, 0);
        BoxIcon.scale.setTo(5, 5);
        game.physics.arcade.enable(BoxIcon);
        BoxIcon.tint = 0xffffff;

        FighterIcon = game.add.sprite(game.world.width * 0.7, game.world.height * 0.5, 'FighterIcon');
        FighterIcon.anchor.setTo(.5, 0);
        FighterIcon.scale.setTo(5, 5);
        game.physics.arcade.enable(FighterIcon);
        FighterIcon.tint = 0xffffff;

        //TEST:COMPUTER icon
        computerIcon = game.add.button(game.world.width * .5, game.world.height * .5 + 150, 'computerIcon');
        computerIcon.anchor.setTo(.5, .5);
        computerIcon.scale.setTo( .35, .53);
        computerIcon.visible = false;
        //game.physics.arcade.enable(computerIcon);
        computerIcon.tint = 0xffffff;
        
        computerIcon.events.onInputUp.add(function () {
            controlOptionAI *= -1;
            console.log(controlOptionAI);
            if (controlOptionAI == -2){
                computerIcon.tint = 0xffff00;
            }
            else{
                computerIcon.tint = 0xffffff;
            }
        });
        //.onInputUp.add(this.arcade, this);

        player1Icon = game.add.sprite(game.world.width * .5, game.world.height * .25, 'player1cssIcon');
        player1Icon.scale.setTo(3, 3);
        player1Icon.anchor.setTo(.5, .5);

        player2Icon = game.add.sprite(game.world.width * .5, game.world.height * .5, 'player2cssIcon');
        player2Icon.visible = false;
        //player2Icon.scale.setTo(3, 3);
        //player2Icon.anchor.setTo(.5, .5);

        player1Icon.inputEnabled = true;
        //player2Icon.inputEnabled = true;

        player1Icon.input.enableDrag(true);
        //player2Icon.input.enableDrag(true);
        
        game.physics.arcade.enable(player1Icon);
        //game.physics.arcade.enable(player2Icon);

        player1Icon.enableBody = true;
        //player2Icon.enableBody = true;

        player1Icon.events.onDragStop.add(this.onDragStop, this);
        player1Icon.events.onDragStart.add(this.onDragStart, this);
        player2Icon.events.onDragStop.add(this.onDragStop, this);
        player2Icon.events.onDragStart.add(this.onDragStart, this);

        LabIcon.enableBody = true;
        GothIcon.enableBody = true;
        BoxIcon.enableBody = true;
        FighterIcon.enableBody = true;

        buttonSound = game.add.audio('buttonSound');

        buttonSound.volume = gameManager.volume * 0.2;

        //var startLabel = game.add.text(80, game.world.height - 40, 'Press "1" key to play game after selecting characters!', { font: '25px Arial', fill: '#ffffff' });
        //gameReadyText = game.add.text(game.world.width * .5, game.world.height - 75, '', { font: '90px Permanent Marker', fill: '#ffffff' });
        gameReadyText = new TextButton(this.game, game.world.width * .5, game.world.height - 75, '', { font: '75px Permanent Marker', fill: '#ffffff' });
        gameReadyText.anchor.setTo(.5, .5);

        player1Text = game.add.text(game.world.width * .05, game.world.height * .3, '', { font: '90px Permanent Marker', fill: '#ffffff' });
        player2Text = game.add.text(game.world.width * .95, game.world.height * .3, '', { font: '90px Permanent Marker', fill: '#ffffff' });
        player1Text.anchor.setTo(0,.5);
        player2Text.anchor.setTo(1,.5);

        player1BodyIcon = game.add.sprite(game.world.width * .25 - 150, game.world.height * .5 + 150, '');
        player2BodyIcon = game.add.sprite(game.world.width * .75 + 150, game.world.height * .5 + 150, '');
        player1BodyIcon.anchor.setTo(.5,.5);
        player2BodyIcon.anchor.setTo(.5,.5);
        player1BodyIcon.scale.setTo(1.5, 1.5);
        player2BodyIcon.scale.setTo(1.5, 1.5);

        //Chose your library: Click on label to set variable to a library, then send info later
        var player1Label = game.add.text(game.world.width*0.25, 50, 'Choose your Library!', { font: '50px Permanent Marker', fill: '#ffffff' });
        player1Label.inputEnabled = true;
        player1Label.selected = 0;
        player1Label.librarySelected = '';
        player1Label.events.onInputUp.add(function () {
            switch (player1Label.selected) {

                case 0:
                    player1Label.librarySelected = 'Marston'
                    player1Label.text = `${player1Label.librarySelected}`;
                    player1Label.selected++;
                    break;
                case 1:
                    player1Label.librarySelected = 'West'
                    player1Label.text = `${player1Label.librarySelected}`;
                    player1Label.selected--;
                    break;
            }
        });

        var player2Label = game.add.text(game.world.width * .65 + 150, 50, 'Choose your Library!', { font: '50px Permanent Marker', fill: '#ffffff' });
        player2Label.inputEnabled = true;
        player2Label.selected = 0;
        player2Label.librarySelected = '';
        player2Label.events.onInputUp.add(function () {
            switch (player2Label.selected) {

                case 0:
                    player2Label.librarySelected = 'Marston'
                    player2Label.text = `${player2Label.librarySelected}`;
                    player2Label.selected++;
                    break;
                case 1:
                    player2Label.librarySelected = 'West'
                    player2Label.text = `${player2Label.librarySelected}`;
                    player2Label.selected--;
                    break;
            }
        });

        //Hide labels used in debugging
        player1Label.visible = false;
        player2Label.visible = false;

        menuLabel = new TextButton(this.game, game.world.width * .05, game.world.height * .05, 'MENU', { font: '90px Permanent Marker', fill: '#ffffff' });

        menuLabel.events.onInputUp.add(function () {
            game.state.start('menu');
        });

        console.log("arcade css?");
        ColorMenu1 = new ColorMenu(1);
        
        //player 1 color selection events
        ColorMenu1.button[0].onInputUp.add(function (){
                gameManager.playerTint[0] = ColorMenu1.colorPick(0);
        });

        ColorMenu1.button[1].onInputUp.add(function (){
                gameManager.playerTint[0] = ColorMenu1.colorPick(1);
        });
        
        ColorMenu1.button[2].onInputUp.add(function (){
                gameManager.playerTint[0] = ColorMenu1.colorPick(2);
        });

        ColorMenu1.button[3].onInputUp.add(function (){
                gameManager.playerTint[0] = ColorMenu1.colorPick(3);
        });
        
        ColorMenu1.button[4].onInputUp.add(function (){
                gameManager.playerTint[0] = ColorMenu1.colorPick(4);
        });
        
        ColorMenu1.button[5].onInputUp.add(function (){
                gameManager.playerTint[0] = ColorMenu1.colorPick(5);
        });

    },
    start: function () {
        gameReadyText.text = `Game Start!`;
        //music.stop();
        game.state.start('arctcs');
    },
    update: function () {
        player1Text.text = `${charName1}`;
        player2Text.text = `${charName2}`;
        //If the character is selected, play the selected animation
        game.physics.arcade.collide(player1Icon, player2Icon);
        if (player1BodyIcon.animations) {
            player1BodyIcon.tint = gameManager.playerTint[0];
            player1BodyIcon.animations.play('idle');
        }

        if (player2BodyIcon.animations) {
            player2BodyIcon.tint = gameManager.playerTint[1];
            player2BodyIcon.animations.play('idle');
        }

        if (charSelected1 && key1.isDown) {
            //Eventually allow the player to start game;
            gameReadyText.text = `Game Start!`;
            game.state.start('arctcs');
        }
        else if (charSelected1) { //Allow the player to tap game ready to start game
            gameReadyText.text = `Click here or Press 'ENTER' to start!`;
            gameReadyText.inputEnabled = true;
            gameReadyText.events.onInputUp.addOnce(function () {
                //music.stop();
                game.state.start('arctcs');
            });
        }
        else {
            {
                gameReadyText.text = ``;
                gameReadyText.inputEnabled = false;
            }
        }
    },
    colorButtonPress: function (buttonOrder, buttonNum){
        gameManager.playerTint[buttonOrder] = playerColorButtons.colorPick(buttonNum);
    },
    onDragStop: function () {
        //If you drop the cursor on the icon
        if (game.physics.arcade.overlap(player1Icon, LabIcon)) {
            if(muteState==false)
            buttonSound.play();
            //Determine's what's spawned, and lets you start game
            charName1 = "Lab";
            charSelected1 = true;
            //"select" dude, and change color of pic
            LabIcon.tint = 0xffff00;
            //destroys the old sprite so when you create a new one only one exists
            player1BodyIcon.kill();

            player1BodyIcon = game.add.sprite(game.world.width * .3 - 150, game.world.height * .5 - 50, 'Lab');
            
            player1BodyIcon.scale.setTo(3.5, 3.5);
            player1BodyIcon.animations.add('idle', [1, 2], 5, true);
            player1BodyIcon.animations.add('kick', [6], 5, true);
            if (player1BodyIcon.animations) {
                player1BodyIcon.alpha = 1;
            }
        }
        else {
            // player1BodyIcon.kill();
        }

        //If you drop the icon on the chick Picture
        if (game.physics.arcade.overlap(player1Icon, GothIcon)) {
            if(muteState==false)
            buttonSound.play();
            charName1 = "Goth";
            charSelected1 = true;
            GothIcon.tint = 0xffff00;
            player1BodyIcon.kill();

            player1BodyIcon = game.add.sprite(game.world.width * .3 - 150, game.world.height * .5 - 50, 'Goth');

            player1BodyIcon.scale.setTo(3.5, 3.5);
            player1BodyIcon.animations.add('idle', [1, 2], 5, true);
            player1BodyIcon.animations.add('kick', [6], 5, true);
            if (player1BodyIcon.animations) {
                player1BodyIcon.alpha = 1;
            }
        }

        if (game.physics.arcade.overlap(player1Icon, BoxIcon)) {
            if(muteState==false)
            buttonSound.play();
            charName1 = "Boxer";
            charSelected1 = true;
            BoxIcon.tint = 0xffff00;
            player1BodyIcon.kill();

            player1BodyIcon = game.add.sprite(game.world.width * .25 - 150, game.world.height * .5 - 50, 'Boxer');

            player1BodyIcon.scale.setTo(3.5, 3.5);
            player1BodyIcon.animations.add('idle', [1, 2], 5, true);
            player1BodyIcon.animations.add('kick', [6], 5, true);
            if (player1BodyIcon.animations) {
                player1BodyIcon.alpha = 1;
            }
        }

        if (game.physics.arcade.overlap(player1Icon, FighterIcon)) {
            if(muteState==false)
            buttonSound.play();
            charName1 = "Fighter";
            charSelected1 = true;
            BoxIcon.tint = 0xffff00;
            player1BodyIcon.kill();

            player1BodyIcon = game.add.sprite(game.world.width * .3 - 150, game.world.height * .5 - 50, 'Fighter');

            player1BodyIcon.scale.setTo(3.5, 3.5);
            player1BodyIcon.animations.add('idle', [1, 2], 5, true);
            player1BodyIcon.animations.add('kick', [6], 5, true);
            if (player1BodyIcon.animations) {
                player1BodyIcon.alpha = 1;
            }
        }

        if (game.physics.arcade.overlap(player2Icon, LabIcon)) {
            if(muteState==false)
            buttonSound.play();
            charName2 = "Lab";
            charSelected2 = true;
            LabIcon.tint = 0xffff00;
            player2BodyIcon.kill();
            controlOptionAI = -2;

            player2BodyIcon = game.add.sprite(game.world.width * .6 + 150, game.world.height * .5 - 50, 'Lab');
            player2BodyIcon.scale.setTo(3.5, 3.5);
            player2BodyIcon.animations.add('idle', [1, 2], 5, true);
            player2BodyIcon.animations.add('kick', [6], 5, true);
            player2BodyIcon.visible = true;

            if (player2BodyIcon.animations) {
                player2BodyIcon.alpha = 1;
            }
        }
        else {
            //player2BodyIcon.kill();
        }

        if (game.physics.arcade.overlap(player2Icon, GothIcon)) {
            if(muteState==false)
            buttonSound.play();
            charName2 = "Goth";
            charSelected2 = true;
            GothIcon.tint = 0xffff00;
            player2BodyIcon.kill();
            controlOptionAI = -2;

            player2BodyIcon = game.add.sprite(game.world.width * .6 + 150, game.world.height * .5 - 50, 'Goth');
            player2BodyIcon.scale.setTo(3.5, 3.5);
            player2BodyIcon.animations.add('idle', [1, 2], 5, true);
            player2BodyIcon.animations.add('kick', [6], 5, true);

            if (player2BodyIcon.animations) {
                player2BodyIcon.alpha = 1;
            }
        }

        if (game.physics.arcade.overlap(player2Icon, BoxIcon)) {
            if(muteState==false)
            buttonSound.play();
            charName2 = "Boxer";
            charSelected2 = true;
            BoxIcon.tint = 0xffff00;
            player2BodyIcon.kill();
            controlOptionAI = -2;

            player2BodyIcon = game.add.sprite(game.world.width * .55 + 150, game.world.height * .5 - 50, 'Boxer');
            player2BodyIcon.scale.setTo(3.5, 3.5);
            player2BodyIcon.animations.add('idle', [1, 2], 5, true);
            player2BodyIcon.animations.add('kick', [6], 5, true);

            if (player2BodyIcon.animations) {
                player2BodyIcon.alpha = 1;
            }
        }

        if (game.physics.arcade.overlap(player2Icon, FighterIcon)) {
            if(muteState==false)
            buttonSound.play();
            charName2 = "Fighter";
            charSelected2 = true;
            FighterIcon.tint = 0xffff00;
            player2BodyIcon.kill();
            controlOptionAI = -2;

            player2BodyIcon = game.add.sprite(game.world.width * .6 + 150, game.world.height * .5 - 50, 'Fighter');
            player2BodyIcon.scale.setTo(3.5, 3.5);
            player2BodyIcon.animations.add('idle', [1, 2], 5, true);
            player2BodyIcon.animations.add('kick', [6], 5, true);

            if (player2BodyIcon.animations) {
                player2BodyIcon.alpha = 1;
            }
        }

        else {
            // player2BodyIcon.kill();
        }

        if (!game.physics.arcade.overlap(player1Icon, LabIcon) && !game.physics.arcade.overlap(player1Icon, GothIcon) && !game.physics.arcade.overlap(player1Icon, BoxIcon)  && !game.physics.arcade.overlap(player1Icon, FighterIcon)) {
            player1BodyIcon.kill();
        }

        if (!game.physics.arcade.overlap(player2Icon, LabIcon) && !game.physics.arcade.overlap(player2Icon, GothIcon) && !game.physics.arcade.overlap(player2Icon, BoxIcon) && !game.physics.arcade.overlap(player2Icon, FighterIcon)&& !game.physics.arcade.overlap(player2Icon, computerIcon)) {
            player2BodyIcon.kill();
        }
    },
    onDragStart: function () {

        if (game.physics.arcade.overlap(player1Icon, LabIcon)) {
            charName1 = "";
            charSelected1 = false;
            LabIcon.tint = 0xffffff;

            if (player1BodyIcon.animations) {
                player1BodyIcon.alpha = .5;
            }
        }

        if (game.physics.arcade.overlap(player1Icon, GothIcon)) {
            charName1 = "";
            charSelected1 = false;
            GothIcon.tint = 0xffffff;

            if (player1BodyIcon.animations) {
                player1BodyIcon.alpha = .5;
            }
        }

        if (game.physics.arcade.overlap(player1Icon, BoxIcon)) {
            charName1 = "";
            charSelected1 = false;
            BoxIcon.tint = 0xffffff;

            if (player1BodyIcon.animations) {
                player1BodyIcon.alpha = .5;
            }
        }

        if (game.physics.arcade.overlap(player1Icon, FighterIcon)) {
            charName1 = "";
            charSelected1 = false;
            FighterIcon.tint = 0xffffff;

            if (player1BodyIcon.animations) {
                player1BodyIcon.alpha = .5;
            }
        }

        if (game.physics.arcade.overlap(player2Icon, LabIcon)) {
            charName2 = "";
            charSelected2 = false;
            LabIcon.tint = 0xffffff;

            if (player2BodyIcon.animations) {
                player2BodyIcon.alpha = .5;
            }
        }

        if (game.physics.arcade.overlap(player2Icon, BoxIcon)) {
            charName2 = "";
            charSelected2 = false;
            BoxIcon.tint = 0xffffff;

            if (player2BodyIcon.animations) {
                player2BodyIcon.alpha = .5;
            }
        }

        if (game.physics.arcade.overlap(player2Icon, FighterIcon)) {
            charName2 = "";
            charSelected2 = false;
            FighterIcon.tint = 0xffffff;

            if (player2BodyIcon.animations) {
                player2BodyIcon.alpha = .5;
            }
        }

        if (game.physics.arcade.overlap(player2Icon, GothIcon)) {
            charName2 = "";
            charSelected2 = false;
            GothIcon.tint = 0xffffff;

            if (player2BodyIcon.animations) {
                player2BodyIcon.alpha = .5;
            }
        }
    }
};
