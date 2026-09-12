// Handle form submission
const dataForm = document.getElementById('dataForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

dataForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page refresh

    // Change button state
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'Submitting...';
    submitBtn.disabled = true;
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    try {
        // Get input values
        const newSubmission = {
            id: Date.now().toString(),
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            mobile: document.getElementById('mobile').value,
            description: document.getElementById('description').value,
            timestamp: new Date().toLocaleString()
        };

        // Get existing data from localStorage or start empty array
        const existingData = JSON.parse(localStorage.getItem('formSubmissions')) || [];
        
        // Add new submission
        existingData.push(newSubmission);
        
        // Save back to localStorage
        localStorage.setItem('formSubmissions', JSON.stringify(existingData));
        
        // Show success message and reset form
        successMessage.style.display = 'block';
        dataForm.reset();
    } catch (error) {
        console.error("Error saving data: ", error);
        errorMessage.style.display = 'block';
    } finally {
        // Restore button state
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    }
});
