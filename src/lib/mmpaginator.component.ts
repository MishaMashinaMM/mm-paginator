import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * Fields necessary for handling the display page's label and calculations of the paginator.
 *
 * @member {number} displayIndex - used as page label on paginator display
 * @member {boolean} displayValue - used in template for setting the display of this page's *displayIndex*: if it's *true* the *displayIndex* will be displayed as a page label, if it's *false* the *...* (three dots) will be displayed, and if it's *null* it won't be displayed.
 */
export interface Page {
  displayIndex: number;
  displayValue: boolean;
}

@Component({
  selector: 'mm-paginator',
  templateUrl: './mmpaginator.component.html'
})
export class PaginationComponent implements OnInit {
  @Input() prevText: string = 'Prev';
  @Input() nextText: string = 'Next';
  // entriesToShow: how many data entries to load per page
  @Input() entriesToShow: number = 1;
  // pagesToShowAroundActive: how many pages the paginator will display before and after the activePage
  @Input() pagesToShowAroundActive: number = 0;
  // dataLength: total number of entries in data object
  @Input() dataLength: any = 0;
  // sendChangesToParent: output emitter updating the activePage values at parent's
  @Output() sendChangesToParent = new EventEmitter<number>();
  // activePage: currently selected page
  activePage: number = 1;
  // pagesTotal: total number of pages
  pagesTotal: number = 1;
  // pagesAsObjects: array of pages as objects of type *Page*
  pagesAsObjects: Page[] = [];
  // handles displaying of warning about bad usage practices:
  paginatorWarning: boolean = false;
  // warning message to display in case of bad usage practice:
  paginatorWarningMessage: string = '';

  /**
   * Sets initial values for paginator.
   *
   * *pagesTotal* is calculated depending on *dataLength* and *entriesToShow*.
   * *pagesAsObjects* is populated with pages set *not* to be displayed.
   * *displayCondition()* is called to render the display of pages based on its rules.
   */
  ngOnInit() {
    // check for errors (bad usage practice), proceed if no errors
    if (this.checkForErrors()) return;
    // set the value of *pagesTotal* and use it to populate *pagesAsObjects*
    // with initial values (will be changed in *displayCondition()* method)
    this.pagesTotal = Math.ceil(this.dataLength / this.entriesToShow);
    for (let i = 1; i <= this.pagesTotal; i++) {
      this.pagesAsObjects.push({ displayIndex: i, displayValue: null });
    }
    // render pages:
    this.displayCondition(
      this.pagesToShowAroundActive,
      this.pagesTotal,
      this.activePage,
      this.pagesAsObjects
    );
  }

  /**
   * Called when user clicks on a page in paginator to switch to it.
   *
   * @param index - The new *activePage* value i.e. the new page to display as selected.
   * @remarks *displayCondition()* is called to render the new display of pages based on its rules for the new *activePage* value.
   */
  changePage(index: number) {
    // *activePage* value will only change if it's above 0 (there's no page with label '0' to display) and if it's up to *pagesTotal* value
    if (index > 0 && index <= this.pagesTotal) this.activePage = index;
    // re-render pages:
    this.displayCondition(
      this.pagesToShowAroundActive,
      this.pagesTotal,
      this.activePage,
      this.pagesAsObjects
    );
  }

