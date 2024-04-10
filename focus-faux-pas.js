javascript:(function() {
    var indicatorContainer = null;

    // Function to create the indicator container
    function createIndicatorContainer() {
        indicatorContainer = document.createElement('div');
        indicatorContainer.style.position = "fixed";
        indicatorContainer.style.top = "10px";
        indicatorContainer.style.right = "10px";
        indicatorContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        indicatorContainer.style.color = "white";
        indicatorContainer.style.padding = "10px";
        indicatorContainer.style.zIndex = "9999";
        document.body.appendChild(indicatorContainer);
    }

    // Inline styles
    var inlineStyles = document.createElement('style');
    inlineStyles.innerHTML = `
        .focus-calculator dt {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .focus-calculator dd {
            display: block;
            margin: 0;
        }
        .pass {
            background-color: green;
            padding: 2px;
        }
        .fail {
            background-color: red;
            padding: 2px;
        }
    `;
    document.head.appendChild(inlineStyles);

    // Function to calculate the minimum expected perimeter area of the element
    function calculateMinPerimeterArea(element) {
        var largerWidth = element.offsetWidth + 2; // Adding 2px for 1px larger on all sides
        var largerHeight = element.offsetHeight + 2; // Adding 2px for 1px larger on all sides
        var smallerWidth = element.offsetWidth - 2; // Subtracting 2px for 1px smaller on all sides
        var smallerHeight = element.offsetHeight - 2; // Subtracting 2px for 1px smaller on all sides
        var largerArea = largerWidth * largerHeight;
        var smallerArea = smallerWidth * smallerHeight;
        var minPerimeterArea = largerArea - smallerArea;
        return minPerimeterArea.toFixed(0);
    }

    // Function to calculate the actual perimeter area of the element with outline and outline offset
    function calculateActualPerimeterArea(element) {
        var outlineWidth = getOutlineWidth(element);
        var outlineOffset = outlineWidth > 0 ? getOutlineOffset(element) : 0;
        var largerWidth = element.offsetWidth + outlineWidth + outlineOffset; // Adding outline width and offset
        var largerHeight = element.offsetHeight + outlineWidth + outlineOffset; // Adding outline width and offset
        var smallerWidth = element.offsetWidth - outlineWidth - outlineOffset; // Subtracting outline width and offset
        var smallerHeight = element.offsetHeight - outlineWidth - outlineOffset; // Subtracting outline width and offset
        var largerArea = largerWidth * largerHeight;
        var smallerArea = smallerWidth * smallerHeight;
        var actualPerimeterArea = largerArea - smallerArea;
        if (actualPerimeterArea === 0) {
            return "No outline set";
        }
        return actualPerimeterArea.toFixed(0);
    }

    // Function to temporarily focus on an element to obtain the outline width
    function getOutlineWidth(element) {
        // Store the original focus state and style
        var originalFocusState = element.getAttribute('data-focus-state');
        var originalOutlineStyle = element.style.outline;

        // Apply focus
        element.focus();
        // Get the computed outline width
        var computedStyle = window.getComputedStyle(element);
        var outlineWidth = parseInt(computedStyle.getPropertyValue('outline-width').replace('px', ''), 10);

        // Restore the original focus state and style
        if (originalFocusState === null) {
            element.removeAttribute('data-focus-state');
            element.blur();
        } else {
            element.setAttribute('data-focus-state', originalFocusState);
        }
        element.style.outline = originalOutlineStyle;

        return outlineWidth;
    }

    // Function to temporarily focus on an element to obtain the outline offset
    function getOutlineOffset(element) {
        // Store the original focus state and style
        var originalFocusState = element.getAttribute('data-focus-state');
        var originalOutlineStyle = element.style.outlineOffset;

        // Apply focus
        element.focus();
        // Get the computed outline offset
        var computedStyle = window.getComputedStyle(element);
        var outlineOffset = parseInt(computedStyle.getPropertyValue('outline-offset').replace('px', ''), 10);

        // Restore the original focus state and style
        if (originalFocusState === null) {
            element.removeAttribute('data-focus-state');
            element.blur();
        } else {
            element.setAttribute('data-focus-state', originalFocusState);
        }
        element.style.outlineOffset = originalOutlineStyle;

        return outlineOffset;
    }

    // Function to create the list of focusable elements and their calculations
    function createIndicatorList() {
        // Clear existing content
        if (indicatorContainer) {
            indicatorContainer.innerHTML = "";
        }

        // Create the indicator container if it doesn't exist
        if (!indicatorContainer) {
            createIndicatorContainer();
        }

        // Find all focusable elements
        var focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');

        // Iterate over focusable elements
        focusableElements.forEach(function(element) {
            var minPerimeterArea = calculateMinPerimeterArea(element);
            var actualPerimeterArea = calculateActualPerimeterArea(element);
            var passFailClass = actualPerimeterArea === "No outline set" ? "fail" : (parseFloat(actualPerimeterArea) >= parseFloat(minPerimeterArea) ? "pass" : "fail");

            // Create a list item for each focusable element
            var tagName = element.tagName.toLowerCase();
            var listItem = document.createElement('div');
            listItem.className = "focus-calculator";

            var heading = document.createElement('h2');
            var elementTag = document.createElement('span');
            elementTag.textContent = tagName;
            var passFailText = document.createElement('small');
            passFailText.textContent = actualPerimeterArea === "No outline set" ? "Fail" : (parseFloat(actualPerimeterArea) >= parseFloat(minPerimeterArea) ? "Pass" : "Fail");
            passFailText.classList.add(passFailClass);
            heading.appendChild(elementTag);
            heading.appendChild(document.createTextNode(" - "));
            heading.appendChild(passFailText);
            listItem.appendChild(heading);

            var dl = document.createElement('dl');
            var dt1 = document.createElement('dt');
            dt1.textContent = tagName.toUpperCase() + " Content";
            var dd1 = document.createElement('dd');
            dd1.textContent = element.textContent;
            var dt2 = document.createElement('dt');
            dt2.textContent = "Minimum Focus Area:";
            var dd2 = document.createElement('dd');
            dd2.textContent = minPerimeterArea;
            var dt3 = document.createElement('dt');
            dt3.textContent = "Actual Focus Area:";
            var dd3 = document.createElement('dd');
            dd3.textContent = actualPerimeterArea;

            dl.appendChild(dt1);
            dl.appendChild(dd1);
            dl.appendChild(dt2);
            dl.appendChild(dd2);
            dl.appendChild(dt3);
            dl.appendChild(dd3);

            listItem.appendChild(dl);

            indicatorContainer.appendChild(listItem);
        });
    }

    // Function to handle bookmarklet click
    function bookmarkletClick() {
        if (!indicatorContainer) {
            createIndicatorList();
        } else {
            indicatorContainer.remove();
            indicatorContainer = null;
        }
    }

    // Add click event listener to the bookmarklet itself
    document.body.addEventListener('click', bookmarkletClick);

    // Show indicators immediately after clicking the bookmarklet
    bookmarkletClick();

})();
