let player;
let floor;

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
        color: color(0, 0, 0),
        grounded: false,
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
            if ( this.grounded && keyIsDown(87))
                this.jump();
            if (keyIsDown(68))
                this.moveRight();
            if (keyIsDown(65))
                this.moveLeft();
        },
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
}

function draw()
{
    background(255);
    floor.drawFloor();
    player.drawPlayer();
    player.gravity(floor);
    player.movement();
}
