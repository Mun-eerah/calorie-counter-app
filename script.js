const calorieCounter = document.getElementById("calorie-counter");
const budgetNumberInput = document.getElementById("budget");
const entryDropdown = document.getElementById("entry-dropdown")
const addEntryButton = document.getElementById("add-entry");
const removeEntryButton = document.getElementById("remove-entry");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");
let isError = false;

const nigerianFoodsDatabase = [
    { name: "Eba (Garri)", calories: 250 }, //swallows
    { name: "Amala (Yam Flour)", calories: 220 },
    { name: "Pounded yam(Iyan)", calories: 500 },
    { name: "Fufu (Akpu)", calories: 400 },
    { name: "Tuwo Shinkafa", calories: 320 },
    { name: "Semovita", calories: 370 },
    { name: "White Rice (1 cup cooked)", calories: 180 }, //extra foods
    { name: "Jollof Rice (1 plate basic)", calories: 320 },
    { name: "Fried Plantain (Dodo)", calories: 250 }, 
    { name: "Boiled Plantain (1 medium)", calories: 130 },
    { name: "Boiled Yam (1 slice)", calories: 100 },
    { name: "Beans (Ewa, 1 cup cooked)", calories: 270 },
    { name: "Akara (1 ball)", calories: 50 },
    { name: "Moi Moi (1 wrap)", calories: 170 },
    { name: "Egusi Soup (light serving)", calories: 280 }, //soups
    { name: "Efo Riro (light serving)", calories: 200 },
    { name: "Okra Soup (light serving)", calories: 180 },
    { name: "Ogbono Soup (light serving)", calories: 220 },
    { name: "Afang Soup (light serving)", calories: 250 },
    { name: "Banga Soup (light serving)", calories: 350 },
    { name: "Ayamase Stew (Ofada Stew, 1 serving)", calories: 200 },
    { name: "Nigerian Stew (Tomato, 1 serving)", calories: 150 },
    { name: "Fried Fish (1 piece)", calories: 250 }, //proteins
    { name: "Boiled Egg (1 large)", calories: 78 },
    { name: "Fried Egg (1 large)", calories: 120 },
    { name: "Fried Chicken (1 piece)", calories: 300 },
    { name: "Boiled Chicken (1 piece)", calories: 180 },
    { name: "Suya (small stick)", calories: 150 },
    { name: "Pomo (Cow Skin, 1 piece)", calories: 50 },
    { name: "Buns (1 piece)", calories: 200 },
    { name: "Puff-Puff (1 piece)", calories: 100 },
    { name: "Doughnut (1 piece)", calories: 250 },
    { name: "Tea Bread (1 slice)", calories: 120 },
    { name: "Akamu/Ogi (1 cup)", calories: 120 },
    { name: "Kunu (1 cup)", calories: 150 },
    { name: "Zobo (1 cup, unsweetened)", calories: 20 },
    { name: "Groundnut (1 small handful)", calories: 100 },
    { name: "Catfish (1 piece)", calories: 220 }, // Add more common items like:
    { name: "Goat Meat (1 piece)", calories: 180 },
    { name: "Yam Porridge (Asaro, 1 serving)", calories: 400 },
    { name: "Indomie Noodles (1 packet cooked)", calories: 380 }, // Basic, without extras
    { name: "Coconut Rice (1 plate)", calories: 500 },
    { name: "Plantain Porridge (1 serving)", calories: 350 },
    { name: "Eba & Egusi (typical plate)", calories: 700 }, // Combined meal
    { name: "Pounded Yam & Egusi (typical plate)", calories: 750 }, // Combined meal
]
function cleanInputString(str) {
    const regex = /[+-\s]/g;
    return str.replace(regex, '');
}

function isInvalidInput(str) {
    const regex = /\d+e\d+/i;
    return str.match(regex);
}

function setupSearch(inputElement, resultsContainer, nigerianFoodsDatabase) {
    let timeoutID;

    inputElement.addEventListener('input', () => {
        clearTimeout(timeoutID);

        timeoutID = setTimeout(() => {
            const searchText = inputElement.value.toLowerCase().trim();
            resultsContainer.innerHTML = '';

            if (searchText.length > 1) {
                const filteredItems = nigerianFoodsDatabase.filter(food => food.name.toLowerCase().includes(searchText));
                if (filteredItems.length > 0) {
                    resultsContainer.style.display = 'block';
                    filteredItems.forEach(food => {
                        const resultDiv = document.createElement('div');
                        resultDiv.classList.add('search-result-food');
                        resultDiv.innerHTML = `<span>${food.name}</span> (${food.calories} cal)`;
                        resultDiv.addEventListener('click', () => {     //Handle click on a search result
                            inputElement.value = food.name; //set the name input field
                            const caloriesInputId = inputElement.id.replace('-name', '-calories'); //want to match the name with the corresponding calories
                            const caloriesInput = document.getElementById(caloriesInputId);
                            if (caloriesInput) {
                                caloriesInput.value = food.calories; //sets input calories field
                            }
                            resultsContainer.innerHTML = '';
                            resultsContainer.style.display = 'none';
                        });
                        resultsContainer.appendChild(resultDiv);
                    })
                } else {
                    resultsContainer.style.display = 'none';
                }
            } else {
                resultsContainer.style.display = 'none';
            }
        }, 300);  //300ms delay
    });
    // Hide results when clicking outside the input or results container
    document.addEventListener('click', (event) => {  //event.target is where the user clicks on
        if (!resultsContainer.contains(event.target) && event.target !== inputElement) { //if resultsContainer doesnt contain event.target, where user is going to click
            resultsContainer.style.display = 'none'; 
        }
    });
}

