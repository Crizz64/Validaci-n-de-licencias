const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.post("/", (req, res) => {
const input = req.body;
console.log(input);
const response = {
status: 1,
status_message: "Ok",
data: {
actions: [
{
type: "sendText",
text: "Hola mundo!",
},
],
},
};
res.json(response);
});

app.listen(port, () => {
console.log(`Servidor escuchando en puerto ${port}`);
});

// test pedidos

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
text: "Pedido no encontrado, revisalo e ingresalo de nuevo",
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