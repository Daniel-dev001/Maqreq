const cuerpo = document.getElementById("cuerpoRegistros");
const buscarInput = document.getElementById("buscar");

function mostrarRegistros(filtrar = "") {
  db.collection("registros").orderBy("fecha", "desc").onSnapshot(snapshot => {
    cuerpo.innerHTML = "";

    snapshot.forEach(doc => {
      const r = doc.data();
      const textoBusqueda = (r.conductor + " " + r.obraLugar + " " + r.material).toLowerCase();

      if (textoBusqueda.includes(filtrar.toLowerCase())) {
        const fila = document.createElement("tr");

        fila.innerHTML = `
  <td>${r.fecha || "-"}</td>
  <td>${r.tipoVehiculo || "-"}</td>
  <td>${r.placa || "-"}</td>
  <td>${r.conductor || "-"}</td>
  <td>${r.material || "-"}</td>
  <td>${r.metros || "-"}</td>
  <td>${r.obraLugar || "-"}</td>
  <td><a href="ver_registro.html?id=${doc.id}">Ver</a></td>
  <td><button onclick="eliminarRegistro('${doc.id}')">🗑️</button></td>
  <td><a href="index.html?id=${doc.id}">✏️ Editar</a></td>
`;



        cuerpo.appendChild(fila);
      }
    });
  });
}

buscarInput.addEventListener("input", () => {
  mostrarRegistros(buscarInput.value);
});

mostrarRegistros();

document.getElementById("btnExportarExcel").addEventListener("click", async () => {
  const registros = [];

  const snapshot = await db.collection("registros").orderBy("fecha", "desc").get();
  snapshot.forEach(doc => {
    const r = doc.data();
    registros.push({
      Fecha: r.fecha || "-",
      Vehículo: r.tipoVehiculo || "-",
      Placa: r.placa || "-",
      Conductor: r.conductor || "-",
      "¿Trabajó?": r.trabajo || "-",
      "Hora inicio": r.horaInicio || "-",
      "Hora fin": r.horaFin || "-",
      "Total horas": r.totalHoras || 0,
      "Obra / Lugar": r.obraLugar || "-",
      Material: r.material || "-",
      Metros: r.metros || 0,
      "Gasto Combustible": r.gastoCombustible || 0,
      "Gasto Repuestos": r.gastoRepuestos || 0,
      "Gasto Mano de Obra": r.gastoManoObra || 0,
    });
  });

  const hoja = XLSX.utils.json_to_sheet(registros);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Registros");

  XLSX.writeFile(libro, "registros-maquinaria.xlsx");
});

function eliminarRegistro(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.")) {
    db.collection("registros").doc(id).delete()
      .then(() => {
        alert("✅ Registro eliminado correctamente");
      })
      .catch((error) => {
        console.error("Error al eliminar: ", error);
        alert("❌ Hubo un error al eliminar el registro");
      });
  }
}
