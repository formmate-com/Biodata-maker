document.getElementById("photo").addEventListener("change", function (event) {
  const reader = new FileReader();
  reader.onload = function () {
    const img = document.getElementById("photo-preview");
    img.src = reader.result;
    img.style.display = "block";
    img.setAttribute("data-image", reader.result);
  };
  reader.readAsDataURL(event.target.files[0]);
});

document.getElementById("download-btn").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const name = document.getElementById("name").value;
  const father = document.getElementById("father").value;
  const dob = document.getElementById("dob").value;
  const address = document.getElementById("address").value;
  const mobile = document.getElementById("mobile").value;
  const email = document.getElementById("email").value;
  const photoData = document.getElementById("photo-preview").getAttribute("data-image");
  const educationData = document.getElementById("education").value;

  // Header with name and photo
  doc.setFontSize(14);
  doc.text(`Name: ${name}`, 40, 60);
  doc.text(`Father's Name: ${father}`, 40, 80);

  if (photoData) {
    doc.addImage(photoData, "JPEG", 400, 40, 100, 120);
  }

  doc.text(`Date of Birth: ${dob}`, 40, 110);
  doc.text(`Mobile: ${mobile}`, 40, 130);
  doc.text(`Email: ${email}`, 40, 150);
  doc.text(`Address:`, 40, 170);
  doc.text(address, 40, 190, { maxWidth: 500 });

  // Education Table
  const rows = educationData
    .split("\n")
    .filter(Boolean)
    .map(row => row.split(",").map(cell => cell.trim()));

  if (rows.length > 0) {
    doc.autoTable({
      head: [["Degree", "Institution", "Year"]],
      body: rows,
      startY: 250,
      theme: "grid",
      styles: { fontSize: 12, cellPadding: 6 },
    });
  }

  doc.save(`${name}_Biodata.pdf`);
});
