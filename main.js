var game = new Phaser.Game(800,600, Phaser.CANVAS,'gamediv');

var spacefield;
var backgoundv;
var player;
var cursors;
var bullets;
var bulletTime = 0;
var fireButton;

var enemies;

var score = 0;
var scoretext;
var winText;



var first = {
	preload:function() {
		game.load.image('starfield', "assets/starfield.png");
		game.load.image('player', "assets/player.png");
		game.load.image('bullet', "assets/bullet.png");
		game.load.image('enemy', "assets/enemy.png");


	},

	create:function() {
		spacefield = game.add.tileSprite(0,0,800,600,'starfield');
		backgoundv = 4;

		timer = game.time.create(false);
		timer.start();

		player = game.add.sprite(100, 250, 'player');
		player.angle = 90;

		game.physics.enable(player,Phaser.Physics.ARCADE);

		cursors = game.input.keyboard.createCursorKeys();

		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(30,'bullet');
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 1);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);

		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		enemies = game.add.group();
		enemies.enableBody = true;
		enemies.physicsBodyType = Phaser.Physics.ARCADE;

		createEnemies();

		scoreText = game.add.text(0,550, 'Score:', {font: '32px Arial', fill :'#fff'});
		winText = game.add.text(game.world.centerX,game.world.centerY, 'Amazing! You Won!', {font: '32px Arial', fill :'#fff'});
		winText.visible = false;
	},

	update:function() {


		game.physics.arcade.overlap(bullets,enemies,collisionHandler, null, this);

		player.body.velocity.y = 0;
		spacefield.tilePosition.x -= backgoundv;

		if(cursors.up.isDown)
		{
			player.body.velocity.y = -350;
		}

		if(cursors.down.isDown)
		{
			player.body.velocity.y = 350;
		}

		if(fireButton.isDown) 
		{
			fireBullet();
		}

		

		if(score == 4000)
		{
			winText.visible = true;
			scoreText.visible = false;
		}
		scoreText.text = 'Score:' + score;
	}
}

function fireBullet() {
	if(game.time.now > bulletTime)
	{
		bullet = bullets.getFirstExists(false);

		if(bullet)
		{
			bullet.reset(player.x,player.y+35);
			bullet.body.velocity.x = 400;
			bulletTime = game.time.now + 200;
		}
	}
}

function createEnemies() {
	for(var x = 0; x < 4;x++) {
		for(var y = 0; y < 10; y++) {
			var enemy = enemies.create(x*40, y*50,'enemy');
			enemy.anchor.setTo(0.5,0.5);
		}
	}

	enemies.x = 500;
	enemies.y = 100;

	var tween = game.add.tween(enemies).to({y:50},1000,Phaser.Easing.Linear.None,true,0,1000,true);
	tween.onLoop.add(descend, this);
}

function descend() {
	enemies.x +=10;
}

function collisionHandler(bullet,enemy) {
	bullet.kill();
	enemy.kill();


	score +=100;
}

game.state.add('mainState',first);
game.state.start('mainState');