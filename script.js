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
    
    // Add more education fields with a limit of 3 entries
    document.getElementById('add-education').addEventListener('click', () => {
        const educationFields = document.getElementById('education-fields');
        const existingEntries = educationFields.getElementsByClassName('education-entry').length;

        if (existingEntries >= 3) {
            alert("You can add a maximum of 3 qualifications.");
            return;
        }

        const newEntry = document.createElement('div');
        newEntry.classList.add('education-entry');
        newEntry.innerHTML = `
            <input type="text" class="exam-name" placeholder="Exam Name (e.g., High School)">
            <input type="text" class="board-name" placeholder="Name of Board">
            <input type="text" class="passing-year" placeholder="Passing Year">
            <input type="number" class="marks-obtain" placeholder="Marks Obtained">
            <input type="number" class="total-marks" placeholder="Total Marks">
        `;
        educationFields.appendChild(newEntry);
    });

    const form = document.getElementById('bio-data-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;

        try {
            // Populate all text fields
            document.getElementById('output-rajkumar-name').innerText = capitalizeWords(document.getElementById('name').value);
            document.getElementById('output-top-email').innerText = document.getElementById('email').value.toLowerCase();
            document.getElementById('output-top-phone').innerText = document.getElementById('mob-no').value;
            document.getElementById('output-name').innerText = capitalizeWords(document.getElementById('name').value);
            document.getElementById('output-father-name').innerText = capitalizeWords(document.getElementById('father-name').value);
            document.getElementById('output-dob').innerText = document.getElementById('dob').value;
            document.getElementById('output-address').innerText = capitalizeWords(document.getElementById('address').value);
            document.getElementById('output-caste').innerText = capitalizeWords(document.getElementById('caste').value);
            document.getElementById('output-sex').innerText = document.getElementById('sex').value;
            document.getElementById('output-mob-no').innerText = document.getElementById('mob-no').value;
            document.getElementById('output-email').innerText = document.getElementById('email').value.toLowerCase();
            document.getElementById('output-languages').innerText = capitalizeWords(document.getElementById('languages').value);
            document.getElementById('output-date').innerText = document.getElementById('date').value;
            document.getElementById('output-place').innerText = capitalizeWords(document.getElementById('place').value);
            
            const extraQualification = document.getElementById('extra-qualification').value;

            // Handle education fields
            const educationBody = document.getElementById('output-education-body');
            educationBody.innerHTML = '';
            document.querySelectorAll('.education-entry').forEach(entry => {
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

            // Handle Extra Qualification
            const extraQualOutputSection = document.getElementById('extra-qual-output-section');
            if (extraQualification.trim() !== '') {
                document.getElementById('output-extra-qualification').innerText = extraQualification;
                extraQualOutputSection.style.display = 'block';
            } else {
                extraQualOutputSection.style.display = 'none';
            }

            // Load images
            const loadImage = (file, imgElement) => {
                return new Promise((resolve, reject) => {
                    if (!file) {
                        imgElement.src = '';
                        return resolve();
                    }
                    const reader = new FileReader();
                    reader.onload = () => {
                        imgElement.src = reader.result;
                        imgElement.onload = () => resolve();
                        imgElement.onerror = (err) => reject(err);
                    };
                    reader.onerror = (err) => reject(err);
                    reader.readAsDataURL(file);
                });
            };
            
            await Promise.all([
                loadImage(document.getElementById('photo').files[0], document.getElementById('output-photo')),
                loadImage(document.getElementById('signature-upload').files[0], document.getElementById('output-signature-img'))
            ]);

            await new Promise(resolve => setTimeout(resolve, 100));

            // Generate PDF using the new print-friendly method
            generatePdf();

        } catch (error) {
            console.error("Error during data processing:", error);
            alert("Failed to process data. Please try again.");
        } finally {
            submitButton.textContent = 'Download PDF';
            submitButton.disabled = false;
        }
    });

    function generatePdf() {
        const { jsPDF } = window.jspdf;
        const bioDataOutput = document.getElementById('bio-data-output');
        
        bioDataOutput.classList.remove('hidden');

        const pdf = new jsPDF('p', 'mm', 'a4');

        pdf.html(bioDataOutput, {
            callback: function(pdf) {
                pdf.save('Bio-Data.pdf');
                bioDataOutput.classList.add('hidden');
            },
            margin: [10, 5, 10, 5], // Top, Right, Bottom, Left
            autoPaging: 'text',
            width: 200, // Content width within the PDF
            windowWidth: bioDataOutput.scrollWidth
        });
    }
});
