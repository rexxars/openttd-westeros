import {rm} from 'node:fs/promises'
import {join as joinPath} from 'node:path'

import sharp from 'sharp'

const TILE_SIZE = 512
const SOURCE_IMAGE = 'assets/full.png'
const PUBLIC_DIR = joinPath(import.meta.dirname, '..', 'public')
const DZI_DIR = joinPath(PUBLIC_DIR, 'westeros_files')
const DZI_PATH = joinPath(PUBLIC_DIR, 'westeros')
const DZI_FILE_PATH = joinPath(DZI_DIR, 'westeros.dzi')
const VIPS_PROPS_PATH = joinPath(DZI_DIR, 'vips-properties.xml')

// Configure sharp to handle large images
sharp.cache(false)
sharp.concurrency(1)

async function generateTiles() {
  const start = Date.now()
  try {
    // Clean up old tiles
    await rm(DZI_DIR, {recursive: true, force: true})
    await rm(DZI_FILE_PATH, {force: true})

    const inputImage = await sharp(SOURCE_IMAGE, {limitInputPixels: false})
    const metadata = await inputImage.metadata()
    const {width, height, channels, format} = metadata

    console.log('Source image metadata:', {width, height, channels, format})

    await inputImage
      .png({compressionLevel: 9, palette: true, quality: 100, effort: 10})
      .tile({size: TILE_SIZE, background: '#000', skipBlanks: 5, container: 'fs', layout: 'dz'})
      .toFile(DZI_PATH)

    // Clean up unnecessary files
    await rm(VIPS_PROPS_PATH, {force: true})

    const end = Date.now()
    console.log(`Tiles generated in ${((end - start) / 1000).toFixed(2)} seconds`)
  } catch (err) {
    console.error('Error generating tiles:', err)
    throw err
  }
}

generateTiles()
