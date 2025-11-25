const express = require("express");
const request = require("request");
const app = express();
const port = 3000;

app.use(express.json());
app.post("/patente", (req, res) => {
  let data = req.body;
  let answer = req.body.userInput;
  // let nombre = data.nombre

  //Mostrar en consola
  console.log("Los datos son: ", data);
  console.log("Las respuestas son: ", answer);
  if (!answer) {
    res.json({
      status: 1,
      status_message: "Ok",
      data: {
        actions: [
          {
            type: "sendText",
            text: "Indícanos el número de la patente",
          },
          {
            type: "teamDelegate",
            id_team: "25898",
          },
        ],
      },
    });
  }

  if (answer == "1234") {
    res.json({
      status: 1,
      status_message: "Ok",
      data: {
        actions: [
          {
            type: "sendText",
            text: "la fecha de caducidad es 02/03/2025",
          },
        ],
      },
    });
  }
});

app.post("/pedido", (req, res) => {
  let data = req.body.inputs;
  let respuestaCliente = req.body.userInput;
  let pedido = req.body.inputs.pedido;

  //Mostrar en consola
  console.log("Los datos son: ", respuestaCliente);
  if (!pedido) {
    res.json({
      status: 1,
      status_message: "Ok",
      data: {
        actions: [
          {
            type: "sendText",
            text: "Ingresa el id de tu pedido. (Pedidos de prueba: 12345 y 67890)",
          },
          {
            type: "input",
          },
        ],
      },
    });
  }
  let respuesta;
  if (respuestaCliente || pedido) {
    switch (respuestaCliente || pedido) {
      case "12345":
        respuesta = "El pedido 12345 está en camino";
        break;
      case "67890":
        respuesta = "El pedido 67890 está en camino";
        break;
      case "si":
        respuesta = "si";
        break;
      case "no":
        respuesta = "no";
        break;
      default:
        respuesta = null;
    }
    // En caso de no encontrar el pedido
    if (respuesta == null) {
      res.json({
        status: 1,
        status_message: "Ok",
        data: {
          actions: [
            {
              type: "sendText",
              text: "Te vamos a transferir al bot de nuevo",
            },
            {
              type: "teamDelegate",
              id_team: "5559",
            },
            {
              type: "input",
            },
          ],
        },
      });
    } else if (respuesta == "si") {
      res.json({
        status: 1,
        status_message: "Ok",
        data: {
          actions: [
            {
              type: "sendText",
              text: "Ingresa el id de tu pedido.",
            },
            {
              type: "input",
            },
          ],
        },
      });
    } else if (respuesta == "no") {
      res.json({
        status: 1,
        status_message: "Ok",
        data: {
          actions: [
            {
              type: "sendText",
              text: "Ok, hasta pronto.",
            },
            {
              type: "userDelegate",
              id_user: "36909",
            },
          ],
        },
      });
    } else {
      res.json({
        status: 1,
        status_message: "Ok",
        data: {
          actions: [
            {
              type: "sendText",
              text: respuesta,
            },
            {
              type: "sendText",
              text: "Quieres consultar otro pedido? (Escribe 'si' o 'no' sin comillas)",
            },
            {
              type: "input",
            },
          ],
        },
      });
    }
  }
});

app.post("/callback-timeout", (req, res) => {
  console.log("Info bot:", req.body.inputs);
  try {
    setTimeout(() => {
      console.log("¡Ha pasado 5 segundos!");
      res.json({
        status: 1,
        status_message: "Ok",
        data: {
          actions: [
            {
              type: "sendText",
              text: "Hola, te saludo desde un callback",
            },
            {
              type: "teamDelegate",
              id_team: "5559",
            },
          ],
        },
      });
    }, 5000);
  } catch (error) {
    console.log("Error en el callback", error);
  }
});

