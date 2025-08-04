function addEducation() {
  const section = document.getElementById('educationSection');
  const div = document.createElement('div');
  div.className = 'edu-entry';
  div.innerHTML = `
    <label>Exam Name: <input type="text" name="exam[]" required /></label>
    <label>Board/University: <input type="text" name="board[]" required /></label>
    <label>Year: <input type="text" name="year[]" required /></label>
    <label>Result: <input type="text" name="result[]" required /></label>
  `;
  section.appendChild(div);
}

document.getElementById('biodataForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const form = e.target;
  const preview = document.getElementById('preview');

  const photoFile = form.photo.files[0];
  let photoURL = '';
  if (photoFile) {
    photoURL = URL.createObjectURL(photoFile);
  }

  let html = `<h2 style="text-align:center;">Biodata</h2>`;

  html += `<p><strong>Name:</strong> ${form.name.value}</p>`;
  html += `<p><strong>Father's Name:</strong> ${form.father.value}</p>`;
  html += `<p><strong>Mother's Name:</strong> ${form.mother.value}</p>`;
  html += `<p><strong>Date of Birth:</strong> ${form.dob.value}</p>`;
  html += `<p><strong>Sex:</strong> ${form.sex.value}</p>`;
  html += `<p><strong>Address:</strong> ${form.address.value}</p>`;
  html += `<p><strong>Phone:</strong> ${form.phone.value}</p>`;
  html += `<p><strong>Email:</strong> ${form.email.value}</p>`;
  if (photoURL) {
    html += `<p><strong>Photo:</strong><br/><img src="${photoURL}" width="120"/></p>`;
  }

  html += `<h3>Education Qualification</h3>`;
  const exams = form.querySelectorAll('input[name="exam[]"]');
  const boards = form.querySelectorAll('input[name="board[]"]');
  const years = form.querySelectorAll('input[name="year[]"]');
  const results = form.querySelectorAll('input[name="result[]"]');

  html += `<table border="1" cellpadding="5" cellspacing="0"><tr><th>Exam</th><th>Board/University</th><th>Year</th><th>Result</th></tr>`;
  for (let i = 0; i < exams.length; i++) {
    html += `<tr><td>${exams[i].value}</td><td>${boards[i].value}</td><td>${years[i].value}</td><td>${results[i].value}</td></tr>`;
  }
  html += `</table>`;

  if (form.extra.value) {
    html += `<h3>Extra Qualification</h3><p>${form.extra.value}</p>`;
  }

  preview.innerHTML = html;
});
