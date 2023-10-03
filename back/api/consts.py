JS_CODES = [
    {
        "bookermaker_id":1,
        "code": """ 
    const searchedName = "<<name>>";
    const amountToBet = <<amount>>;

    const buttonsWithTiltle = document.querySelectorAll("button[title].price");
    
    function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            const cost = a[j - 1] === b[i - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, // Eliminación
                matrix[i][j - 1] + 1, // Inserción
                matrix[i - 1][j - 1] + cost // Sustitución
            );
        }
    }
    return matrix[b.length][a.length];
    }

    function sortButtonsBySimilarity(buttons,searchedName) {
    return [...buttons].sort((a, b) => {
        const aText = a.textContent.trim();
        const bText = b.textContent.trim();
        return levenshteinDistance(aText, bText);
    });
    }

    const rightBtn = sortButtonsBySimilarity(buttonsWithTiltle, searchedName)[0];
    const rightName = rightBtn.title.trim();
    console.log(rightName);
    rightBtn.click();





    setTimeout(() => {
    console.log(document.querySelectorAll("tr.bet-details .seln-name"));
    }, 500);


    let input;
    function lookForInput() {
    console.log(input);
    if (input == undefined){
        try{
        const containers = Array.from(document.querySelectorAll("tr.bet-details")).filter(cont=>cont.querySelector(".seln-name").textContent === rightName);
        console.log("containers",containers);
        input = containers[0].querySelector("input.stake");
        input.value = amountToBet;
        console.log("input",input);
        }
        catch(err){
        console.log(err);
        setTimeout(() => {
            lookForInput();
        }, 1000);
        }
    }
    }
    lookForInput();
    """     
    },
    {
        "bookermaker_id":2,
        "code": """
        alert("hi: "+ "<<name>>" + " " + "<<amount>>"  )
        """
    },
    {
        "bookermaker_id":3,
        "code": """
        alert("hi: "+ "<<name>>" + " " + "<<amount>>"  )
        """
    },
]