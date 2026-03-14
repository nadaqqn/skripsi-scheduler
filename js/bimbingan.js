// ===============================
// DATABASE LOCAL STORAGE
// ===============================

const form = document.getElementById("bimbinganForm");
const listContainer = document.getElementById("bimbinganList");

// Ambil data dari localStorage
function getBimbingan() {
  return JSON.parse(localStorage.getItem("bimbingan")) || [];
}

// Simpan ke localStorage
function saveBimbingan(data) {
  localStorage.setItem("bimbingan", JSON.stringify(data));
}

// Render ke UI
function renderBimbingan() {
  let data = getBimbingan();

  // ===============================
  // SORT BY TANGGAL
  // ===============================
  data.sort((a, b) => {
    if (isAscending) {
      return new Date(a.tanggal) - new Date(b.tanggal);
    } else {
      return new Date(b.tanggal) - new Date(a.tanggal);
    }
  });

  listContainer.innerHTML = "";

  data.forEach((item) => {
    const statusColor =
      item.status === "Selesai"
        ? "bg-green-100 text-green-600"
        : "bg-orange-100 text-orange-600";

    const card = `
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md flex flex-col transition">
    
    <div class="flex justify-between items-start">

      <h3 class="font-semibold text-gray-800 dark:text-white">
        ${item.topik}
      </h3>

      <div class="mt-auto flex justify-end pt-4 gap-3">

      <button onclick="goToDetail(${item.id})"
        class="text-gray-500 hover:text-teal-600 text-sm">
        <i class="fi fi-br-file-circle-info text-gray-600 dark:text-white"></i>
     
        </button>
        <button onclick="editBimbingan(${item.id})"
          class="text-blue-500 hover:text-blue-700 text-sm">
          <i class="fi fi-br-pencil text-gray-600 dark:text-white"></i>
        </button>

        <button onclick="deleteBimbingan(${item.id})"
          class="text-red-500 hover:text-red-700 text-sm">
          <i class="fi fi-br-trash-xmark"></i>
        </button>

        <span class="text-xs ${statusColor} px-3 py-1 rounded-full">
          ${item.status}
        </span>

      </div>
    </div>

    <div class="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-1">
      <p><i class="fi fi-br-chalkboard-user text-gray-600 dark:text-white"></i> ${item.dosen}</p>
      <p><i class="fi fi-br-calendar-days text-gray-600 dark:text-white"></i> ${item.tanggal}</p>
    </div>

  </div>
`;

    listContainer.innerHTML += card;
  });
}

sortToggle.addEventListener("click", () => {
  isAscending = !isAscending;

  // Ganti icon
  sortToggle.innerHTML = isAscending ? '<i class="fi fi-br-arrow-up text-gray-600 dark:text-white"></i>' : '<i class="fi fi-br-arrow-down text-gray-600 dark:text-white"></i>';

  renderBimbingan();
});

// ===============================
// TAMBAH DATA
// ===============================

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const tanggal = document.getElementById("tanggal").value;
  const topik = document.getElementById("topik").value;
  const dosen = document.getElementById("dosen").value;
  const status = document.getElementById("status").value;

  let data = getBimbingan();

  if (editId) {
    // MODE UPDATE
    data = data.map(item =>
      item.id === editId
        ? { ...item, tanggal, topik, dosen, status }
        : item
    );

    editId = null;
  } else {
    // MODE TAMBAH
    const newData = {
      id: Date.now(),
      tanggal,
      topik,
      dosen,
      status,
      catatan: [] 
    };

    data.push(newData);
  }

  saveBimbingan(data);
  renderBimbingan();

  form.reset();
  document.querySelector("#bimbinganModal h2").textContent = "Tambah Bimbingan";

  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

// ===============================
// HAPUS DATA
// ===============================
function deleteBimbingan(id) {
  let data = getBimbingan();

  data = data.filter(item => item.id !== id);

  saveBimbingan(data);
  renderBimbingan();
}

// ===============================
// PERBARUI DATA
// ===============================
let editId = null;

function editBimbingan(id) {
  const data = getBimbingan();
  const item = data.find(i => i.id === id);

  if (!item) return;

  // Isi form
  document.getElementById("tanggal").value = item.tanggal;
  document.getElementById("topik").value = item.topik;
  document.getElementById("dosen").value = item.dosen;
  document.getElementById("status").value = item.status;

  editId = id;

  // Ganti judul modal
  document.querySelector("#bimbinganModal h2").textContent = "Edit Bimbingan";

  // Buka modal
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

// ===============================
// PINDAH HALAMAN DETAIL
// ===============================
function goToDetail(id) {
  window.location.href = `detail.html?id=${id}`;
}

// Load pertama kali
renderBimbingan();
