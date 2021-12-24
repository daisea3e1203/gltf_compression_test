# MeshOptimization

## Setup and Development
Download [Node.js](https://nodejs.org/en/download/).
Run this following commands:

``` bash
# Install dependencies (only for first time)
npm i

# Serve at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

## MeshOptimization

### meshoptimizer (gltfpack)

1. Install gltfpack with `npm i -g gltfpack`

2. Compress gltf output from Houdini from the commandline
``` bash
# Simple optimization (Keep mesh name and material name)
gltfpack -i output.glb -o output_pack.glb -kn -km

# With Compression (Requires meshopt decoder to load optimized mesh)
gltfpack -i output.glb -o output_pack_c.glb -c -kn -km

# With even more Compression (The output can also be gzipped for extra compression on delivery)
gltfpack i- output.glb -o output_pack_cc.glb -cc  -kn -km

# Or just use the script
bin/pack_gltf output.glb
```

### draco

1. Install gltf-pipeline with `npm i -g gltf-pipeline`

2. Compress
```bash
gltf-pipeline -i output.glb -o output_drc.glb -d

# Or use the script for automatic renaming
bin/to_drc output.glb
```

## Compression Methods Comparison

|name|method|size|load time|
|---|---|---|---|
|rop_gltf_crag_mat.glb|raw|4.2M|321ms|
|rop_gltf_crag_mat_pack.glb|gltfpack (no option)|3.1M|270ms|
|rop_gltf_crag_mat_pack_c.glb|gltfpack (c option)|806K|140ms|
|rop_gltf_crag_mat_pack_cc.glb|gltfpack (cc option)|704K|140ms|
|rop_gltf_crag_mat_drc_glb| draco (via gltf-pipeline) | 241K|470ms|

