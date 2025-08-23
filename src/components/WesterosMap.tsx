import OpenSeadragon, {type Viewer} from 'openseadragon'

import {useEffect} from 'react'

function noop() {
  // intentional noop
}

function getHashParams() {
  const hash = window.location.hash.substring(1)
  try {
    return new URLSearchParams(hash)
  } catch (e) {
    console.error('Error parsing hash params:', e)
    return new URLSearchParams()
  }
}

function setHashParams(params: URLSearchParams) {
  const hash = params.toString()
  window.location.replace(`#${hash}`)
}

export function WesterosMap() {
  useEffect(() => {
    if (!window.location.hostname.includes('rubysrealm.net')) {
      return noop
    }

    const ctrl = new AbortController()
    fetch('/ping/westeros', {signal: ctrl.signal}).then(noop).catch(noop)
    return () => ctrl.abort()
  }, [])

  useEffect(() => {
    const viewer: Viewer = OpenSeadragon({
      id: 'westeros-viewer',
      tileSources: '/westeros.dzi',
      animationTime: 0.3,
      showNavigationControl: false,
      showNavigator: true,
    })

    viewer.addHandler('open', function () {
      let zoom = viewer.viewport.getZoom()
      let center = viewer.viewport.getCenter()

      const params = getHashParams()
      if (params.has('x') && params.has('y')) {
        const x = parseFloat(params.get('x') || '0.5')
        const y = parseFloat(params.get('y') || '0.5')
        center = new OpenSeadragon.Point(x, y)
      }

      if (params.has('zoom')) {
        zoom = parseFloat(params.get('zoom') || '1.0')
      }

      viewer.viewport.zoomTo(zoom, center, true)
      viewer.viewport.panTo(center, true)
    })

    viewer.addHandler('animation-finish', () => {
      const {viewport} = viewer
      const center = viewport.getCenter()
      const params = getHashParams()
      params.set('x', center.x.toString())
      params.set('y', center.y.toString())
      params.set('zoom', viewport.getZoom().toString())
      setHashParams(params)
    })

    return () => {
      viewer.destroy()
    }
  }, [])

  return <div id="westeros-viewer" className="map-container" />
}
