// Fetch data from localStorage and populate the table
function loadData() {
    const dataBody = document.getElementById('dataBody');
    const existingData = JSON.parse(localStorage.getItem('formSubmissions')) || [];

    // Clear existing table body
    dataBody.innerHTML = '';

    if (existingData.length === 0) {
        dataBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No submissions found yet.</td></tr>';
        return;
    }

    // Sort by timestamp descending (newest first)
    existingData.reverse();

    // Loop through the results and build the table rows
    existingData.forEach((data) => {
        const tr = document.createElement('tr');
        
        // Date
        const tdDate = document.createElement('td');
        tdDate.textContent = data.timestamp || '-';

        // Name
        const tdName = document.createElement('td');
        tdName.textContent = data.name || '-';
        
        // Email
        const tdEmail = document.createElement('td');
        tdEmail.textContent = data.email || '-';
        
        // Mobile
        const tdMobile = document.createElement('td');
        tdMobile.textContent = data.mobile || '-';
        
        // Address
        const tdAddress = document.createElement('td');
        tdAddress.textContent = data.address || '-';
        
        // Description
        const tdDesc = document.createElement('td');
        tdDesc.textContent = data.description || '-';
        
        tr.appendChild(tdDate);
        tr.appendChild(tdName);
        tr.appendChild(tdEmail);
        tr.appendChild(tdMobile);
        tr.appendChild(tdAddress);
        tr.appendChild(tdDesc);
        
        dataBody.appendChild(tr);
    });
}

// Convert data to CSV and trigger download
function exportToCSV() {
    const existingData = JSON.parse(localStorage.getItem('formSubmissions')) || [];
    
    if (existingData.length === 0) {
        alert("No data to export!");
        return;
    }

    // Define CSV headers
    const headers = ["Date", "Name", "Email", "Mobile", "Address", "Description"];
    
    // Create CSV rows
    const csvRows = [];
    csvRows.push(headers.join(',')); // Add header row

    // Add data rows
    existingData.forEach(row => {
        const values = [
            `"${row.timestamp || ''}"`,
            `"${(row.name || '').replace(/"/g, '""')}"`,
            `"${(row.email || '').replace(/"/g, '""')}"`,
            `"${(row.mobile || '').replace(/"/g, '""')}"`,
            `"${(row.address || '').replace(/"/g, '""')}"`,
            `"${(row.description || '').replace(/"/g, '""')}"`
        ];
        csvRows.push(values.join(','));
    });

    // Create the CSV string
    const csvString = csvRows.join('\n');
    
    // Create a Blob and trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "submissions_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Event Listeners
loadData(); // Call immediately since script is at bottom of body
document.getElementById('exportBtn').addEventListener('click', exportToCSV);
