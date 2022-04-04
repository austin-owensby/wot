<template>
  <div id="app">
    <head id="top-nav" :class="{'hide-header': !showHeader}">
      <nav v-if="showHeader" id="book-nav">
        <div v-for="(book, index) in books" :id="`book-${index}`" :title="book" @click="selectBook(book)" :class="{selected: selectedBook === book}" :key="book">
          <span>{{index}}</span>
        </div>
      </nav>
      <div v-if="showHeader" id="book-selection">
        <span>{{selectedBook}}</span>
        <select v-model="selectedChapter">
          <option v-for="chapter in bookChapters" :key="chapter" :value="chapter">{{chapter}}</option>
        </select>
        <button id="next-chapter-button" @click="nextChapter">Next Chapter</button>
      </div>
      <div v-if="showHeader" id="collapse-icon" :class="{left: !showInfo}" @click="collapse('Header')" title="Collapse Header">^</div>
      <div v-if="!showHeader" id="collapse-icon-down" :class="{left: !showInfo}" @click="collapse('Header')" title="Show Header">v</div>
    </head>
    <div id="map-container" :class="{'hide-header': !showHeader}">
      <Map v-if="showMap" :book="selectedBook" :chapter="selectedChapter" :fullWidth="!showInfo" :key="showInfo" @goToLocation="goToLocation" @collapse="collapse('Map')"></Map>
      <Info v-if="showInfo" :book="selectedBook" :chapter="selectedChapter" :location="location" :fullWidth="!showMap" @resetLocation="goToLocation('')" @collapse="collapse('Info')"></Info>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { books, chapters } from '@/utilities/book-info'
import Map from '@/components/Map.vue'
import Info from '@/components/Info.vue'

@Component({
  components: {
    Map,
    Info
  }
})
export default class App extends Vue {
  private selectedBook: string = localStorage.book ?? this.books[1];
  private selectedChapter: string = localStorage.chapter ?? this.bookChapters[0];
  private location: string = localStorage.search ?? '';
  private showMap: boolean = localStorage.showMap === undefined ? true : localStorage.showMap === 'true';
  private showInfo: boolean = localStorage.showInfo === undefined ? true : localStorage.showInfo === 'true';
  private showHeader: boolean = localStorage.showHeader === undefined ? true : localStorage.showHeader === 'true';

  private get books () {
    return books
  }

  private get bookChapters () {
    return chapters[this.selectedBook]
  }

  private selectBook (book: string) {
    this.selectedBook = book
    this.selectedChapter = this.bookChapters[0]
  }

  private goToLocation (location: string) {
    this.location = location
  }

  private collapse (view: string) {
    if (view === 'Map') {
      if (this.showInfo) {
        this.showMap = false
      } else {
        this.showInfo = true
      }
    } else if (view === 'Info') {
      if (this.showMap) {
        this.showInfo = false
      } else {
        this.showMap = true
      }
    } else if (view === 'Header') {
      this.showHeader = !this.showHeader
    }
  }

  private nextChapter () {
    const chapterIndex = this.bookChapters.indexOf(this.selectedChapter)

    if (chapterIndex !== -1 && chapterIndex < this.bookChapters.length - 1) {
      this.selectedChapter = this.bookChapters[chapterIndex + 1]
    } else if (this.selectedBook !== this.books[-1]) {
      const bookIndex = this.books.indexOf(this.selectedBook)

      if (bookIndex !== -1 && bookIndex < this.books.length - 1) {
        this.selectedBook = this.books[bookIndex + 1]
        this.selectedChapter = this.bookChapters[0]
      }
    }
  }

  @Watch('selectedChapter')
  private chapterSelected () {
    localStorage.chapter = this.selectedChapter
  }

  @Watch('selectedBook')
  private bookSelected () {
    localStorage.book = this.selectedBook
  }

  @Watch('showMap')
  private mapToggled () {
    localStorage.showMap = this.showMap
  }

  @Watch('showInfo')
  private infoToggled () {
    localStorage.showInfo = this.showInfo
  }

  @Watch('showHeader')
  private headerToggled () {
    localStorage.showHeader = this.showHeader
  }
}
</script>

<style lang="scss">
$books: #DEE3B0, #7FC2D1, #D5D6DB, #8C3836, #522028, #342984, #E6DD8E, #CCBF86, #39265B, #373D3F, #A1AE6C, #1F2F4F, #264526, #1B2F3E, #8C3836;

// Default/Light mode variables
:root{
  --background: white;
  --text: black;
  --accent: #8C3836;
}

@media (prefers-color-scheme: dark)
{
  :root{
    --background: #2b2a33;
    --text: white;
  }
}

html,
body,
#app {
  margin: 0;
  height: 100%;
  width: 100%;
  background-color: var(--background);
  color: var(--text);
}

select {
  background-color: var(--background);
  color: var(--text);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex: 1;
  flex-direction: column;
}

#top-nav {
  border-bottom: ridge .5rem Var(--accent);
  padding: 1rem;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 6.5rem;
  max-height: 6.5rem;

  &.hide-header {
    min-height: 0;
    max-height: 0;
    height: 0;
    padding: 0;
  }

  #collapse-icon,
  #collapse-icon-down {
    position: absolute;
    z-index: 1000;
    background: var(--accent);
    color: white;
    width: 1.5rem;
    height: 1.5rem;
    font-size: 1.25rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    right: 0;
    top: 7rem;

    &.left {
      left: 0;
    }
  }

  #collapse-icon-down {
    top: .5rem;
  }
}

#book-nav{
  display: flex;
  margin-bottom: 1rem;
  overflow-x: auto;

  div {
    border-radius: 100%;
    min-height: 1.5rem;
    min-width: 1.5rem;
    background-color: var(--background);
    cursor: pointer;
    margin-right: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;

    &.selected {
      color: white;
    }

    @for $i from 0 through length($books) - 1 {
      &#book-#{$i} {
        border: solid .5rem nth($books, $i + 1);

        &.selected {
          background-color: nth($books, $i + 1);

          @if ($i == 0) {
            color: black;
          }
          @else if ($i == 2) {
            color: black;
          }
          @else if ($i == 6) {
            color: black;
          }
          @else if ($i == 7) {
            color: black;
          }
          @else if ($i == 10) {
            color: black;
          }
        }
      }
    }
  }
}

#book-selection {
  select {
    margin-left: 0.5rem
  }
}

#map-container {
  display: flex;
  height: calc(100% - 9rem);

  &.hide-header {
    height: calc(100% - .5rem);
  }
}

#next-chapter-button {
  margin-left: 1rem;
  cursor: pointer;
}
</style>
