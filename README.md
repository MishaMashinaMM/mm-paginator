# Paginator Component

Content:
1. [About](#1.-about)
2. [Usage](#2.-usage)
3. [Implementation](#3.-implementation)
4. [Warnings in paginator](#4.-warnings-in-paginator)
5. [Author](#5.-author)
6. [Final notes](#7.-final-notes)
<br><br>

---

# 1. About

_MMPaginator_ is a ready-made Angular component for displaying and handling the page navigation block, usually put under the table that lists the data and allows the user to display parts of it (as pages).

><font size="4">Read [Usage](#2.-usage) for detailed explanation, or skip to [Implementation](#3.-implementation) for jumping right into it.</font>

It is made to be dynamic and dumb: it requires few inputs form the parent component and will handle few variables by itself, returning just one to parent.

You can also easily customize its DOM elements, since all elements (static or dynamic) are generated with **id**s, so you can access them simply by getElementById (see **Customizing paginator elements** further below). Default css class is also provided.

Unlike most existing paginator packages, this one will display the label for obvious pages. For example (if set to display 2 pages around the **[active]** one), instead of displaying:

`PREV 1 ... 3 4 [5] 6 7 ... 13 NEXT`

_where it's obvious that first [...] stands for page 2_

this Paginator will display:

`PREV 1 2 3 4 [5] 6 7 ... 13 NEXT`

same goes for the next-to-last page in cases like:

`PREV 1 ... 7 8 [9] 10 11 12 13 NEXT`


><br><font size="4">See it in action: [MMPaginator at Stackblitz](https://stackblitz.com/edit/angular-ivy-pogcvd)<br><br></font>

Note: linked project has some extra code (not inherent to Paginator) just to show it in the context. Read further for details on what's actually important for the Paginator.

---

# 2. Usage

## 2.1. Displaying pages

- Displaying of pages' labels and styles depends on the _pagesToShowAroundActive_ variable. This number defines how many pages before and after the active page (the one currently selected) will be displayed in paginator.

- To display particular number of pages before and after the currently active page, set that number in parent's variables initialization:

  `pagesToShowAroundActive: number = 2;`

  and pass it to _[pagesToShowAroundActive]_ @Input of the paginator via the template:

  `[pagesToShowAroundActive]="pagesToShowAroundActive"`

- If you don't want to introduce such var in parent, just pass the value to _[pagesToShowAroundActive]_ @Input of the paginator via the template, like:

  `[pagesToShowAroundActive]="2"`

- To display only the first, last and active page, set _pagesToShowAroundActive_ to **-1**. No other pages will be displayed.

- Minimum value of _pagesToShowAroundActive_ is **-1** and maximum is equal to total number of entries of your data.

- Paginator will display an **warning message** (instead of the content in template) if _pagesToShowAroundActive_ doesn't meet the min/max criteria.

## 2.2. Logic of displaying and styling the pages

- **Previous** and **Next** buttons for pages are always displayed.

- **First**, **active** and **Last** page labels are always displayed.

- Number of pages defined by _pagesToShowAroundActive_ are displayed before and after the **active** page.

- All pages after the **first** page (page #1) and before the first page that meets the criteria of being before the **active** page by _pagesToShowAroundActive_ will be displayed as single case of three dots: ... (like in 'read more' type of shortenings).

- All pages before the **last** page and after the last page that meets the criteria of being after the **active** page by _pagesToShowAroundActive_ will be displayed as single case of three dots: ... .

- However, if the [...] would replace just _one_ page, then it's obvious which page that is (for example if the pages 1, 3, 4 etc. are displayed and [...] stands between 1 and before 3) - the paginator will display the page number instead of [...].

## 2.3. Entries per page

- Entries per page are passed to paginator from parent as _entriesToShow_. This var is important in parent component too, because it should govern the logic of displaying data in table (see below about necessary parent component structure).

- To display particular number of entries per page, set that number in parent's variables initialization:

  `entriesToShow: number = 2;`

  and pass it to _[entriesToShow]_ @Input of the paginator via the template:

  `[entriesToShow]="entriesToShow"`

- Unlike _pagesToShowAroundActive_ variable, initializing the _entriesToShow_ is necessary because you'll use it in parent template too, so it wouldn't be wise to have its value set in two different places.

- Minimum allowed value of _entriesToShow_ is 1, and maximum is equal to the number of entries in your data variable (or: to the length of it).

- Paginator will display an **warning message** (instead of the content in template) if _entriesToShow_ doesn't meet the min/max criteria.

## 2.4. Data length (total number of entries)

- Passing the _dataLength_ to paginator is necessary for calculating the total number of pages to display in paginator.

- Pass it to _[dataLength]_ @Input of the paginator via the template:

  `[dataLength]="data.length"`

  where you can replace _data_ in _data.length_ with the name of your data object (or array) containing the entries you're displaying in the table.

- Thus, it's not necessary to initialize a new variable in parent for this.

## 2.5. 'Previous' and 'Next' text on buttons

- Set your prefered textual content of the 'prev' and 'next' buttons of the paginator.

- To display particular text on the buttons, set that string in parent's variables initialization:

  `prevText: string = 'PREV;` // or whatever you want
  `nextText: string = 'NEXT;` // or whatever you want

  and pass it to _[prevText]_ and _[nextText]_ @Input of the paginator via the template:

  `[prevText]="prevText"`
  `[nextText]="nextText"`

- If you don't want to introduce such vars in parent, just pass the value to*[prevText]* and _[nextText]_ @Input of the paginator via the template, like:

  `[prevText]="PREV"`
  `[nextText]="NEXT"`

## 2.6. Paginator to parent communication

- Paginator will emit an event to parent upon changing the active page. When user selects a new page in paginator, new value of active page will be emitted to parent via _sendChangesToParent_ and received by parent through _getVariablesFromPaginator()_ method.

- Create a _getVariablesFromPaginator()_ method in parent and send it to paginator's @Output like:

  `(sendChangesToParent)="getVariablesFromPaginator($event)"`

- See further below about how to write _getVariablesFromPaginator()_ method in parent.

---

# 3. Implementation

## 3.1. Customizing paginator elements

- You can (and should) edit your global .css file (_styles.css_ in web app, or _global.css_ in your Ionic mobile app) by adding the following css code and edit it further to suit your design preferences. Colors in the styles have been set by their HTML color names so you can easily get a grasp of what's what.

- Paginator's global css selector is `mm-paginator`, so you can paste this into your global css file and edit it as you please:

```
/*
  MMPaginator STYLES: START
*/

/* general styling */
.mm-paginator {
    margin-top: 15px;
    text-align: center;
    font-family: Verdana, Arial, Tahoma, Serif;
    font-size: 13px;
}

/* a tag styling: used for all displayed pages */
.mm-paginator a {
    padding: 5px 9px;
    border-radius: 5px;
    margin: 3px;
}
  
/* active page styling: also for 'prev' and 'next' buttons */
.mm-paginator a.active {
    background-color: SteelBlue;
    color: white;
}

/* inactive page styling: for pages with displayValue==false */
.mm-paginator a.none {
    background-color: AliceBlue;
    color: black;
}

/* hidden page styling: for pages with displayValue==null */
.mm-paginator a.empty {
    margin-left: -6px;
    margin-right: -6px;
}

/* hover styling */
.mm-paginator a:hover:not(.empty) {
    background-color: MidnightBlue;
    color: white;
}

/* warning styling */
.mm-paginator .warning {
    font-size: 12px;
    border-radius: 10px;
    padding: 10px;
    background-color: Crimson;
    color: white;
}
/*
MMPaginator STYLES: END
*/
```

- IDs of the individual elements:

    - **main div** container: `'mm-p-main'`
    - **previous** button: `'mm-p-prev'`
    - **next** button: `'mm-p-prev'`
    - **empty** element (showing [...]): `'mm-p-empty'`
    - **pages** buttons: `'mm-p-'` + their label (as number), for example: `'mm-p-1', 'mm-p-2'` etc.

    Access them easily by `document.getElementById(`**theIDyouWant**`)`

## 3.2. Parent component

### 3.2.1. Importing the library module

- Import the paginator:

  `import { MMPaginatorModule } from 'mmpaginator';`

  (path depending on where you put it, of course).

- Add it to _imports_:

  `imports: [ MMPaginatorModule ]`

### 3.2.2. Changes in parent's .ts file

- Initialize the variables you'll send to paginator (read **Usage** above, to see about possible differences in handling the variables):

```
    entriesToShow: number = 2; // min -1, max == data.length
    pagesToShowAroundActive: number = 1; // min 1, max == data.length
    prevText: string = 'Prev'; // or whatever you want
    nextText: string = 'Next'; // or whatever you want
```

- Use this method to receive value emitted from paginator:

```
    getVariablesFromPaginator(activePage: number) {
        this.activePage = activePage;
    }
```

### 3.2.1. Changes in parent's template / html

- You can set up your table and iterate over your data content in various ways, but it's important to use this logic for displaying the content:

  `*ngIf="i < activePage * entriesToShow && i >= (activePage - 1) * entriesToShow"`

  for example:

  ```
  (...)
  <tr *ngFor="let entry of data; let idx = index">
      <ng-container *ngIf="idx < activePage * entriesToShow && idx >= (activePage - 1) * entriesToShow">
          <td>(...))</td>
      </ng-container>
  </tr>
  (...)
  ```

  where you have an **_index_** (named _idx_ here, but you can name it differently) to use in the **ng-container**'s **ngIf**, the **_activePage_** as the name of the active page variable that paginator is going to emit back to parent upon changes (you can rename the var too, but be sure to rename it in parent's _getVariablesFromPaginator()_ method too), and **_entriesToShow_** as the variable that you have to pass to paginator (see **Entries per page** above).

- Below your table, you have to paste this block of code:

  ```
  <!-- paginator component: start -->
  <pagination
      [prevText]="prevText"
      [nextText]="nextText"
      [entriesToShow]="entriesToShow"
      [pagesToShowAroundActive]="pagesToShowAroundActive"
      [dataLength]="data.length"
      (sendChangesToParent)="getVariablesFromPaginator($event)">
  </pagination>
  <!-- paginator component: end -->
  ```

---

# 4. Warnings in paginator

- Paginator has two warning messages that it'll display instead of the (expected) content if you don't pass it expected range of values.

- If you passed wrong _pagesToShowAroundActive_ (with value under minimum or above maximum, as defined in **Displaying pages**):

  > PAGINATOR WARNING:<br>Incorrect number entered for displaying pages before/after the active one!<br>Only -1 and higher values are accepted, and value cannot be higher than your _data.length_ value<br>Check the _pagesToShowAroundActive_ value.

- If you passed wrong _entriesToShow_ (with value under minimum or above maximum, as defined in **Entries per page**):

  > PAGINATOR WARNING:<br>Incorrect number entered for amount of entries per page!<br>Minimum of 1 is required, and the maximum cannot exceed the _data.length_ value<br>Check the _entriesToShow_ value.

---

# 5. Author

- Author: Misha Mashina, March 2022.

- Contact: misha.mashina@gmail.com

---

# 6. Final notes

- You can use this component and its code freely, with or without changes, and as you see fit.

- While this component is too simple to offer any room for errors/bugs, the responsibility for the effects of using it _(modified or not)_ rests solely on you and not on the author.

- The code is _heavily_ commented. Feel free to delete the stuff, modify it, or just laugh at the author's obsession with documenting it all.

---

Enjoy!