function addEntry() {
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`); //targetInputContainer refers to each fields such as breakfast, lunch e.t.c
    const entryNumber = targetInputContainer.querySelectorAll('.templateEntry').length + 1;  //'input[type="text"]' replaced by templateEntry
    const entryType = entryDropdown.value;

    // new htmlstring for the name input, calories input and results div
    const HTMLString = ` 
        <div class="templateEntry">
            <label for="${entryType}-${entryNumber}-name">Entry ${entryNumber} Name</label>
            <input type="text" id="${entryType}-${entryNumber}-name" class="food-name-input" placeholder="Name"/>
            <div id="${entryType}-${entryNumber}-results" class="search-results"></div>
            <label for="${entryType}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
            <input type="number" min="0" id="${entryType}-${entryNumber}-calories" class="food-calories-input" placeholder="Calories"/>
        </div>
        `;
    targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
    const newlyAddedNameInput = document.getElementById(`${entryType}-${entryNumber}-name`);
    const newlyAddedResultsContainer = document.getElementById(`${entryType}-${entryNumber}-results`);

    
    if (['breakfast', 'lunch', 'dinner'].includes(entryType)) {
        setupSearch(newlyAddedNameInput, newlyAddedResultsContainer, nigerianFoodsDatabase);
    }  
}

function removeEntry() {
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
    const allTargetInputContainers = targetInputContainer.querySelectorAll('.templateEntry');
    if (allTargetInputContainers.length > 0) {
        const lastEntry = allTargetInputContainers[allTargetInputContainers.length - 1];
        lastEntry.remove();
    } else {
        alert('All entries removed!');
    } 
}

function calculateCalories(e) {
    e.preventDefault();
    isError = false;
    //get each of the inputs of the entrydropdown.value so you can access their inputs which is the children
    const breakfastCaloriesInputs = document.querySelectorAll('#breakfast input[type="number"]');
    const lunchCaloriesInputs = document.querySelectorAll('#lunch input[type="number"]');
    const dinnerCaloriesInputs = document.querySelectorAll('#dinner input[type="number"]');
    const snacksCaloriesInputs = document.querySelectorAll('#snacks input[type="number"]');
    const exerciseCaloriesInputs = document.querySelectorAll('#exercise input[type="number"]');

    const breakfastCalories = getCaloriesFromInputField(breakfastCaloriesInputs);
    const lunchCalories = getCaloriesFromInputField(lunchCaloriesInputs);
    const dinnerCalories = getCaloriesFromInputField(dinnerCaloriesInputs);
    const snacksCalories = getCaloriesFromInputField(snacksCaloriesInputs);
    const exerciseCalories = getCaloriesFromInputField(exerciseCaloriesInputs);
    const budgetCalories = getCaloriesFromInputField([budgetNumberInput]);

    if (isError) {
        return;
    }

    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
    const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';

    output.innerHTML = `
        <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
        <hr>
        <p>${budgetCalories} Calories Budgeted</p>
        <p>${consumedCalories} Calories Consumed</p>
        <p>${exerciseCalories} Calories Burned</p>
    `;
    output.classList.remove("hide");
}

function getCaloriesFromInputField(list) {  //a list for each calorie input field e.g  ALL breakfast calories inputs
    let calories = 0;
    for (const item of list) {
        const cleanedValue = cleanInputString(item.value);
        const invalidInputMatch = isInvalidInput(cleanedValue);
        if (invalidInputMatch) {
            alert('Invalid Input: ${invalidInputMatch[0]}')
            isError = true;
            return null;
        }
        calories += Number(cleanedValue);
    }
    return calories;
}
function clearForm() {
    const inputContainers = document.querySelectorAll('.input-container');
    for (const container of inputContainers) {
        container.innerHTML = '';
    }
    budgetInputNumber.value = '';
    output.innerText = '';
    output.classList.add('hide');
}

addEntryButton.addEventListener('click', addEntry);
removeEntryButton.addEventListener('click', removeEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener('click', clearForm);
