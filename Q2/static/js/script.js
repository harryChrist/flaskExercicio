document.addEventListener('DOMContentLoaded', () => {
    // Remove a chamada de fetchMessageOfTheDay() aqui

    const fetchMessageOfTheDay = async () => {
        const userBirthDate = document.getElementById('birthdate-input').value;
        const apiUrl = `http://localhost:5000/api/mensagem-do-dia?data_nascimento=${userBirthDate}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            displayMessageOfTheDay(data);
        } catch (error) {
            console.error('Error fetching message of the day:', error);
        }
    };

    const displayMessageOfTheDay = (data) => {
        document.getElementById('birthdate').textContent = data['data-de-nascimento'];
        document.getElementById('sign').textContent = data['signo'];
        document.getElementById('message').textContent = data['mensagem'];

        document.getElementById('loading').style.display = 'none';
        document.getElementById('message-container').style.display = 'block';
    };

    // Remove a chamada de fetchMessageOfTheDay() aqui
});
