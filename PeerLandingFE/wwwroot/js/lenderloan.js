async function fetchLoans() {
  const token = localStorage.getItem('jwtToken');
  const lenderId = sessionStorage.getItem('id');

  try {
    // Fetch all loans
    const response = await fetch('/ApiLoan/GetAllLoans', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch loans');
    }

    const jsonData = await response.json();

    if (jsonData.success) {
      populateLoansTable(jsonData.data);
    } else {
      throw new Error(jsonData.message || 'No loans available');
    }
  } catch (error) {
    alert(error.message);
  }
}

async function fundLoan(loanId) {
  const token = localStorage.getItem('jwtToken');
  const userId = localStorage.getItem('id');

  const reqFundLoanDto = {
    lenderId: userId,
    loanId: loanId,
  };

  const response = await fetch(`https://localhost:7020/rest/v1/loan/FundLoan`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqFundLoanDto),
  });

  if (response.ok) {
    alert('Loan funded successfully');
    fetchLoan();
  } else {
    const errorData = await response.json();
    alert(`Error: ${errorData.message}`);
  }
}

function populateLoansTable(loans) {
  const loanTableBody = document.querySelector('#loanTable tbody');
  loanTableBody.innerHTML = '';

  loans.forEach((loan) => {
    const row = document.createElement('tr');

    let actionButton = '';
    if (loan.status === 'requested') {
      actionButton = `<button class="btn btn-primary btn-sm" onClick="fundLoan('${loan.loanId}')">Beri Pinjaman</button>`;
    } else {
      actionButton = `<button class="btn btn-warning btn-sm" disabled>Loan already funded</button>`;
    }

    row.innerHTML = `
           <td>${loan.user.name}</td>
            <td>${loan.amount}</td>
            <td>${loan.interestRate}</td>
            <td>${loan.duration} Bulan</td>
            <td>${loan.status}</td>
            <td>${loan.createdAt}</td>
            <td>${actionButton}</td>
        `;

    loanTableBody.appendChild(row);
  });
}

async function approveLoan(id) {
  console.log(id);
  const token = localStorage.getItem('jwtToken');
  const _lenderId = localStorage.getItem('id');

  const reqApproveLoanDto = {
    loanId: id,
    lenderId: _lenderId,
  };

  console.log(reqApproveLoanDto);

  const response = await fetch('/ApiLender/ApproveLoan', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqApproveLoanDto),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to approve loan');
      }
      return response.json();
    })
    .then((data) => {
      alert('Loan approved successfully!');
    })
    .catch((error) => {
      alert('Error approving loan: ' + error.message);
    });
}

async function fetchHistoryLoans() {
  const token = localStorage.getItem('jwtToken');
  const id = localStorage.getItem('userId');

  const response = await fetch('/ApiLender/GetHistoryLoans?lenderId=${id}', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  if (!response.ok) {
    alert('failed to fetch loans');
    return;
  }

  const loansData = await response.json();
  if (loansData.success) {
    populateHistoryLoanTable(loansData.data);
  } else {
    alert('No loans');
  }
}

function populateHistoryLoanTable(loans) {
  const historyLoanTableBody = document.querySelector(
    '#historyLoanTable tbody'
  );
  historyLoanTableBody.innerHTML = '';

  loans.forEach((loan) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${loan.borrowerName} </td>
        <td>${loan.amount} </td>
        <td>${loan.repaidAmount} </td>
        <td>${loan.balanceAmount} </td>
        <td>${loan.repaidStatus} </td>
        <td>${loan.paidAt} </td>
        `;
    historyLoanTableBody.appendChild(row);
  });
}

window.onload = function () {
  fetchLoans();
  fetchSaldo();
  fetchLoans();
  fetchHistoryLoans();
  fundLoan();
};
