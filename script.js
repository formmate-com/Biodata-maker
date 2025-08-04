document.addEventListener('DOMContentLoaded', () => {
    // Function to capitalize the first letter of each word
    function capitalizeWords(str) {
        if (!str) return '';
        // Handle emails carefully to avoid capitalizing after @
        if (str.includes('@')) {
            return str.toLowerCase();
        }
        return str.toLowerCase().split(' ').map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    }
    
    // Add more education fields
    document.getElementById('add-education').addEventListener('click', () => {
        const educationFields = document.getElementById('education-fields');
        const newEntry = document.createElement('div');
        newEntry.classList.add('education-entry');
        newEntry.innerHTML = `
            <input type="text" class="exam-name" placeholder="Exam Name">
            <input type="text" class="board-name" placeholder="Name of Board">
            <input type="text" class="passing-year" placeholder="Passing Year">
            <input type="number" class="marks-obtain" placeholder="Marks Obtained">
            <input type="number" class="total-marks" placeholder="Total Marks">
        `;
        educationFields.appendChild(newEntry);
    });

    const form = document.getElementById('bio-data-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // 1. Get all values and capitalize them
        const name = capitalizeWords(document.getElementById('name').value);
        const fatherName = capitalizeWords(document.getElementById('father-name').value);
        const dob = document.getElementById('dob').value;
        const address = capitalizeWords(document.getElementById('address').value);
        const caste = capitalizeWords(document.getElementById('caste').value);
        const sex = document.getElementById('sex').value;
        const mobNo = document.getElementById('mob-no').value;
        const email = document.getElementById('email').value.toLowerCase(); // Emails should be lowercase
        const languages = capitalizeWords(document.getElementById('languages').value);
        const date = document.getElementById('date').value;
        const place = capitalizeWords(document.getElementById('place').value);
        
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
            const examName = capitalizeWords(entry.querySelector('.exam-name').value);
            const boardName = capitalizeWords(entry.querySelector('.board-name').value);
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

        // Handle image uploads using Promises to ensure they load before PDF generation
        const photoInput = document.getElementById('photo');
        const signatureInput = document.getElementById('signature-upload');
        
        const loadImage = (file, imgElement) => {
            return new Promise((resolve) => {
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        imgElement.src = e.target.result;
                        // Wait for the image to be fully rendered in the DOM
                        imgElement.onload = () => resolve();
                    };
                    reader.readAsDataURL(file);
                } else {
                    imgElement.src = '';
                    resolve(); // Resolve immediately if no file
                }
            });
        };
        
        const photoPromise = loadImage(photoInput.files[0], document.getElementById('output-photo'));
        const signaturePromise = loadImage(signatureInput.files[0], document.getElementById('output-signature-img'));

        // Wait for both images to be loaded before generating the PDF
        Promise.all([photoPromise, signaturePromise]).then(() => {
            generatePdf();
        });
    });

    function generatePdf() {
        const { jsPDF } = window.jspdf;
        const bioDataOutput = document.getElementById('bio-data-output');
        
        bioDataOutput.classList.remove('hidden');
        
        html2canvas(bioDataOutput, { scale: 3, useCORS: true }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save("Bio-Data.pdf");
            
            bioDataOutput.classList.add('hidden');
        }).catch(err => {
            console.error("Error generating PDF:", err);
            bioDataOutput.classList.add('hidden');
        });
    }
});