app.post("/data-historial", (req, res) => {
  const idConversacion = req.body.id; // Obtener el id de la conversación del cuerpo de la solicitud

  // Opciones de la solicitud a la API
  const options = {
    method: "POST",
    url: "https://api.liveconnect.chat/prod/history/messages",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      PageGearToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjX2tleSI6IjI0MDc3MmNhNmUzYmE4OWI3YmMxNzU4OWY0MDVkMmY2IiwiaWRfcGdlIjo0MjEsImlkX2N1ZW50YSI6MjE1MCwibm9tYnJlIjoiTGl2ZUNvbm5lY3TCriAoRGVtbykiLCJpYXQiOjE3MjY2NjQ4MTYsImV4cCI6MTcyNjY5MzYxNn0.TOCnD7vdUQgzSZEaYatJAIUIXNsV4vE2uccmvA583J0",
    },
    body: { id_conversacion: idConversacion }, // Enviamos el id en el cuerpo
    json: true,
  };

  // Hacer la solicitud a la API
  request(options, function (error, response, body) {
    if (error) {
      console.error("Error en la petición a la API:", error);
      return res.status(500).json({ error: "Error en la petición a la API" });
    }

    // Procesar los mensajes obtenidos de la API
    console.log("Mensajes obtenidos de la API:", body);
    const resultado = obtenerMensajesTexto(body);

    // Devolver el resultado procesado como respuesta
    res.json({ datos: resultado });
  });

  // Función para procesar los mensajes de tipo texto
  function obtenerMensajesTexto(mensajes) {
    const data = mensajes.data;
    console.log("obteniendo mensajes desde:", data);
    // Filtrar solo los mensajes públicos (interno: 0) y de tipo texto (tipo: 0)
    const mensajesTexto = data.filter(
      (mensaje) =>
        mensaje.interno === 0 &&
        mensaje.tipo === 0 &&
        (mensaje.remitente_tipo === 0 || mensaje.remitente_tipo === 1),
    );

    // Mapear los mensajes para devolver solo remitente y mensaje
    const mensajesEtiquetados = mensajesTexto.map((mensaje) => {
      let remitente = mensaje.remitente_tipo === 0 ? "Agente" : "Contacto";
      return {
        remitente,
        mensaje: mensaje.mensaje,
      };
    });

    return mensajesEtiquetados;
  }
});

app.post("/intranet", (req, res) => {
  let data = req.body.inputs;
  let answer = req.body.userInput;
  let documento = data.num_documento;

  //Mostrar en consola
  console.log("Los datos son: ", data);
  console.log("Las respuestas son: ", answer);
  console.log("El documento es: ", documento);

  const mensaje = `👋 Bienvenido, Brian, ¿en qué te puedo ayudar hoy?

  1️⃣ 💵 Consultar mi salario
  2️⃣ 📦 Consultar mi inventario
  3️⃣ 🌴 Consultar mis vacaciones`;

  if (documento == "12345" || answer == "12345") {
    res.json({
      status: 1,
      status_message: "Ok",
      data: {
        actions: [
          {
            type: "sendText",
            text: mensaje,
          },
        ],
      },
    });
  } else {
    res.json({
      status: 1,
      status_message: "Ok",
      data: {
        actions: [
          {
            type: "sendText",
            text: "El documento no existe, por favor revisa e ingresalo de nuevo.",
          },
          {
            type: "input",
          },
        ],
      },
    });
  }
});

app.post("/enviar-archivo", (req, res) => {
  res.json({
    status: 1,
    status_message: "Ok",
    data: {
      actions: [
        {
          type: "sendText",
          text: "Te comparto un archivo pdf",
        },
        {
          type: "sendFile",
          url: "https://cdn.liveconnect.chat/421/lc/2/biblioteca/1815/60739/manual_de_conexion_canales_whatsapp_api_cloud_actualizado_ene25.pdf",
        },
      ],
    },
  });
});


// Middleware para parsear JSON (debe ir antes de los routes)
app.use(express.json())

app.post('/validar-licencia', (req, res) => {
  try {
    // 1️⃣ Validación del campo "licencia"
    if (!req.body?.licencia) {
      throw new Error('El campo "licencia" es obligatorio')
    }

    // 2️⃣ Normalizamos el valor a cadena y a lower‑case
    const licencia = req.body.licencia.toString().toLowerCase()

    // 3️⃣ Construimos el arreglo de acciones según la condición
    const actions = [
      {
        type: "sendText",
        text:
          licencia === '1234'
            ? 'Reservaremos tu cupo'
            : 'Lo sentimos tu licencia parece estar vencida',
      },
      {
        type: "sendFile",
        url: "https://cdn.liveconnect.chat/421/lc/2/biblioteca/1815/60739/manual_de_conexion_canales_whatsapp_api_cloud_actualizado_ene25.pdf",
      },
    ]

    // 4️⃣ Respuesta exitosa
    res.json({
      status: 1,
      status_message: 'Ok',
      data: { actions },
    })
  } catch (error) {
    // 5️⃣ Manejo de errores
    res.status(400).json({
      status: 0,
      status_message: 'Error',
      error: error.message,
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})