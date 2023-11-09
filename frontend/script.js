function sendOTP() {
  const phoneNumber = document.getElementById("phoneNumber").value;

  // permintaan HTTP ke backend untuk mengirim OTP
  fetch("http://localhost:3000/send-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phoneNumber }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      alert(`OTP sent successfully`);
    })
    .catch((error) => {
      console.error("Error sending OTP:", error.message);
      alert("Failed to send OTP");
    });
}

function verifyOTP() {
    const phoneNumber = document.getElementById("phoneNumber").value;
    const userEnteredOTP = document.getElementById("otp").value;
  
    console.log('Verifying OTP:', userEnteredOTP);
  
    //permintaan HTTP ke backend untuk verifikasi OTP
    fetch("http://localhost:3000/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, otp: userEnteredOTP }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to verify OTP");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.success) {
          alert("OTP is valid");
        } else {
          alert("OTP is invalid: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error.message);
        alert("Success to verify OTP");
      });
  }
  
  
  
