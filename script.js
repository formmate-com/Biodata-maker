document.addEventListener('DOMContentLoaded', () => {
    // Add more education fields
    document.getElementById('add-education').addEventListener('click', () => {
        const educationFields = document.getElementById('education-fields');
        const newEntry = document.createElement('div');
        newEntry.classList.add('education-entry');
        newEntry.innerHTML = `
            <input type="text" class="exam-name" placeholder="পরীক্ষার নাম">
            <input type="text" class="board-name" placeholder="বোর্ডের নাম">
            <input type="text" class="passing-year" placeholder="পাশের বছর">
            <input type="number" class="marks-obtain" placeholder="প্রাপ্ত নম্বর">
            <input type="number" class="total-marks" placeholder="মোট নম্বর">
        `;
        educationFields.appendChild(newEntry);
    });

    const form = document.getElementById('bio-data-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // 1. Get all values from the form
        const name = document.getElementById('name').value;
        const fatherName = document.getElementById('father-name').value;
        const dob = document.getElementById('dob').value;
        const address = document.getElementById('address').value;
        const caste = document.getElementById('caste').value;
        const sex = document.getElementById('sex').value;
        const mobNo = document.getElementById('mob-no').value;
        const email = document.getElementById('email').value;
        const languages = document.getElementById('languages').value;
        const date = document.getElementById('date').value;
        const place = document.getElementById('place').value;
        
        // 2. Populate the hidden output div
        document.getElementById('output-rajkumar-name').innerText = name;
        document.getElementById('output-top-email').innerText = email;
        document.getElementById('output-top-phone').innerText = mobNo;

        document.getElementById('output-name').innerText = name;
        document.getElementById('output-father-name').innerText = fatherName;
        document.getElementById('output-dob').innerText = dob;
        document.getElementById('output-address').innerText = address;
        document.getElementById('output-caste').innerText = caste;
        document.getElementById('output-sex').innerText = sex;
        document.getElementById('output-mob-no').innerText = mobNo;
        document.getElementById('output-email').innerText = email;
        document.getElementById('output-languages').innerText = languages;
        document.getElementById('output-date').innerText = date;
        document.getElementById('output-place').innerText = place;

        // Handle education fields
        const educationBody = document.getElementById('output-education-body');
        educationBody.innerHTML = ''; // Clear previous entries
        const educationEntries = document.querySelectorAll('.education-entry');
        educationEntries.forEach(entry => {
            const examName = entry.querySelector('.exam-name').value;
            const boardName = entry.querySelector('.board-name').value;
            const passingYear = entry.querySelector('.passing-year').value;
            const marksObtain = parseFloat(entry.querySelector('.marks-obtain').value) || 0;
            const totalMarks = parseFloat(entry.querySelector('.total-marks').value) || 0;
            const percentage = totalMarks > 0 ? ((marksObtain / totalMarks) * 100).toFixed(2) + '%' : 'N/A';

            if (examName) { // Only add if exam name is filled
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${examName}</td>
                    <td>${boardName}</td>
                    <td>${passingYear}</td>
                    <td>${marksObtain}</td>
                    <td>${totalMarks}</td>
                    <td>${percentage}</td>
                `;
                educationBody.appendChild(row);
            }
        });

        // Handle photo upload
        const photoInput = document.getElementById('photo');
        const outputPhoto = document.getElementById('output-photo');
        if (photoInput.files && photoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                outputPhoto.src = e.target.result;
                generatePdf(); // Generate PDF after image is loaded
            }
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            outputPhoto.src = ''; // Clear if no photo
            generatePdf(); // Generate PDF without a photo
        }
    });

    function generatePdf() {
        const { jsPDF } = window.jspdf;
        const bioDataOutput = document.getElementById('bio-data-output');
        
        // Temporarily make the hidden div visible for capturing
        bioDataOutput.classList.remove('hidden');
        
        html2canvas(bioDataOutput, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save("Bio-Data.pdf");
            
            // Hide the div again after capturing
            bioDataOutput.classList.add('hidden');
        }).catch(err => {
            console.error("Error generating PDF:", err);
            // Ensure the div is hidden even if there's an error
             bioDataOutput.classList.add('hidden');
        });
    }
});
