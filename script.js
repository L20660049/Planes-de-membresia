// Función para generar un canvas animado con formas (círculos, cuadrados, etc.)
var canvasShape = function(block_id, params) {
    // Verificar si se proporcionaron parámetros, de lo contrario, usar valores predeterminados
    if (typeof params === "object") {
        var radius_ball = params.size || 10;  // Tamaño del elemento (por defecto 10)
        var image = params.image || 'http://kidschemistry.ru/wp-content/themes/fary-chemical/images/smile/icon_cool.png'; // Imagen de fondo por defecto
        var speed_ball = params.speed || 10;  // Velocidad del elemento (por defecto 10)
        var total_ball = Math.min(params.number_of_item || 150, 250);  // Número máximo de elementos (máx. 250)
        var ballShape = params.shape || 'circle';  // Forma de los elementos (por defecto círculo)
    } else {
        var radius_ball = 10;
        var speed_ball = 10;
        var total_ball = 150;
        var ballShape = 'circle';
    }

    // Crear el elemento canvas y obtener el contexto 2D para dibujar
    var canvas_el = document.createElement('canvas');
    var canvas = document.getElementById(block_id).appendChild(canvas_el);
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;  // Configurar el ancho del canvas según el tamaño de la ventana
    canvas.height = window.innerHeight;  // Configurar la altura del canvas según el tamaño de la ventana
    var particles = [];  // Arreglo que contendrá las partículas (elementos)
    var color1 = params.color;  // Color de las partículas

    // Función para obtener un color aleatorio si no se proporciona uno
    function GetRandomColor() {
        if (typeof params.color === "string") {
            return color1;
        } else {
            var r = 0, g = 0, b = 0;
            // Asegura que los colores aleatorios no sean demasiado oscuros
            while (r < 100 && g < 100 && b < 100) {
                r = Math.floor(Math.random() * 256);
                g = Math.floor(Math.random() * 256);
                b = Math.floor(Math.random() * 256);
            }
            return "rgb(" + r + "," + g + "," + b + ")";
        }
    }

    // Constructor de partículas, que se posicionan aleatoriamente dentro del canvas
    var Particle = function(x, y) {
        this.x = x || canvas.width * Math.random();  // Posición X aleatoria
        this.y = y || canvas.height * Math.random();  // Posición Y aleatoria
        this.vx = speed_ball * Math.random() - 2;  // Velocidad en X
        this.vy = speed_ball * Math.random() - 2;  // Velocidad en Y
        this.Color = GetRandomColor();  // Color aleatorio o predefinido
    }

    // Método para dibujar cada partícula según su forma
    Particle.prototype.Draw = function(ctx) {
        ctx.fillStyle = this.Color;
        if (ballShape == 'circle') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius_ball, 0, 2 * Math.PI, false);  // Dibujar círculo
            ctx.fill();
        } else if (ballShape == 'square') {
            ctx.fillRect(this.x, this.y, radius_ball, radius_ball);  // Dibujar cuadrado
        } else if (ballShape == "triangle") {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + radius_ball, this.y + radius_ball);
            ctx.lineTo(this.x + radius_ball, this.y - radius_ball);
            ctx.closePath();
            ctx.fill();  // Dibujar triángulo
        } else if (ballShape == "hexa") {
            var side = 0;
            var size = radius_ball;
            var x = this.x;
            var y = this.y;
            ctx.beginPath();
            ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));
            for (side; side < 7; side++) {
                ctx.lineTo(x + size * Math.cos(side * 2 * Math.PI / 6), y + size * Math.sin(side * 2 * Math.PI / 6));
            }
            ctx.fill();  // Dibujar hexágono
        } else if (ballShape == "img") {
            var img = new Image();
            img.src = image;
            ctx.drawImage(img, this.x, this.y);  // Dibujar imagen
        }
    }

    // Método para actualizar la posición de cada partícula
    Particle.prototype.Update = function() {
        this.x += this.vx;
        this.y += this.vy;

        // Invertir la velocidad si las partículas tocan los bordes del canvas
        if (this.x < 0 || this.x > canvas.width)
            this.vx = -this.vx;

        if (this.y < 0 || this.y > canvas.height)
            this.vy = -this.vy;
    }

    // Función principal del bucle de animación
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpia el canvas en cada frame

        // Actualiza y dibuja cada partícula en cada frame
        for (var i = 0; i < particles.length; i++) {
            particles[i].Update();
            particles[i].Draw(ctx);
        }
        requestAnimationFrame(loop);  // Llama recursivamente a la función para mantener la animación
    }

    // Crear las partículas iniciales
    for (var i = 0; i < total_ball; i++)
        particles.push(new Particle());

    // Función para crear nuevas partículas al hacer clic o mover el mouse
    function drawCircle(event) {
        for (var i = 0; i < 2; i++) {
            var cursorX = event.pageX;
            var cursorY = event.pageY;
            particles.unshift(new Particle(cursorX, cursorY));  // Añade nuevas partículas al principio del array
            if (particles.length > 500) {
                particles.pop();  // Elimina partículas si hay demasiadas
            }
        }
    }

    // Configurar el área para que no tenga scroll y añadir eventos de mouse
    document.getElementById(block_id).style.overflow = 'hidden';
    document.getElementById(block_id).addEventListener('click', drawCircle);
    document.getElementById(block_id).addEventListener('mousemove', drawCircle);
    
    // Iniciar el bucle de animación
    loop();

    // Ajustar el tamaño del canvas al redimensionar la ventana
    window.onresize = function() {  
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

// Personalización de los parámetros para crear el efecto
canvasShape('canvas-shapes', {
    size: 6,  // Tamaño de los elementos
    speed: 5, // Velocidad de los elementos
    number_of_item: 600,  // Número máximo de elementos (máx. 250)
    shape: "circle",  // Forma de los elementos: "circle", "square", "triangle", "hexa"
    // color: '#008000',  // Color opcional para los elementos
    // image: "http://petitrocher.camp-atlantique.com/sites/default/files/styles/icone_titre_home_25_25/public/icone_smile_soleil_134.png",  // Imagen opcional para los elementos
});
