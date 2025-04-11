let player;
let floor;
let countCanyons = 7;
let countPlatforms = 0;
let countCheckpoints = 3;
let canyons = [];
let platforms = [];
let checkpoints = [];
let onGrounded; 
let basefloor = 200;
let offsetMovingCamera = 150;

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
        speedRun: 4,
        respawnPos: 150,
        drawPlayer: function()
        {
            fill(this.color);
            rect(this.x, this.y, this.width, this.height);
        },
        gravity: function(platform)
        {   
            if (!this.dead)
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
            }
        },
        jump: function()
        {
            this.speedGravity = 20;
            this.y -= this.speedGravity;
            this.grounded = false;
        },
        moveLeft: function() { this.x -= this.speedRun; },
        moveRight: function() { this.x += this.speedRun; },
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
                {
                    this.y -= this.speedGravity;
                }
                else
                {
                    this.y = height - floor.height - this.width;
                    this.x = this.respawnPos;
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
        },
        takeCheckpoint: function()
        {
            console.log(this.x);
            for(let i = 0; i < checkpoints.length; i++)
            {
                if (this.x > checkpoints[i].x && this.x < checkpoints[i].x + checkpoints[i].width && checkpoints[i].y)
                {
                    console.log("TakeCheck");
                    player.respawnPos = checkpoints[i].x - checkpoints[i].width/2;
                }

            }
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
                x: i * 100 + random(width),
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

    for (let i = 0; i < countCheckpoints; i++)
    {
        checkpoints.push(
            {
                x: (i + 1) * 500,
                y: basefloor,
                height:50,
                width:20,
                draw: function(){
                    fill("#AF2010");
                    rect(this.x, height - floor.height - this.height, this.width, this.height);
                }
            }
        )
    }
    onGrounded = floor;
}

function movingCamera(direction)
{
    for(let i = 0; i < canyons.length; i++)
    {
        if (!direction)
            canyons[i].x += player.speedRun;
        else
            canyons[i].x -= player.speedRun;
    }
    for(let i = 0; i < platforms.length; i++)
    {
        if (!direction)
            platforms[i].x += player.speedRun;
        else
            platforms[i].x -= player.speedRun;
    }
    for (let i = 0; i < checkpoints.length; i++)
    {
        if (!direction)
            checkpoints[i].x += player.speedRun;
        else
            checkpoints[i].x -= player.speedRun;
    }
    if (!direction)
        player.x += player.speedRun;
    else
        player.x -= player.speedRun;
}
function draw()
{
    background(255);
    floor.drawFloor();
    for(let i = 0; i < canyons.length; i++)
        canyons[i].drawCanyon();
    for(let i = 0; i < platforms.length; i++)
        platforms[i].draw();
    for(let i = 0; i < checkpoints.length; i++)
        checkpoints[i].draw();
    if (player.x > width - 2 * offsetMovingCamera)
        movingCamera(true);
    else if (player.x < offsetMovingCamera)
        movingCamera(false);
    player.drawPlayer();
    player.checkCanyon();
    player.checkOutside();
    //player.checkPlatform();
    player.takeCheckpoint();
    player.gravity(floor);
    player.movement();
}
