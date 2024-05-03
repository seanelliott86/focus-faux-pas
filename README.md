# Focus Faux Pas Bookmarklet

## What is Focus Faux Pas?

Focus Faux Pas is a handy bookmarklet designed to help you ensure that the focus appearance of focusable elements on a web page complies with [Focus Appearance (Level AAA) WCAG Guideline](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html). It checks elements like buttons and links ensuring their focus is as sharp as a tack according to the Web Content Accessibility Guidelines (WCAG).

## How Does it Work?

Focus Faux Pas calculates the minimum and actual focus areas for focusable elements, taking into account style details like outline width and offset. It then provides a visual indicator to show if each element's focus game is up to snuff or needs a little extra love.

## How to Use

To install the bookmarklet go to: [https://seanelliott86.github.io/focus-faux-pas/](https://seanelliott86.github.io/focus-faux-pas/)

Simply drag and drop the bookmarklet provided into your browser's bookmarks bar. Then, when you're on a webpage, click the bookmarklet to activate Focus Faux Pas and see the results!

To remove the results click the bookmarklet again.

## What Focus Faux Pas doesn't check... just yet?

* Elements like inputs, selects, I need to work on a useful way to display results
* Colour contrast of the outline
* Other outline styles (inset, dotted etc)
* Conformance via other methods to produce an "outline" such and box-shadow

## Why did I create this?

Focus is one of the simplest things to add to your site to improve its accessibility, the [Focus Appearance WCAG Guideline](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) is new in WCAG 2.2 but it's a AAA level guideline. Most people lump AAA guidelines in the too-hard basket so this tool helps you check if the focus is of sufficient size to pass the guideline.
