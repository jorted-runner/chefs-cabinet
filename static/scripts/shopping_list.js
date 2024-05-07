document.addEventListener('DOMContentLoaded', function() {
    const dataText = document.querySelector('.data').textContent;
    const data = JSON.parse(dataText);
    
    const shoppingList = data.shopping_list;
    const ulElmnt = document.createElement('ul');
    for (const key in shoppingList) {
        if (shoppingList.hasOwnProperty(key)) {
            const value = shoppingList[key];
            console.log(`${key}: ${value}`);
            const li = document.createElement('li');
            li.innerHTML = `${value} ${key}`;
            ulElmnt.appendChild(li);
        }
    }
    document.querySelector('.list').appendChild(ulElmnt);
});
