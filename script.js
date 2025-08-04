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
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Show a loading indicator
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;

        try {
            // 1. Populate all text fields first
            document.getElementById('output-name').innerText = capitalizeWords(document.getElementById('name').value);
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
            
            // Get value for Extra Qualification
            const extraQualification = document.getElementById('extra-qualification').value;

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

            // Handle Extra Qualification Display
            const extraQualOutputSection = document.getElementById('extra-qual-output-section');
            if (extraQualification.trim() !== '') {
                document.getElementById('output-extra-qualification').innerText = extraQualification;
                extraQualOutputSection.style.display = 'block'; // Show the section
            } else {
                extraQualOutputSection.style.display = 'none'; // Hide if empty
            }

            // 2. Handle image loading very carefully
            const loadImage = (file, imgElement) => {
                return new Promise((resolve, reject) => {
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            imgElement.src = e.target.result;
                            // IMPORTANT: Wait for the image to be fully decoded and rendered
                            imgElement.decode().then(() => {
                                resolve();
                            }).catch(reject);
                        };
                        reader.onerror = (err) => reject("File reading error");
                        reader.readAsDataURL(file);
                    } else {
                        imgElement.src = '';
                        resolve(); // Resolve immediately if no file
                    }
                });
            };
            
            const photoInput = document.getElementById('photo');
            const signatureInput = document.getElementById('signature-upload');
            
            // Wait for both images to be set and rendered
            await Promise.all([
                loadImage(photoInput.files[0], document.getElementById('output-photo')),
                loadImage(signatureInput.files[0], document.getElementById('output-signature-img'))
            ]);

            // 3. Generate PDF after everything is ready
            generatePdf();

        } catch (error) {
            console.error("An error occurred during data processing or image loading:", error);
            alert("Failed to process data or load images. Please try again with standard image files (JPG, PNG).");
        } finally {
            // Re-enable button
            submitButton.textContent = 'Download PDF';
            submitButton.disabled = false;
        }
    });

    function generatePdf() {
        const { jsPDF } = window.jspdf;
        const bioDataOutput = document.getElementById('bio-data-output');
        
        bioDataOutput.classList.remove('hidden');

        const options = {
            scale: 2,
            useCORS: true,
            allowTaint: true // May help with some image loading issues
        };

        html2canvas(bioDataOutput, options).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            pdf.save("Bio-Data.pdf");
            
            bioDataOutput.classList.add('hidden');
        }).catch(err => {
            console.error("Error during PDF generation:", err);
            alert("Could not generate the PDF. Please try again.");
            bioDataOutput.classList.add('hidden');
        });
    }
});
