/***** APP CONTROLLER *****/
import * as UIControl from './ui.js';
import { updateOverview } from './ui.js';
import * as BudgetControl from './budget.js';
import { budgetData } from './budget.js';
import { calculateBudget } from './budget.js';
window.budgetData = budgetData;
window.calculateBudget = calculateBudget;
window.updateOverview = updateOverview;

var isClosed = 0;

// Event lisenters
document.querySelectorAll('.dark-mode-switch').forEach(el => {
    el.addEventListener('click', (event) => {
        UIControl.switchTheme(event);
    })
});

document.querySelectorAll('.inc').forEach(el => {
    el.addEventListener('click', () => {
        closeSettings();
        toggleSheet('inc-sheet', 'exp-sheet');
    })
});

document.querySelectorAll('.exp').forEach(el => {
    el.addEventListener('click', () => {
        closeSettings();
        toggleSheet('exp-sheet', 'inc-sheet');
    })
});

document.querySelectorAll('.home').forEach(el => {
    el.addEventListener('click', () => {
        showHome();
        closeSettings();
    })
});

document.querySelectorAll('.settings').forEach(el => {
    el.addEventListener('click', () => {
        showHome();
        toggleSettings();
    })
});

document.querySelector('.add-inc-btn').addEventListener('click', () => {
    addIncome();
});

document.querySelector('.add-exp-btn').addEventListener('click', () => {
    addExpense();
});

document.querySelector('.close-inc-sheet').addEventListener('click', () => {
    toggleSheet('inc-sheet', 'inc-sheet');
});

document.querySelector('.close-exp-sheet').addEventListener('click', () => {
    toggleSheet('exp-sheet', 'exp-sheet');
});

document.querySelector('.close-set-sheet').addEventListener('click', () => {
    closeSettings();
});

document.querySelector('.inc-list').addEventListener('click', () => {
    let itemID;

    itemID = event.target.parentNode.parentNode.id;

    deleteIncItem(itemID);
});

document.querySelector('.exp-list').addEventListener('click', () => {
    let itemID;

    itemID = event.target.parentNode.parentNode.id;

    deleteExpItem(itemID);
});

document.getElementById('clear-inc-btn').addEventListener('click', () => {
    clearAllItems('inc');
});

document.getElementById('clear-exp-btn').addEventListener('click', () => {
    clearAllItems('exp');
});

document.addEventListener('keypress', function(event) {
    if (event.keyCode === 13 || event.which == 13) {
        if (document.querySelector('.inc-sheet').style.visibility === 'visible') {
            addIncome();
        } else if (document.querySelector('.exp-sheet').style.visibility === 'visible') {
            addExpense();
        } else if (document.querySelector('.savings-rate').style.display === 'flex') {
            changeSavingsRate();
        }
    }
});

document.querySelector('.rate-btn').addEventListener('click', () => {
    showRate();
})

document.querySelector('.close-rate-btn').addEventListener('click', () => {
    closeRate();
})

document.querySelector('.close-welcome-btn').addEventListener('click', () => {
    closeWelcome();
    isClosed = 1;
    window.localStorage.setItem('isClosed', JSON.stringify(isClosed));
})

document.querySelector('.change-rate').addEventListener('click', () => {
    changeSavingsRate();
})

document.querySelector('.click-background').addEventListener('click', () => {
        closeRate();
    })

document.querySelectorAll('.reset-btn').forEach(el => {
    el.addEventListener('click', () => {
        BudgetControl.changeRate(0);
        clearAllItems('inc');
        clearAllItems('exp');
    })
})

