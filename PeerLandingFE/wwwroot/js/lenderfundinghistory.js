async function fetchFundingsByLenderId() {
  const token = localStorage.getItem('jwtToken');
  const id = localStorage.getItem('id');

  try {
    const response = await fetch(
      `https://localhost:7020/rest/v1/loan/GetLoanHistoryForLender?lenderId=${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch fundings');
    }

    const jsonData = await response.json();

    if (jsonData.success) {
      populateFundingsTable(jsonData.data);
    } else {
      throw new Error(jsonData.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert(error.message);
  }
}

function populateFundingsTable(fundings) {
  const loansHistoryTableBody = document.querySelector(
    '#loansHistoryTable tbody'
  );
  loansHistoryTableBody.innerHTML = '';

  fundings.forEach((funding) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${funding?.borrowerName}</td>
        <td>${formatCurrency(funding?.amount)}</td>
        <td>${formatCurrency(funding?.repaidAmount)}</td>
        <td>${formatCurrency(funding?.balanceAmount)}</td>
        <td>${funding?.repaidStatus}</td>
        <td>${formatDate(funding?.paidAt)}</td>
      `;
    loansHistoryTableBody.appendChild(row);
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

document.addEventListener('DOMContentLoaded', fetchFundingsByLenderId);
