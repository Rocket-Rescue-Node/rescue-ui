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


const dev = true;



// Event listeners
document.getElementById("signedMsg").addEventListener("keyup", validate);
document.getElementById("termsCheckbox").addEventListener("click", validate);
document.getElementById("submitBtn").addEventListener("click", submit);
const copyBtns = document.getElementsByClassName("code-copy");
Array.from(copyBtns).forEach(function(element) {
  element.addEventListener('click', copyText);
});



// Checks if signed message is valid json and format
function validate() {
  log("validating...");
  if (dev) { return document.getElementById("submitBtn").classList.remove("disabled"); }

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
  log("submitting...");
  if (dev) {
    let response = {
      data: {
        username: "username",
        password: "password",
        timestamp: Date().now
      }
    };
    createAccessToken(response);
    setExpirationDate(response);
    document.getElementById("requestAccess").classList.add("d-none");
    document.getElementById("accessToken").classList.remove("d-none");
    return
  }

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
      log(response);
      createAccessToken(response);
      setExpirationDate(response);
      requestAccess.classList.add("d-none");
      accessToken.classList.remove("d-none");
    } else {
      console.error(`ERROR: ${response.error}`);
      if (response.error == "timestamp is too old") {
        alert('ERROR: Your signature has expired. Signatures are only valid for 15 minutes after they are created. Please generate a new signature and submit again within a 15 minute period.');
      } else if (response.error == "invalid signature") {
        alert('ERROR: Your signature is invalid.');
      } else if (response.error == "node is not registered") {
        alert('ERROR: Your node is not registered.');
      } else if (response.error == "node is not authorized") {
        alert('ERROR: Your node is not authorized.');
      } else if (response.error == "node has requested too many credentials") {
        alert('ERROR: You have exceeded your usage limits.');
      } else if (response.error) {
        alert('Error: ' + response.error);
      }
    }
  })
}



// Populate UI with access token
function createAccessToken(response) {
  log("creating token...");
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
              <span>      - "CC_API_ENDPOINT=https://${username}:${password}@${clients[client]}.rescuenode.com"</span>`;
    } else if (clients[client] == "prysm") {
      token =`<span>version: "3.7"</span>
              <span>services:</span>
              <span>  validator:</span>
              <span>    x-rp-comment: Add your customizations below...</span>
              <span>    environment:</span>
              <span>      - "CC_RPC_ENDPOINT=prysm-grpc.rescuenode.com:443"</span>
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
  log("setting expiration...");
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
function copyText() {
  log("copying...");
  let copyIconId = this.id;
  log(`\tclicked: ${copyIconId}`);
  let textToCopyId = this.getAttribute("data-copy");
  log(`\tcopying: ${textToCopyId}`);
  const textToCopy = document.getElementById(textToCopyId).innerText;
  log(`\tcopied content: ${textToCopy}`);
  navigator.clipboard.writeText(textToCopy).then(function() {
    let tooltipElement = document.getElementById(copyIconId);
    let tooltip = bootstrap.Tooltip.getInstance(tooltipElement);
    setTimeout(() => { tooltip.hide(); }, 1000);
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}



// Console log
function log(msg) {
  if (dev) {
    console.log(msg);
  }
}




