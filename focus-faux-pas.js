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
                font-family: Arial, sans-serif;
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
                font-size: 1rem;
                line-height: 1.5;
                display: block;
                font-weight: bold;
            }
            .ffp-result-container dd {
                font-size: 1rem;
                line-height: 1.5;
                display: flex;
                align-items: center;
                margin: 0 0 0.5rem 0;
                color: #707070;
            }
    
            .ffp-main-heading{
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
                margin: 0 0 1rem 0;
                border-bottom: 2px solid rgba(0, 0, 0, 0.1);
                padding-bottom: 0.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .ffp-result-heading-text{
                page-break-inside: avoid;
                font-family: monospace;
                font-size: 1.1rem;
                line-height: 1.6;
                max-width: 100%;
                overflow: auto;
                display: block;
                word-wrap: break-word;
            }

            .ffp-result-toggle{
                display: flex;
                align-items: center;
            }

            .ffp-result-toggle label{
                margin-right: 8px;
            }

            .ffp-result-toggle input{
                appearance: auto;
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
            .ffp-highlight-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 2px solid #FFA500;
                pointer-events: none;
                z-index: 9998; 
            }
    
            .ffp-highlight-overlay::after{
                content: '!';
                font-weight: bold;
                position: absolute;
                top: -24px;
                left: 50%;
                width: 48px;
                height: 24px;
                display: flex;
                flex-direction: column;
                background: orange;
                text-align: center;
                transform: translateX(-50%);
                justify-content: center;
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
    const getElementOutlineValues = (element) => {
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
    
    const createHighlightOverlay = (element, id) => {
        const existingOverlay = document.getElementById(id);
    
        if (existingOverlay) {
            existingOverlay.remove();
        } else {
            const highlightOverlay = document.createElement('div');
            highlightOverlay.id = id;
            highlightOverlay.classList.add('ffp-highlight-overlay');
    
            const rect = element.getBoundingClientRect();
    
            highlightOverlay.style.width = rect.width + 4 + 'px';
            highlightOverlay.style.height = rect.height + 4 + 'px';
            highlightOverlay.style.top = rect.top + window.scrollY - 4 + 'px';
            highlightOverlay.style.left = rect.left + window.scrollX - 4 + 'px';
    
            document.body.appendChild(highlightOverlay);
        }
    };    
    
    const createIndicatorList = () => {
    
        const indicatorContainer = createIndicatorContainer();
        const fragment = document.createDocumentFragment()
    
        // Find all focusable elements
        // const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const focusableElements = document.querySelectorAll('a, button');
    
        focusableElements.forEach((element, i) => {
            const listItem = createListItem(element, i);
            fragment.appendChild(listItem);
        });

        indicatorContainer.appendChild(fragment);
    };

    // Function to create a list item for a focusable element
    const createListItem = (element, i) => {
        // Create the list item
        const listItem = document.createElement('div');
        listItem.classList.add('ffp-result-container');

        // Create heading
        const heading = document.createElement('h2');
        heading.classList.add('ffp-result-heading');

        // Create heading text
        const headingText = document.createElement('span');
        headingText.textContent = `<${element.tagName.toLowerCase()} />`;
        headingText.classList.add('ffp-result-heading-text');

        // Create toggle checkbox
        const headingToggle = document.createElement('span');
        headingToggle.classList.add('ffp-result-toggle');
        const headingCheckbox = document.createElement('input');
        headingCheckbox.type = "checkbox";
        headingCheckbox.name = "toggleHighlight";
        headingCheckbox.id = `headingCheckbox${i}`;
        headingCheckbox.classList.add('headingCheckbox');
        headingCheckbox.addEventListener('change', function() {
            createHighlightOverlay(element, i)
        });
        const headinglabel = document.createElement('label');
        headinglabel.htmlFor = `headingCheckbox${i}`;
        headinglabel.appendChild(document.createTextNode("Highlight"));
        headingToggle.appendChild(headinglabel);
        headingToggle.appendChild(headingCheckbox);

        heading.appendChild(headingText);
        heading.appendChild(headingToggle);

        listItem.appendChild(heading);

        // Create details list
        const detailsList = document.createElement('dl');

        const minPerimeterArea = calculateMinPerimeterArea(element);
        const outlineValues = getElementOutlineValues(element);
        const actualPerimeterArea = calculateActualPerimeterArea(element, outlineValues);
        const parentInformation = getParentInformation(element);
        const contrastRatio = getContrastRatio(outlineValues.color, parentInformation.color);
        const isPassingPerimeter = parseFloat(actualPerimeterArea) >= parseFloat(minPerimeterArea);
        const outlineValueText = actualPerimeterArea === 0 ? "Outline removed" : actualPerimeterArea;
        const contrastRatioFormatted = contrastRatio.toFixed(2) + ":1";

        // Create detail items
        const textContentItem = createDetailItem('Text Content', element.textContent, null);
        const perimeterAreaItem = createDetailItem(`Focus area (minimum ${minPerimeterArea}):`, outlineValueText, isPassingPerimeter);
        const contrastRatioItem = createDetailItem('Contrast ratio (minimum 3:1)', contrastRatioFormatted, contrastRatio >= 3);
    
        console.log(element.textContent)
        console.log(outlineValues)

        // Append detail items to details list
        detailsList.appendChild(textContentItem);
        detailsList.appendChild(perimeterAreaItem);
        detailsList.appendChild(contrastRatioItem);

        listItem.appendChild(detailsList);

        return listItem;
    };

    const createDetailItem = (label, value, pass) => {
        const dt = document.createElement('dt');
        dt.textContent = label;

        const dd = document.createElement('dd');

        const ddtext = document.createElement('span');
        ddtext.textContent = value;
        
        dd.appendChild(ddtext);

        if(pass != null){
            const ddpassFailText = document.createElement('small');
            ddpassFailText.textContent = pass ? "Pass" : "Fail";
            ddpassFailText.classList.add('ffp-result')
            ddpassFailText.classList.add(pass ? "ffp-result_pass" : "ffp-result_fail");
            dd.appendChild(ddpassFailText);
        }

        const item = document.createElement('div');
        item.appendChild(dt);
        item.appendChild(dd);

        return item;
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