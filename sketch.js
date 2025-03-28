let player;
let floor;
let countCanyons = 2;
let countPlatforms = 2;
let canyons = [];
let platforms = [];
let onGrounded; 
let basefloor = 200;

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
        gravity: function(platform)
        {   
            if (this.speedGravity > -5)
                this.speedGravity--;
            if (this.y + this.height <= height - platform.y - platform.height)
            {
                this.y -= this.speedGravity;
                console.log("check", height - platform.y - platform.height);
            }
            else 
            {
                this.y = (height - platform.y - platform.height) - this.height + 2;
                this.grounded = true;
            }
        },
        jump: function()
        {
            this.speedGravity = 20;
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
        },
        checkPlatform: function()
        {
            let onPlatform = false;
            for(let i = 0; i < countPlatforms; i++)
            {
                if
                (
                    this.y + this.height <= platforms[i].y  && 
                    this.x + this.width >= platforms[i].x && 
                    this.x  <= platforms[i].x + platforms[i].width
                )
                {
                    
                    floor.height = platforms[i].y + platforms[i].height + 2;
                    console.log("Set floor", floor.height);
                    onPlatform = true;
                }
            }
            if(!onPlatform)
                floor.height = basefloor;
        }
    };

    floor = {
        y: 0,
        height: 200,
        drawHeight: 200,
        name:"floor",
        color: color(10, 100, 10),
        drawFloor: function()
        {
            fill(this.color);
            rect(0, height - this.drawHeight, width, this.drawHeight);
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

    for(let i = 0; i < countPlatforms; i++)
    {
        platforms.push(
            {
                x: random(width),
                name:"platform",
                y: 400,
                width: 80 + random(30),
                height: 20,
                color: color(100, 200, 100),
                draw: function()
                {
                    fill(this.color);
                    rect(this.x, height - this.height - this.y, this.width, this.height);
                }
            }
        )
    }
    onGrounded = floor;
}


function draw()
{
    background(255);
    floor.drawFloor();
    for(let i = 0; i < canyons.length; i++)
        canyons[i].drawCanyon();
    for(let i = 0; i < platforms.length; i++)
        platforms[i].draw();
    player.drawPlayer();
    player.checkCanyon();
    player.checkOutside();
    player.checkPlatform();
    player.gravity(floor);
    player.movement();
}
