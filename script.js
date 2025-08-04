document.getElementById("add-edu").addEventListener("click", () => {
  const eduDiv = document.createElement("div");
  eduDiv.classList.add("edu-row");
  eduDiv.innerHTML = `
    <input type="text" placeholder="Exam" class="exam" required />
    <input type="text" placeholder="Board/University" class="board" required />
    <input type="text" placeholder="Year" class="year" required />
    <input type="text" placeholder="Percentage/CGPA" class="result" required />
  `;
  document.getElementById("education-list").appendChild(eduDiv);
});

document.getElementById("biodata-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const fullName = document.getElementById("fullName").value;
  const fatherName = document.getElementById("fatherName").value;
  const dob = document.getElementById("dob").value;
  const gender = document.getElementById("gender").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const extra = document.getElementById("extra").value;

  const photoInput = document.getElementById("photo");
  let imageDataURL = null;

  if (photoInput.files.length > 0) {
    const reader = new FileReader();
    reader.readAsDataURL(photoInput.files[0]);
    await new Promise(resolve => {
      reader.onload = () => {
        imageDataURL = reader.result;
        resolve();
      };
    });
  }

  let y = 20;
  doc.setFontSize(18);
  doc.text("BIODATA", 105, y, { align: "center" });
  y += 10;

  if (imageDataURL) {
    doc.addImage(imageDataURL, "JPEG", 140, y - 10, 40, 40);
  }

  doc.setFontSize(12);
  doc.text(`Full Name: ${fullName}`, 20, y); y += 10;
  doc.text(`Father's Name: ${fatherName}`, 20, y); y += 10;
  doc.text(`Date of Birth: ${dob}`, 20, y); y += 10;
  doc.text(`Gender: ${gender}`, 20, y); y += 10;
  doc.text(`Phone: ${phone}`, 20, y); y += 10;
  if (email) {
    doc.text(`Email: ${email}`, 20, y); y += 10;
  }
  doc.text("Address:", 20, y); y += 8;
  const addressLines = doc.splitTextToSize(address, 160);
  doc.text(addressLines, 25, y); y += addressLines.length * 8;

  doc.text("Educational Qualification:", 20, y); y += 10;
  const exams = document.querySelectorAll(".exam");
  const boards = document.querySelectorAll(".board");
  const years = document.querySelectorAll(".year");
  const results = document.querySelectorAll(".result");

  for (let i = 0; i < exams.length; i++) {
    doc.text(`• ${exams[i].value}, ${boards[i].value}, ${years[i].value}, ${results[i].value}`, 25, y);
    y += 8;
  }

  if (extra) {
    doc.text("Extra Qualification:", 20, y); y += 10;
    const extraLines = doc.splitTextToSize(extra, 160);
    doc.text(extraLines, 25, y);
    y += extraLines.length * 8;
  }

  doc.save(`${fullName.replace(/\s+/g, '_')}_Biodata.pdf`);
});
