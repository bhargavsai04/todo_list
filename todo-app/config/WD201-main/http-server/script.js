

let userEntries = JSON.parse(localStorage.getItem("userEntries")) || [];


const retrieveEntries = () => {
    return JSON.parse(localStorage.getItem('userEntries')) || [];
}


const displayEntries = () => {
    let entries = retrieveEntries();
    let tableEntries = entries.map(entry => {
        return `<tr>${Object.values(entry).map(val => `<td class='border px-4 py-2'>${val}</td>`).join('')}</tr>`;
    }).join('\n');
    document.getElementById('user-entries').innerHTML = `
        <table class='table-auto w-full'>
            <tr>
                <th class='px-4 py-2 '>Name </th>
                <th class='px-4 py-2 '>Email </th>
                <th class='px-4 py-2 '>Password </th>
                <th class='px-4 py-2 '>Dob </th>
                <th class='px-4 py-2 '>Accepted terms? </th>
            </tr>
            ${tableEntries}
        </table>`;
}


const calculateAge = dob => {
    let birthYear = new Date(dob).getFullYear();
    let currentYear = new Date().getFullYear();
    return currentYear - birthYear;
}


const saveUserForm = event => {
    event.preventDefault();
    let dob = document.getElementById('dob').value;
    let age = calculateAge(dob);
    if (age < 18 || age > 55) {
        alert("Age must be between 18 and 55");
        document.getElementById('dob').style = 'border:1px solid red';
    } else {
        document.getElementById('dob').style = 'border:none';
        let entry = {
            Name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            dob: dob,
            acceptTerms: document.getElementById('acceptTerms').checked
        };
        userEntries.push(entry);
        localStorage.setItem("userEntries", JSON.stringify(userEntries));
        displayEntries();
        document.getElementById("user_form").reset();
    }
}


document.getElementById("user_form").addEventListener('submit', saveUserForm);


displayEntries();