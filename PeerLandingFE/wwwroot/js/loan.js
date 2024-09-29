async function fetchLoan() {
  const token = localStorage.getItem('jwtToken');
  const userId = localStorage.getItem('id');

  const response = await fetch(`/ApiLoan/GetAllLoanByUserId?id=${userId}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });

  if (!response.ok) {
    alert('Failed to fetch loans');
    return;
  }

  const jsonData = await response.json();
  if (jsonData.success) {
    populateLoanTable(jsonData.data);
  } else {
    alert(jsonData.message);
  }
}

function populateLoanTable(loans) {
  const loanTableBody = document.querySelector('#loanTable tbody');
  loanTableBody.innerHTML = '';
  console.log(loans);

  loans.forEach((loan) => {
    const row = document.createElement('tr');
    row.innerHTML = `
          <td>${loan.amount}</td>
          <td>${loan.interestRate.toFixed(2)}%</td>
          <td>${loan.duration} Bulan</td>
          <td>${loan.status}</td>
          <td>            
             ${getLoanActionButton(loan)}
          </td>
        `;
    loanTableBody.appendChild(row);
  });
}

function getLoanActionButton(loan) {
  switch (loan.status) {
    case 'funded':
    case 'on-repaid':
      return `<button class="btn btn-success btn-sm" onClick="populatePaymentsModal('${loan.loanId}')">Pay</button>`;
    case 'requested':
      return `<button class="btn btn-secondary btn-sm" disabled>Waiting Approval</button>`;
    case 'repaid':
      return `<button class="btn btn-info btn-sm" onClick="populatePaymentsModal('${loan.loanId}')">Details</button>`;
    default:
      return `<span class="text-muted">No action</span>`;
  }
}

async function populatePaymentsModal(loanId) {
  const token = localStorage.getItem('jwtToken');
  console.log(token);

  const response1 = await fetch(
    `https://localhost:7020/rest/v1/repayment/GetMonthlyPaymentByLoanId?loanId=${loanId}`,
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }
  );

  if (!response1.ok) {
    alert('Failed to fetch repayment');
    return;
  }

  const jsonData1 = await response1.json();
  console.log(jsonData1);

  if (jsonData1.success) {
    const paymentRows = document.getElementById('paymentRows');
    paymentRows.innerHTML = '';

    jsonData1.data.forEach((payment, index) => {
      const row = document.createElement('tr');

      const monthCell = document.createElement('td');
      monthCell.textContent = `Bulan ${index + 1}`;

      const amountCell = document.createElement('td');
      amountCell.textContent = payment.amount;

      const paymentIdCell = document.createElement('td');
      paymentIdCell.textContent = payment.id;

      const payCell = document.createElement('td');
      const checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.checked = payment.status;
      checkBox.disabled = payment.status;

      payCell.appendChild(checkBox);

      row.appendChild(monthCell);
      row.appendChild(amountCell);
      row.appendChild(paymentIdCell);
      row.appendChild(payCell);

      console.log(row);
      paymentRows.appendChild(row);
    });

    $('#viewPaymentsModal').modal('show');
  } else {
    alert(jsonData1.message);
  }
}

async function submitPayment() {
  const token = localStorage.getItem('jwtToken');
  const selectedPayments = [];

  const paymentRows = document.querySelectorAll('#paymentRows tr');

  paymentRows.forEach((row) => {
    const checkBox = row.querySelector('input[type="checkbox"]');
    const paymentIdCell = row.cells[2];

    if (checkBox.checked && !checkBox.disabled) {
      const paymentId = paymentIdCell.textContent;

      selectedPayments.push(paymentId);
    }
  });

  if (selectedPayments.length === 0) {
    alert('Please select at least one payment to proceed.');
    return;
  }

  const payload = {
    paymentIds: selectedPayments,
  };
  console.log(payload);

  const response = await fetch(
    'https://localhost:7020/rest/v1/repayment/PayMultipleMonthlyPayment',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(payload),
    }
  );

  if (response.ok) {
    alert('Payments submitted successfully!');
    $('#viewPaymentsModal').modal('hide');
  } else {
    const errorData = await response.json();
    alert(`Error: ${errorData.message}`);
  }
}

async function addRequestLoan() {
  const amount = document.getElementById('requestLoanAmount').value;
  const interestRate = document.getElementById('requestLoanInterestRate').value;
  const borrowerId = localStorage.getItem('id');

  const reqAddLoanDto = {
    amount: parseFloat(amount),
    borrowerId: borrowerId,
    interestRate: parseFloat(interestRate),
    duration: 12,
  };

  const token = localStorage.getItem('jwtToken');

  const response = await fetch(`/ApiLoan/AddLoanRequest`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqAddLoanDto),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to add loan request');
      }
      return response.json();
    })
    .then((data) => {
      alert('Loan request added successfully');
      $('#addRequestLoanModal').modal('hide');
      fetchLoan();
    })
    .catch((error) => {
      alert('Error adding loan request: ' + error.message);
    });
}

window.onload = fetchLoan;
