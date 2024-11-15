let player;
let floor;
let countCanyons = 2;
let canyons = [];

function setup()
{
    createCanvas(800, 800);
    player = 
    {
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        speedGravity: -5,
        color: color(200, 150, 0),
        grounded: false,
        dead: false,
        drawPlayer: function()
        {
            fill(this.color);
            rect(this.x, this.y, this.width, this.height);
        },
        gravity: function(floor)
        {
            if (this.speedGravity > -5)
                this.speedGravity--;
            if (this.y + this.height < height - floor.height)
                this.y -= this.speedGravity;
            else 
            {
                this.grounded = true;
            }
        },
        jump: function()
        {
            this.speedGravity = 15;
            this.y -= this.speedGravity;
            this.grounded = false;
        },
        moveLeft: function() { this.x -= 4; },
        moveRight: function() { this.x += 4; },
        movement: function() 
        {
            if (!this.dead)
            {
                if ( this.grounded && keyIsDown(87))
                    this.jump();
                if (keyIsDown(68))
                    this.moveRight();
                if (keyIsDown(65))
                    this.moveLeft();
            }
        },
        deadAnimation: function()
        {
            if (this.dead)
            {
                if (this.y < height)
                    this.y -= this.speedGravity;
                else
                {
                    this.y = height - floor.height - this.width;
                    this.x = 100;
                    this.grounded = true;
                    this.dead = false;
                }
            }
        },
        checkOutside: function() {
            if (this.x < -10)
                this.x = width - this.width + 10;
            if (this.x > width + 10)
                this.x = -10;
        },
        checkCanyon: function() {
            for(let i = 0; i < canyons.length; i++)
            {
                if
                (
                    this.y + this.height >= height - floor.height && 
                    this.x >= canyons[i].x && 
                    this.x + this.width <= canyons[i].x + canyons[i].width
                )
                {
                    this.grounded = false;   
                    this.dead = true;
                    this.deadAnimation();   
                }
            }
        }
    };

    floor = {
        height: 200,
        color: color(10, 100, 10),
        drawFloor: function()
        {
            fill(this.color);
            rect(0, height - this.height, width, this.height);
        },
    }  

    for(let i = 0; i < countCanyons; i++)
    {
        canyons.push
        (
            {
                x: 250 + i * 400,
                y: height-floor.height,
                width: 100,
                drawCanyon: function()
                {
                    fill(100);
                    rect(this.x, this.y, this.width, floor.height);
                }
            }
        );
    }
}


function draw()
{
    background(255);
    floor.drawFloor();
    for(let i = 0; i < canyons.length; i++)
        canyons[i].drawCanyon();
    player.drawPlayer();
    player.checkCanyon();
    player.checkOutside();
    player.gravity(floor);
    player.movement();
}
