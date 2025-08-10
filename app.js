
const firebaseConfig = {
  apiKey: "AIzaSyBfbuFkD9IN-W2xiFnx64qFm0bYM6ZNs60",
  authDomain: "maqreq-9c564.firebaseapp.com",
  projectId: "maqreq-9c564",
  storageBucket: "maqreq-9c564.firebasestorage.app",
  messagingSenderId: "391512571959",
  appId: "1:391512571959:web:871ad89a4101b2996c7fb2"
};

const params = new URLSearchParams(window.location.search);
const registroId = params.get("id");

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registroForm");

  const tipoVehiculo = document.getElementById("tipoVehiculo");
  const volquetaExtra = document.getElementById("volquetaExtra");
  const material = document.getElementById("material");
  const materialOtro = document.getElementById("materialOtro");
  const horaInicio = document.getElementById("horaInicio");
  const horaFin = document.getElementById("horaFin");
  const totalHoras = document.getElementById("totalHoras");
  const placaInput = document.getElementById("placa");

  // Mostrar campos si es Volqueta
  tipoVehiculo.addEventListener("change", () => {
    volquetaExtra.style.display = tipoVehiculo.value === "Volqueta" ? "block" : "none";
  });

  // Mostrar input si el material es "Otros"
  material?.addEventListener("change", () => {
    materialOtro.style.display = material.value === "Otros" ? "block" : "none";
  });

  // Calcular automáticamente horas trabajadas
  function calcularHoras() {
    if (horaInicio.value && horaFin.value) {
      const [hiH, hiM] = horaInicio.value.split(":").map(Number);
      const [hfH, hfM] = horaFin.value.split(":").map(Number);
      const inicio = hiH * 60 + hiM;
      const fin = hfH * 60 + hfM;
      const total = (fin - inicio) / 60;
      totalHoras.value = total >= 0 ? total.toFixed(2) : "";
    }
  }

  horaInicio.addEventListener("change", calcularHoras);
  horaFin.addEventListener("change", calcularHoras);

  // Si hay ID, cargar datos para edición
  if (registroId) {
    db.collection("registros").doc(registroId).get().then((doc) => {
      if (doc.exists) {
        const r = doc.data();

        tipoVehiculo.value = r.tipoVehiculo || "";
        document.getElementById("conductor").value = r.conductor || "";
        document.getElementById("fecha").value = r.fecha || "";

        const radio = document.querySelector(`input[name="trabajo"][value="${r.trabajo}"]`);
        if (radio) radio.checked = true;

        horaInicio.value = r.horaInicio || "";
        horaFin.value = r.horaFin || "";
        totalHoras.value = r.totalHoras || "";
        document.getElementById("obraLugar").value = r.obraLugar || "";
        document.getElementById("gastoCombustible").value = r.gastoCombustible || 0;
        document.getElementById("gastoRepuestos").value = r.gastoRepuestos || 0;
        document.getElementById("gastoManoObra").value = r.gastoManoObra || 0;
        placaInput.value = r.placa || "";

        if (r.tipoVehiculo === "Volqueta") {
          volquetaExtra.style.display = "block";
          material.value = ["Arena", "Triturado"].includes(r.material) ? r.material : "Otros";
          if (r.material !== "Arena" && r.material !== "Triturado") {
            materialOtro.style.display = "block";
            materialOtro.value = r.material;
          }
          document.getElementById("metros").value = r.metros || 0;
        }
      }
    });
  }

  const radioTrabajoSi = document.querySelector('input[name="trabajo"][value="Sí"]');
const radioTrabajoNo = document.querySelector('input[name="trabajo"][value="No"]');

function actualizarRequeridosPorTrabajo() {
  const trabajoSi = document.querySelector('input[name="trabajo"]:checked')?.value === "Sí";

  document.getElementById("horaInicio").required = trabajoSi;
  document.getElementById("horaFin").required = trabajoSi;
  document.getElementById("totalHoras").required = trabajoSi;
  document.getElementById("obraLugar").required = trabajoSi;
}

// Al cargar si ya hay valor seleccionado
actualizarRequeridosPorTrabajo();

// Escuchar cambios en radios
radioTrabajoSi?.addEventListener("change", actualizarRequeridosPorTrabajo);
radioTrabajoNo?.addEventListener("change", actualizarRequeridosPorTrabajo);


  // Guardar datos
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tipoVehiculo = document.getElementById("tipoVehiculo").value;
    const conductor = document.getElementById("conductor").value;
    const fecha = document.getElementById("fecha").value;
    const trabajo = document.querySelector('input[name="trabajo"]:checked')?.value || "No";
    const horaInicioVal = document.getElementById("horaInicio").value;
    const horaFinVal = document.getElementById("horaFin").value;
    const totalHorasVal = parseFloat(document.getElementById("totalHoras").value || 0);
    const obraLugar = document.getElementById("obraLugar").value;
    const gastoCombustible = parseFloat(document.getElementById("gastoCombustible")?.value || 0);
    const gastoRepuestos = parseFloat(document.getElementById("gastoRepuestos")?.value || 0);
    const gastoManoObra = parseFloat(document.getElementById("gastoManoObra")?.value || 0);
    const placa = placaInput ? placaInput.value : "";

    let materialFinal = "";
    let metros = 0;

    if (tipoVehiculo === "Volqueta") {
      const matValue = material.value;
      materialFinal = matValue === "Otros" ? materialOtro.value : matValue;
      metros = parseFloat(document.getElementById("metros")?.value || 0);
    }

    const registro = {
      tipoVehiculo,
      placa,
      conductor,
      fecha,
      trabajo,
      horaInicio: horaInicioVal,
      horaFin: horaFinVal,
      totalHoras: totalHorasVal,
      obraLugar,
      gastoCombustible,
      gastoRepuestos,
      gastoManoObra,
      material: materialFinal,
      metros
    };

    try {
      if (registroId) {
        await db.collection("registros").doc(registroId).update(registro);
        alert("✅ Registro actualizado correctamente");
      } else {
        await db.collection("registros").add(registro);
        alert("✅ Registro creado correctamente");
      }

      window.location.href = "registros.html";
    } catch (error) {
      console.error("❌ Error al guardar registro:", error);
      alert("❌ Hubo un error al guardar");
    }
  });
});
