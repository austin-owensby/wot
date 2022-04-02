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
      v-for="star in stars"
      :key="star.name"
      :lat-lng="star"
    >
      <l-popup :content="star.name" />
    </l-marker>
    <l-polyline :lat-lngs="travel" color="red" weight="5" />
  </l-map>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { LMap, LImageOverlay, LMarker, LPopup, LPolyline } from 'vue2-leaflet'
import { CRS } from 'leaflet'

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
  private url = '/img/wot-map.4edb0adf.jpg'
  private bounds = [[0, 0], [1000, 1000]]
  private minZoom = -2
  private crs = CRS.Simple
  private travel = [[440, 401], [484, 414]]
  private stars = [
    { name: 'Emond\'s Field', lng: 401, lat: 440 },
    { name: 'Baerlon', lng: 414, lat: 484 }
  ]

  private mounted () {
    if (this.$refs.map) {
      (this.$refs.map as any).mapObject.setView([500, 500], 0)
    }
  }
}
</script>
