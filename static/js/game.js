let currentBeeCoinPrice = 0;
let currentaCornPrice = 0;
document.addEventListener("DOMContentLoaded", async (event) => {
  console.log(window.location.href);

  let url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
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

      beecoinText = document.getElementById("BCHTEXT");
      beecoinText.appendChild(document.createTextNode(jsonData[1]["amount"]));

      acornText = document.getElementById("ACRTEXT");
      acornText.appendChild(document.createTextNode(jsonData[2]["amount"]));

      USDText = document.getElementById("USDTEXT");
      USDText.appendChild(document.createTextNode(jsonData[0]["amount"]));
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
  console.log(event);
  console.log(document.getElementById("popup"));
  document.getElementById("popup").style.display = "block";
  beecoinPrice = document.getElementById("current-price");
  beecoinPrice.appendChild(document.createTextNode(currentBeeCoinPrice));
  var ctx = document.getElementById("myChart").getContext("2d");

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
      var myLineChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "beeCoin",
              fill: false,
              backgroundColor: "ffffff",
              borderColor: "000000",
              data: data,
            },
          ],
        },
      });
    });
  document.getElementById("popup").scrollIntoView();
};

acornOnClick = async (event) => {
  console.log(event);
  console.log(document.getElementById("popup"));
  document.getElementById("popup").style.display = "block";
  acornPrice = document.getElementById("current-price");
  acornPrice.appendChild(document.createTextNode(currentaCornPrice));
  var ctx = document.getElementById("myChart").getContext("2d");

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
      console.log(jsonData);
      labels = [];
      data = [];
      for (const rateData of jsonData) {
        labels.push(rateData["timestamp"]);
        data.push(rateData["rate"]);
      }
      console.log(data);
      console.log(labels);
      var myLineChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "aCorn",
              fill: false,
              backgroundColor: "ffffff",
              borderColor: "000000",
              data: data,
            },
          ],
        },
      });
    });
  document.getElementById("popup").scrollIntoView();
};
