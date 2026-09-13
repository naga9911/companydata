document.addEventListener('DOMContentLoaded', () => {
    const sidebarBtns = document.querySelectorAll('.sidebar-btn');
    const screenSections = document.querySelectorAll('.screen-section');
    const dataForms = document.querySelectorAll('.data-form');
    
    const tableHeaders = document.getElementById('tableHeaders');
    const tableBody = document.getElementById('tableBody');
    const noDataMessage = document.getElementById('noDataMessage');
    const dataTable = document.getElementById('dataTable');
    const downloadCsvBtn = document.getElementById('downloadCsvBtn');

    let currentScreen = 'screen1-1';
    let editingIndex = null;

    // 1. Navigation Logic
    
    // Toggle Dropdowns
    const toggleBtns = document.querySelectorAll('.sidebar-toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Close other dropdowns (optional - depends on preference, let's keep them independent for now or close others to be clean)
            toggleBtns.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    otherBtn.classList.remove('active');
                    const otherDropdown = otherBtn.nextElementSibling;
                    if (otherDropdown) otherDropdown.classList.remove('show');
                    const otherArrow = otherBtn.querySelector('.arrow');
                    if (otherArrow) otherArrow.textContent = '▶';
                }
            });

            // Toggle current
            btn.classList.toggle('active');
            const dropdown = btn.nextElementSibling;
            if (dropdown) {
                dropdown.classList.toggle('show');
            }
            const arrow = btn.querySelector('.arrow');
            if (arrow) {
                arrow.textContent = dropdown.classList.contains('show') ? '▼' : '▶';
            }
        });
    });

    // Sub-screen Navigation
    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes from all sub-btns
            sidebarBtns.forEach(b => b.classList.remove('active'));
            screenSections.forEach(s => s.classList.remove('active-screen'));

            // Add active class to clicked button and target screen
            btn.classList.add('active');
            currentScreen = btn.getAttribute('data-target');
            document.getElementById(currentScreen).classList.add('active-screen');

            // Reset editing state when switching screens
            editingIndex = null;
            dataForms.forEach(f => f.reset());

            // Re-render table for the selected screen
            renderTable();
        });
    });

    // 2. Form Submission and Deletion
    dataForms.forEach(form => {
        // Handle Submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const screenId = form.getAttribute('data-screen');
            
            // Gather form data
            const formData = new FormData(form);
            const entry = {};
            formData.forEach((value, key) => {
                entry[key] = value;
            });
            entry.timestamp = new Date().toLocaleString();

            // Save to localStorage
            const storageKey = `company_data_${screenId}`;
            const existingData = JSON.parse(localStorage.getItem(storageKey)) || [];
            
            if (editingIndex !== null) {
                // Update existing entry (keep original timestamp)
                entry.timestamp = existingData[editingIndex].timestamp;
                existingData[editingIndex] = entry;
                editingIndex = null; // reset
            } else {
                // Add new entry
                existingData.push(entry);
            }
            
            localStorage.setItem(storageKey, JSON.stringify(existingData));

            // Reset form and update table
            form.reset();
            renderTable();
        });

        // Handle Delete (Clear form)
        const deleteBtn = form.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                form.reset();
                editingIndex = null;
            });
        }
    });

    // 3. Render Table
    function renderTable() {
        const storageKey = `company_data_${currentScreen}`;
        const data = JSON.parse(localStorage.getItem(storageKey)) || [];

        // Clear existing table
        tableHeaders.innerHTML = '';
        tableBody.innerHTML = '';

        if (data.length === 0) {
            dataTable.style.display = 'none';
            noDataMessage.style.display = 'block';
            downloadCsvBtn.style.display = 'none';
            return;
        }

        dataTable.style.display = 'table';
        noDataMessage.style.display = 'none';
        downloadCsvBtn.style.display = 'inline-block';

        // Extract headers from the first entry (assuming consistent structure)
        const headers = Object.keys(data[0]);
        
        // Build Header Row
        headers.forEach(header => {
            const th = document.createElement('th');
            // Format camelCase to Title Case
            const formattedHeader = header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            th.textContent = formattedHeader;
            tableHeaders.appendChild(th);
        });

        // Add Actions header
        const actionTh = document.createElement('th');
        actionTh.textContent = 'Actions';
        tableHeaders.appendChild(actionTh);

        // Build Data Rows
        data.forEach((entry, index) => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = entry[header];
                tr.appendChild(td);
            });

            // Add Edit Button
            const actionTd = document.createElement('td');
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => {
                editRow(index, entry);
            });
            actionTd.appendChild(editBtn);
            tr.appendChild(actionTd);

            tableBody.appendChild(tr);
        });
    }

    // Handle Edit Click
    function editRow(index, entry) {
        editingIndex = index;
        
        // Find the active form
        const activeForm = document.querySelector(`.data-form[data-screen="${currentScreen}"]`);
        if (!activeForm) return;

        // Populate fields
        Object.keys(entry).forEach(key => {
            const input = activeForm.elements[key];
            if (input) {
                input.value = entry[key];
            }
        });

        // Scroll to form
        activeForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 4. Download CSV
    downloadCsvBtn.addEventListener('click', () => {
        const storageKey = `company_data_${currentScreen}`;
        const data = JSON.parse(localStorage.getItem(storageKey)) || [];

        if (data.length === 0) return;

        const headers = Object.keys(data[0]);
        let csvContent = headers.join(',') + '\n';

        data.forEach(row => {
            const rowValues = headers.map(header => {
                let cellData = row[header] || '';
                // Escape quotes and wrap in quotes if contains comma
                cellData = cellData.toString().replace(/"/g, '""');
                if (cellData.includes(',')) {
                    cellData = `"${cellData}"`;
                }
                return cellData;
            });
            csvContent += rowValues.join(',') + '\n';
        });

        // Trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${currentScreen}_data.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Initial render
    renderTable();
});
