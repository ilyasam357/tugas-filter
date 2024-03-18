let productDiv = document.querySelector(".product");

function createCardElement(element) {
  let cardDiv = document.createElement("div");
  cardDiv.className = "productItems";

  let cardImage = document.createElement("img");
  cardImage.className = "image";
  cardImage.src = element.image_thumbnail;
  cardImage.alt = element.title;

  let titleElement = document.createElement("h3");
  titleElement.textContent = element.judul_paket;

  let jadwal = document.createElement("p");
  jadwal.textContent = new Date(
    element.jadwal_keberangkatan
  ).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let priceElement = document.createElement("p");
  let formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(element.price_quad_basic);
  priceElement.textContent = `Price: ${formattedPrice}`;

  cardDiv.appendChild(cardImage);
  cardDiv.appendChild(titleElement);
  cardDiv.appendChild(jadwal);
  cardDiv.appendChild(priceElement);

  return cardDiv;
}

function showProduct() {
  // ambil data dari api
  let getData = async () => {
    const response = await fetch(
      "https://mock-api-pribadi-malik.vercel.app/api/mosleme-travel/packages"
    );
    finalProduct = await response.json();
    finalProduct.cards.forEach((element) => {
      let cardDiv = createCardElement(element);
      productDiv.appendChild(cardDiv);
    });
  };
  getData();
  // end ambil data

  /* filter paket */
  // Function to filter and display the data based on the selected keyword
  function filterPaket(keyword) {
    // Filter the data based on the keyword
    const filteredPaket = finalProduct.cards.filter((element) => {
      return element.judul_paket.toLowerCase().includes(keyword);
    });

    // Clear the UI and display the filtered data
    productDiv.innerHTML = "";
    filteredPaket.forEach((element) => {
      const cardDiv = createCardElement(element);
      productDiv.appendChild(cardDiv);
    });
  }

  // Add event listeners for the filter buttons
  document.addEventListener("click", function (event) {
    if (event.target.matches("#allButton")) {
      filterPaket("");
    } else if (event.target.matches("#hajiButton")) {
      filterPaket("haji");
    } else if (event.target.matches("#umrahButton")) {
      filterPaket("umrah");
    } else if (event.target.matches("#tourButton")) {
      filterPaket("tour");
    }
  });
  /* end filter paket */

  /* filter harga */
  // Fungsi untuk menampilkan data berdasarkan filter harga
  function filterHarga(filterFunction) {
    const filterData = finalProduct.cards.filter(filterFunction);
    productDiv.innerHTML = "";
    filterData.forEach((element) => {
      let cardDiv = createCardElement(element);
      productDiv.appendChild(cardDiv);
    });
  }

  // Mendengarkan input dari pengguna
  document.addEventListener("click", function (event) {
    if (event.target.matches("#hargaRendahButton")) {
      filterHarga((element) => element.price_quad_basic < 30000000);
    } else if (event.target.matches("#hargaTertinggiButton")) {
      filterHarga((element) => element.price_quad_basic > 40000000);
    }
  });
  /* end filter harga */

  /* filter bulan */
  document.getElementById("options").addEventListener("change", function () {
    const selectedValue = this.value;
    const filteredData = finalProduct.cards.filter((element) => {
      const month = new Date(element.jadwal_keberangkatan).getMonth() + 1;
      return month.toString() === selectedValue;
    });
    productDiv.innerHTML = "";
    if (filteredData.length === 0) {
      const cardDiv = document.createElement("div");
      cardDiv.className = "productItems";
      cardDiv.textContent = "No data found";
      productDiv.appendChild(cardDiv);
    } else {
      filteredData.forEach((element) => {
        const cardDiv = createCardElement(element);
        productDiv.appendChild(cardDiv);
      });
    }
  });
  /* end filter bulan */

  /*filter tahun dan bulan*/
  // Buat <select> element
  let selectElement = document.createElement("select");
  selectElement.setAttribute("name", "yearMonthSelect");
  selectElement.setAttribute("id", "yearMonthSelect");

  // Dapatkan tahun saat ini dan bulan saat ini
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth();
  let months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Tambahkan opsi tahun dan bulan ke dalam <select> untuk 5 tahun ke depan
  for (let i = 0; i < 6; i++) {
    let year = currentYear + i;
    let yearGroup = document.createElement("optgroup");
    yearGroup.label = year.toString();

    // Mulai dari bulan saat ini jika tahun pertama, atau Januari jika tahun berikutnya
    let startMonth = i === 0 ? currentMonth : 0;

    // Tambahkan opsi bulan ke dalam grup tahun
    for (let j = startMonth; j < months.length; j++) {
      let optionElement = document.createElement("option");
      optionElement.setAttribute("value", months[j] + " " + year);
      optionElement.textContent = months[j];
      yearGroup.appendChild(optionElement);
    }

    selectElement.appendChild(yearGroup);
  }

  // Masukkan <select> ke dalam elemen dengan id "container" misalnya
  document.getElementById("yearMonthSelect").appendChild(selectElement);

  // Tambahkan event listener untuk memperbarui data ketika pengguna memilih opsi
  selectElement.addEventListener("change", function () {
    const selectedValue = this.value;
    const filterTahun = finalProduct.cards.filter((element) => {
      const date = new Date(element.jadwal_keberangkatan);
      const selectedDate = new Date(selectedValue);

      const indonesianLocale = "id-ID";
      const dateFormatter = new Intl.DateTimeFormat(indonesianLocale, {
        month: "long",
        year: "numeric",
      });

      const formattedDate = dateFormatter.format(date);
      const formattedSelectedDate = dateFormatter.format(selectedDate);

      return formattedDate === formattedSelectedDate;
    });
    
    productDiv.innerHTML = "";
    if (filterTahun.length === 0) {
      const cardDiv = document.createElement("div");
      cardDiv.className = "productItems";
      cardDiv.textContent = "No data found";
      productDiv.appendChild(cardDiv);
    } else {
      filterTahun.forEach((element) => {
        const cardDiv = createCardElement(element);
        productDiv.appendChild(cardDiv);
      });
    }
  });
  /*end filter tahun*/
}

showProduct();
