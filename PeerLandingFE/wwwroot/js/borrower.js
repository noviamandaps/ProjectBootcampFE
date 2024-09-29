document.addEventListener('DOMContentLoaded', function () {
    getBalance();
    getLoanList();
});

function getBalance() {
    const token = localStorage.getItem('jwtToken');
    const id = sessionStorage.getItem('id');
    console.log("User ID: ", sessionStorage.getItem('id'));

    fetch(`/ApiBorrower/GetUserById?id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            return response.json();
        })
        .then(data => {
            const lenderElm = document.getElementById('borrowerBalance');
            if (data && !data.isNullOrEmpty) {
                const user = data.data;
                console.log(data);
                if (lenderElm) {
                    lenderElm.innerHTML = 'Rp ' + user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace('.', ',');
                    lenderElm.style.fontFamily = 'Arial, sans-serif';
                    lenderElm.style.fontSize = '22px';
                    lenderElm.style.color = '#2c3e50';
                }
                console.log(user.balance);
                return parseFloat(user.balance);
            }
            else {
                alert('user not found or null');
                return 0;
            }
        })
        .catch(error => {
            alert('Error fetching user data: ' + error.message);
            return 0;
        });
}

function showAddLoanModal() {
    $('#addLoanModal').modal('show');
}

async function addLoan() {
    const amount = parseFloat(document.getElementById("loanAmount").value);
    const interest = parseFloat(document.getElementById("interestRate").value);
    const borrowerId = sessionStorage.getItem('id');
    const reqAddLoanDTO = {
        borrowerId: borrowerId,
        amount: amount,
        interestRate: interest
    }
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/ApiBorrower/AddLoan', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqAddLoanDTO),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add loan')
            }
            return response.json();
        })
        .then(data => {
            alert('Loan added')
            $('#addLoanModal').modal('hide');
            getBalance();
        })
        .catch(error => {
            alert('Error adding loan: ' + error.message);
        });
}

async function getLoanList() {
    try {
        const token = localStorage.getItem('jwtToken');
        const borrowerId = sessionStorage.getItem('id');
        const response = await fetch(`/ApiBorrower/GetLoans?idBorrower=${borrowerId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const responseClone = response.clone();
        if (!response.ok) {
            let errorResponse;
            try {
                errorResponse = await responseClone.json();
            } catch (jsonError) {
                errorResponse = await responseClone.text();
            }
            alert(`Failed to fetch loans: ${response.status} - ${errorResponse}`);
            return;
        }

        const jsonData = await response.json();
        if (jsonData.success) {
            populateLoanTable(jsonData.data);
        } else {
            alert('No loans');
        }
    }
    catch (error) {
        alert('An error occurred while fetching loan data: ' + error.message);
    }
}

function populateLoanTable(loans) {
    const loanTable = document.querySelector('#loanListTable tbody');
    loanTable.innerHTML = '';

    loans.forEach(loan => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${loan.amount}</td>
        <td>${loan.interestRate}</td>
        <td>${loan.duration}</td>
        <td>${loan.status}</td>
        `;
        loanTable.appendChild(row);
    });
}