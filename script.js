document.getElementById('biodataForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const name = document.getElementById('name').value;
  const father = document.getElementById('father').value;
  const dob = document.getElementById('dob').value;
  const address = document.getElementById('address').value;
  const caste = document.getElementById('caste').value;
  const nationality = document.getElementById('nationality').value;
  const sex = document.getElementById('sex').value;
  const mobile = document.getElementById('mobile').value;
  const email = document.getElementById('email').value;
  const languages = document.getElementById('languages').value;
  const place = document.getElementById('place').value;

  const exam = document.getElementById('exam').value;
  const board = document.getElementById('board').value;
  const year = document.getElementById('year').value;
  const marks = document.getElementById('marks').value;
  const total = document.getElementById('total').value;
  const percent = document.getElementById('percent').value;

  const photo = document.getElementById('photo');

  // Title
  doc.setFontSize(18);
  doc.text("BIO – DATA", 80, 20);

  doc.setFontSize(12);
  doc.text(`NAME: ${name}`, 20, 30);
  doc.text(`EMAIL: ${email}`, 20, 38);
  doc.text(`PHONE NO: ${mobile}`, 20, 46);

  doc.setFont(undefined, 'bold');
  doc.text("PERSONAL INFORMATION:", 20, 56);
  doc.setFont(undefined, 'normal');

  doc.text(`FATHER NAME: ${father}`, 20, 64);
  doc.text(`DATE OF BIRTH: ${dob}`, 20, 72);
  doc.text(`ADDRESS: ${address}`, 20, 80);
  doc.text(`CASTE: ${caste}`, 20, 88);
  doc.text(`NATIONALITY: ${nationality}`, 20, 96);
  doc.text(`SEX: ${sex}`, 20, 104);
  doc.text(`EMAIL ID: ${email}`, 20, 112);
  doc.text(`LANGUAGES KNOWN: ${languages}`, 20, 120);

  doc.setFont(undefined, 'bold');
  doc.text("EDUCATIONAL QUALIFICATION:", 20, 130);
  doc.setFont(undefined, 'normal');

  doc.autoTable({
    head: [["EXAM", "BOARD", "YEAR", "MARKS", "TOTAL", "%"]],
    body: [[exam, board, year, marks, total, percent]],
    startY: 135,
    theme: 'grid',
    styles: { fontSize: 10 }
  });

  doc.text("DECLARATION – I hereby declare that the above information is true.", 20, doc.lastAutoTable.finalY + 20);
  doc.text(`DATE: ___________`, 20, doc.lastAutoTable.finalY + 30);
  doc.text(`PLACE: ${place}`, 20, doc.lastAutoTable.finalY + 38);
  doc.text("SIGNATURE: _______________", 120, doc.lastAutoTable.finalY + 38);

  if (photo.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      doc.addImage(e.target.result, 'JPEG', 160, 20, 30, 30);
      doc.save("biodata.pdf");
    };
    reader.readAsDataURL(photo.files[0]);
  } else {
    doc.save("biodata.pdf");
  }
});
