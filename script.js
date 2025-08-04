document.addEventListener('DOMContentLoaded', () => {
    // Function to capitalize the first letter of each word
    function capitalizeWords(str) {
        if (!str) return '';
        if (str.includes('@')) {
            return str.toLowerCase();
        }
        return str.toLowerCase().split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
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
    form.addEventListener('submit', async (event) => { // Make the handler async
        event.preventDefault();
        console.log("Form submitted. Starting PDF generation process...");

        try {
            // 1. Get all values and capitalize them
            const name = capitalizeWords(document.getElementById('name').value);
            const fatherName = capitalizeWords(document.getElementById('father-name').value);
            const dob = document.getElementById('dob').value;
            const address = capitalizeWords(document.getElementById('address').value);
            const caste = capitalizeWords(document.getElementById('caste').value);
            const sex = document.getElementById('sex').value;
            const mobNo = document.getElementById('mob-no').value;
            const email = document.getElementById('email').value.toLowerCase();
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
            educationBody.innerHTML = '';
            const educationEntries = document.querySelectorAll('.education-entry');
            educationEntries.forEach(entry => {
                const examName = capitalizeWords(entry.querySelector('.exam-name').value);
                const boardName = capitalizeWords(entry.querySelector('.board-name').value);
                const passingYear = entry.querySelector('.passing-year').value;
                const marksObtain = parseFloat(entry.querySelector('.marks-obtain').value) || 0;
                const totalMarks = parseFloat(entry.querySelector('.total-marks').value) || 0;
                const percentage = totalMarks > 0 ? ((marksObtain / totalMarks) * 100).toFixed(2) + '%' : 'N/A';

                if (examName) {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${examName}</td><td>${boardName}</td><td>${passingYear}</td><td>${marksObtain}</td><td>${totalMarks}</td><td>${percentage}</td>`;
                    educationBody.appendChild(row);
                }
            });

            // Handle image uploads robustly
            console.log("Loading images...");
            const photoInput = document.getElementById('photo');
            const signatureInput = document.getElementById('signature-upload');
            
            const loadImage = (file, imgElement) => {
                return new Promise((resolve, reject) => {
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            imgElement.src = e.target.result;
                            imgElement.onload = () => {
                                console.log(`${imgElement.id} loaded successfully.`);
                                resolve();
                            };
                            imgElement.onerror = (err) => reject(`Error loading ${imgElement.id}.`);
                        };
                        reader.onerror = (err) => reject("File reader error.");
                        reader.readAsDataURL(file);
                    } else {
                        imgElement.src = '';
                        resolve(); // Resolve immediately if no file
                    }
                });
            };
            
            await Promise.all([
                loadImage(photoInput.files[0], document.getElementById('output-photo')),
                loadImage(signatureInput.files[0], document.getElementById('output-signature-img'))
            ]);

            console.log("All images loaded. Calling generatePdf().");
            generatePdf();

        } catch (error) {
            console.error("An error occurred during data processing or image loading:", error);
            alert("Failed to process data or load images. Please check the browser console (F12) for details.");
        }
    });

    function generatePdf() {
        console.log("Inside generatePdf(). Preparing to capture content.");
        const { jsPDF } = window.jspdf;
        const bioDataOutput = document.getElementById('bio-data-output');
        
        bioDataOutput.classList.remove('hidden');

        const options = {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: true,
        };

        console.log("Running html2canvas...");
        html2canvas(bioDataOutput, options).then(canvas => {
            console.log("Canvas created successfully. Generating PDF.");
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save("Bio-Data.pdf");
            console.log("PDF saved successfully.");
            
            bioDataOutput.classList.add('hidden');
        }).catch(err => {
            console.error("Error during PDF generation:", err);
            alert("Could not generate the PDF. Please check the browser console (F12) for more details.");
            bioDataOutput.classList.add('hidden');
        });
    }
});
