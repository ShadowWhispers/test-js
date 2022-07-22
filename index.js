const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5

//Create Background
const background = new Sprite({
	position: {
		x:0,
		y:0
	},
	imageSrc: './img/background.png'
})

//Create Background animation:
const shop = new Sprite({
	position: {
		x: 750,
		y: 300
	},
	imageSrc: './img/shop.png',
	scale: 2.2,
	frameMax: 6

})

//create player--------------------------------------------------------------------
const player = new Fighter({
	position:{
		x:100,
		y:0
	},
	velocity: {
		x:0,
		y:0
	},
	color: 'red',
	offset: {
		x: 0,
		y: 0
	}, 
	imageSrc: './img/p1/Sprites/Idle.png',	
	frameMax: 8,
	scale: 2.5,
	offset: {
		x: 215,
		y: 157
	},
	sprites: {
		idle: {
			imageSrc: './img/p1/Sprites/Idle.png',
			frameMax: 8 
		},
		run: {
			imageSrc: './img/p1/Sprites/Run.png',
			frameMax: 8
		},
		jump: {
			imageSrc: './img/p1/Sprites/Jump.png',
			frameMax: 2
		},
		fall: {
			imageSrc: './img/p1/Sprites/Fall.png',
			frameMax: 2
		},
		attack1: {
			imageSrc: './img/p1/Sprites/Attack1.png',
			frameMax: 6
		},
		takeHit: {
			imageSrc: './img/p1/Sprites/Take Hit.png',
			frameMax: 4
		},
		death: {
			imageSrc: './img/p1/Sprites/Death.png',
			frameMax: 6
		}
	},
	attackBox: {
		offset: {
			x:80,
			y:40
		},
		width: 180,
		height: 50
	}
})

//create enemy---------------------------------------------------------------------
const enemy = new Fighter({
	position:{
		x:900,
		y:100
	},
	velocity: {
		x:0,
		y:0
	},
	color: 'blue',
	offset: {
		x: 50,
		y: 0
	}, 
	imageSrc: './img/p2/Sprites/Idle.png',
	scale: 2.5,
	frameMax: 4,
	offset: {
		x: 215,
		y: 170
	},
	sprites: {
		idle: {
			imageSrc: './img/p2/Sprites/Idle.png',
			frameMax: 4 
		},
		run: {
			imageSrc: './img/p2/Sprites/Run.png',
			frameMax: 8
		},
		jump: {
			imageSrc: './img/p2/Sprites/Jump.png',
			frameMax: 2
		},
		fall: {
			imageSrc: './img/p2/Sprites/Fall.png',
			frameMax: 2
		},
		attack1: {
			imageSrc: './img/p2/Sprites/Attack1.png',
			frameMax: 4
		},
		takeHit: {
			imageSrc: './img/p2/Sprites/Take hit.png',
			frameMax: 3
		},
		death: {
			imageSrc: './img/p2/Sprites/Death.png',
			frameMax: 7
		}
	},
	attackBox: {
		offset: {
			x:-170,
			y:40
		},
		width: 180,
		height: 50
	}
})

//possible key pressed-------------------------------------------------------------
const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	w: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	},
	ArrowUp: {
		pressed: false
	}
}

decreaseTimer()

//Animation------------------------------------------------------------------------
function animate() {
	window.requestAnimationFrame(animate)
	c.fillStyle = "black"
	c.fillRect(0, 0, canvas.width, canvas.height)
	background.update()
	shop.update()
	c.fillStyle = 'rgba(255, 255, 255, 0.12)'
	c.fillRect(0, 0, canvas.width, canvas.height)
	player.update()
	enemy.update()

	player.velocity.x = 0
	enemy.velocity.x = 0

	//movement p1-------------------------------------------------------------------
		//running
	if (keys.a.pressed && player.lastKey === 'a'){
		player.velocity.x = -3
		player.switchSprite('run')
	} else if (keys.d.pressed && player.lastKey === 'd'){
		player.velocity.x = 3
		player.switchSprite('run')
	} else {
		player.switchSprite('idle')
	}
		//jumping & falling
	if (player.velocity.y  < 0){
		player.switchSprite('jump')
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall')
	}
	

	//movement p2--------------------------------------------------------------------
		//running
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
		enemy.velocity.x = -3
		enemy.switchSprite('run')
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
		enemy.velocity.x = 3
		enemy.switchSprite('run')
	} else {	
		enemy.switchSprite('idle')
	}
		//jumping and falling
	if (enemy.velocity.y  < 0){
		enemy.switchSprite('jump')
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall')
	}

	//hit box collision--------------------------------------------------------------
	//player hitting enemy
	if (player.attackBox.position.x + player.attackBox.width >= enemy.position.x && 
		player.attackBox.position.x <= enemy.position.x + enemy.width &&
		player.attackBox.position.y + player.attackBox.height >= enemy.position.y &&
		player.attackBox.position.y <= enemy.position.y + enemy.height &&
		player.isAttacking && player.frameCurrent === 4)
	{
		enemy.takeHit()
		player.isAttacking = false		
		gsap.to('#enemyHealth', {
			width: enemy.health + '%'
		})
	}

	//enemy hitting player
	if (enemy.attackBox.position.x + enemy.attackBox.width >= player.position.x && 
		enemy.attackBox.position.x <= player.position.x + player.width &&
		enemy.attackBox.position.y + enemy.attackBox.height >= player.position.y &&
		enemy.attackBox.position.y <= player.position.y + player.height &&
		enemy.isAttacking && enemy.frameCurrent === 2)
	{
		player.takeHit()
		enemy.isAttacking = false
		gsap.to('#playerHealth', {
			width: player.health + '%'
		})
	}

	//if attack missed
	if (player.isAttacking && player.frameCurrent === 4) {
		player.isAttacking = false
	}
	if (enemy.isAttacking && enemy.frameCurrent === 2) {
		enemy.isAttacking = false
	}

	//end game: ---------------------------------------------------------------------
	if (enemy.health <= 0 || player.health <= 0)
	{
		determineWinner({player, enemy, timerId})
	}
}

animate()

//movement---------------------------------------------------------------------------
window.addEventListener('keydown', (event) => {
	if (!player.dead) {
		switch (event.key) {
			case 'd':
				keys.d.pressed = true
				player.lastKey = 'd'
				break
			case 'a':
				keys.a.pressed = true
				player.lastKey = 'a'
				break
			case 'w':
				player.velocity.y = -15
				break
			case ' ':
				player.attack()
				break
		}
	}

	if (!enemy.dead) {
		switch (event.key) {
			case 'ArrowRight':
				keys.ArrowRight.pressed = true
				enemy.lastKey = 'ArrowRight'
				break
			case 'ArrowLeft':
				keys.ArrowLeft.pressed = true
				enemy.lastKey = 'ArrowLeft'
				break
			case 'ArrowUp':
				enemy.velocity.y = -15
				break
			case 'ArrowDown':
				enemy.attack()
				break
		}
	}
})

window.addEventListener('keyup', (event) => {
	//p1 key
	switch (event.key) {
		case 'd':
			keys.d.pressed = false
			break
		case 'a':
			keys.a.pressed = false
			break
	}	

	//p2 key
	switch (event.key) {
		case 'ArrowRight':
			keys.ArrowRight.pressed = false
			break
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false
			break
	}
})