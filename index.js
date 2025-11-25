import express from "express";
// import fetch from "node-fetch";   // descomenta si usas node‑fetch
const app = express();
const port = 3004;

// Middleware para parsear JSON (solo una vez)
app.use(express.json());

// ----------------------------------------------------
//  /patente
// ----------------------------------------------------
app.post("/patente", (req, res) => {
  const data = req.body;
  const answer = req.body.userInput;

  console.log("Los datos son: ", data);
  console.log("Las respuestas son: ", answer);

  if (!answer) {
    return res.json({
      status: 1,
      status_message: "Ok",
      data: {
        actions: [
          { type: "sendText", text: "Indícanos el número de la patente" },
          { type: "teamDelegate", id_team: "25898" },
        ],
      },
    });
  }

  if (answer === "1234") {
    return res.json({
      status: 1,
      status_message: "Ok",
      data: {
        actions: [{ type: "sendText", text: "la fecha de caducidad es 02/03/2025" }],
      },
    });
  }

  // Si no coincide con nada, puedes devolver algo genérico
  res.json({ status: 1, status_message: "Ok", data: { actions: [] } });
});

// ----------------------------------------------------
//  /pedido
// ----------------------------------------------------
app.post("/pedido", (req, res) => {
  const pedido = req.body.inputs?.pedido;
  const respuestaCliente = req.body.userInput;   // <-- variable que faltaba

  console.log("Los datos son: ", respuestaCliente);

  if (!pedido) {
    return res.json({
      status: 1,
      status_message: "Ok",
      data: {
        actions: [
          {
            type: "sendText",
            text: "Ingresa el id de tu pedido. (Pedidos de prueba: 12345 y 67890)",
          },
          { type: "input" },
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

    if (respuesta == null) {
      return res.json({
        status: 1,
        status_message: "Ok",
        data: {
          actions: [
            { type: "sendText", text: "Te vamos a transferir al bot de nuevo" },
            { type: "teamDelegate", id_team: "5559" },
            { type: "input" },
          ],
        },
      });
    }

    if (respuesta === "si") {
      return res.json({
        status: 1,
        status_message: "Ok",
        data: {
          actions: [
            { type: "sendText", text: "Ingresa el id de tu pedido." },
            { type: "input" },
          ],
        },
      });
    }

    if (respuesta === "no") {
      return res.json({
        status: 1,
        status_message: "Ok",
        data: {
          actions: [
            { type: "sendText", text: "Ok, hasta pronto." },
            { type: "userDelegate", id_user: "36909" },
          ],
        },
      });
    }

    return res.json({
      status: 1,
      status_message: "Ok",
      data: {
        actions: [
          { type: "sendText", text: respuesta },
          {
            type: "sendText",
            text: "Quieres consultar otro pedido? (Escribe 'si' o 'no' sin comillas)",
          },
          { type: "input" },
        ],
      },
    });
  }

  res.json({ status: 1, status_message: "Ok", data: { actions: [] } });
});

// ----------------------------------------------------
//  /callback-timeout
// ----------------------------------------------------
app.post("/callback-timeout", (req, res) => {
  console.log("Info bot:", req.body.inputs);
  setTimeout(() => {
    console.log("¡Ha pasado 5 segundos!");
    res.json({
      status: 1,
      status_message: "Ok",
      data: {
        actions: [
          { type: "sendText", text: "Hola, te saludo desde un callback" },
          { type: "teamDelegate", id_team: "5559" },
        ],
      },
    });
  }, 5000);
});

// ----------------------------------------------------
//  /data-historial  (usando fetch en lugar de request)
// ----------------------------------------------------
app.post("/data-historial", async (req, res) => {
  const idConversacion = req.body.id;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      PageGearToken: process.env.PAGE_GEAR_TOKEN,
    },
    body: JSON.stringify({ id_conversacion: idConversacion }),
  };

  try {
    // const resp = await fetch("https://api.liveconnect.chat/prod/history/messages", options);
    // const body = await resp.json();
    // console.log("Mensajes obtenidos de la API:", body);
    // const resultado = obtenerMensajesTexto(body);
    // res.json({ datos: resultado });

    // *** Placeholder: el bloque anterior está comentado para que el ejemplo corra sin internet ***
    res.json({ datos: [] });
  } catch (error) {
    console.error("Error en la petición a la API:", error);
    res.status(500).json({ error: "Error en la petición a la API" });
  }

  function obtenerMensajesTexto(mensajes) {
    const data = mensajes.data;
    console.log("obteniendo mensajes desde:", data);
    const mensajesTexto = data.filter(
      (m) =>
        m.interno === 0 &&
        m.tipo === 0 &&
        (m.remitente_tipo === 0 || m.remitente_tipo === 1),
    );
    return mensajesTexto.map((m) => ({
      remitente: m.remitente_tipo === 0 ? "Agente" : "Contacto",
      mensaje: m.mensaje,
    }));
  }
});

// ----------------------------------------------------
//  /intranet
// ----------------------------------------------------
app.post("/intranet", (req, res) => {
  const data = req.body.inputs;
  const answer = req.body.userInput;
  const documento = data?.num_documento;

  console.log("Los datos son: ", data);
  console.log("Las respuestas son: ", answer);
  console.log("El documento es: ", documento);

  const mensaje = `👋 Bienvenido, Brian, ¿en qué te puedo ayudar hoy?

  1️⃣ 💵 Consultar mi salario
  2️⃣ 📦 Consultar mi inventario
  3️⃣ 🌴 Consultar mis vacaciones`;

  if (documento === "12345" || answer === "12345") {
    return res.json({
      status: 1,
      status_message: "Ok",
      data: { actions: [{ type: "sendText", text: mensaje }] },
    });
  }

  res.json({
    status: 1,
    status_message: "Ok",
    data: {
      actions: [
        {
          type: "sendText",
          text: "El documento no existe, por favor revisa e ingresalo de nuevo.",
        },
        { type: "input" },
      ],
    },
  });
});

// ----------------------------------------------------
//  /enviar-archivo
// ----------------------------------------------------
app.post("/enviar-archivo", (_, res) => {
  res.json({
    status: 1,
    status_message: "Ok",
    data: {
      actions: [
        { type: "sendText", text: "Te comparto un archivo pdf" },
        {
          type: "sendFile",
          url: "https://cdn.liveconnect.chat/421/lc/2/biblioteca/1815/60739/manual_de_conexion_canales_whatsapp_api_cloud_actualizado_ene25.pdf",
        },
      ],
    },
  });
});

// ----------------------------------------------------
//  /validar-licencia
// ----------------------------------------------------
app.post("/licencia", (req, res) => {
  try {
    // Busca la licencia en los dos posibles nodos
    const licencia = req.body.inputs?.licencia
                    || req.body.chat?.contacto?.licencia;

    if (!licencia) {
      throw new Error('El campo "licencia" es obligatorio');
    }

    const texto = licencia.toString().toLowerCase() === "1234"
      ? "Reservaremos tu cupo"
      : "Lo sentimos tu licencia parece estar vencida";

    const actions = [
      { type: "sendText", text: texto },
      {
        type: "sendFile",
        url: "https://cdn.liveconnect.chat/421/lc/2/biblioteca/1815/60739/manual_de_conexion_canales_whatsapp_api_cloud_actualizado_ene25.pdf",
      },
    ];

    res.json({ status: 1, status_message: "Ok", data: { actions } });
  } catch (error) {
    res.status(400).json({
      status: 0,
      status_message: "Error",
      error: error.message,
    });
  }
});