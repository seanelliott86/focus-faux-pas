(() => {
let indicatorContainerExists = document.getElementById('focusFauxPas');
let stylesAdded = document.getElementById('focusFauxPasStyles');

const addStyles = () => {
    // Inline styles
    const inlineStyles = document.createElement('style');
    inlineStyles.id = 'focusFauxPasStyles'; // Add an ID to identify the styles
    inlineStyles.innerHTML = `
        .ffp-container {
            position: fixed;
            top: 1rem;
            right: 1rem;
            bottom: 1rem;
            padding: 1rem;
            z-index: 9999;
            width: 100%;
            min-width: 250px;
            max-width: 300px;
            height: 80%;
            overflow-y: auto;
            border: solid 1px #e2e4e6;
            color: #333;
            background: rgba(255, 255, 255, 0.74);
            border-radius: 16px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(7.4px);
            font-size: 1rem;
        }

        .ffp-container *{
            all: unset;
        }

        .ffp-result-container{
            padding: 0.5rem;
            margin-bottom: 1rem;
            background-color: #F6F5FF;
            display: block;
        }
        .ffp-result-container dt {
            font-family: Arial, sans-serif;
            font-size: 1rem;
            line-height: 1.5;
            display: block;
            font-weight: bold;
        }
        .ffp-result-container dd {
            font-family: Arial, sans-serif;
            font-size: 1rem;
            line-height: 1.5;
            display: block;
            margin: 0 0 0.5rem 0;
            color: #707070;
        }

        .ffp-main-heading{
            font-family: Arial, sans-serif;
            font-weight: 700;
            font-size: 2rem;
            line-height: 1.25;
            color: #000;
            display: block;
            margin: 0 0 1rem 0;
            padding: 0 0 1rem 0;
            border-bottom: 2px solid rgba(0, 0, 0, 0.1);
        }

        .ffp-result-heading{
            font-family: Arial, sans-serif;
            font-weight: 600;
            font-size: 1.5rem;
            line-height: 1.25;
            color: #000;
            display: flex;
            align-items: center;  
            margin: 0 0 1rem 0;
        }

        .ffp-result{
            display: inline-block;
            padding: 0.125rem;
            font-size: 1rem;
            margin-left: 0.75rem;
            min-width: 50px;
            text-align: center;
            color: #fff;
            border-radius: 4px;;
        }

        .ffp-result_pass {
            background-color: green;
        }
        .ffp-result_fail {
            background-color: red;
        }
    `;
    document.head.appendChild(inlineStyles);
};

// Function to create the indicator container
const createIndicatorContainer = () => {
    const indicatorContainer = document.createElement('div');
    indicatorContainer.id = 'focusFauxPas';
    indicatorContainer.classList.add('ffp-container');
    const mainHeading = document.createElement('h1');
    mainHeading.textContent = 'Focus faux pas results';
    mainHeading.classList.add('ffp-main-heading');
    indicatorContainer.appendChild(mainHeading);
    document.body.appendChild(indicatorContainer);

    return indicatorContainer;
};

// Function to calculate the minimum expected perimeter area of the element
const calculateMinPerimeterArea = (element) => {
    const largerWidth = element.offsetWidth + 2; // Adding 2px for 1px larger on all sides
    const largerHeight = element.offsetHeight + 2; // Adding 2px for 1px larger on all sides
    const smallerWidth = element.offsetWidth - 2; // Subtracting 2px for 1px smaller on all sides
    const smallerHeight = element.offsetHeight - 2; // Subtracting 2px for 1px smaller on all sides
    const largerArea = largerWidth * largerHeight;
    const smallerArea = smallerWidth * smallerHeight;
    const minPerimeterArea = largerArea - smallerArea;
    return minPerimeterArea;
};

// Function to calculate the actual perimeter area of the element with outline and outline offset
const calculateActualPerimeterArea = (element) => {
    const outlineValues = getOutlineValues(element);
    const largerWidth = element.offsetWidth + outlineValues.width + outlineValues.offset; // Adding outline width and offset
    const largerHeight = element.offsetHeight + outlineValues.width + outlineValues.offset; // Adding outline width and offset
    const smallerWidth = element.offsetWidth - outlineValues.width - outlineValues.offset; // Subtracting outline width and offset
    const smallerHeight = element.offsetHeight - outlineValues.width - outlineValues.offset; // Subtracting outline width and offset
    const largerArea = largerWidth * largerHeight;
    const smallerArea = smallerWidth * smallerHeight;
    const actualPerimeterArea = largerArea - smallerArea;
    return actualPerimeterArea;
};

// Function to temporarily focus on an element to obtain the outline values
const getOutlineValues = (element) => {
    // Apply focus
    element.focus();
    // Get the computed outline width
    const computedStyle = window.getComputedStyle(element);
    const outlineWidth = parseInt(computedStyle.getPropertyValue('outline-width').replace('px', ''), 10);
    const outlineOffset = outlineWidth > 0 ? parseInt(computedStyle.getPropertyValue('outline-offset').replace('px', ''), 10) : 0;

    return {
        width: outlineWidth,
        offset: outlineOffset,
    };
};

// Function to create the list of focusable elements and their calculations
const createIndicatorList = () => {

    const indicatorContainer = createIndicatorContainer();

    // Find all focusable elements
    // const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const focusableElements = document.querySelectorAll('a, button');

    // Iterate over focusable elements
    focusableElements.forEach((element) => {
        const minPerimeterArea = calculateMinPerimeterArea(element);
        const actualPerimeterArea = calculateActualPerimeterArea(element);
        const noOutlineSet = actualPerimeterArea === 0;
        const isPassing = parseFloat(actualPerimeterArea) >= parseFloat(minPerimeterArea);

        // Create a list item for each focusable element
        const tagName = element.tagName.toLowerCase();
        const listItem = document.createElement('div');
        listItem.classList.add("ffp-result-container");

        const heading = document.createElement('h2');
        const elementTag = document.createElement('span');
        elementTag.textContent = tagName;
        const passFailText = document.createElement('small');
        passFailText.textContent = isPassing ? "Pass" : "Fail";
        passFailText.classList.add('ffp-result')
        passFailText.classList.add(isPassing ? "ffp-result_pass" : "ffp-result_fail");
        heading.classList.add('ffp-result-heading');
        heading.appendChild(elementTag);
        heading.appendChild(passFailText);
        listItem.appendChild(heading);

        const dl = document.createElement('dl');
        const dt1 = document.createElement('dt');
        dt1.textContent = "Text Content";
        const dd1 = document.createElement('dd');
        dd1.textContent = element.textContent;
        const dt2 = document.createElement('dt');
        dt2.textContent = "Minimum Focus Area:";
        const dd2 = document.createElement('dd');
        dd2.textContent = minPerimeterArea;
        const dt3 = document.createElement('dt');
        dt3.textContent = "Actual Focus Area:";
        const dd3 = document.createElement('dd');
        dd3.textContent = noOutlineSet ? "Outline removed" : actualPerimeterArea;

        dl.appendChild(dt1);
        dl.appendChild(dd1);
        dl.appendChild(dt2);
        dl.appendChild(dd2);
        dl.appendChild(dt3);
        dl.appendChild(dd3);

        listItem.appendChild(dl);

        indicatorContainer.appendChild(listItem);
    });
};

if (indicatorContainerExists) {
    indicatorContainerExists.parentNode.removeChild(indicatorContainerExists);
    indicatorContainerExists = null;
} else {
    if (!stylesAdded) {
        addStyles();
    }
    createIndicatorList();
}
})();