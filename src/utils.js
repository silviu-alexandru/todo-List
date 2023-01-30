const getCategory = () => {
    const projects = document.querySelectorAll('.sb-option');
    let category = '';
    projects.forEach(element => {
        if (element.classList.contains('selected')) {
            console.log(element.textContent);
            category = element.textContent;
        }         
    });
    return category
}

const saveToStorage = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos))
}

const getId = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    /*         var fakeRandom4 = (Math.floor(Math.random() * 899999999 + 100000000));
            $("#idAdresaDif").setValue(($("#caseUID").getValue()).slice(0, 23) + fakeRandom4); */


    return result;
}

function closeForm() {
    document.getElementById("todoForm").style.display = "none";
    todoForm.innerHTML = '';
}
export {getCategory, saveToStorage, getId, closeForm};