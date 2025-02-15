document.addEventListener("DOMContentLoaded", function() {
    cargarPreguntasFrecuentes(); // Cargar preguntas frecuentes al inicio
    obtenerPreguntasFrecuentes(); // Cargar preguntas frecuentes cada 5 segundos

    // Configurar eventos al cargar la página
    document.getElementById('send-btn').onclick = async function () {
        const pregunta = document.getElementById('pregunta').value;
        if (pregunta) {
            await enviarPregunta(pregunta); // Llama a enviarPregunta cuando se presiona el botón
        }
    };

    // Detectar el evento de Enter en el input de la pregunta
    document.getElementById('pregunta').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Evita el comportamiento por defecto del Enter
            document.getElementById('send-btn').click(); // Simula el clic del botón de enviar
        }
    });

    // Llama a la función de obtener preguntas frecuentes cada 5 segundos
    setInterval(obtenerPreguntasFrecuentes, 5000); // Actualiza cada 5 segundos
});

// Función para cargar preguntas frecuentes
function cargarPreguntasFrecuentes() {
    fetch('/preguntas_frecuentes')
        .then(response => response.json())
        .then(data => {
            const preguntasList = document.getElementById('preguntas-frecuentes');
            preguntasList.innerHTML = ''; // Limpiar la lista antes de agregar
            data.preguntas_frecuentes.forEach(pregunta => {
                agregarPreguntaFrecuente(pregunta);
            });
        })
        .catch(error => console.error('Error al cargar preguntas frecuentes:', error));
}

// Función para agregar una pregunta frecuente a la lista
function agregarPreguntaFrecuente(pregunta) {
    const preguntasList = document.getElementById('preguntas-frecuentes');
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item question-item'; // Asegúrate de incluir la clase question-item
    listItem.textContent = pregunta;

    // Agregar el evento click para enviar la pregunta
    listItem.addEventListener('click', function() {
        enviarPregunta(pregunta); // Enviar la pregunta al chatbot al hacer clic
    });

    preguntasList.appendChild(listItem);
}

// Función para enviar una pregunta al chatbot
async function enviarPregunta(pregunta) {
    const chatBox = document.getElementById('chat-box');

    // Mensaje del usuario
    chatBox.innerHTML += `<div class="message user-message"><p>${pregunta}</p></div>`;

    const response = await fetch('/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pregunta }),
    });
    const data = await response.json();

    // Procesar el formato del texto para convertir los asteriscos en negritas y listas
    let formattedResponse = data.respuesta
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convertir **texto** en <strong>texto</strong>
        .replace(/\* (.*?)\n/g, '<li>$1</li>') // Convertir * item en <li>item</li>
        .replace(/\n/g, '<br>'); // Convertir saltos de línea en <br>

    // Agregar el mensaje del chatbot con el formato HTML
    chatBox.innerHTML += `<div class="message"><p>${formattedResponse}</p></div>`;
    document.getElementById('pregunta').value = ''; // Limpiar el campo de entrada
    chatBox.scrollTop = chatBox.scrollHeight; // Desplazarse hacia abajo
}

// Función para mostrar u ocultar el flujo
function mostrarFlujo() {
    const canvaFlujo = document.getElementById('canva-flujo');

    // Alternar la clase 'mostrar' para mostrar u ocultar el iframe
    if (canvaFlujo.style.display === "none") {
        canvaFlujo.style.display = "block"; // Mostrar el iframe
        setTimeout(() => { // Esperar a que el display se haya establecido para aplicar opacidad
            canvaFlujo.style.opacity = "1"; // Cambiar a opacidad 1
        }, 10); // Timeout pequeño para asegurar que el navegador renderice el cambio de display antes de cambiar la opacidad
    } else {
        canvaFlujo.style.opacity = "0"; // Cambiar a opacidad 0
        setTimeout(() => { // Esperar a que la opacidad se haya establecido antes de ocultar el iframe
            canvaFlujo.style.display = "none"; // Ocultar el iframe
        }, 500); // Este tiempo debe coincidir con la duración de la transición de opacidad
    }
}
function mostrarDiagrama() {
    var diagrama = document.getElementById("diagramaTitulacion");
    
    // Cambiar entre mostrar u ocultar la imagen
    if (diagrama.style.display === "none") {
        diagrama.style.display = "block";  // Muestra la imagen
    } else {
        diagrama.style.display = "none";   // Oculta la imagen si ya está visible
    }
}
// Función para obtener preguntas frecuentes
function obtenerPreguntasFrecuentes() {
    fetch('/preguntas_frecuentes')
        .then(response => response.json())
        .then(data => {
            const preguntasFrecuentes = data.preguntas_frecuentes;
            const ul = document.getElementById('preguntas-frecuentes');
            ul.innerHTML = ''; // Limpiar la lista existente
            
            // Mostrar solo las primeras 5 preguntas
            preguntasFrecuentes.slice(0, 5).forEach(pregunta => {
                const li = document.createElement('li');
                li.className = 'list-group-item question-item';
                li.textContent = pregunta;
                li.onclick = () => {
                    // Al hacer clic en la pregunta, se puede enviar automáticamente
                    document.getElementById('pregunta').value = pregunta;
                    document.getElementById('send-btn').click();
                };
                ul.appendChild(li);
            });
        })
        .catch(error => console.error('Error al obtener preguntas frecuentes:', error));
}
