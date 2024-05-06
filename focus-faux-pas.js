(() => {
let indicatorContainerExists = document.getElementById('focusFauxPas');
let stylesAdded = document.getElementById('focusFauxPasStyles');

const addStyles = () => {
    // Inline styles
    const inlineStyles = document.createElement('style');
    inlineStyles.id = 'focusFauxPasStyles';
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
            display: flex;
            align-items: center;
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
            page-break-inside: avoid;
            font-family: monospace;
            font-size: 1.1rem;
            line-height: 1.6;
            max-width: 100%;
            overflow: auto;
            display: block;
            word-wrap: break-word;
            margin: 0 0 1rem 0;
            border-bottom: 2px solid rgba(0, 0, 0, 0.1);
            padding-bottom: 0.5rem;
        }

        .ffp-result{
            display: inline-block;
            padding: 0.2rem 0.5rem;
            font-size: 0.75rem;
            margin-left: 0.75rem;
            text-align: center;
            color: #fff;
            border-radius: 4px;
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

const getContrastRatio = (color1, color2) => {
    function getLuminance(color) {
        var rgb = color.match(/\d+/g);
        if (!rgb) return 1; // Default to white if color is not found
        for (var i = 0; i < 3; i++) {
            rgb[i] /= 255;
            rgb[i] = rgb[i] <= 0.03928 ? rgb[i] / 12.92 : Math.pow((rgb[i] + 0.055) / 1.055, 2.4);
        }
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    }

    var luminance1 = getLuminance(color1);
    var luminance2 = getLuminance(color2);

    var brighter = Math.max(luminance1, luminance2);
    var darker = Math.min(luminance1, luminance2);

    return (brighter + 0.05) / (darker + 0.05);
}

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
const calculateActualPerimeterArea = (element, outlineValues) => {
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
    element.focus();

    // Get the computed outline width
    const computedStyle = window.getComputedStyle(element);
    const outlineWidth = parseInt(computedStyle.getPropertyValue('outline-width').replace('px', ''), 10);
    const outlineStyle = computedStyle.getPropertyValue('outline-style');
    const outlineOffset = outlineWidth > 0 ? parseInt(computedStyle.getPropertyValue('outline-offset').replace('px', ''), 10) : 0;
    const outlineColor = computedStyle.getPropertyValue('outline-color');

    return {
        width: outlineWidth,
        offset: outlineOffset,
        styles: outlineStyle,
        color: outlineColor,
    };
};

const getParentInformation = (element) => {
    let parentBackgroundColor = 'rgb(255, 255, 255)'; // Default to white
    let backgroundElement = '';

    let parent = element.parentElement;
    while (parent) {
        const parentStyle = window.getComputedStyle(parent);
        const backgroundColor = parentStyle.getPropertyValue('background-color');
        if (backgroundColor !== 'rgba(0, 0, 0, 0)') {
            parentBackgroundColor = backgroundColor;
            backgroundElement = parent.tagName;
            break;
        }
        parent = parent.parentElement;
    }

    if (backgroundElement === '') {
        backgroundElement = 'HTML';
    }

    return {
        element: backgroundElement,
        color: parentBackgroundColor
    }
}

// Function to create the list of focusable elements and their calculations
const createIndicatorList = () => {

    const indicatorContainer = createIndicatorContainer();

    // Find all focusable elements
    // const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const focusableElements = document.querySelectorAll('a, button');

    // Iterate over focusable elements
    focusableElements.forEach((element) => {
        const minPerimeterArea = calculateMinPerimeterArea(element);
        const outlineValues = getOutlineValues(element);
        const actualPerimeterArea = calculateActualPerimeterArea(element, outlineValues);
        const parentInformation = getParentInformation(element);
        const noOutlineSet = actualPerimeterArea === 0;
        const contrastRatio = getContrastRatio(outlineValues.color, parentInformation.color);
        const isPassingPerimeter = parseFloat(actualPerimeterArea) >= parseFloat(minPerimeterArea);
        const isPassingColorContrast = contrastRatio.toFixed(2) >= 3;
        const isPassingAll = isPassingPerimeter && isPassingColorContrast;

        // Create a list item for each focusable element
        const tagName = element.tagName.toLowerCase();
        const listItem = document.createElement('div');
        listItem.classList.add("ffp-result-container");

        // Create a heading element for each focusable elemnt
        const heading = document.createElement('h2');
        heading.textContent = "<" + tagName + ' />';
        heading.classList.add('ffp-result-heading');
        listItem.appendChild(heading);

        const dl = document.createElement('dl');
        const dt1 = document.createElement('dt');
        dt1.textContent = "Text Content";
        const dd1 = document.createElement('dd');
        dd1.textContent = element.textContent;
        const dt2 = document.createElement('dt');
        dt2.textContent = "Focus area (minimum " + minPerimeterArea + "):";
        const dd2 = document.createElement('dd');
        const dd2spantext = document.createElement('span');
        dd2spantext.textContent = noOutlineSet ? "Outline removed" : actualPerimeterArea;
        const dd2passFailText = document.createElement('small');
        dd2passFailText.textContent = isPassingPerimeter ? "Pass" : "Fail";
        dd2passFailText.classList.add('ffp-result')
        dd2passFailText.classList.add(isPassingPerimeter ? "ffp-result_pass" : "ffp-result_fail");
        dd2.appendChild(dd2spantext);
        dd2.appendChild(dd2passFailText);

        const dt3 = document.createElement('dt');
        dt3.textContent = "Contrast ratio (minimum 3:1)";
        const dd3 = document.createElement('dd');
        const dd3spantext = document.createElement('span');
        dd3spantext.textContent = contrastRatio.toFixed(2) + ":1";
        const dd3passFailText = document.createElement('small');
        dd3passFailText.textContent = isPassingColorContrast ? "Pass" : "Fail";
        dd3passFailText.classList.add('ffp-result')
        dd3passFailText.classList.add(isPassingColorContrast ? "ffp-result_pass" : "ffp-result_fail");
        dd3.appendChild(dd3spantext);
        dd3.appendChild(dd3passFailText);
        
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