<template>
  <l-map
    ref="map"
    :min-zoom="minZoom"
    :crs="crs"
    style="height: 100%; width: 50%;"
  >
    <l-image-overlay
      :url="url"
      :bounds="bounds"
    />
    <l-marker
      v-for="point in map.points"
      :key="point.name"
      :lat-lng="point"
      @click="goToLocation(point.name)"
    >
      <l-popup :content="point.name" />
    </l-marker>
    <l-polyline
      v-for="(path, index) in map.paths"
      :key="index"
      :lat-lngs="path.path"
      :color="path.color"
      :weight="5"
    />
  </l-map>
</template>

<script scoped lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { LMap, LImageOverlay, LMarker, LPopup, LPolyline } from 'vue2-leaflet'
import { CRS } from 'leaflet'
import { MapService } from '@/services/mapService'

@Component({
  components: {
    LMap,
    LImageOverlay,
    LMarker,
    LPopup,
    LPolyline
  }
})
export default class Map extends Vue {
  @Prop() private book!: string
  @Prop() private chapter!: string
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
}
</script>
