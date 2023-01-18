// API Responses
// {
//   "data": {
//     "username": "EkE_2xRt9rX2Fc4s2tyBsjtRQtE=",
//     "password": "CgYQ4LWc3gYSIIQaFl5ordaFkmIwVUe84dPygBlsaGDWYZifXTViL3GT",
//     "timestamp": 1673992928
//   }
// }
// {
//   "error": "timestamp is too old"
// }
// {
//   "error": "invalid signature"
// }



// Checks if signed message is valid json and format
function validate() {
  const signedMsg = document.getElementById("signedMsg").value;
  const termsCheckbox = document.getElementById("termsCheckbox").checked;
  const submitBtn = document.getElementById("submitBtn");
  const errorMsg = document.getElementById("errorMsg");
  const correctFormat = signedMsg.includes(`{`) && 
                        signedMsg.includes(`"address"`) && 
                        signedMsg.includes(`"msg"`) && 
                        signedMsg.includes(`"sig"`) && 
                        signedMsg.includes(`"version"`) && 
                        signedMsg.includes(`}`);
  let validJSON = false;
  try {
    let test = JSON.parse(signedMsg);
    validJSON = true;
  } catch {};

  if (validJSON && correctFormat) {
    errorMsg.classList.add("d-none");
    if (termsCheckbox) {
      submitBtn.classList.remove("disabled");
    } else {
      submitBtn.classList.add("disabled");
    }
  } else {
    submitBtn.classList.add("disabled");
    errorMsg.classList.remove("d-none");
    if (signedMsg == "") {
      errorMsg.classList.add("d-none");
    }
  }
}



// Submit signed message and handle response
function submit() {
  const requestAccess = document.getElementById("requestAccess");
  const accessToken = document.getElementById("accessToken");
  const signedMsg = JSON.parse(document.getElementById("signedMsg").value);

  fetch('https://api.rescuenode.com/rescue/v1/credentials/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(signedMsg)
  })
  .then(response => response.json())
  .then(response => {
    if (response.data) {
      console.log(response);
      createAccessToken(response);
      setExpirationDate(response);
      requestAccess.classList.add("d-none");
      accessToken.classList.remove("d-none");
    } else {
      console.error(`ERROR: ${response.error}`);
      if (response.error == "timestamp is too old") {
        alert('ERROR: Your signature has expired. Signatures are only valid for 15 minutes after they are created. Please generate a new signature and submit again within a 15 minute period.');
      }
      if (response.error == "invalid signature") {
        alert('ERROR: Your signature is invalid.');
      }
    }
  })
}



// Populate UI with access token
function createAccessToken(response) {
  const username = response.data.username;
  const password = response.data.password;
  const timestamp = response.data.timestamp;
  const clients = ["lighthouse", "teku", "nimbus", "prysm"];
  for (let client in clients) {
    let token;
    if (clients[client] == "lighthouse" || clients[client] == "teku" || clients[client] == "nimbus") {
      token =`<span>version: "3.7"</span>
              <span>services:</span>
              <span>  validator:</span>
              <span>    x-rp-comment: Add your customizations below...</span>
              <span>    environment:</span>
              <span>      - "CC_API_ENDPOINT=http://${username}:${password}@${clients[client]}.rescuenode.com"</span>`;
    } else if (clients[client] == "prysm") {
      token =`<span>version: "3.7"</span>
              <span>services:</span>
              <span>  validator:</span>
              <span>    x-rp-comment: Add your customizations below...</span>
              <span>    environment:</span>
              <span>      - "CC_RPC_ENDPOINT=prysm-grpc.rescuenode.com"</span>
              <span>      - "VC_ADDITIONAL_FLAGS=--grpc-headers=rprnauth=${username}:${password} --tls-cert=/etc/ssl/certs/ca-certificates.crt"</span>`;
    } else {
      console.error("Client not supported")
    }
    if (clients[client] == "lighthouse") {
      const lighthouseCode = document.getElementById("lighthouseCode");
      lighthouseCode.innerHTML = token;
    } else if (clients[client] == "teku") {
      const tekuCode = document.getElementById("tekuCode");
      tekuCode.innerHTML = token;
    } else if (clients[client] == "nimbus") {
      const nimbusCode = document.getElementById("nimbusCode");
      nimbusCode.innerHTML = token;
    } else if (clients[client] == "prysm") {
      const prysmCode = document.getElementById("prysmCode");
      prysmCode.innerHTML = token;
    }
  }
}


// Populate UI with expiration date
function setExpirationDate(response) {
  const timestamp = response.data.timestamp * 1000; // in milliseconds
  const expirationDate = document.getElementById("expDate");
  const expiration = new Date(timestamp + 1296000000);
  expirationDate.innerHTML = expiration;
}



// Enable tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
// Copy text
function copyText(copyIconId, textToCopyId) {
  const textToCopy = document.getElementById(textToCopyId).innerText;
  console.log(textToCopy);
  navigator.clipboard.writeText(textToCopy).then(function() {
    let tooltipElement = document.getElementById(copyIconId);
    let tooltip = bootstrap.Tooltip.getInstance(tooltipElement);
    setTimeout(() => { tooltip.hide(); }, 1000);
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}




