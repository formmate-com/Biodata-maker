let uploadedImage = null;

function addEducation() {
  const container = document.getElementById("educationContainer");
  const div = document.createElement("div");
  div.className = "edu";
  div.innerHTML = `
    <input type="text" placeholder="Exam" class="exam"/>
    <input type="text" placeholder="Board/University" class="board"/>
    <input type="text" placeholder="Year" class="year"/>
    <input type="text" placeholder="Marks (%)" class="marks"/>
  `;
  container.appendChild(div);
}

document.getElementById("photo").addEventListener("change", function (e) {
  const reader = new FileReader();
  reader.onload = function (event) {
    uploadedImage = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

function generateBiodata() {
  const fullName = document.getElementById("fullName").value;
  const fatherName = document.getElementById("fatherName").value;
  const motherName = document.getElementById("motherName").value;
  const sex = document.getElementById("sex").value;
  const dob = document.getElementById("dob").value;
  const mobile = document.getElementById("mobile").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const extra = document.getElementById("extraQualification").value;

  const exams = document.querySelectorAll(".exam");
  const boards = document.querySelectorAll(".board");
  const years = document.querySelectorAll(".year");
  const marks = document.querySelectorAll(".marks");

  let eduHTML = "<ul>";
  for (let i = 0; i < exams.length; i++) {
    eduHTML += `<li>${exams[i].value} | ${boards[i].value} | ${years[i].value} | ${marks[i].value}%</li>`;
  }
  eduHTML += "</ul>";

  const preview = `
    <div>
      <h2 style="text-align:center;">BIODATA</h2>
      <div>
        <strong>Name:</strong> ${fullName}<br/>
        <strong>Father's Name:</strong> ${fatherName}<br/>
        <strong>Mother's Name:</strong> ${motherName}<br/>
        <strong>Sex:</strong> ${sex}<br/>
        <strong>Date of Birth:</strong> ${dob}<br/>
        <strong>Mobile:</strong> ${mobile}<br/>
        <strong>Email:</strong> ${email}<br/>
        <strong>Address:</strong> ${address}<br/>
        ${uploadedImage ? `<img src="${uploadedImage}" class="photo"/>` : ""}
      </div>
      <hr/>
      <h3>Education Qualification:</h3>
      ${eduHTML}
      <h3>Extra Qualification:</h3>
      <p>${extra}</p>
    </div>
  `;

  document.getElementById("biodataPreview").innerHTML = preview;
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const content = document.getElementById("biodataPreview");

  doc.html(content, {
    callback: function (doc) {
      doc.save("biodata.pdf");
    },
    x: 10,
    y: 10,
    html2canvas: { scale: 0.5 },
  });
}
