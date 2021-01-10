createAccount = async (event) => {
  event.preventDefault();

  username = document.getElementById("username").value;
  email = document.getElementById("email").value;
  console.log(username, email);
  await fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify({ username: username, email: email }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((jsonData) => {
      location.replace(`/game?id=${jsonData}`);
    });
};
