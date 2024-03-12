let productDiv = document.querySelector(".product");

let displayProduct = async () => {
  let product = await fetch(
    "https://mock-api-pribadi-malik.vercel.app/api/mosleme-travel/packages"
  );
  let finalProduct = await product.json();

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
    jadwal.textContent = new Date(element.jadwal_keberangkatan).toLocaleDateString(
      "id-ID",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

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

  finalProduct.cards.forEach((element) => {
    let cardDiv = createCardElement(element);
    productDiv.appendChild(cardDiv);
  });

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
    if (event.target.matches("#hajiButton")) {
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
  document
    .getElementById("buttonContainer")
    .addEventListener("click", function (event) {
      if (event.target.id === "hargaAllButton") {
        filterHarga(() => true);
      } else if (event.target.id === "hargaRendahButton") {
        filterHarga((element) => {
          return (
            element.price_quad_basic >= 13000000 &&
            element.price_quad_basic <= 30000000
          );
        });
      } else if (event.target.id === "hargaSedangButton") {
        filterHarga((element) => {
          return (
            element.price_quad_basic >= 30000000 &&
            element.price_quad_basic <= 40000000
          );
        });
      } else if (event.target.id === "hargaTertinggiButton") {
        filterHarga((element) => {
          return element.price_quad_basic >= 40000000;
        });
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
    filteredData.forEach((element) => {
      const cardDiv = createCardElement(element);
      productDiv.appendChild(cardDiv);
    });
  });

  /* end filter bulan */
};

displayProduct();
