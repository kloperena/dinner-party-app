var c;

function setup() {
   createCanvas(1000, 1000);
   c = color(0);
}

function draw() {
    // INCLUDE NOTES SECTION TITLE
    noStroke();
    fill(200);
    fill(0);
    text("WRITE NOTES HERE", 100, 50);
}

function mouseDragged() {
    strokeWeight(10);
    stroke(c);
    line(mouseX, mouseY, pmouseX, pmouseY);
}

function keyPressed() {
    if(key == "r") {
        c = color(255, 0, 0);
    }
}