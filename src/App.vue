<template>
  <div id="app">
    <head id="top-nav">
      <nav id="book-nav">
        <div v-for="(book, index) in books" :id="`book-${index}`" :title="book" @click="selectBook(book)" :class="{selected: selectedBook === book}" :key="book">
          <span>{{index}}</span>
        </div>
      </nav>
      <div id="book-selection">
        <span>{{selectedBook}}</span>
        <select v-model="selectedChapter">
          <option v-for="chapter in bookChapters" :key="chapter" :value="chapter">{{chapter}}</option>
        </select>
      </div>
    </head>
    <div id="map-container">
      <Map :book="selectedBook" :chapter="selectedChapter" @goToLocation="goToLocation"></Map>
      <Info :book="selectedBook" :chapter="selectedChapter" :location="location" @resetLocation="goToLocation('')"></Info>
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

  private get books () {
    return books
  }

  private get bookChapters () {
    return chapters[this.selectedBook]
  }

  @Watch('selectedChapter')
  private chapterSelected () {
    localStorage.chapter = this.selectedChapter
  }

  private selectBook (book: string) {
    this.selectedBook = book
    localStorage.book = this.selectedBook
    this.selectedChapter = this.bookChapters[0]
  }

  private goToLocation (location: string) {
    this.location = location
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
  overflow-x: auto;
  min-height: 5.75rem;
  max-height: 5.75rem;
}

#book-nav{
  display: flex;
  margin-bottom: 1rem;

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
  height: 100%;
}

</style>
