<template>
  <div id="inner-map-container" :class="{'full-width': fullWidth}">
    <div id="collapse-icon" @click="collapse" title="Shrink/Collapse Map">&lt;</div>
    <l-map
      ref="map"
      :min-zoom="minZoom"
      :crs="crs"
      :maxBounds="bounds"
      :options="{zoomControl: false}"
      style="height: 100%; width: 100%;"
    >
      <l-image-overlay
        :url="url"
        :bounds="bounds"
      />
      <l-circle
        v-for="point in map.points"
        :key="point.name"
        :lat-lng="point"
        :radius="3.5"
        :color="point.color"
        :fillOpacity="1"
        :fillColor="point.color"
        @click="goToLocation(point.name)"
      >
        <l-tooltip>{{point.name}}</l-tooltip>
      </l-circle>
      <l-polyline
        v-for="(path, index) in map.paths"
        :key="index"
        :lat-lngs="path.path"
        :color="path.color"
        :weight="5"
      />
      <l-control-zoom position="bottomright"></l-control-zoom>
    </l-map>
  </div>
</template>

<script scoped lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { LMap, LImageOverlay, LCircle, LPopup, LPolyline, LControlZoom, LTooltip } from 'vue2-leaflet'
import { CRS } from 'leaflet'
import { MapService } from '@/services/mapService'

@Component({
  components: {
    LMap,
    LImageOverlay,
    LCircle,
    LPopup,
    LPolyline,
    LControlZoom,
    LTooltip
  }
})
export default class Map extends Vue {
  @Prop() private book!: string
  @Prop() private chapter!: string
  @Prop() private fullWidth!: boolean
  private url = 'https://raw.githubusercontent.com/austin-owensby/wot/master/src/assets/wot-map.jpg' // There's got to be a better way to do this right???
  private bounds = [[0, 0], [1000, 1000]]
  private minZoom = -2
  private crs = CRS.Simple

  private get map () {
    return MapService.getMap(this.book, this.chapter)
  }

  private mounted () {
    if (this.$refs.map) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.$refs.map as any).mapObject.setView([500, 500], 0)
    }
  }

  private goToLocation (location: string) {
    this.$emit('goToLocation', location)
  }

  private collapse () {
    this.$emit('collapse')
  }
}
</script>

<style scoped lang="scss">
  #collapse-icon {
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
    right: calc(50% + .25rem);
  }

  #inner-map-container {
    width: 50%;

    &.full-width {
      width: 100%;

      #collapse-icon {
        right: 0;
      }
    }
  }
</style>
