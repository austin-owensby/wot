<template>
  <aside id="info-container" :class="{'full-width': fullWidth}">
    <div id="collapse-icon" @click="collapse" title="Shrink/Collapse Info">&gt;</div>
    <h1>Info</h1>
    <select v-model="selectedTab">
      <option value="Summary">Summary</option>
      <option value="Locations">Locations</option>
      <option value="Characters">Characters</option>
      <option value="Timeline">Timeline</option>
      <option value="Glossary">Glossary</option>
    </select>
    <input v-if="selectedTab !== 'Summary'" type="search" v-model="search" :placeholder="'Search ' + selectedTab">
    <div class="content" v-if="selectedTab === 'Summary'" v-html="summary">
    </div>
    <div class="content" v-if="selectedTab === 'Locations'">
        <div class="card" v-for="location in locations" :key="location.name">
            <div class="header">{{location.name}}</div>
            <div v-html="location.description"> </div>
            <div class="tag-header" v-if="location.tags.length > 0"><i>See also</i></div>
            <div class="tag" v-for="tag in location.tags" :key="location.name + tag" @click="goToTag(tag)">
                {{tag}}
            </div>
        </div>
    </div>
    <div class="content" v-if="selectedTab === 'Characters'">
        <div class="card" v-for="character in characters" :key="character.name">
            <div class="header">{{character.name}}</div>
            <div v-html="character.description"></div>
            <div class="tag-header" v-if="character.tags.length > 0"><i>See also</i></div>
            <div class="tag" v-for="tag in character.tags" :key="character.name + tag" @click="goToTag(tag)">
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
    <div class="content" v-if="selectedTab === 'Glossary'">
        <div class="card" v-for="glossaryEntry in glossary" :key="glossaryEntry.name">
            <div class="header">{{glossaryEntry.name}}</div>
            <div v-html="glossaryEntry.description"></div>
            <div class="tag-header" v-if="glossaryEntry.tags.length > 0"><i>See also</i></div>
            <div class="tag" v-for="tag in glossaryEntry.tags" :key="glossaryEntry.name + tag" @click="goToTag(tag)">
                {{tag}}
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
  @Prop() private fullWidth!: boolean
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

  private get glossary () {
    return DataService.getGlossary(this.book, this.chapter).filter(g => !this.search || (this.search && g.name.includes(this.search)))
  }

  private collapse () {
    this.$emit('collapse')
  }

  private goToTag (tag: string) {
    this.selectedTab = 'Glossary' // Switch to the glossary in case the tag is not in the same section we are currently in
    this.search = tag
  }

  @Watch('selectedTab')
  private tabChanged () {
    this.search = ''
    localStorage.tab = this.selectedTab
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
  height: 100%;

  &.full-width {
    width: 100%;

    #collapse-icon {
      left: .5rem;
    }
  }

  h1 {
    margin-top: .5rem;
    text-align: center;
  }

  select {
    font-size: 1.5rem;
    margin-bottom: .5rem;
  }

  .content {
    overflow: auto;
    height: calc(100% - 6rem);
  }
}

#info-container > * {
  margin: 0 1rem;
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

  .tag-header {
    margin-top: 1rem;
  }

  .tag {
    text-decoration: underline;
    cursor: pointer;
  }
}

#collapse-icon {
  position: absolute;
  z-index: 1000;
  background: black;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  left: calc(50% + .25rem);
  margin: 0;
}

</style>
