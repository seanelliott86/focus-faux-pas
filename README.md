# Focus Faux Pas Bookmarklet

## What is Focus Faux Pas?

Focus Faux Pas is a handy bookmarklet designed to help you ensure that the focus appearance of focusable elements on a web page complies with [Focus Appearance (Level AAA) WCAG Guideline](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html). It checks elements like buttons and links ensuring their focus is as sharp as a tack according to the Web Content Accessibility Guidelines (WCAG).

## How Does it Work?

Focus Faux Pas calculates the minimum and actual focus areas for focusable elements, taking into account style details like outline width and offset. It also checks the outline color to see if it passes 3:1 contrast ratio. It then creates a result window to show if each element's focus game is up to snuff or needs a little extra love.

NOTE: When calculating color contrast, if the bookmarklet cant find a background color in the focusable elements imeadiate parent it will keep searching parent elements, if none can be found an assumption is made the background is white.

## How to Use

To install the bookmarklet go to: [https://seanelliott86.github.io/focus-faux-pas/](https://seanelliott86.github.io/focus-faux-pas/)

Simply drag and drop the bookmarklet provided into your browser's bookmarks bar. Then, when you're on a webpage, click the bookmarklet to activate Focus Faux Pas and see the results!

To remove the results click the bookmarklet again.

## What Focus Faux Pas doesn't check... just yet?

* Elements like inputs, selects, I need to work on a useful way to display results
* Other outline styles (inset, dotted etc)
* Conformance via other methods to produce an "outline" such and box-shadow

## Why did I create this?

Focus is one of the simplest things to add to your site to improve its accessibility, the [Focus Appearance WCAG Guideline](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) is new in WCAG 2.2, even though it's a AAA level guideline this is one of the easier AAA guidelines to meet and more people should be ticking this one off their checklist. Now you can test your focus using this handy bookmarklet.