export function formatNumber (num) {
    let int;

    int = Math.round(num);

    return `$${int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

// Add new income item to list
function addIncome () {

    let item;

    item = UIControl.getIncInput();

    if (item.value >= 0 && item.description !== NaN) {
    
        let input, newItem;
        // Get input from DOM
        input = UIControl.getIncInput();

        // Add item into budget
        newItem = BudgetControl.addItem('inc', input.description, input.value);

        // Add item to the UI
        UIControl.addIncItem(newItem);

        // Calculate/update budget
        BudgetControl.calculateBudget();

        // Clear fields
        clearFields('inc');

        // Update the overview UI
        UIControl.updateOverview();

    } else {
        let form;

        form = document.querySelector('.add-inc-form');
        
        form.classList.add('animate__shakeX');

        form.style.setProperty('--animate-duration', '.5s');

       removeShakeInc();
    }
}

// Add new expense item to list
function addExpense () {
    
    let item;
    
    item = UIControl.getExpInput();
    
    if (item.value >= 0 && item.description !== NaN) {
        
        let input, newItem;
        // Get input from DOM
        input = UIControl.getExpInput();
        
        // Add item into budget
        newItem = BudgetControl.addItem('exp', input.description, input.value);
        
        // Add item to the UI
        UIControl.addExpItem(newItem);
        
        // Calculate/update budget
        BudgetControl.calculateBudget();
        
        // Clear fields
        clearFields('exp');
        
        // Update the overview UI
        UIControl.updateOverview();
    } else {
        let form;
        
        form = document.querySelector('.add-exp-form');
        
        form.classList.add('animate__shakeX');
        
        form.style.setProperty('--animate-duration', '.5s');
        
        removeShakeExp();
    }
}

function removeShakeInc () {
    setTimeout(() => {
        let form;

        form = document.querySelector('.add-inc-form');
    
        form.classList.remove('animate__shakeX');
    }, 500);
}

function removeShakeExp () {
    setTimeout(() => {
        let form;

        form = document.querySelector('.add-exp-form');
    
        form.classList.remove('animate__shakeX');
    }, 500);
}

function removeShakeRate () {
    setTimeout(() => {
        let form;

        form = document.querySelector('.rate-change');
    
        form.classList.remove('animate__shakeX');
    }, 500);
}

// Clear input fields after inputting data
function clearFields (type) {
    let fields, fieldsArr;
    
    if (type === 'inc') {
            fields = document.querySelectorAll(UIControl.DOMStrings.inputIncDescription + ', ' + UIControl.DOMStrings.inputIncValue);
        } else if (type === 'exp') {
            fields = document.querySelectorAll(UIControl.DOMStrings.inputExpDescription + ', ' + UIControl.DOMStrings.inputExpValue);
        } else if (type === 'rate') {
            fields = document.querySelectorAll(UIControl.DOMStrings.inputSavingsRate + ', ' + UIControl.DOMStrings.inputSavingsRate);
        }
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            fieldsArr[0].focus();
}

// Delete income item
function deleteIncItem (id) {

    // Delete item from budget
    BudgetControl.deleteItem('inc', id);

    // Delete item from the UI
    UIControl.deleteListItem(id);

    // Update the budget
    BudgetControl.calculateBudget();

    // Update the overview
    UIControl.updateOverview();
}

// Delete expense item
function deleteExpItem (id) {

    // Delete item from budget
    BudgetControl.deleteItem('exp', id);

    // Delete item from the UI
    UIControl.deleteListItem(id);

    // Update the budget
    BudgetControl.calculateBudget();

    // Update the overview
    UIControl.updateOverview();
}

function clearAllItems (type) {
    // Clear items from UI
    UIControl.clearList(type);

    // Clear items from budget
    BudgetControl.clearBudget(type);

    // Update budget
    BudgetControl.calculateBudget();

    // Update the overview
    UIControl.updateOverview();
}

function changeSavingsRate () {

    let hasRate;

    hasRate = UIControl.getSavingsInput();

    if (hasRate >= 0 && hasRate !== NaN) {

        let savingsRate;

        // Get new rate input
        savingsRate = UIControl.getSavingsInput();

        BudgetControl.changeRate(savingsRate);

        // Update budget
        BudgetControl.calculateBudget();

        // Clear field
        clearFields('rate');

        // Hide savings rate conatiner
        closeRate();

        // Update the overview UI
        UIControl.updateOverview();
    } else {
        let form;
        
        form = document.querySelector('.rate-change');
        
        form.classList.add('animate__shakeX');
        
        form.style.setProperty('--animate-duration', '.5s');
        
        removeShakeRate();
    }
}

// Toggle inc/exp sheet
function toggleSheet(open, close) {
    let openID = document.getElementById(open);
    let closeID = document.getElementById(close);

    openID.style.visibility = ((openID.style.visibility != 'visible') ? 'visible' : 'hidden');
    
    if (closeID.style.visibility === 'visible') {
        closeID.style.visibility = 'hidden';
    }
}

// Open settings sheet
function toggleSettings () {
    let item;

    item = document.querySelector('.settings-sheet');

    if (item.style.visibility === 'visible') {
        item.style.visibility = 'hidden';
    } else {
        item.style.visibility = 'visible';
    }
}

// Close settings sheet
function closeSettings () {
    let item;

    item = document.querySelector('.settings-sheet');

    item.style.visibility = 'hidden';
}

// Show home container and hide all others
function showHome() {
    document.getElementById('inc-sheet').style.visibility = 'hidden';
    document.getElementById('exp-sheet').style.visibility = 'hidden';
    document.getElementById('home').style.visibility = 'visible';
}

// Close the welcome header
function closeWelcome () {
    let header = document.querySelector('.card-header');

    header.style.display = 'none';
}

// Show the change savings rate card
function showRate () {
    let savingsRate = document.querySelector('.savings-rate');
    
    savingsRate.style.display = 'flex';
}

// Hide the change savings rate card
function closeRate () {
    let savingsRate = document.querySelector('.savings-rate');

    savingsRate.style.display = 'none';
}

// Initialization
function init () {
    if (localStorage.getItem('storedBudget') === null) {

        // Default setting for localStorage to prevent null error
        let defaultString = '{\"inputs\":{\"inc\":[],\"exp\":[],\"rate\":0},\"totals\":{\"inc\":0,\"exp\":0,\"savings\":0,\"safe\":0}}';

        localStorage.setItem('storedBudget', defaultString);

    }

    // Retrieve previous stored budget
    BudgetControl.getStoredBudget();
    
    // Restore UI list items
    UIControl.restoreListItems();
    
    // Update the UI with stored budget data
    UIControl.updateOverview();
    
    // Check if welcome header is closed
    let welcomeClosed;
    
    welcomeClosed = JSON.parse(localStorage.getItem('isClosed'));
    
    if (welcomeClosed === 1) {
        closeWelcome();
    }
    
    const currentTheme = localStorage.getItem('theme') ? window.localStorage.getItem('theme') : null;
    
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        if (currentTheme === 'dark') {
            document.getElementById('dark-mode-switch').checked = true;
        }
    }
}

init();