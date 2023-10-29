const canvas = document.getElementById('eyeCanvas');
const ctx = canvas.getContext('2d');

let WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
canvas.width = WIDTH;
canvas.height = HEIGHT;

const WHITE = '#FFFFFF', BLACK = '#000000', SKIN_COLOR = '#ED781F';

let eyeball_radius = Math.min(WIDTH, HEIGHT) * 0.4;
let pupil_radius = eyeball_radius * 0.33;
let eyelid_thickness = 30, eyelid_gap = 2 * eyeball_radius, blink_speed = 10, blinking = false;
let pupil_x = WIDTH / 2, pupil_y = HEIGHT / 2, target_x = pupil_x, target_y = pupil_y, lerp_factor = 0.3;
let blink_counter = 0, move_counter = 0, blink_threshold = randInt(50, 300), move_threshold = randInt(200, 300);

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick_random_spot() {
    let angle = Math.random() * 2 * Math.PI;
    let distance = Math.random() * (eyeball_radius - pupil_radius);
    let x = (WIDTH / 2) + distance * Math.cos(angle);
    let y = (HEIGHT / 2) + distance * Math.sin(angle);
    return [x, y];
}

function ease(t) {
    return t * t * (3 - 2 * t);
}

function draw() {
    ctx.fillStyle = SKIN_COLOR;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    let t = ease(lerp_factor);
    pupil_x = (1 - t) * pupil_x + t * target_x;
    pupil_y = (1 - t) * pupil_y + t * target_y;

    blink_counter++;
    if (blink_counter >= blink_threshold) {
        blinking = true;
        blink_counter = 0;
        blink_threshold = randInt(50, 300);
    }

    move_counter++;
    if (move_counter >= move_threshold) {
        [target_x, target_y] = pick_random_spot();
        move_counter = 0;
        move_threshold = randInt(200, 300);
    }

    ctx.fillStyle = WHITE;
    ctx.beginPath();
    ctx.arc(WIDTH / 2, HEIGHT / 2, eyeball_radius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = BLACK;
    ctx.beginPath();
    ctx.arc(pupil_x, pupil_y, pupil_radius, 0, 2 * Math.PI);
    ctx.fill();

    if (blinking) {
        eyelid_gap -= blink_speed;
        if (eyelid_gap <= 0) {
            eyelid_gap = 0;
            blinking = false;
        }
    } else if (!blinking && eyelid_gap < 2 * eyeball_radius) {
        eyelid_gap += blink_speed;
    }

    let upper_eyelid_y = (HEIGHT / 2) - (eyelid_gap / 2);
    let lower_eyelid_y = (HEIGHT / 2) + (eyelid_gap / 2);
    ctx.fillStyle = SKIN_COLOR;
    ctx.fillRect(0, 0, WIDTH, upper_eyelid_y);
    ctx.fillRect(0, lower_eyelid_y, WIDTH, HEIGHT);

    requestAnimationFrame(draw);
}

function showModal() {
    document.getElementById('settingsModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('settingsModal').style.display = 'none';
}

function adjustPupilSpeed(value) {
    lerp_factor = parseFloat(value);
    document.getElementById('pupilSpeedValue').textContent = value;
}

function adjustBlinkSpeed(value) {
    blink_speed = parseInt(value, 10);
    document.getElementById('blinkSpeedValue').textContent = value;
}

// Adjust canvas size when window resizes
window.addEventListener('resize', () => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    eyeball_radius = Math.min(WIDTH, HEIGHT) * 0.3;
    pupil_radius = eyeball_radius * 0.33;
});

draw();