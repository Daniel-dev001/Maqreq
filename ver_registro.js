const firebaseConfig = {
  apiKey: "AIzaSyBfbuFkD9IN-W2xiFnx64qFm0bYM6ZNs60",
  authDomain: "maqreq-9c564.firebaseapp.com",
  projectId: "maqreq-9c564",
  storageBucket: "maqreq-9c564.firebasestorage.app",
  messagingSenderId: "391512571959",
  appId: "1:391512571959:web:871ad89a4101b2996c7fb2"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const contenedor = document.getElementById("contenidoRegistro");

if (!id) {
  contenedor.innerHTML = "<p>Error: No se proporcionó ID.</p>";
} else {
  db.collection("registros").doc(id).get().then(doc => {
    if (!doc.exists) {
      contenedor.innerHTML = "<p>Registro no encontrado.</p>";
      return;
    }

    const r = doc.data();
    contenedor.innerHTML = `
      <p><strong>Tipo de vehículo:</strong> ${r.tipoVehiculo || "-"}</p>
      <p><strong>Placa:</strong> ${r.placa || "-"}</p>
      <p><strong>Conductor:</strong> ${r.conductor || "-"}</p>
      <p><strong>Fecha:</strong> ${r.fecha || "-"}</p>
      <p><strong>¿Trabajó?:</strong> ${r.trabajo || "-"}</p>
      <p><strong>Hora de inicio:</strong> ${r.horaInicio || "-"}</p>
      <p><strong>Hora de fin:</strong> ${r.horaFin || "-"}</p>
      <p><strong>Total horas:</strong> ${r.totalHoras || "-"}</p>
      <p><strong>Obra / Lugar:</strong> ${r.obraLugar || "-"}</p>
      <p><strong>Gasto en combustible:</strong> $${r.gastoCombustible || 0}</p>
      <p><strong>Gasto en repuestos:</strong> $${r.gastoRepuestos || 0}</p>
      <p><strong>Gasto en mano de obra:</strong> $${r.gastoManoObra || 0}</p>
      <p><strong>Material:</strong> ${r.material || "-"}</p>
      <p><strong>Metros:</strong> ${r.metros || 0}</p>
    `;
  }).catch(error => {
    contenedor.innerHTML = `<p>Error al cargar registro: ${error.message}</p>`;
  });
}
