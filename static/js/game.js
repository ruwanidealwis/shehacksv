let currentBeeCoinPrice = 0;
let currentaCornPrice = 0;
let url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
document.addEventListener("DOMContentLoaded", async (event) => {
  console.log(window.location.href);

  //get wallet
  console.log(params);
  await fetch(`/viewWallet?userID=${params.get("id")}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((jsonData) => {
      console.log(jsonData);

      for (const wallet of jsonData) {
        console.log(wallet);
        if (wallet["currencyType"] === "beeCoin") {
          beecoinText = document.getElementById("BCHTEXT");
          beecoinText.appendChild(document.createTextNode(wallet["amount"]));
        } else if (wallet["currencyType"] === "aCorn") {
          acornText = document.getElementById("ACRTEXT");
          acornText.appendChild(document.createTextNode(wallet["amount"]));
        } else {
          USDText = document.getElementById("USDTEXT");
          USDText.appendChild(document.createTextNode(wallet["amount"]));
        }
      }
    });

  await fetch(`/currentRate?currency_type=beeCoin`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((jsonData) => {
      console.log(jsonData);
      beecoinPrice = document.getElementById("beecoin_price");
      beecoinPrice.appendChild(document.createTextNode(jsonData));
      currentBeeCoinPrice = jsonData;
    });

  await fetch(`/currentRate?currency_type=aCorn`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((jsonData) => {
      console.log(jsonData);
      acornPrice = document.getElementById("acorn_price");
      acornPrice.appendChild(document.createTextNode(jsonData));
      currentaCornPrice = jsonData;
    });
  //get currenct prices
});

beecoinOnClick = async (event) => {
  document.getElementById("BCH-Title").innerHTML = "BeeCoin (BCH)";
  console.log(event);
  console.log(document.getElementById("popup"));
  document.getElementById("popup").style.display = "block";
  beecoinPrice = document.getElementById(
    "current-price"
  ).innerHTML = currentBeeCoinPrice;

  var ctx = document.getElementById("myChart").getContext("2d");
  await fetch(
    `/averagePrice?currency_type=beeCoin&userID=${params.get("id")}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((jsonData) => {
      document.getElementById("average-price").innerHTML =
        jsonData["average_price"];
    });

  await fetch(`/history?coin=beeCoin`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((jsonData) => {
      console.log(jsonData);
      labels = [];
      data = [];
      for (const rateData of jsonData) {
        labels.push(rateData["timestamp"]);
        data.push(rateData["rate"]);
      }
      console.log(data);
      console.log(labels);
      localStorage.setItem("coin", "beeCoin");
      var myLineChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "beeCoin",
              fill: false,
              backgroundColor: "#4BB7F8",
              borderColor: "#4BB7F8",
              data: data,
            },
          ],
        },
      });
    });
  document.getElementById("popup").scrollIntoView();
};

acornOnClick = async (event) => {
  document.getElementById("BCH-Title").innerHTML = "aCorn (ACH)";
  console.log(event);
  console.log(document.getElementById("popup"));
  document.getElementById("popup").style.display = "block";

  beecoinPrice = document.getElementById(
    "current-price"
  ).innerHTML = currentaCornPrice;
  var ctx = document.getElementById("myChart").getContext("2d");
  await fetch(`/averagePrice?currency_type=aCorn&userID=${params.get("id")}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((jsonData) => {
      document.getElementById("average-price").innerHTML =
        jsonData["average_price"];
    });

  await fetch(`/history?coin=aCorn`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((jsonData) => {
      labels = [];
      data = [];
      for (const rateData of jsonData) {
        labels.push(rateData["timestamp"]);
        data.push(rateData["rate"]);
      }
      localStorage.setItem("coin", "aCorn");
      var myLineChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "aCorn",
              fill: false,
              backgroundColor: "#4BB7F8",
              borderColor: "#4BB7F8",
              data: data,
            },
          ],
        },
      });
    });
  document.getElementById("popup").scrollIntoView();
};

onBuy = async (event) => {
  console.log(event);
  currency = localStorage.getItem("coin");
  const buyForm = new FormData();
  buyForm.append("userID", params.get("id"));
  buyForm.append("currency_type", currency);
  buyForm.append(
    "current_rate",
    document.getElementById("current-price").innerHTML
  );
  buyForm.append("cost", document.getElementById("amount").value);
  await fetch(`/buy`, {
    method: "POST",
    body: buyForm,
  }).then((response) => {
    if (response.ok) {
      return true;
    }
  });
};

onSell = async (event) => {
  console.log(event);
  currency = localStorage.getItem("coin");
  const buyForm = new FormData();
  buyForm.append("userID", params.get("id"));
  buyForm.append("currency_type", currency);
  buyForm.append(
    "current_rate",
    document.getElementById("current-price").innerHTML
  );
  buyForm.append("sell_amount", document.getElementById("sell_amount").value);
  await fetch(`/sell`, {
    method: "POST",
    body: buyForm,
  }).then((response) => {
    if (response.ok) {
      return true;
    }
  });
};