  /**
   * Renders the display of pages, based on selected *activePage*, *totalPages* number and *pagesToShowAroundActive* value.
   *
   * @param p2show - *pagesToShowAroundActive* value
   * @param total - *totalPages* value
   * @param active - *activePage* value
   * @param pages - *pagesAsObjects* array
   * @remarks Emitter *sendChangesToParent* is used to send new value of *activePage* to parent, so that parent can re-render the display of data.
   */
  displayCondition(p2show: number, total: number, active: number, pages: any) {
    pages.forEach((p, idx) => {
      // set all pages' display property to null, and we'll change it to true or false
      // only if they meet the conditions that follow after:
      pages[idx].displayValue = null;
      if (
        // all examples: 9 pages asumed, [x] means displayed
        // (number without [ ] will be removed from the display - see further)

        // taking into account the obvious: first, active and last pages
        // should be displayed in navigation:

        // if page is the first:
        // ex: [1]-2-3-4-5-6-7-8-9
        idx == 0 ||
        // or it's the last:
        // ex: 1-2-3-4-5-6-7-8-[9]
        idx == total - 1 ||
        // or it's the active page (idx starts from 0, active starts from 1 so +1 to ids):
        // ex: 1-2-3-4-[5]-6-7-8-9
        idx + 1 == active ||
        // 3 cases above combined will give:
        // ex: [1]-2-3-4-[5]-6-7-8-[9]

        // then, taking into account the pagesToShowAroundActive,
        // i.e. how many pages to show before and after p2show:

        // 1st case: it's before the first (not-to-display!) page after the p2show
        // (on the right of active):
        (idx < active + p2show &&
          // 2nd case: it's after the first (not-to-display!) page before the p2show
          // (on the left of active):
          idx + 1 >= active - p2show) ||
        // so if, for example, p2show==1 and active==5, 2 cases above combined will give:
        // ex: 1-2-3-[4]-[5]-[6]-7-8-9

        // then, taking into account that we don't want to display '...'
        // if it would cover the only/obvious number, i.e. we don't want:
        // [1]...[3][4][5]...[9] <- number 2 is obvious, but still covered by '...', or:
        // [1]...[5][6][7]...[9] <- number 8 is obvious, but still covered by '...'
        // however, we cannot just display one page before the last and one after the first,
        // because the first visible page (defined in cases above) might be several places
        // away! so we need to take into account how far that next visible page actually is.

        // for the only undisplayed page before the last:
        // 1st case: if that page actually *is* next to last:
        // (note: -1 would be if idx starts at 1, but it starts at 0, so 1 less: -2)
        (idx == total - 2 &&
          // and 2nd case: distance of the last page (total) and actual page (active)
          // is 'covered' by # of pages to show (p2show) after the active one
          //and leaves 2 places: the page we want to disaply *and* the last page:
          total - active == p2show + 2) ||
        // ex: 2 cases above will show:
        // [1]...[5][6][7][8][9] where 6 is active page and p2show==1:
        // 1st case: page 8 *is* next to last page
        // and 2nd case: 9-6 (total-active) equals 1+2 (p2show+2), i.e. after the actual page
        // there is 1 page [page 7] allowed to display (defined by p2show==1) and 2 more

        // for the only undisplayed page after the first:
        // 1st case: if that page actually *is* right after to first:
        // (note: idx starts at 0, so the next page is 1)
        (idx == 1 &&
          // and 2nd case: the first displayed page is page 3, and we know it by
          // substracting p2show from active, because it will give the index of the first
          // displayed page (not including the first page - it's always displayed!)
          active - p2show == 3)
        // ex: 2 cass above will show:
        // [1][2][3][4][5]...[9] where 4 is active page and p2show==1
        // or [1][2][3][4][5][6][7][8][9] where 5 is active page and p2show==2
        // (note: all 9 are displayed because of all the previous cases!)
      ) {
        // thus we set that page to display:
        pages[idx].displayValue = true;
      } else if (
        // we want to display '...' only *once* on the left/right of the active page,
        // i.e. between that page, and first/last pages
        // regardless of the actual number of pages that are not being displayed

        // 1st case: take the page right after the last displayed page
        // i.e. which has an index of active page + pagesToShowAroundActive:
        idx == active + p2show ||
        // ex: if 5 is active page and p2show==1, we just want to show '...'
        // for the page 7, and skip page 8 altogether (display 9 as the last)

        // or 2nd case: take the page that is right before the first displayed page
        // i.e. which has an index of the active page - pagesToShowAroundActive
        // (note: we add 2 because we need to match indexes, not absolute values)
        idx == active - (p2show + 2)
        // ex: if 5 is active page and p2show==1, we just want to show '...'
        // for the page 3, and skip page 2 altogether (display 1 as the first)

        // ex: 2 cases above will show:
        // [1]...[4][5][6]...[9] where 5 is active page and p2show==1
      ) {
        // thus set that page to display '...'
        pages[idx].displayValue = false;
      }
      // all other pages will not be displayed: neither by their number, nor by the '...',
      // because they will have the 'displayed' property still as 'null' and the template
      // will only render 'true' (render as number) or 'false' (render as '...')
    });
    // send data back to parent component:
    this.sendChangesToParent.emit(this.activePage);
  }

  /**
   * Checks for the right range of values passed from the parent via @Input.
   *
   * @returns {boolean} True or false: true if warning error should be displayed to the user.
   */
  checkForErrors() {
    // *pagesToShowAroundActive* is of the wrong value:
    // lower than -1 or higher than the total number of entries in the table
    if (
      this.pagesToShowAroundActive < -1 ||
      this.pagesToShowAroundActive > this.dataLength
    ) {
      this.paginatorWarning = true;
      this.paginatorWarningMessage = this.pagesToShowAroundActiveError;
      return true;
    }
    // *entriesToShow* is of the wrong value:
    // lower than 1 or higher than the total number of entries in the table
    if (this.entriesToShow < 1 || this.entriesToShow > this.dataLength) {
      this.paginatorWarning = true;
      this.paginatorWarningMessage = this.entriesToShowError;
      return true;
    }
  }

  // warning messages
  pagesToShowAroundActiveError =
    'PAGINATOR WARNING:<br>Incorrect number entered for displaying pages before/after the active one!<br>Only -1 and higher values are accepted, and value cannot be higher than your *data.length* value<br>Check the *pagesToShowAroundActive* value.';
  entriesToShowError =
    'PAGINATOR WARNING:<br>Incorrect number entered for amount of entries per page!<br>Minimum of 1 is required, and the maximum cannot exceed the *data.length* value<br>Check the *entriesToShow* value.';
}
