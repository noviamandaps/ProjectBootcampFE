﻿async function fetchUserById() {
    const token = localStorage.getItem("jwtToken");
    const id = localStorage.getItem("id")

    const response = await fetch(`/ApiMstUser/GetUserById?id=${id}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (!response.ok) {
        alert('Failed to fetch user data');
    }

    const data = await response.json();

    if (data.success) {
        const user = data.data;

        document.getElementById("userBalance").textContent = user.balance;
    } else {
        alert(data.message);
    }
}

async function updateBalance() {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("jwtToken");
    const balance = document.getElementById('saldoAmount').value;

    try {
        const response = await fetch(`/ApiMstUser/GetUserById?id=${id}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data: ' + response.statusText);
        }

        const data = await response.json();

        if (data.success) {
            const reqMstUserDto = {
                name: data.data.name,
                role: data.data.role,
                balance: parseFloat(balance)
            };

            const updateResponse = await fetch(`/ApiMstUSer/UpdateUser/${id}`, {
                method: 'PUT',
                headers: {
                    "Authorization": "Bearer " + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqMstUserDto)
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to update balance');
            }

            const updateData = await updateResponse.json();
            console.log(updateData);

            $('#editSaldoModal').modal('hide');
            alert('Balance updated successfully');            
            fetchUserById();
        } else {
            alert('User not found');
        }
    } catch (error) {
        alert('Error: ' + error);
    }
}



window.onload = fetchUserById();