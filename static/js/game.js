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
    });
  //get currenct prices
});
