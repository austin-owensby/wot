<template>
  <aside id="info-container">
    <h1>Info</h1>
    <div id="info-options">
        <button :class="{selected: selectedTab === 'Summary'}" @click="setTab('Summary')">Summary</button>
        <button :class="{selected: selectedTab === 'Locations'}" @click="setTab('Locations')">Locations</button>
        <button :class="{selected: selectedTab === 'Characters'}" @click="setTab('Characters')">Characters</button>
        <button :class="{selected: selectedTab === 'Timeline'}" @click="setTab('Timeline')">Timeline</button>
    </div>
    <input v-if="selectedTab !== 'Summary'" type="search" v-model="search" :placeholder="'Search ' + selectedTab">
    <div class="content" v-if="selectedTab === 'Summary'" v-html="summary">
    </div>
    <div class="content" v-if="selectedTab === 'Locations'">
        <div class="card" v-for="location in locations" :key="location.name">
            <div class="header">{{location.name}}</div>
            <div>
                <div v-html="location.description">
                </div>
                <div v-for="tag in location.tags" :key="tag">
                    {{tag}}
                </div>
            </div>
        </div>
    </div>
    <div class="content" v-if="selectedTab === 'Characters'">
        <div class="card" v-for="character in characters" :key="character.name">
            <div class="header">{{character.name}}</div>
            <div v-html="character.description">
            </div>
            <div v-for="tag in character.tags" :key="tag">
                {{tag}}
            </div>
        </div>
    </div>
    <div class="content" v-if="selectedTab === 'Timeline'">
        <div class="card" v-for="event in timeline" :key="event.name">
            <div class="header">{{event.name}} - {{event.time}}</div>
            <div v-html="event.summary">
            </div>
        </div>
    </div>
  </aside>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { DataService } from '@/services/dataService'

@Component
export default class App extends Vue {
  @Prop() private book!: string
  @Prop() private chapter!: string
  @Prop() private location!: string
  private selectedTab = localStorage.tab ?? 'Summary'
  private search = localStorage.search

  private get summary () {
    return DataService.getSummary(this.book, this.chapter)
  }

  private get locations () {
    return DataService.getLocations(this.book, this.chapter).filter(l => !this.search || (this.search && l.name.includes(this.search)))
  }

  private get characters () {
    return DataService.getCharacters(this.book, this.chapter).filter(c => !this.search || (this.search && c.name.includes(this.search)))
  }

  private get timeline () {
    return DataService.getTimeline(this.book, this.chapter).filter(e => !this.search || (this.search && e.name.includes(this.search)))
  }

  private setTab (tab: string) {
    this.selectedTab = tab
    this.search = ''
    localStorage.tab = tab
    localStorage.search = this.search
    this.$emit('resetLocation')
  }

  @Watch('search')
  private searchChanged () {
    localStorage.search = this.search

    if (this.location !== this.search) {
      this.$emit('resetLocation')
    }
  }

  @Watch('location')
  private locationChanged () {
    if (this.location) {
      this.selectedTab = 'Locations'
      localStorage.tab = 'Locations'
      this.search = this.location
      localStorage.search = this.search
    }
  }
}
</script>

<style scoped lang="scss">
#info-container {
  border-left: ridge .5rem var(--accent);
  width: 50%;
  padding: .5rem;
  min-width: 21rem;
  overflow: auto;

  h1 {
    margin-top: 0;
  }
}

#info-options {
    display: flex;
    flex: 1;
    margin-bottom: .5rem;

    button {
        display: flex;
        font-size: 1rem;
        width: 25%;
        height: 2rem;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-weight: bold;
        color: black;
        border-radius: 0;

        &.selected {
            color: var(--accent);
        }
    }
}

.card {
  background-color: var(--accent);
  color: white;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 5px;

  .header {
    font-size: 1.2rem;
    font-weight: bold;
  }
}

.content {
  overflow: auto;
}

</style>
